const jwt = require('jsonwebtoken');
const User = require('../models/userSignup');


const authenticate = (req, res, next) => {
    console.log('in the middleware')

    const token = req.header('Authorization');
    //console.log(token);
    const user = jwt.verify(token, 'd3ec4a17b9e89ca0527bba8eab6b546c3c75931f3c245a81503c81732d9d8ef4');
    console.log(user.userId);

    User.findByPk(user.userId)
    .then((user) => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
};

module.exports = {
    authenticate
};
