const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Post = require('../models/matchModel')
const User = require('../models/userModel')
const emailValidation = require('../nodeMailer/nodeMailer')
const crypto = require('crypto');

function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
}

const sampleController = {
    getSampleData: (req, res) => {
        res.json({message: 'Sample API route'});
    }
}

const verify = async (req, res) => {
    const { verificationToken } = req.query || req.body;

    const user = await User.findOne({ verificationToken });

    if (user) {
        if (!user.verified) {
            console.log('updating user verification')
            // Mark the user as verified
            await User.findOneAndUpdate({ verificationToken }, { $set: {verified: true}, $unset: {verificationToken: 1} });
            return res.status(200).json('User verified');
        } else {
            return res.status(400).json('User already verified');
        }
    } else {
        return res.status(404).json('User not found')
    }
}

const nodeMailer = async(req, res) => {
    const {email, verificationToken} = req.body
    const testUser = await User.findOne({verificationToken: verificationToken, email: email})
    if(testUser){
      emailValidation(email, verificationToken)
      return res.status(200).json('email sent')
    }
    return res.status(400).json('USER DNE')
  }

const createUser = async (req, res) => {
    const {firstName, lastName, email, password,} = req.body
  
    // add user to db
    const testUser = await User.findOne({username: username})
    const testEmail = await User.findOne({email: email})
    const verified = false;
    const verificationToken = generateVerificationToken();
    console.log(firstName, ',',  lastName, ',', email, ',', password);
    if(!testUser) {
      if(!testEmail){
        try {
          const user = await User.create({firstName, lastName, email, password})
          await emailValidation(email, verificationToken)
          return res.status(200).json('user created')
        } catch (error) {
          return res.status(400).json({error: error.message})
        }
      }
      return res.status(400).json('EMAIL ALREADY EXISTS')
    }
    res.status(400).json('USERNAME ALREADY EXISTS')
}

const loginUser = async (req, res) => {
    const {email, password} = req.body

    // Verify user login information
    const user = await User.findOne({email: email})

    // Email not found 
    if (!user) {
        return res.status(400).json({error: 'COULD NOT FIND USER'})
    }

    // verified = false, account has not been approved yet
    if (!user.verified) {
        return res.status(400).json({error: 'DENIED ACCESS: VERIFY EMAIL'})
    }
}

module.exports = {
    createUser,
};