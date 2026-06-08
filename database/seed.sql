-- Seed Data for PMS Database
USE PMS;

-- Default Admin User 
-- NOTE: The password will be hashed at runtime via the backend setup endpoint.
-- Run: node backend/scripts/seedUser.js after npm install
-- Or login will automatically create the admin user if none exists.
INSERT INTO Users (UserName, Password, Role) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin');

-- Sample Vehicles
INSERT INTO Vehicle (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, UserID) VALUES
('RAB001A', 'Toyota', 'RAV4', 2022, 'SUV', 35000000.00, 'Available', 1),
('RAB002B', 'Honda', 'Civic', 2023, 'Sedan', 28000000.00, 'Rented', 1),
('RAB003C', 'Ford', 'Ranger', 2021, 'Truck', 45000000.00, 'Available', 1),
('RAB004D', 'Toyota', 'Corolla', 2022, 'Sedan', 25000000.00, 'Maintenance', 1),
('RAB005E', 'BMW', 'X5', 2024, 'SUV', 85000000.00, 'Available', 1),
('RAB006F', 'Mercedes', 'C200', 2023, 'Sedan', 65000000.00, 'Rented', 1),
('RAB007G', 'Volkswagen', 'Golf', 2022, 'Hatchback', 22000000.00, 'Available', 1),
('RAB008H', 'Nissan', 'Pathfinder', 2023, 'SUV', 42000000.00, 'Available', 1),
('RAB009I', 'Hyundai', 'Tucson', 2024, 'SUV', 38000000.00, 'Rented', 1),
('RAB010J', 'Suzuki', 'Vitara', 2022, 'SUV', 30000000.00, 'Available', 1);

-- Sample Customers
INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Status, UserID) VALUES
('Jean', 'Kagame', 'jean.kagame@email.com', '0788001001', 'Active', 1),
('Alice', 'Mukamana', 'alice.m@email.com', '0788001002', 'Active', 1),
('Patrick', 'Habimana', 'patrick.h@email.com', '0788001003', 'Active', 1),
('Diane', 'Uwimana', 'diane.u@email.com', '0788001004', 'Inactive', 1),
('Eric', 'Niyonzima', 'eric.n@email.com', '0788001005', 'Active', 1),
('Grace', 'Ishimwe', 'grace.i@email.com', '0788001006', 'Blocked', 1),
('Samuel', 'Mugisha', 'samuel.m@email.com', '0788001007', 'Active', 1),
('Josiane', 'Mukeshimana', 'josiane.m@email.com', '0788001008', 'Active', 1),
('David', 'Hakizimana', 'david.h@email.com', '0788001009', 'Inactive', 1),
('Sarah', 'Uwase', 'sarah.u@email.com', '0788001010', 'Active', 1);

-- Sample Promotions
INSERT INTO Promotion (Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, UserID) VALUES
('New Year Sale', 'Start the new year with amazing deals on all vehicles!', 'Percentage', 15.00, '2024-01-01', '2024-01-31', 'Active', 1),
('Holiday Price Slash', 'Special holiday discounts on selected SUV models', 'FLAT_RATE', 500000.00, '2024-12-01', '2024-12-31', 'Active', 1),
('Weekend Flash Sale', 'Limited time weekend offers on sedans', 'Percentage', 10.00, '2024-11-15', '2024-11-17', 'Active', 1),
('Clearance Discount Offer', 'Clearance sale on older models', 'Amount', 300000.00, '2024-10-01', '2024-10-30', 'Expired', 1),
('Seasonal Price Drop', 'End of season price reductions on all trucks', 'CASHBACK', 200000.00, '2024-09-01', '2024-09-30', 'Expired', 1),
('Summer Special', 'Exclusive summer promotions on hatchbacks', 'BUY_ONE_GET_ONE', 0.00, '2024-06-01', '2024-08-31', 'Expired', 1),
('Loyalty Bonus', 'Loyalty discount for returning customers', 'Percentage', 20.00, '2024-11-01', '2024-12-31', 'Active', 1),
('Bundle Deal', 'Bundle insurance with rental for special pricing', 'Bundle', 100000.00, '2024-11-01', '2024-12-31', 'Active', 1);

-- Sample Promotion-Vehicle Assignments
INSERT INTO Promotion_Vehicle (PromotionID, VehicleID, Performance) VALUES
(1, 1, 'High demand during New Year period'),
(1, 2, 'Good performance for city driving'),
(2, 3, 'Best selling truck model'),
(2, 5, 'Premium SUV with excellent features'),
(3, 4, 'Economical choice for daily commute'),
(3, 6, 'Luxury sedan with great comfort'),
(4, 7, 'Compact and efficient'),
(5, 8, 'Family-friendly SUV option'),
(6, 9, 'Popular among young professionals'),
(7, 10, 'Reliable and affordable SUV'),
(8, 1, 'Great combination with insurance'),
(8, 3, 'Bundle offer on work vehicles');
