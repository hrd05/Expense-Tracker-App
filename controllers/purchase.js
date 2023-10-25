const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/userSignup');
const Expense = require('../models/expense');
const { Sequelize } = require('sequelize');
require('dotenv').config();


exports.getPremiumMember = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(err);
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch(err => {
                    throw new Error(err);
                })
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went Wrong', error: err });
    }

};

exports.updateTransactionstatus = async (req, res) => {

    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } })

        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFULL' })
        const promise2 = req.user.update({ isPremiumUser: true })

        Promise.all([promise1, promise2]).then(() => {
            return res.status(201).json({ message: 'Transaction Successfull' });
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong' });
    }
};

exports.showLeaderboard = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        const users = await User.findAll();
        const combinedExpense = {};

        expenses.forEach((expenses) => {
            if(combinedExpense[expenses.userId]){
                combinedExpense[expenses.userId] += expenses.amount;
            }
            else{
                combinedExpense[expenses.userId] = expenses.amount;
            }
        });
        const leaderboard = [];
        users.forEach((user) => {
            
            leaderboard.push({name: user.name, total_Expense: combinedExpense[user.id] || 0});
        })
        leaderboard.sort((a,b) => b.total_Expense - a.total_Expense);

        res.status(201).json(leaderboard);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'something went wrong' });
    }

}