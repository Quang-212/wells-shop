const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const { Server } = require("socket.io")
require('dotenv').config()
const port = process.env.PORT || 8080
const route = require('./routes')
const Comment = require("./models/Comment.js")
// cors
app.use(cors({
  origin: ['http://localhost:3000', process.env.SECRET_FRONTEND_DOMAIN],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'],
  credentials: true
}))
//session
app.use(session({
  secret: process.env.SECRET_SIGNED_SESSION_CODE,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600 * 7 * 1000 * 24 },
  store: MongoStore.create({
    mongoUrl: process.env.SECRET_DATABASE_URL,
    ttl: 7 * 24 * 60 * 60,
    crypto: {
      secret: process.env.SECRET_SIGNED_SESSION_CODE
    }
  })
}))
//socket
const { createServer } = require("http")
const Product = require('./models/Product')
const User = require('./models/User')
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on("connection", (socket) => {
  console.log('someone connected')

  socket.on("getNews", async (productId) => {
    const newProduct = await Product.findById(productId).exec()
    io.emit("getNews", newProduct)
  })
  socket.on("newClient", async (userId) => {
    try {
      const comments = await Comment.find({ from: userId.toString() }).exec()
      if (comments) {
        const roomIds = comments.map(comment => comment.targetId)
        socket.join(roomIds)
      }
    } catch (err) {
      console.log(err)
    }
  })
  socket.on("commentNotice", async ({ targetId, productId, reply, from }) => {
    socket.join(targetId)
    try {
      const [targetProduct, sender] = await Promise.all([Product.findById(productId).exec(), User.findById(from).exec()])
      const { name, _id } = targetProduct
      const { displayName } = sender
      io.emit("commentUpdate", "re-render")
      io.to(targetId).emit("commentNotice", {
        targetProduct: { name, _id },
        from: { displayName, fromId: sender._id },
        reply
      })
    } catch (err) {
      console.log(err)
    }
  })
  socket.on("disconnect", () => {
    console.log('user disconnected')
  })
})
//fb auth setup
app.use(passport.initialize())
app.use(passport.session())

//Parse cookie
app.use(cookieParser(process.env.SECRET_SIGNED_COOKIES_CODE))
//HTTP logger
app.use(morgan('combined'))
//handle post method-data
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
//App route
route(app)
//react serve
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "/client/build")))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
  })
}

//Connect to DB
mongoose.connect(process.env.SECRET_DATABASE_URL)
  .then(() => {
    console.log('Connected to DB')
    httpServer.listen(port, () => {
      console.log(`App listening on port ${port}`)
    })
  })
  .catch(err => console.log('Connect to DB error: ', err)) 