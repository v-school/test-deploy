const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 7000
const morgan = require('morgan')
const path = require("path")
const mongoose = require('mongoose')
const expressJwt = require('express-jwt')

// Middlewares for every request
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, "client", "build")))

// DB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/todos", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => console.log("connected to the DB"))
.catch(err => console.log(err))


//Gatekeeper.  Checks for a token on requests to /api, 
    // if there is a token, it will create the req.user object
    // if there is not a token, it will throw an "UnauthorizedError"
app.use("/api", expressJwt({secret: process.env.SECRET}))  // req.user

// Routes
app.use("/auth", require('./routes/authRouter.js'))
app.use("/api/todo", require('./routes/todoRouter.js'))

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err)
    if(err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Server listen
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
