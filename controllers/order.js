const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const Expense = require('../models/expense');
// const { Sequelize } = require('sequelize');
// const sequelize = require('../util/database');
// require('dotenv').config();


exports.getPremiumMember = async (req, res) => {

    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                throw new Error(err);
            }
            try {
                const newOrder = await Order.create({
                    rzpOrderId: order.id,
                    userId: req.user
                })

                return res.status(201).json({ newOrder, key_id: rzp.key_id });
            }
            catch (err) {
                throw new Error(err);
            }
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went Wrong', error: err });
    }







    // req.user.createOrder({ orderid: order.id, status: 'PENDING' })
    //     .then(() => {
    //         return res.status(201).json({ order, key_id: rzp.key_id });
    //     })
    //     .catch(err => {
    //         throw new Error(err);
    //     })



};

exports.updateTransactionstatus = async (req, res) => {

    try {
        const { payment_id, order_id } = req.body;
        const promise1 = await Order.findOneAndUpdate({ rzpOrderId: order_id }, { $set: { status: 'SUCCESS', paymentId: payment_id } })


        // const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFULL' })
        const promise2 = await User.findByIdAndUpdate(req.user, { $set: { isPremium: true } });

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

        const users = await User.find();

        const allUserExpense = users.map((user) => {
            return {
                username: user.name,
                totalExpense: user.totalExpense
            }
        })
        const sortedUsersDescending = allUserExpense.sort((a, b) => b.totalExpense - a.totalExpense);

        return res.status(201).json(sortedUsersDescending);
    }
    catch (err) {
        console.log(err);
    }

}