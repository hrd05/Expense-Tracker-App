const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/userSignup');
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
        Order.findOne({ where: { orderid: order_id } }).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFULL' }).then(() => {
                req.user.update({ isPremiumUser: true }).then(() => {
                    return res.status(201).json({ message: 'Transaction Successfull' })
                })
                    .catch((err) => {
                        throw new Error(err);
                    })
            }).catch((err) => {
                throw new Error(err);
            })
        }).catch((err) => {
            throw new Error(err);
        })

    } catch (err) {
        console.log(err);
    }
};