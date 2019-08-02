const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

// Pre-save Hook to encrypt the password
userSchema.pre("save", function(next){
    const user = this
    // makes sure there is a password in the user object from the /signup post request
    if(!user.isModified("password")) return next()
    // Encrypt password
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err)
        // overwrite user's plain text password with hashed password
        user.password = hash
        // Move on to the .save() in the "signup" route
        next()
    })
})

// Methods
// Comparing the encrypted password to the user's password attempt
userSchema.methods.checkPassword = function(passwordAttempt, callback){
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
        if (err) return callback(err)
        callback(null, isMatch)
    })
}

// Removing the password from the user object before sending it to the front end
userSchema.methods.withoutPassword = function(){
    const user = this.toObject()
    delete user.password
    return user
}


module.exports = mongoose.model("User", userSchema)