const { Schema, default: mongoose } = require('mongoose');

const orderSchema = new Schema({
    rzpOrderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    status: {
        type: String,
        default: 'PENDING',
        enum: { values: ['PENDING', 'SUCCESS'], message: '{VALUE} is not supported' }
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);


// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentid: Sequelize.STRING,
//     orderid: Sequelize.STRING,
//     status: Sequelize.STRING
// });

// module.exports = Order;