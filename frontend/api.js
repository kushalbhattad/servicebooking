const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Auth methods
    async register(name, email, phone, password, address, city) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password, address, city })
        });
        return this._handleResponse(response);
    }

    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await this._handleResponse(response);
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('token', data.token);
        }
        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
    }

    isAuthenticated() {
        return !!this.token;
    }

    // Services methods
    async getAllServices() {
        const response = await fetch(`${API_BASE_URL}/services`);
        return this._handleResponse(response);
    }

    async getServiceById(id) {
        const response = await fetch(`${API_BASE_URL}/services/${id}`);
        return this._handleResponse(response);
    }

    // Bookings methods
    async createBooking(serviceId, numberOfPeople, bookingDate, bookingTime, notes) {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({ serviceId, numberOfPeople, bookingDate, bookingTime, notes })
        });
        return this._handleResponse(response);
    }

    async getUserBookings() {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return this._handleResponse(response);
    }

    async getBookingById(id) {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return this._handleResponse(response);
    }

    async cancelBooking(id) {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return this._handleResponse(response);
    }

    async _handleResponse(response) {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API Error');
        }
        return response.json();
    }
}

const api = new ApiService();
