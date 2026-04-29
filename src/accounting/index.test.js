/**
 * Unit Tests for Mergington High School Accounting System
 * Tests based on TESTPLAN.md
 */

const {
  readBalance,
  writeBalance,
  getTotal,
  creditAccount,
  debitAccount,
  resetBalance,
} = require('./index');

// Reset balance before each test
beforeEach(() => {
  resetBalance();
});

describe('Data Module', () => {
  test('TC-002: Initial balance should be 1000.00', () => {
    expect(readBalance()).toBe(1000.00);
  });

  test('writeBalance should update the stored balance', () => {
    writeBalance(500.00);
    expect(readBalance()).toBe(500.00);
  });
});

describe('getTotal (View Balance)', () => {
  test('TC-002: Returns current balance', () => {
    const balance = getTotal();
    expect(balance).toBe(1000.00);
  });

  test('TC-016: Balance is a number with decimal precision', () => {
    const balance = readBalance();
    expect(balance.toFixed(2)).toBe('1000.00');
  });
});

describe('creditAccount', () => {
  test('TC-003: Credit valid amount increases balance', () => {
    const newBalance = creditAccount(500.00);
    expect(newBalance).toBe(1500.00);
    expect(readBalance()).toBe(1500.00);
  });

  test('TC-004: Credit zero amount leaves balance unchanged', () => {
    const newBalance = creditAccount(0.00);
    expect(newBalance).toBe(1000.00);
  });

  test('TC-005: Credit large amount works correctly', () => {
    const newBalance = creditAccount(999999.99);
    expect(newBalance).toBeCloseTo(1000999.99, 2);
  });

  test('TC-012: Multiple credits accumulate correctly', () => {
    creditAccount(100.00);
    creditAccount(200.00);
    expect(readBalance()).toBe(1300.00);
  });

  test('TC-017: Credit after failed debit works correctly', () => {
    debitAccount(2000.00); // Should fail
    creditAccount(500.00);
    expect(readBalance()).toBe(1500.00);
  });
});

describe('debitAccount', () => {
  test('TC-006: Debit with sufficient funds reduces balance', () => {
    const newBalance = debitAccount(200.00);
    expect(newBalance).toBe(800.00);
    expect(readBalance()).toBe(800.00);
  });

  test('TC-007: Debit with insufficient funds returns unchanged balance', () => {
    const balanceBefore = readBalance();
    const result = debitAccount(1500.00);
    expect(result).toBe(balanceBefore);
    expect(readBalance()).toBe(balanceBefore);
  });

  test('TC-008: Debit exact balance results in zero balance', () => {
    const newBalance = debitAccount(1000.00);
    expect(newBalance).toBe(0.00);
    expect(readBalance()).toBe(0.00);
  });

  test('TC-009: Debit 1 cent over balance is rejected', () => {
    const balanceBefore = readBalance();
    const result = debitAccount(1000.01);
    expect(result).toBe(balanceBefore);
    expect(readBalance()).toBe(balanceBefore);
  });

  test('TC-013: Multiple debits accumulate correctly', () => {
    debitAccount(300.00);
    debitAccount(200.00);
    expect(readBalance()).toBe(500.00);
  });

  test('TC-019: Debit to zero then further debit fails', () => {
    debitAccount(1000.00); // Zero balance
    const result = debitAccount(1.00); // Should fail
    expect(readBalance()).toBe(0.00);
    expect(result).toBe(0.00);
  });
});

describe('Mixed Operations', () => {
  test('TC-014: Mixed credit and debit operations', () => {
    creditAccount(500.00); // 1500
    debitAccount(200.00); // 1300
    expect(readBalance()).toBe(1300.00);
  });

  test('TC-015: Balance persists across multiple operations in session', () => {
    creditAccount(500.00);
    debitAccount(200.00);
    const balance = getTotal();
    expect(balance).toBe(1300.00);
  });
});
