import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cartAddFromServer } from './redux/features/cartSlice'
import { favAddFromServer } from './redux/features/favoriteSlice'
import { loginUpdate } from './redux/features/authSlice'
import { userLogin } from './redux/features/authSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./App.scss"
import socket from './utils/socket.js'
import Router from './routes/index'
import axiosJWT from './config/axiosConfig.js'


function CommentDisplay({ productId, children }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => { navigate(`/shop/product?id=${productId}`) }}
    >
      {children}
    </div>
  )
}

function App() {

  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const loggedIn = useSelector(state => state.auth.isLoggedIn)
  let res1
  //user checking and initialize(OAuth)
  useEffect(() => {

    (async () => {
      try {
        if (loggedIn !== 1 || !user) {
          res1 = await axios({
            method: "GET",
            url: '/auth/initialize-user',
            withCredentials: true
          })
          console.log('user checking...', res1.data)
          dispatch(loginUpdate(res1.data.isLoggedIn))
          res1.data.isLoggedIn === 1 && dispatch(userLogin(res1.data.user))

        }
        if (user.id || res1.data.user.id) {
          const res2 = await axiosJWT({
            method: 'GET',
            url: `/user/${user.id}`
          })
          console.log('AddDataFromServer success')
          dispatch(cartAddFromServer(res2.data.cart))
          dispatch(favAddFromServer(res2.data.favorites))
        }
      } catch (err) {
        console.log(err.response)
      }
    })()
  }, [])
  //socket init
  const commentNotice = ({ targetProduct, from, reply }) => {
    const { name, _id } = targetProduct
    const { displayName, fromId } = from
    console.log(fromId, user.id)
    if (fromId === user.id) {
      toast.info(<CommentDisplay productId={_id}>
        {`Commented on ${name}`}
      </CommentDisplay>
      )
    } else if (reply === user.id) {
      toast.info(
        <CommentDisplay productId={_id}>
          {`${displayName} replied you on ${name}`}
        </CommentDisplay>
      )
    } else {
      toast.info(
        <CommentDisplay productId={_id}>
          {`${displayName} also commented on ${name}`}
        </CommentDisplay>
      )
    }
  }
  useEffect(() => {
    if (user.id || res1?.data.user.id) {
      socket.emit("newClient", user.id || res1?.data.user.id)
      socket.on("commentNotice", (props) => {
        commentNotice(props)
      })
    }
  }, [])

  return (

    <div className="App">
      <Router />
      <ToastContainer
        bodyClassName="toast"
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1}
      />
    </div>
  )
}

export default App
