
const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
const expenseController = require('../controllers/expense');
const userAunthentication = require('../middleware/auth');


const { route } = require('./expense');

router.get('/', userController.getSignup);

router.post('/signup', userController.postSignup);

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

router.get('/user/download', userAunthentication.authenticate, expenseController.getDownload);

router.post('/user/download', userController.postFileUrl);

router.get('/user/downloadhistory', userAunthentication.authenticate, userController.getDownloadHistory);



module.exports = router;