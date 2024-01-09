
const express = require('express');

const router = express.Router();

const resetController = require('../controllers/reset');


router.get('/password/forgotpassword', resetController.getforgotpassword);

router.get('/password/updatepassword/:resetpasswordid', resetController.updatepassword);

router.get('/password/resetpassword/:id', resetController.resetpassword);

router.post('/password/forgotpassword', resetController.forgotpassword);



module.exports = router;