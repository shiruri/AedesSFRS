/**
 * AEDES API - Centralized API connector
 * Connects frontend to Spring Boot backend
 */

const BASE_URL = 'http://localhost:8080';
const REQUEST_TIMEOUT = 15000;

/**
 * Get auth token from localStorage
 */
function getToken() {
    return localStorage.getItem('aedes_token');
}

/**
 * Save auth token
 */
function setToken(token) {
    localStorage.setItem('aedes_token', token);
}

/**
 * Remove auth token
 */
function removeToken() {
    localStorage.removeItem('aedes_token');
}

/**
 * Save user data
 */
function setUser(user) {
    localStorage.setItem('aedes_user', JSON.stringify(user));
}

/**
 * Get user data
 */
function getUser() {
    const user = localStorage.getItem('aedes_user');
    return user ? JSON.parse(user) : null;
}

/**
 * Check if authenticated
 */
function isAuthenticated() {
    return !!getToken();
}

/**
 * Logout user
 */
function logout() {
    removeToken();
    localStorage.removeItem('aedes_user');
    var depth = window.location.pathname.split('/').length - 2;
    window.location.href = depth > 0 ? '../'.repeat(depth) + 'index.html' : 'index.html';
}

/**
 * API Request Handler
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const url = BASE_URL + endpoint;
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': 'Bearer ' + token }),
        ...options.headers
    };

    const config = {
        ...options,
        headers,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        mode: 'cors',
        credentials: 'include'
    };

    try {
        const response = await fetch(url, config);
        
        if (response.status === 0) {
            throw new Error('Cannot connect to server. Please ensure backend is running on port 8080.');
        }

        if (response.status === 401) {
            if (!endpoint.includes('/auth/login')) {
                logout();
                throw new Error('Session expired. Please login again.');
            }
            var errData = await response.json().catch(function() { return {}; });
            throw new Error(errData.message || errData.error || 'Invalid credentials');
        }

        if (response.status === 404) {
            throw new Error('Endpoint not found: ' + endpoint);
        }

        if (!response.ok) {
            let errorMessage = 'Request failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {}
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('[API Error]', error.message);
        throw error;
    }
}

/**
 * API Methods
 */
const API = {
    // Auth endpoints
    auth: {
        login: async function(login, password) {
            const data = await apiRequest('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ login, password })
            });
            if (data.token) {
                setToken(data.token);
                setUser(data.userResponse);
            }
            return data;
        },
        
        register: async function(name, email, password, role) {
            const data = await apiRequest('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role })
            });
            if (data.token) {
                setToken(data.token);
                setUser(data.userResponse);
            }
            return data;
        },
        
        me: async function() {
            const data = await apiRequest('/api/auth/me', {
                method: 'GET'
            });
            setUser(data);
            return data;
        },
        
        logout: logout
    }
};

// Export for use
window.API = API;
window.Auth = {
    getToken,
    setToken,
    removeToken,
    getUser,
    setUser,
    isAuthenticated,
    logout
};