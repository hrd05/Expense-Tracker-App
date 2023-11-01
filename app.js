const express = require('express');
const fs = require('fs');
const Sequelize = require('sequelize');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./util/database');
const User = require('./models/userSignup');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotPass');
const FilesDownloaded = require('./models/downloadhistory');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const resetRoute = require('./routes/reset');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(userRoute);

app.use(expenseRoute);

app.use(purchaseRoute);

app.use(resetRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(FilesDownloaded);
FilesDownloaded.belongsTo(User);

sequelize.sync({})
    .then(() => {
        app.listen(process.env.PORT ||  3000);
    })
    .catch(err => console.log(err));




