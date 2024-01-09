
const mongoose = require('mongoose');
// const uuid = require('uuid');

const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({

    _id: {
        type: String,
        required: true
    },
    active: {
        type: Boolean
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    // expiresBy: Date.now()
})

module.exports = mongoose.model('ForgotPasswords', forgotPasswordSchema);



// // // const Sequelize = require('sequelize');
// // const sequelize = require('../util/database');

// // //id, name , password, phone number, role

// // const Forgotpassword = sequelize.define('forgotpassword', {
// //     id: {
// //         type: Sequelize.UUID,
// //         allowNull: false,
// //         primaryKey: true
// //     },
// //     active: Sequelize.BOOLEAN,
// //     expiresby: Sequelize.DATE
// // })

// // module.exports = Forgotpassword;