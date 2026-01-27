const API_BASE_URL = 'http://localhost:3000';

class Api {
    static async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Get Error:', error);
            throw error;
        }
    }

    static async post(endpoint, body) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'API Request Failed');
            return data;
        } catch (error) {
            console.error('API Post Error:', error);
            throw error;
        }
    }
}
