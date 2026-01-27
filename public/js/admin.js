const user = Utils.requireRole('admin');

function logout() {
    Utils.logout();
}

async function loadApplications() {
    try {
        const pendingApps = await Api.get('/admin/applications?status=pending');
        const approvedUsers = await Api.get('/admin/applications?status=approved');

        const content = document.getElementById('content');
        let html = "";

        if (pendingApps.length > 0) {
            html += "<h3>Pending Requests</h3><table><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Connection</th><th>Action</th></tr></thead><tbody>";
            pendingApps.forEach(app => {
                html += `<tr>
                    <td>${app.fullName}</td>
                    <td>${app.role}</td>
                    <td>${app.email}</td>
                    <td>${app.connectionType}</td>
                    <td><button class="approve-btn" onclick="approve('${app._id}')">Approve</button></td>
                </tr>`;
            });
            html += "</tbody></table>";
        } else {
            html += "<h3>Pending Requests</h3><p>No pending applications.</p>";
        }

        html += "<h3>Approved Users (Active Connections)</h3>";
        if (approvedUsers.length > 0) {
            html += "<table><thead><tr><th>Service No</th><th>Name</th><th>Role</th><th>Email</th><th>Connection</th></tr></thead><tbody>";
            approvedUsers.forEach(user => {
                html += `<tr>
                    <td><strong>${user.serviceNumber}</strong></td>
                    <td>${user.fullName}</td>
                    <td>${user.role}</td>
                    <td>${user.email}</td>
                    <td>${user.connectionType}</td>
                </tr>`;
            });
            html += "</tbody></table>";
        } else {
            html += "<p>No active connections.</p>";
        }

        content.innerHTML = html;
    } catch (err) {
        console.error(err);
        document.getElementById('content').innerText = "Error loading data.";
    }
}

async function approve(id) {
    if (!confirm("Approve this application?")) return;

    try {
        const data = await Api.post('/admin/approve', { id });
        alert('Approved! Service Number: ' + data.serviceNumber);
        loadApplications();
    } catch (err) {
        alert("Error approving: " + err.message);
    }
}

// Make functions global
window.approve = approve;
window.logout = logout;

loadApplications();
