const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'Harshhrd05!', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
