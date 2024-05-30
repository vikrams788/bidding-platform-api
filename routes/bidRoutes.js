const express = require('express');
const { check } = require('express-validator');
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:itemId/bids', authMiddleware, bidController.getAllBids);

router.post('/:itemId/bids', authMiddleware, [
    check('bid_amount', 'Bid amount is required').isDecimal(),
], bidController.placeBid);

module.exports = router;