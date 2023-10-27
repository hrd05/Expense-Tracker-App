
const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
const resetController = require('../controllers/reset');

const { route } = require('./expense');

router.get('/', userController.getSignup);

router.post('/signup', userController.postSignup );

router.get('/login', userController.getLogin);

router.post('/user/login', userController.postLogin);

router.get('/password/forgotpassword' , resetController.getforgotpassword);

router.post('/password/forgotpassword', resetController.postforgotpassword);


module.exports = router;