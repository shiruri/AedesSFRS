const BASE_URL = 'http://localhost:8080';
const REQUEST_TIMEOUT = 15000;

const API = {
    async request(endpoint, options = {}) {
        const token = Auth.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const config = {
            ...options,
            headers,
            signal: AbortSignal.timeout(REQUEST_TIMEOUT)
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, config);

            if (response.status === 401) {
                Auth.logout();
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Request failed (${response.status})`);
            }

            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your connection.');
            }
            if (error.message.includes('Session expired')) {
                throw error;
            }
            console.error('API Error:', error.message);
            throw error;
        }
    },

    get(endpoint, options = {}) {
        return this.request(endpoint, { method: 'GET', ...options });
    },

    post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            ...options
        });
    },

    put(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            ...options
        });
    },

    delete(endpoint, options = {}) {
        return this.request(endpoint, { method: 'DELETE', ...options });
    },

    auth: {
        login: async (credentials) => {
            try {
                return await API.post('/api/auth/login', credentials);
            } catch (error) {
                throw new Error(error.message || 'Login failed. Please try again.');
            }
        },
        register: async (userData) => {
            try {
                return await API.post('/api/auth/register', userData);
            } catch (error) {
                throw new Error(error.message || 'Registration failed. Please try again.');
            }
        },
        me: () => API.get('/api/auth/me')
    }
};

window.API = API;