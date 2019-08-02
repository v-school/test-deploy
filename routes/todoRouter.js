const express = require('express')
const todoRouter = express.Router()
const Todo = require('../models/todo.js')

// Get all by user
todoRouter.get("/", (req, res, next) => {
    Todo.find({user: req.user._id}, (err, todos) => {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(todos)
    })
})


// todoRouter.get("/public", (req, res, next) => {
//     Todo.find((err, todos) => {
//         if(err){
//             res.status(500)
//             return next(err)
//         }
//         return res.status(200).send(todos)
//     })
// })


// Add new Todo
todoRouter.post("/", (req, res, next) => {
    // Add user's _id to the new Todo object before saving it in the DB
    req.body.user = req.user._id
    const newTodo = new Todo(req.body)
    newTodo.save((err, savedTodo) => {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(201).send(savedTodo)
    })
})


module.exports = todoRouter