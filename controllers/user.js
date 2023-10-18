
const path = require('path');

const User = require('../models/userSignup');


exports.getSignup = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'signup.html'));
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.create({
        name,
        email,
        password
    })
    .then(() => {
        res.sendFile(path.join(__dirname,'../', 'views', 'login.html' ));
    })
    .catch(err => console.log(err));


}