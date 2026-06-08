const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleController');

router.get('/', VehicleController.getAll);
router.get('/all', VehicleController.getAllSimple);
router.get('/:id', VehicleController.getById);
router.post('/', VehicleController.create);
router.put('/:id', VehicleController.update);
router.delete('/:id', VehicleController.delete);

module.exports = router;
