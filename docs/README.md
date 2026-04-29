# Mergington High School - Legacy COBOL Accounting System Documentation

## Overview

This documentation describes the legacy COBOL-based accounting system used by Mergington High School since the early 1990s. The system manages student fees, cafeteria accounts, and school supplies purchases.

## COBOL Files

### 1. `main.cob` - Main Program (`MainProgram`)

**Purpose:** Entry point of the application. Provides an interactive menu-driven interface for account management operations.

**Key Functions:**
- Displays the Account Management System menu with 4 options:
  1. View Balance
  2. Credit Account
  3. Debit Account
  4. Exit
- Accepts user input and delegates to the `Operations` program via CALL statements
- Loops until the user selects Exit (option 4)

**Business Rules:**
- Valid user choices are 1 through 4
- Invalid choices display an error message and re-prompt the user
- The program runs continuously until the user explicitly exits

---

### 2. `data.cob` - Data Program (`DataProgram`)

**Purpose:** Handles all data storage and retrieval for student account balances. Acts as the data access layer.

**Key Functions:**
- `READ` operation: Returns the current `STORAGE-BALANCE` value to the caller
- `WRITE` operation: Updates `STORAGE-BALANCE` with a new balance value

**Business Rules:**
- Initial balance is set to `1000.00` (default starting balance for student accounts)
- Supports only two operations: READ and WRITE, passed via `PASSED-OPERATION` parameter
- Balance is stored as a packed decimal with 2 decimal places (`PIC 9(6)V99`)

---

### 3. `operations.cob` - Operations Program (`Operations`)

**Purpose:** Contains the business logic for all account operations. Processes credits, debits, and balance inquiries by interacting with `DataProgram`.

**Key Functions:**
- `TOTAL` operation: Reads the current balance from `DataProgram` and displays it
- `CREDIT` operation: Prompts for an amount, reads current balance, adds the amount, writes the updated balance, and confirms the transaction
- `DEBIT` operation: Prompts for an amount, reads current balance, checks for sufficient funds, subtracts the amount, writes the updated balance, and confirms the transaction

**Business Rules:**
- **Insufficient Funds**: If the account balance is less than the requested debit amount, the transaction is rejected with the message "Insufficient funds for this debit."
- **Credit**: Any positive amount can be added to the account
- **Balance Display**: Balance is shown with 2 decimal place precision
- Initial balance defaults to `1000.00`

---

## Data Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant MainProgram
    participant Operations
    participant DataProgram

    User->>MainProgram: Start Application
    MainProgram->>User: Display Menu (View Balance / Credit / Debit / Exit)

    alt View Balance (Option 1)
        User->>MainProgram: Select 1
        MainProgram->>Operations: CALL using 'TOTAL'
        Operations->>DataProgram: CALL using 'READ', FINAL-BALANCE
        DataProgram-->>Operations: Return STORAGE-BALANCE
        Operations-->>User: Display "Current balance: {FINAL-BALANCE}"
    end

    alt Credit Account (Option 2)
        User->>MainProgram: Select 2
        MainProgram->>Operations: CALL using 'CREDIT'
        Operations->>User: Display "Enter credit amount"
        User->>Operations: Enter AMOUNT
        Operations->>DataProgram: CALL using 'READ', FINAL-BALANCE
        DataProgram-->>Operations: Return STORAGE-BALANCE
        Operations->>Operations: ADD AMOUNT TO FINAL-BALANCE
        Operations->>DataProgram: CALL using 'WRITE', FINAL-BALANCE
        DataProgram-->>Operations: Update STORAGE-BALANCE
        Operations-->>User: Display "Amount credited. New balance: {FINAL-BALANCE}"
    end

    alt Debit Account (Option 3)
        User->>MainProgram: Select 3
        MainProgram->>Operations: CALL using 'DEBIT'
        Operations->>User: Display "Enter debit amount"
        User->>Operations: Enter AMOUNT
        Operations->>DataProgram: CALL using 'READ', FINAL-BALANCE
        DataProgram-->>Operations: Return STORAGE-BALANCE
        alt Sufficient Funds
            Operations->>Operations: SUBTRACT AMOUNT FROM FINAL-BALANCE
            Operations->>DataProgram: CALL using 'WRITE', FINAL-BALANCE
            DataProgram-->>Operations: Update STORAGE-BALANCE
            Operations-->>User: Display "Amount debited. New balance: {FINAL-BALANCE}"
        else Insufficient Funds
            Operations-->>User: Display "Insufficient funds for this debit."
        end
    end

    alt Exit (Option 4)
        User->>MainProgram: Select 4
        MainProgram->>MainProgram: Set CONTINUE-FLAG to 'NO'
        MainProgram-->>User: Display "Exiting the program. Goodbye!"
    end
```
