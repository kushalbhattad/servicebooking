const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.getAllServices();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get service by ID
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.getServiceById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
