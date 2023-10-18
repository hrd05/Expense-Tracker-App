const express = require('express');
const Sequelize = require('sequelize');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const userRoute = require('./routes/user');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sequelize = require('./util/database');

app.use(userRoute);

sequelize.sync()
.then(() => {
    app.listen(3000);    
})
.catch(err => console.log(err));




