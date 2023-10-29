const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const FilesDownloaded = sequelize.define('fileurl', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    fileUrl: {
        type: Sequelize.STRING
    }
});

module.exports = FilesDownloaded;