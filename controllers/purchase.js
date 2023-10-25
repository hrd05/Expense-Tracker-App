const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/userSignup');
const Expense = require('../models/expense');
const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');
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

        const leaderboard = await User.findAll({
            attributes: ['id', 'name',  [sequelize.fn('COALESCE', sequelize.fn( 'sum', sequelize.col('amount')),0), 'total_Expense'],],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_Expense', 'DESC']]
        });       

        res.status(201).json(leaderboard);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'something went wrong' });
    }

}