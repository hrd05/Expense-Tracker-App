const moongose = require('mongoose');

const Schema = moongose.Schema;

const downloadHistorySchema = new Schema({
    fileUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),

    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = moongose.model('DownloadHistory', downloadHistorySchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const FilesDownloaded = sequelize.define('fileurl', {

//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },

//     fileUrl: {
//         type: Sequelize.STRING
//     }
// });

<<<<<<< HEAD
// module.exports = FilesDownloaded;
=======
// module.exports = FilesDownloaded;
>>>>>>> 3f9c497b0a904937dad6f5e656953d024da9c68b
