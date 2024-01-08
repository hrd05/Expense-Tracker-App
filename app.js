const express = require('express');
// const Sequelize = require('sequelize');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const helmet = require('helmet');

//models //
// const User = require('./models/userSignup');
// const Expense = require('./models/expense');
// const Order = require('./models/orders');
// const Forgotpassword = require('./models/forgotPass');
// const FilesDownloaded = require('./models/downloadhistory');
// const sequelize = require('./util/database');

//routes //
const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const resetRoute = require('./routes/reset');


const app = express();
app.use(express.static(path.join(__dirname, 'public')));


// app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(userRoute);




app.use(expenseRoute);

app.use(purchaseRoute);

app.use(resetRoute);


mongoose.connect('mongodb+srv://harshdunkhwal55:hbCkEDLtWHpEFNiB@cluster0.al3derw.mongodb.net/expense?retryWrites=true&w=majority')
    .then((result) => {
        console.log('connected');
        app.listen(3000);
    })
    .catch(err => console.log(err));

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);

// User.hasMany(FilesDownloaded);
// FilesDownloaded.belongsTo(User);

// sequelize.sync({})
//     .then(() => {
//         app.listen(3000);
//     })
//     .catch(err => console.log(err));






