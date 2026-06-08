const express = require('express');
const router = express.Router();
const PromotionController = require('../controllers/promotionController');

router.get('/', PromotionController.getAll);
router.get('/all', PromotionController.getAllSimple);
router.get('/:id', PromotionController.getById);
router.post('/', PromotionController.create);
router.put('/:id', PromotionController.update);
router.delete('/:id', PromotionController.delete);

module.exports = router;
