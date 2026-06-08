-- PMS Database Schema
-- Promotion and Marketing Subsystem for SwiftWheels Enterprises

CREATE DATABASE IF NOT EXISTS PMS;
USE PMS;

-- Users Table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL DEFAULT 'Admin',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE Vehicle (
    VehicleID INT AUTO_INCREMENT PRIMARY KEY,
    Plate_Number VARCHAR(50) NOT NULL UNIQUE,
    Brand VARCHAR(100) NOT NULL,
    Model VARCHAR(100) NOT NULL,
    Year INT NOT NULL,
    Vehicle_Type VARCHAR(100) NOT NULL,
    Purchase_Price DECIMAL(10,2) NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'Available',
    UserID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Customers Table
CREATE TABLE Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(50) NOT NULL,
    Status ENUM('Active', 'Inactive', 'Blocked') NOT NULL DEFAULT 'Active',
    UserID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Promotions Table
CREATE TABLE Promotion (
    PromotionID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    Discount_Type VARCHAR(100) NOT NULL,
    Discount_Value DECIMAL(10,2) NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'Active',
    UserID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Promotion_Vehicle Table (Many-to-Many resolver)
CREATE TABLE Promotion_Vehicle (
    PromotionVehicleID INT AUTO_INCREMENT PRIMARY KEY,
    PromotionID INT NOT NULL,
    VehicleID INT NOT NULL,
    Performance VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PromotionID) REFERENCES Promotion(PromotionID) ON DELETE CASCADE,
    FOREIGN KEY (VehicleID) REFERENCES Vehicle(VehicleID) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (PromotionID, VehicleID)
);
