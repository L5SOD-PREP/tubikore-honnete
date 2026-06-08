const VehicleModel = require('../models/vehicleModel');
const CustomerModel = require('../models/customerModel');
const PromotionModel = require('../models/promotionModel');
const PromotionVehicleModel = require('../models/promotionVehicleModel');

const DashboardController = {
  getStats: async (req, res) => {
    try {
      const totalVehicles = await VehicleModel.countAll('');
      const totalCustomers = await CustomerModel.countAll('');
      const totalPromotions = await PromotionModel.countAll('');
      const totalAssignments = await PromotionVehicleModel.countAll('');

      const vehicleStatuses = await VehicleModel.getStatusCounts();
      const customerStatuses = await CustomerModel.getStatusCounts();
      const promotionTypes = await PromotionModel.getDiscountTypeCounts();

      const recentVehicles = await VehicleModel.findAll('', 5, 0);
      const recentCustomers = await CustomerModel.findAll('', 5, 0);
      const recentPromotions = await PromotionModel.findAll('', 5, 0);

      res.json({
        stats: {
          totalVehicles,
          totalCustomers,
          totalPromotions,
          totalAssignments
        },
        charts: {
          vehicleStatuses,
          customerStatuses,
          promotionTypes
        },
        recent: {
          vehicles: recentVehicles,
          customers: recentCustomers,
          promotions: recentPromotions
        }
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = DashboardController;
