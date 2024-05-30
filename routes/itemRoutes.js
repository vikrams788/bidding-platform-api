const express = require('express');
const { check } = require('express-validator');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../utils/upload');
const router = express.Router();

router.get('/', authMiddleware, itemController.getAllItems);
router.get('/:id', authMiddleware, itemController.getItemById);

router.post('/', authMiddleware, roleMiddleware(['user', 'admin']), upload.single('image'), [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('starting_price', 'Starting price is required').isDecimal(),
    check('end_time', 'End time is required').not().isEmpty(),
], itemController.createItem);

router.put('/:id', authMiddleware, roleMiddleware(['user', 'admin']), upload.single('image'), [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('starting_price', 'Starting price is required').isDecimal(),
    check('end_time', 'End time is required').not().isEmpty(),
], itemController.updateItem);

router.delete('/:id', authMiddleware, roleMiddleware(['user', 'admin']), itemController.deleteItem);

module.exports = router;