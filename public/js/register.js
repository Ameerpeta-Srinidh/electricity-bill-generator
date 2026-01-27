function register() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mobileNo = document.getElementById('mobileNo').value;
    const connectionType = document.getElementById('connectionType').value;

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

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(fullName)) {
        document.getElementById('msg').innerText = "Name must contain only alphabets.";
        document.getElementById('msg').style.color = '#d9534f';
        return;
    }


    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobileNo)) {
        document.getElementById('msg').innerText = "Mobile number must be exactly 10 digits.";
        document.getElementById('msg').style.color = '#d9534f';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('msg').innerText = "Please enter a valid email address.";
        document.getElementById('msg').style.color = '#d9534f';
        return;
    }

    const PinCodeRegex = /^[0-9]{6}$/;
    if (address.pincode && !PinCodeRegex.test(address.pincode)) {
        document.getElementById('msg').innerText = "Pincode must be exactly 6 digits.";
        document.getElementById('msg').style.color = '#d9534f';
        return;
    }

    const data = {
        fullName,
        email,
        password,
        mobileNo,
        connectionType,
        address
    };

    apiPost('/auth/register', data)
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
window.register = register;
