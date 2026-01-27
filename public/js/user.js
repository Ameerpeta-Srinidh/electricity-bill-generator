const user = Utils.requireRole('user');

document.getElementById('userName').innerText = user.fullName;

async function loadDashboard() {
    if (user.status === 'pending') {
        document.getElementById('status-msg').innerHTML = "<h3 style='color: orange;'>Your application is pending approval.</h3>";
        document.getElementById('bill-list').innerHTML = "";
        return;
    }

    document.getElementById('serviceNo').innerText = user.serviceNumber;
    document.getElementById('userMobile').innerText = user.mobileNo;
    document.getElementById('userType').innerText = user.connectionType;
    document.getElementById('userUnits').innerText = user.currentUnits;

    try {
        const rates = await apiGet('/bill/rates');
        window.slabRates = rates;
        const myRateConfig = rates[user.connectionType];

        if (myRateConfig && myRateConfig.slabs && myRateConfig.slabs.length > 0) {
            document.getElementById('rateLabel').innerText = `Starts at ${myRateConfig.slabs[0].rate}`;
            document.getElementById('userServiceFee').innerText = Utils.formatCurrency(myRateConfig.serviceCharge);
        }

        const bills = await apiGet(`/bill/history/${user.serviceNumber}`);
        window.allBills = bills;

        if (bills.length === 0) {
            document.getElementById('bill-list').innerText = "No bills found.";
            return;
        }

        let html = `<table><thead><tr><th>Month</th><th>Units</th><th>Due Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>`;

        bills.forEach(bill => {
            const dueDate = Utils.formatDate(bill.dueDate);
            const statusBadge = bill.status === 'paid' ? '<span class="badge bg-paid">PAID</span>' : '<span class="badge bg-unpaid">UNPAID</span>';

            let action = '-';
            if (bill.status !== 'paid') {
                action = `<button class="btn-pay" onclick="pay('${bill._id}')">Pay Now</button>`;
            } else {
                action = `<button class="btn-pay" style="background: #17a2b8;" onclick="downloadReceipt('${bill._id}')">Download Receipt</button>`;
            }

            html += `<tr>
                <td>${bill.month}</td>
                <td>${bill.units}</td>
                <td>${dueDate}</td>
                <td>${Utils.formatCurrency(bill.amount)}</td>
                <td>${statusBadge}</td>
                <td>${action}</td>
            </tr>`;
        });

        html += '</tbody></table>';
        document.getElementById('bill-list').innerHTML = html;

    } catch (err) {
        console.error(err);
        document.getElementById('bill-list').innerText = "Error loading data.";
    }
}

async function pay(id) {
    if (!confirm("Confirm Payment?")) return;

    try {
        const data = await apiPost(`/bill/pay/${id}`, {});
        alert("Payment Successful!");
        loadDashboard();
    } catch (e) {
        alert(e.message);
    }
}

function downloadReceipt(billId) {
    const bill = window.allBills.find(b => b._id === billId);
    if (!bill) return;

    const win = window.open('', '', 'width=600,height=600');
    const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment Receipt</title>
            <style>
                body { font-family: sans-serif; padding: 40px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .total { font-weight: bold; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Electricity Bill Receipt</h2>
                <p>Service Number: ${bill.serviceNumber}</p>
            </div>

            <div style="border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px;">
                <div class="row"><span><strong>Customer Name:</strong></span> <span>${user.fullName}</span></div>
                <div class="row"><span><strong>Mobile:</strong></span> <span>${user.mobileNo}</span></div>
                 <div class="row"><span><strong>Address:</strong></span> <span>${user.address ? `${user.address.houseNo}, ${user.address.locality}, ${user.address.city}` : '-'}</span></div>
            </div>
            
            <div class="row"><span><strong>Bill ID:</strong></span> <span>${bill._id}</span></div>
            <div class="row"><span><strong>Billing Period:</strong></span> <span>${bill.periodStart ? Utils.formatDate(bill.periodStart) : 'N/A'} to ${bill.periodEnd ? Utils.formatDate(bill.periodEnd) : 'N/A'}</span></div>
            <div class="row"><span><strong>Billing Month:</strong></span> <span>${bill.month}</span></div>
            <div class="row"><span><strong>Units Consumed:</strong></span> <span>${bill.units}</span></div>
            
            <div class="total row">
                <span>Amount Paid:</span>
                <span>${Utils.formatCurrency(bill.amount)}</span>
            </div>

            <div class="row" style="margin-top: 10px;">
                <span>Paid Date:</span>
                <span>${Utils.formatDateTime(bill.paidDate)}</span>
            </div>

            <div class="footer">
                <p>Thank you for your payment.</p>
                <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer;">Print Receipt</button>
            </div>
        </body>
        </html>
    `;
    win.document.write(content);
    win.document.close();
}

function showRates() {
    if (!window.slabRates) return alert("Rates not loaded yet.");

    let msg = "Current Slab Rates:\n\n";
    const formatSlabs = (slabs) => {
        return slabs.map((s, i) => {
            if (s.limit === Infinity) return `> ${slabs[i - 1] ? 0 + slabs.slice(0, i).reduce((a, b) => a + b.limit, 0) : 0} Units: ₹${s.rate}`;
            return `Next ${s.limit} Units: ₹${s.rate}`;
        }).join('\n');
    };

    for (const [type, config] of Object.entries(window.slabRates)) {
        msg += `${type.toUpperCase()} (Service Charge: ₹${config.serviceCharge}):\n`;
        let currentCount = 0;
        config.slabs.forEach(s => {
            if (s.limit === Infinity) {
                msg += `Above ${currentCount} Units: ₹${s.rate}\n`;
            } else {
                msg += `${currentCount + 1} - ${currentCount + s.limit} Units: ₹${s.rate}\n`;
                currentCount += s.limit;
            }
        });
        msg += "\n";
    }

    alert(msg);
}

window.pay = pay;
window.downloadReceipt = downloadReceipt;
window.showRates = showRates;
window.logout = Utils.logout;


loadDashboard();
