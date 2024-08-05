import { Router } from "express";
import { Car } from "../models/car.model.js";
import jwt from 'jsonwebtoken';

const carrouter = Router();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Token is required');
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], 'secretkey');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send('Invalid Token');
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).send("Access Denied");
    }
    next();
};

carrouter.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const { car_name, manufacturing_year, price } = req.body;
        const newCar = new Car({ car_name, manufacturing_year, price });
        await newCar.save();
        return res.status(201).json(newCar);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create car' });
    }
});

carrouter.get("/", verifyToken, async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cars' });
    }
});

carrouter.get("/:id", verifyToken, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve car' });
    }
});

carrouter.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { car_name, manufacturing_year, price } = req.body;
        const updateCar = await Car.findByIdAndUpdate(req.params.id, { car_name, manufacturing_year, price }, { new: true });
        if (!updateCar) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.status(200).json(updateCar);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update car' });
    }
});

carrouter.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const deleteCar = await Car.findByIdAndDelete(req.params.id);
        if (!deleteCar) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete car' });
    }
});

export default carrouter;
