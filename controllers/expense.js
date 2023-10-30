
const path = require('path');
const Expense = require('../models/expense');
const User = require('../models/userSignup');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const S3Services = require('../services/S3services');


const { response } = require('express');


exports.getExpenseForm = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'Expense.html'));
};




exports.getDownload = async (req, res) => {

    try {
        const expenses = await req.user.getExpenses();
        //upload to s3
        //convert it to string uploading as a text file
        const userId = req.user.id;
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `Expenses${userId}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, fileName);

        // console.log(fileURL);
        res.status(201).json({ fileURL, userId, success: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'something went wrong' });
    }



}


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

const EXPENSES_PER_PAGE = 5;

exports.getExpenses = (req, res) => {
    const page = Number(req.query.page);
    let totalExpenses;

    Expense.count({where: {userId: req.user.id}})
    .then((total) => {
        totalExpenses = total
        //console.log(totalExpenses, 'total expense')
        return Expense.findAll({
            where: {userId: req.user.id},
            offset: (page-1) * (EXPENSES_PER_PAGE),
            limit: EXPENSES_PER_PAGE
        })
    })
    .then((expenses) => {
        //console.log(expenses);
        res.json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: totalExpenses - (page * EXPENSES_PER_PAGE) > 0,
            nextPage: Number(page) + 1,
            hasPreviousPage: page > 1,
            previousPage: Number(page) - 1,
            lastPage: Math.ceil(totalExpenses / EXPENSES_PER_PAGE),
            user: req.user
        })
    })
    .catch(err => {
        res.status(500).json('sonething went wrong')
    })
    
    // const user = req.user;
    // console.log(req.user.id, 'in get expense');
    // // res.json(user);
    // Expense.findAll({ where: { userId: req.user.id } })
    //     .then((expenses) => {
    //         res.status(201).json({ expenses, user });
    //     })
    //     .catch(err => console.log(err));
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
                    where: { id: req.user.id },
                    transaction: t

                })
                .then(async () => {
                    await t.commit()
                    return expense.destroy();
                })
                .catch(async (err) => {
                    await t.rollback();
                    res.status(500).json(err);
                })

        })
        .then(() => {
            res.status(204).end();
        })
        .catch(err => console.log(err));
}



