function register() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mobileNo = document.getElementById('mobileNo').value;
    const connectionType = document.getElementById('connectionType').value || 'household';

    const address = {
        houseNo: document.getElementById('houseNo').value,
        locality: document.getElementById('locality').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value
    };

    if (!fullName || !email || !password || !mobileNo) {
        document.getElementById('msg').innerText = "Please fill all required fields.";
        return;
    }

    const data = {
        fullName,
        email,
        password,
        mobileNo,
        connectionType,
        role: 'employee',
        address
    };

    Api.post('/auth/register', data)
        .then(res => {
            const msgEl = document.getElementById('msg');
            msgEl.style.color = 'green';
            msgEl.innerText = res.message;
            document.getElementById('regForm').reset();
        })
        .catch(err => {
            const msgEl = document.getElementById('msg');
            msgEl.style.color = '#d9534f';
            msgEl.innerText = err.message || "Registration Failed";
        });
}

// Make globally available
window.register = register;
