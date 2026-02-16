export const apiFetch = async (endpoint, options = {}) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return null;
    }

    return response.json();
};