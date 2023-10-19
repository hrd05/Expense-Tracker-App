
const path = require('path');
const bcrypt = require('bcrypt');

const User = require('../models/userSignup');
const { where } = require('sequelize');


exports.getSignup = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'signup.html'));
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hash) => {
        console.log(err);
        User.create({ name, email, password: hash })
            .then(() => {
                res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));

            })
            .catch(err => console.log(err));
    })

};

exports.getLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
}

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
                    if (!err) {
                        res.status(200).json({ message: 'User logged succesfully' });
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