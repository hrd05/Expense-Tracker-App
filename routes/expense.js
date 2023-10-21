const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');
const userAunthentication = require('../middleware/auth');

router.get('/expense', expenseController.getExpenseForm);

router.delete('/expense/addexpense/:id', expenseController.deleteExpense);

router.post('/expense/addexpense', expenseController.postExpense);

router.get('/expense/addexpense',userAunthentication.authenticate ,   expenseController.getExpenses);


module.exports = router;