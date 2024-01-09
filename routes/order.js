const express = require('express');
const { route } = require('./expense');

const router = express.Router();

const authenticateMiddleware = require('../middleware/auth');
<<<<<<< HEAD
const purchaseController = require('../controllers/order');
=======
const purchaseController = require('../controllers/purchase');
>>>>>>> 3f9c497b0a904937dad6f5e656953d024da9c68b

router.get('/purchase/premiummembership', authenticateMiddleware.authenticate, purchaseController.getPremiumMember);

router.post('/purchase/updatetransactionstatus', authenticateMiddleware.authenticate, purchaseController.updateTransactionstatus);

<<<<<<< HEAD
router.get('/purchase/showleaderboard', authenticateMiddleware.authenticate, purchaseController.showLeaderboard);

module.exports = router;
=======
router.get('/purchase/showleaderboard', authenticateMiddleware.authenticate , purchaseController.showLeaderboard);

module.exports = router;
>>>>>>> 3f9c497b0a904937dad6f5e656953d024da9c68b
