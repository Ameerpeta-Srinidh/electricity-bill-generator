# Test Plan

## 1. Registration (`auth` / `register.js`)

| Test ID | Functionality | Input | Expected Output | Actual Output |
|---------|---------------|-------|-----------------|---------------|
| T-REG-01| Name Validation | Name="John123" | Error: "Name must contain only alphabets." | |
| T-REG-02| Phone Validation | Phone="12345" | Error: "Mobile number must be exactly 10 digits." | |
| T-REG-03| Successful Reg | Valid Data | Success: "Application submitted..." | |
| T-REG-04| Duplicate Email | Existing Email | Error: "Email already registered" | |

## 2. Bill Calculation (`bill.js`)

| Test ID | Functionality | Input | Expected Output | Actual Output |
|---------|---------------|-------|-----------------|---------------|
| T-BIL-01| Household Slab (Low) | Units=50 | (50*1.5) + 25 = ₹100 | |
| T-BIL-02| Household Slab (Med) | Units=100 | (50*1.5 + 50*2.5) + 25 = ₹225 | |
| T-BIL-03| Household Slab (High)| Units=200 | (50*1.5 + 50*2.5 + 50*3.5 + 50*4.5) + 25 = ₹625 | |
| T-BIL-04| Min Charge | Units=0 | Amount = ₹25 | |

## 3. Login (`auth.js`)

| Test ID | Functionality | Input | Expected Output | Actual Output |
|---------|---------------|-------|-----------------|---------------|
| T-LOG-01| Pending User | Valid Creds | Error: "Your application is still pending approval." | |
| T-LOG-02| Invalid Pass | Wrong Pass | Error: "Invalid Credentials" | |
| T-LOG-03| Approved User | Valid Creds | Success: Login + Dashboard Data | |
