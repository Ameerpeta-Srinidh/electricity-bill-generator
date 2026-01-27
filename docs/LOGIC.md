# System Logic & Algorithms

## 1. Bill Calculation Algorithm
**Module:** Backend (`routes/bill.js`)
**Input:** Service Number, Current Reading
**Preconditions:** Previous reading exists (or 0 for new). Current Reading > Previous Reading.

**Algorithm:**
```
START
  READ ServiceNumber, CurrentReading
  FETCH User by ServiceNumber
  IF User NOT FOUND THEN
    RETURN Error "Invalid Service Number"
  END IF

  FETCH Last Bill for ServiceNumber
  SET PreviousReading = LastBill.CurrentReading OR User.InitialReading (0)

  IF CurrentReading < PreviousReading THEN
    RETURN Error "Invalid Reading (Lower than previous)"
  END IF

  SET UnitsConsumed = CurrentReading - PreviousReading
  SET ConnectionType = User.ConnectionType

  CALCULATE Rate based on Slab (e.g., Household)
    IF Units <= 100 THEN Rate = 5
    ELSE IF Units <= 150 THEN Rate = 6
    ELSE IF Units <= 200 THEN Rate = 7
    ELSE Rate = 8
  
  SET Amount = UnitsConsumed * Rate
  SET ServiceCharge = ConnectionType_BaseCharge
  SET TotalAmount = Amount + ServiceCharge

  SAVE Bill to Database
  UPDATE User.CurrentUnits = CurrentReading
  RETURN Bill Details
END
```

## 2. User Approval Logic
**Module:** Backend (`routes/admin.js`)
**Input:** User ID
**Preconditions:** User status is 'pending'.

**Algorithm:**
```
START
  READ UserId
  FETCH User by UserId
  IF User.Status != 'pending' THEN
    RETURN Error
  END IF

  LOOP
    GENERATE Random ServiceNumber (SC + 6 digits)
    CHECK if ServiceNumber exists in DB
    IF NOT exists THEN
      BREAK Loop
    END IF
  END LOOP

  SET User.ServiceNumber = GeneratedServiceNumber
  SET User.Status = 'approved'
  SAVE User
  RETURN ServiceNumber
END
```
