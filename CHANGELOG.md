### 1.0.0 (2024-03-20)

##### Stacks keyring implementation

- Implemented Keyring functionality to enable account generation and export keys
- Added getAccounts() method to fetch list of generated accounts
- Added importWallet() to import account using privateKey
- Added test suite to test wallet
- Added get balance method to fetch STX balance of an account and test cases
- Added functionality to sign and send native STX token, fungible tokens
- Added functionality to sign message
- Added ckecks to function params
- Added test cases for sign message and transaction function
- Added fees estimation for STX andd fungible token transfers
- Added test cases for estimate transaction fee
- Applied the latest nonce values used by an account for transaction signing


### 1.0.1 (2024-05-02)

- Added incoming estimated fee for transaction signing

### 1.0.2 (2024-05-02)

- Updated 'main' path in package.json.
- Updated generate wallet return parameters

### 1.0.3 (2024-05-06)

- Bugfix: sign message

### 1.0.4 (2024-05-07)

- Generalize the address format to uppercase