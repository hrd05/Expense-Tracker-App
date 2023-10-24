const express = require('express');
const Sequelize = require('sequelize');
const path = require('path');
const bodyParser = require('body-parser');

const User = require('./models/userSignup');
const Expense = require('./models/expense');
const Order = require('./models/orders');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sequelize = require('./util/database');

app.use(userRoute);

app.use(expenseRoute);

app.use(purchaseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(3000);    
})
.catch(err => console.log(err));




