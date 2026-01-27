const user = Utils.requireRole('employee');

function logout() {
    Utils.logout();
}

async function generate() {
    const serviceNumber = document.getElementById('serviceNumber').value;
    const currentReading = document.getElementById('currentReading').value;
    const resDiv = document.getElementById('result');

    try {
        const data = await Api.post('/bill/generate', { serviceNumber, currentReading });

        resDiv.style.display = 'block';
        resDiv.style.background = '#d4edda';
        document.getElementById('res-amount').innerText = (data.bill.amount - data.bill.serviceCharge).toFixed(2);
        document.getElementById('res-units').innerText = data.bill.units;
        document.getElementById('res-charge').innerText = data.bill.serviceCharge;
        document.getElementById('res-total').innerText = Utils.formatCurrency(data.bill.amount);

    } catch (err) {
        alert(err.message || "Error generating bill");
        resDiv.style.display = 'none';
    }
}

// Global functions
window.generate = generate;
window.logout = logout;
