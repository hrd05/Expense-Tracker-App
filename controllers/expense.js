
const path = require('path');
const Expense = require('../models/expense');
const jwt = require('jsonwebtoken');

exports.getExpenseForm = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'Expense.html'));
};

exports.postExpense = (req, res, next) => {
    const amount = req.body.amount;
    const category = req.body.category;
    const description = req.body.description;
    console.log('in post expense')
    const token = req.header('Authorization');
    console.log(token);

    const user = jwt.verify(token, 'd3ec4a17b9e89ca0527bba8eab6b546c3c75931f3c245a81503c81732d9d8ef4');
    const id = user.userId;

    Expense.create({
        amount,
        category,
        description,
        userId: id
    })
    .then((expense) => {
        //console.log(expense);
        res.status(201).json(expense);
    })
    .catch(err => console.log(err));
}

exports.getExpenses = (req, res) => {
    const user = req.user;
    // res.json(user);
    Expense.findAll({where: {userId: req.user.id}})
    .then((expenses) => {
        res.status(201).json({expenses,  user});
    })
    .catch(err => console.log(err));
}

exports.deleteExpense = (req, res, next) => {
    const id = req.params.id;

    Expense.findByPk(id)
    .then((expense) => {
        return expense.destroy();
    })
    .then(() => { 
        res.status(204).end();
    })
    .catch(err => console.log(err));
}

