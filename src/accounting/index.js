/**
 * Mergington High School - Accounting System
 * Converted from COBOL to Node.js
 * 
 * Original COBOL files:
 * - main.cob: Main menu and program flow
 * - data.cob: Data storage and retrieval
 * - operations.cob: Business logic (credit, debit, balance)
 */

const readline = require('readline');

// Data module - equivalent to data.cob
let storageBalance = 1000.00;

function readBalance() {
  return storageBalance;
}

function writeBalance(newBalance) {
  storageBalance = newBalance;
}

// Operations module - equivalent to operations.cob
function getTotal() {
  const balance = readBalance();
  console.log(`Current balance: ${balance.toFixed(2)}`);
  return balance;
}

function creditAccount(amount) {
  const currentBalance = readBalance();
  const newBalance = currentBalance + amount;
  writeBalance(newBalance);
  console.log(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
  return newBalance;
}

function debitAccount(amount) {
  const currentBalance = readBalance();
  if (amount > currentBalance) {
    console.log('Insufficient funds for this debit.');
    return currentBalance;
  }
  const newBalance = currentBalance - amount;
  writeBalance(newBalance);
  console.log(`Amount debited. New balance: ${newBalance.toFixed(2)}`);
  return newBalance;
}

// Main program - equivalent to main.cob
function displayMenu() {
  console.log('\n=== Account Management System ===');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('================================');
}

async function getInput(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let continueFlag = true;

  while (continueFlag) {
    displayMenu();
    const choice = await getInput(rl, 'Enter your choice (1-4): ');

    switch (choice) {
      case '1':
        getTotal();
        break;
      case '2': {
        const creditStr = await getInput(rl, 'Enter credit amount: ');
        const creditAmount = parseFloat(creditStr);
        if (isNaN(creditAmount) || creditAmount < 0) {
          console.log('Invalid amount. Please enter a positive number.');
        } else {
          creditAccount(creditAmount);
        }
        break;
      }
      case '3': {
        const debitStr = await getInput(rl, 'Enter debit amount: ');
        const debitAmount = parseFloat(debitStr);
        if (isNaN(debitAmount) || debitAmount < 0) {
          console.log('Invalid amount. Please enter a positive number.');
        } else {
          debitAccount(debitAmount);
        }
        break;
      }
      case '4':
        console.log('Exiting the program. Goodbye!');
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  rl.close();
}

// Export functions for unit testing
module.exports = {
  readBalance,
  writeBalance,
  getTotal,
  creditAccount,
  debitAccount,
  resetBalance: () => { storageBalance = 1000.00; },
};

// Run main only when executed directly (not when required in tests)
if (require.main === module) {
  main();
}
