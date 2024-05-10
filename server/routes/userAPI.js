const express = require('express');
const router = express.Router();
const cors = require('cors');
const {
    createUser,
} = require('../controllers/userController')

router.use(cors());

// define routes
router.post('/register', createUser);

module.exports = (router);