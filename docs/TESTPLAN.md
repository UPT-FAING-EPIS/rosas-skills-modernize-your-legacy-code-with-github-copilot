# Test Plan - Mergington High School COBOL Accounting System

## Overview

This test plan covers all business logic in the legacy COBOL accounting system for Mergington High School. It will be used to validate the implementation with business stakeholders and later to create unit and integration tests in a Node.js application.

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Display Main Menu | Application is running | 1. Launch the application | Menu displays with options: 1. View Balance, 2. Credit Account, 3. Debit Account, 4. Exit | | | |
| TC-002 | View Balance - Initial Balance | Application is running, no prior transactions | 1. Launch application 2. Select option 1 (View Balance) | Display "Current balance: 1000.00" | | | Initial balance defaults to 1000.00 |
| TC-003 | Credit Account - Valid Amount | Application is running, balance = 1000.00 | 1. Launch application 2. Select option 2 (Credit Account) 3. Enter amount: 500.00 | Display "Amount credited. New balance: 1500.00" | | | |
| TC-004 | Credit Account - Zero Amount | Application is running, balance = 1000.00 | 1. Launch application 2. Select option 2 3. Enter amount: 0.00 | Balance remains unchanged at 1000.00 | | | Edge case: zero credit |
| TC-005 | Credit Account - Large Amount | Application is running, balance = 1000.00 | 1. Launch application 2. Select option 2 3. Enter amount: 999999.99 | Display "Amount credited. New balance: 1000999.99" | | | Tests maximum credit boundary |
| TC-006 | Debit Account - Sufficient Funds | Application is running, balance = 1000.00 | 1. Launch application 2. Select option 3 (Debit Account) 3. Enter amount: 200.00 | Display "Amount debited. New balance: 800.00" | | | |
| TC-007 | Debit Account - Insufficient Funds | Application is running, balance = 1000.00 | 1. Launch application 2. Select option 3 3. Enter amount: 1500.00 | Display "Insufficient funds for this debit." Balance remains 1000.00 | | | |
| TC-008 | Debit Account - Exact Balance | Application is running, balance = 1000.00 | 1. Launch application 2. Select option 3 3. Enter amount: 1000.00 | Display "Amount debited. New balance: 0.00" | | | Tests boundary: exactly equal to balance |
| TC-009 | Debit Account - Amount Greater by 1 Cent | Application is running, balance = 1000.00 | 1. Launch application 2. Select option 3 3. Enter amount: 1000.01 | Display "Insufficient funds for this debit." | | | Tests boundary: 1 cent over balance |
| TC-010 | Invalid Menu Selection | Application is running | 1. Launch application 2. Enter invalid option (e.g., 5, 0, -1) | Display "Invalid choice, please select 1-4." Menu re-displays | | | |
| TC-011 | Exit Application | Application is running | 1. Launch application 2. Select option 4 (Exit) | Display "Exiting the program. Goodbye!" Application terminates | | | |
| TC-012 | Multiple Credit Operations | Application is running, balance = 1000.00 | 1. Select option 2, enter 100.00 2. Select option 2, enter 200.00 3. Select option 1 to view balance | Balance = 1300.00 | | | Tests cumulative credits |
| TC-013 | Multiple Debit Operations | Application is running, balance = 1000.00 | 1. Select option 3, enter 300.00 2. Select option 3, enter 200.00 3. Select option 1 to view balance | Balance = 500.00 | | | Tests cumulative debits |
| TC-014 | Mixed Credit and Debit Operations | Application is running, balance = 1000.00 | 1. Select option 2, enter 500.00 2. Select option 3, enter 200.00 3. Select option 1 | Balance = 1300.00 | | | Tests mixed transactions |
| TC-015 | Balance Persistence Within Session | Application is running | 1. Credit 500.00 2. Debit 200.00 3. View balance | Balance reflects all operations = 1300.00 | | | Tests in-memory balance persistence |
| TC-016 | Balance Display Format | Application is running | 1. Launch application 2. Select option 1 | Balance displayed with 2 decimal places | | | Tests numeric formatting |
| TC-017 | Credit After Failed Debit | Application is running, balance = 1000.00 | 1. Attempt debit 2000.00 (fail) 2. Credit 500.00 3. View balance | Balance = 1500.00 (failed debit did not affect balance) | | | |
| TC-018 | Menu Loops After Operation | Application is running | 1. Perform any operation 2. Verify menu re-displays | Menu re-appears after each operation without requiring restart | | | Tests continuous loop behavior |
| TC-019 | Debit to Zero Balance | Application is running, balance = 1000.00 | 1. Debit 1000.00 2. Try to debit any amount 3. View balance | Second debit fails with "Insufficient funds". Balance = 0.00 | | | Tests zero balance behavior |
