const express = require('express')
const userController = require('../controllers/user')

const router = express.Router()

router
    .post('/register', userController.register)
    .post('/login', userController.login)
    .get('/verification/:token', userController.verify)

module.exports = router