# Module Specifications

## 1. Auth Module (`backend/routes/auth.js`)
**Description**: Handles user registration and authentication.
**Inputs**: Full Name, Mobile Number, Email, Password, Connection Type, Address.
**Preconditions**: Database must be connected.
**Output**: JSON response with success/error message and user token/data.

### Logic (Pseudocode)
```
FUNCTION register(userData):
  VALIDATE fullName is alphabets only
  VALIDATE mobileNo is exactly 10 digits
  IF email exists in DB:
    RETURN Error "Email already registered"
  CREATE new User(userData)
  SAVE to DB
  RETURN Success "Application submitted"

FUNCTION login(email, password):
  FIND user by email and password
  IF user not found:
    RETURN Error "Invalid Credentials"
  IF user.status is 'pending' OR 'rejected':
    RETURN Error "Application not approved"
  RETURN user details
```

## 2. Bill Module (`backend/routes/bill.js`)
**Description**: Handles electricity bill generation, calculation logic, and payment processing.
**Inputs**: Service Number, Current Reading.
**Preconditions**: User must exist and have an approved service number.
**Output**: Generated Bill object or Payment Receipt.

### Calculation Algorithm
```
CONST SLAB_RATES = {
  household: [{50, 1.5}, {50, 2.5}, {50, 3.5}, {Infinity, 4.5}],
  commercial: [{50, 2.5}, ..., {Infinity, 8.5}],
  industry: [{50, 3.5}, ..., {Infinity, 15.5}]
}

FUNCTION calculateBill(units, type):
  GET config for type from SLAB_RATES
  SET amount = 0
  SET remaining = units
  FOR each slab in config.slabs:
    IF remaining <= 0 BREAK
    unitsInSlab = MIN(remaining, slab.limit)
    amount += unitsInSlab * slab.rate
    remaining -= unitsInSlab
  RETURN amount + config.serviceCharge
```

## 3. Frontend Registration (`public/js/register.js`)
**Description**: client-side script for capturing user input and sending to backend.
**Logic**:
- Captures input from HTML form.
- Validates Regex: `^[A-Za-z\s]+$` (Name), `^\d{10}$` (Phone).
- Sends async POST request to `/auth/register`.
- Displays success/error message to user.
