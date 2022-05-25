const mongoose = require('mongoose')

const Contact = new mongoose.Schema({

    title: { type: String, required: true },
    thumnails: { type: String, required: true, unique: true },
    des: { type: Array, required: true, default: [] },
    depth: { type: String, default: "root" }, //course
    depth: { type: String, value: '1' }, //js, php
    depth: { type: String, value: '2' }, //js co ban
    //depth: root
    //depth: 1

}, {
    versionKey: false,
    timestamps: true,
    collection: 'contacts'
})

module.exports = mongoose.model('Contact', Contact, 'contacts')

const data = [
    { id: 1, name: "course" },
    { id: 2, name: "Js", parentId: 1 },
    { id: 3, name: "PHP", parentId: 1 },
    { id: 4, name: "Js co ban", parentId: 2 }
];
