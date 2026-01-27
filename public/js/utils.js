const Utils = {
    formatCurrency: (amount) => {
        return '₹' + Number(amount).toFixed(2);
    },

    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString();
    },

    formatDateTime: (dateString) => {
        return new Date(dateString).toLocaleString();
    },

    getUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    requireRole: (role) => {
        const user = Utils.getUser();
        if (!user || user.role !== role) {
            window.location.href = 'login.html';
            return null;
        }
        return user;
    },

    logout: () => {
        localStorage.clear();
        window.location.href = 'login.html';
    }
};
