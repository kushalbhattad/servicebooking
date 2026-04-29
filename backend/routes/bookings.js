const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

const router = express.Router();

// Create booking
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { serviceId, numberOfPeople, bookingDate, bookingTime, notes } = req.body;

        // Validate input
        if (!serviceId || !numberOfPeople || !bookingDate) {
            return res.status(400).json({ error: 'Service ID, number of people, and booking date required' });
        }

        if (numberOfPeople < 1) {
            return res.status(400).json({ error: 'Number of people must be at least 1' });
        }

        // Get service details
        const service = await Service.getServiceById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        // Calculate total amount
        const totalAmount = service.price_per_person * numberOfPeople;

        // Create booking
        const booking = await Booking.createBooking(
            req.user.id,
            serviceId,
            numberOfPeople,
            bookingDate,
            bookingTime,
            totalAmount,
            notes
        );

        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user bookings
router.get('/', authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking.getUserBookings(req.user.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific booking
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.getBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify user owns this booking
        if (booking.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel booking
router.put('/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.getBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updatedBooking = await Booking.cancelBooking(req.params.id);
        res.json({ message: 'Booking cancelled successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
