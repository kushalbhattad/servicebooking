const pool = require('../config/database');

class Booking {
    static async createBooking(userId, serviceId, numberOfPeople, bookingDate, bookingTime, totalAmount, notes = '') {
        const result = await pool.query(
            `INSERT INTO bookings (user_id, service_id, number_of_people, booking_date, booking_time, total_amount, notes, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
             RETURNING *`,
            [userId, serviceId, numberOfPeople, bookingDate, bookingTime, totalAmount, notes]
        );
        return result.rows[0];
    }

    static async getUserBookings(userId) {
        const result = await pool.query(
            `SELECT b.*, s.name as service_name, s.price_per_person
             FROM bookings b
             JOIN services s ON b.service_id = s.id
             WHERE b.user_id = $1
             ORDER BY b.created_at DESC`,
            [userId]
        );
        return result.rows;
    }

    static async getBookingById(bookingId) {
        const result = await pool.query(
            `SELECT b.*, s.name as service_name, s.price_per_person
             FROM bookings b
             JOIN services s ON b.service_id = s.id
             WHERE b.id = $1`,
            [bookingId]
        );
        return result.rows[0];
    }

    static async updateBookingStatus(bookingId, status) {
        const result = await pool.query(
            'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, bookingId]
        );
        return result.rows[0];
    }

    static async cancelBooking(bookingId) {
        return this.updateBookingStatus(bookingId, 'cancelled');
    }
}

module.exports = Booking;
