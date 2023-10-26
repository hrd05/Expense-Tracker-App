
const path = require('path');
const Expense = require('../models/expense');
const User = require('../models/userSignup');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

exports.getExpenseForm = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'Expense.html'));
};

exports.postExpense = async (req, res, next) => {
    const amount = req.body.amount;
    const category = req.body.category;
    const description = req.body.description;
    const t = await sequelize.transaction();
    // console.log(t);
    console.log(req.user);

    const token = req.header('Authorization');
    console.log(token);

    const user = jwt.verify(token, 'd3ec4a17b9e89ca0527bba8eab6b546c3c75931f3c245a81503c81732d9d8ef4');
    const id = user.userId;


    Expense.create({ amount, category, description, userId: id }, { transaction: t })

        .then((expense) => {
            const total_Expense = Number(req.user.totalExpense) + Number(amount);
            console.log(total_Expense);
            User.update({
                totalExpense: total_Expense
            }, {
                where: { id: req.user.id },
                transaction: t
            })
                .then(async () => {
                    await t.commit();
                    res.status(201).json(expense);
                })
                .catch(async (err) => {
                    await t.rollback();
                    return res.status(500).json(err);
                })
        })
        .catch(async (err) => {
            await t.rollback();
            return res.status(500).json(err);
        })

}

exports.getExpenses = (req, res) => {
    const user = req.user;
    // res.json(user);
    Expense.findAll({ where: { userId: req.user.id } })
        .then((expenses) => {
            res.status(201).json({ expenses, user });
        })
        .catch(err => console.log(err));
}

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    const t = await sequelize.transaction();
    
    const token = req.header('Authorization');

    Expense.findByPk(id)
        .then((expense) => {
            console.log(expense.amount);
            const total_Expense = Number(req.user.totalExpense) - Number(expense.amount);
            User.update({
                totalExpense: total_Expense
            },
                {
                    where: { id: req.user.id},
                    transaction: t

                })
                .then(async () => {
                    await t.commit()
                    return expense.destroy();
                })
                .catch(async(err) => {
                    await t.rollback();
                    res.status(500).json(err);
                })

        })
        .then(() => {
            res.status(204).end();
        })
        .catch(err => console.log(err));
}

