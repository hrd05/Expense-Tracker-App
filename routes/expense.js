const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');

router.get('/expense', expenseController.getExpenseForm);

router.post('/expense/addexpense', expenseController.postExpense);

router.get('/expense/addexpense', expenseController.getExpenses);

module.exports = router;