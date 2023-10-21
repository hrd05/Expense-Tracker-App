
const path = require('path');
const Expense = require('../models/expense');

exports.getExpenseForm = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'Expense.html'));
};

exports.postExpense = (req, res, next) => {
    const amount = req.body.amount;
    const category = req.body.category;
    const description = req.body.description;

    Expense.create({
        amount,
        category,
        description
    })
    .then((expense) => {
        //console.log(expense);
        res.status(201).json(expense);
    })
    .catch(err => console.log(err));
}

exports.getExpenses = (req, res, next) => {
    Expense.findAll({where: {userId: req.user.id}})
    .then((expenses) => {
        res.status(201).json(expenses);
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

