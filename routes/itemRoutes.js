const express = require('express');
const { body } = require('express-validator');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../utils/upload');
const router = express.Router();

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);

router.post('/', authMiddleware, roleMiddleware(['user', 'admin']), upload.single('image'), [
    body('name').not().isEmpty(),
    body('description').not().isEmpty(),
    body('starting_price').isDecimal(),
    body('end_time').isISO8601(),
], itemController.createItem);

router.put('/:id', authMiddleware, roleMiddleware(['user', 'admin']), itemController.updateItem);
router.delete('/:id', authMiddleware, roleMiddleware(['user', 'admin']), itemController.deleteItem);

module.exports = router;