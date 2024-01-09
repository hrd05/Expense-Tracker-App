const { Schema, default: mongoose } = require('mongoose');

const orderSchema = new Schema({
<<<<<<< HEAD
    rzpOrderId: {
=======
    orderId: {
>>>>>>> 3f9c497b0a904937dad6f5e656953d024da9c68b
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    status: {
        type: String,
<<<<<<< HEAD
        default: 'PENDING',
        enum: { values: ['PENDING', 'SUCCESS'], message: '{VALUE} is not supported' }
=======
        default: 'Pending'
>>>>>>> 3f9c497b0a904937dad6f5e656953d024da9c68b
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

<<<<<<< HEAD
// module.exports = Order;
=======
// module.exports = Order;
>>>>>>> 3f9c497b0a904937dad6f5e656953d024da9c68b
