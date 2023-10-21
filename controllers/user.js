
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userSignup');
const { where } = require('sequelize');


exports.getSignup = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'signup.html'));
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email } })
        .then((user) => {
            if (user) {
                res.status(409).end();
            }
            else{
                return;
            }
        })

    bcrypt.hash(password, 10, (err, hash) => {
        console.log(err);
        User.create({ name, email, password: hash })
            .then(() => {
                res.redirect('/login');

            })
            .catch(err => console.log(err));
    })

};

exports.getLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
};

function generateAccessToken(id) {
   return jwt.sign({userId: id}, 'd3ec4a17b9e89ca0527bba8eab6b546c3c75931f3c245a81503c81732d9d8ef4');
};



exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email } })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'user not found' });
            }
            else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (!err && result) {
                        res.status(200).json({ message: 'User logged succesfully' , token: generateAccessToken(user.id)});
                        // res.redirect('/expense');
                    }
                    else {
                        res.status(401).json({ message: 'incorrect password' });
                    }
                })
            }
        })
        .catch(err => console.log(err));
};