const express = require('express')
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller')
const {isLoggedIn} = require('../middlewares/auth.middleware');

// register routes
router.post('/register',[
    body('username').isString().notEmpty().trim(),
    body('email').isEmail().isLength({min:7,max:50}).isString().notEmpty().trim().withMessage("Please enter an valid Email"),
    body('password').isString().notEmpty().trim()
],userController.registerController);

// login route
router.post('/login',[
    body('email').isEmail().isLength({min:7,max:50}).isString().notEmpty().trim().withMessage("Please enter an valid Email"),
    body('password').isString().notEmpty().trim()
],userController.loginController);

// set avatar
router.post('/setAvatar',isLoggedIn, userController.setAvatar);

// get all user
router.get('/all', isLoggedIn, userController.getAllUser);

// logout route
router.get('/logout', isLoggedIn, userController.logout)

module.exports = router;