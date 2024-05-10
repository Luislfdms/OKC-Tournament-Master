const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema ({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: [8, 'Minimum password length is 8 characters.']
    },
    verified: {
        type: Boolean,
        required: false
    },
    verificationToken: {
        type: String,
        required: false
    },
    rank: {
        type: String,
        required: false
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
  });
  
module.exports = mongoose.model('User', userSchema)