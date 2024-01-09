const express = require('express');
const { route } = require('./expense');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');
const purchaseController = require('../controllers/purchase');

router.get('/purchase/premiummembership', authenticateMiddleware.authenticate, purchaseController.getPremiumMember);

router.post('/purchase/updatetransactionstatus', authenticateMiddleware.authenticate, purchaseController.updateTransactionstatus);

router.get('/purchase/showleaderboard', authenticateMiddleware.authenticate , purchaseController.showLeaderboard);

module.exports = router;
