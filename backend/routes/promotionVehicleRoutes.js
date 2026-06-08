const express = require('express');
const router = express.Router();
const PromotionVehicleController = require('../controllers/promotionVehicleController');

router.get('/', PromotionVehicleController.getAll);
router.get('/:id', PromotionVehicleController.getById);
router.post('/', PromotionVehicleController.create);
router.put('/:id', PromotionVehicleController.update);
router.delete('/:id', PromotionVehicleController.delete);

module.exports = router;
