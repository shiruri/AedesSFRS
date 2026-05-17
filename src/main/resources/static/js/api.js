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
 * Check if user has required role
 */
function hasRole(requiredRole) {
    const user = getUser();
    if (!user || !user.role) return false;
    if (typeof requiredRole === 'string') {
        return user.role === requiredRole;
    }
    if (Array.isArray(requiredRole)) {
        return requiredRole.includes(user.role);
    }
    return false;
}

/**
 * Check if user is admin
 */
function isAdmin() {
    return hasRole('ADMIN');
}

/**
 * Logout user
 */
function logout() {
    removeToken();
    localStorage.removeItem('aedes_user');
    var origin = window.location.origin;
    var path = window.location.pathname;
    if (path.includes('/dashboard/')) {
        window.location.href = origin + path.replace(/\/dashboard\/.*/, '/index.html');
    } else {
        window.location.href = origin + '/index.html';
    }
}

/**
 * Parse error response to user-friendly message
 */
function parseError(response, endpoint) {
    if (response.status === 0) {
        return 'Cannot connect to server. Please ensure backend is running.';
    }
    
    if (response.status === 401) {
        if (endpoint.includes('/auth/login')) {
            return 'Invalid username/email or password.';
        }
        if (endpoint.includes('/auth/register')) {
            return 'Registration failed. Please try again.';
        }
        return 'Session expired. Please login again.';
    }
    
    if (response.status === 403) {
        return 'You do not have permission to perform this action.';
    }
    
    if (response.status === 404) {
        return 'Requested resource not found.';
    }
    
    if (response.status === 400) {
        return 'Invalid input. Please check your data and try again.';
    }
    
    if (response.status === 409) {
        return 'This record already exists.';
    }
    
    if (response.status === 500) {
        return 'Server error. Please try again later.';
    }
    
    return 'Request failed with status ' + response.status;
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const config = {
        ...options,
        headers,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'include'
    };

    try {
        const response = await fetch(url, config);
        clearTimeout(timeoutId);
        
        if (response.status === 401) {
            throw new Error(parseError(response, endpoint));
        }
        
        if (!response.ok) {
            let errorMessage = parseError(response, endpoint);
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (e) {}
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return null;
        }

        try {
            return await response.json();
        } catch (e) {
            return null;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }
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
                body: JSON.stringify({ name, password, email, role })
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
        
        updatePassword: async function(currentPassword, newPassword) {
            const user = getUser();
            return apiRequest('/api/user/update', {
                method: 'PATCH',
                body: JSON.stringify({
                    id: user.id,
                    name: user.name || user.username,
                    email: user.email,
                    password: newPassword,
                    role: user.role
                })
            });
        },
        
        logout: logout
    },

    user: {
        list: function(page, size) {
            return apiRequest('/api/user?page=' + (page || 0) + '&size=' + (size || 50), { method: 'GET' });
        },
        update: function(data) {
            return apiRequest('/api/user/update', {
                method: 'PATCH',
                body: JSON.stringify(data)
            });
        },
        delete: function(id) {
            return apiRequest('/api/user/delete/' + id, { method: 'DELETE' });
        }
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
    hasRole,
    isAdmin,
    logout
};
