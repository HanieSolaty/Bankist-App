'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const mainHeading = document.querySelector('.main__heading');

const formLogin = document.querySelector('.login');
const formTransfer = document.querySelector('.form--transfer');
const formLoan = document.querySelector('.form--loan');
const formClose = document.querySelector('.form--close');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const modal = document.querySelector('.modal');
const btnCloseModal = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');
const modalMessage = document.querySelector('.modal-heading');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; */

/////////////////////////////////////////////////
//On refresh scroll back to top
//values aren't sorted at the begining
let sorted = false;

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

//Modal window Functions
const hideFunc = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const unhideFunc = function (str) {
  modalMessage.textContent = str;
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

btnCloseModal.addEventListener('click', hideFunc);
overlay.addEventListener('click', hideFunc);

//Bankist functions
function computeUsername(accounts) {
  accounts.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
}

computeUsername(accounts);

function addMovement(movements) {
  //moves are the sorted version of movement based on sorted var
  let moves = sorted
    ? movements.slice().sort((a, b) => (sorted === 'asc' ? a - b : b - a))
    : movements;

  console.log(movements, sorted);
  console.log(moves);

  containerMovements.innerHTML = ``;
  moves.forEach((move, i) => {
    const type = move > 0 ? `deposit` : `withdrawal`;
    const movementsRow = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${Math.abs(move)}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, movementsRow);
  });
}

function calcBalance(curAcc) {
  const movements = curAcc.movements;
  const balance = movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = `${balance}€`;
  curAcc.balance = balance;
}

function calcSummary(movements, interestRate) {
  const sumIn = movements
    .filter(move => move > 0)
    .reduce((sum, move) => sum + move, 0);
  labelSumIn.textContent = `${sumIn}€`;

  const sumOut = movements
    .filter(move => move < 0)
    .reduce((sum, move) => sum + move, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)}€`;

  const sumInterset = movements
    .filter(move => move > 0)
    .map(move => (move * interestRate) / 100)
    .reduce((sum, move) => sum + move, 0);
  labelSumInterest.textContent = `${Math.floor(sumInterset)}€`;
}

let currentAccount;

function updateUI() {
  //calc and display current balance
  calcBalance(currentAccount);
  //calc and display account movements
  addMovement(currentAccount.movements);
  //calc and display current summary
  calcSummary(currentAccount.movements, currentAccount.interestRate);
}

function login(e) {
  e.preventDefault();
  currentAccount = accounts.find(
    account =>
      inputLoginUsername.value.toLowerCase().trim() === account.username
  );
  if (currentAccount?.pin === Number(inputLoginPin.value) && currentAccount) {
    //hide Welcom back text
    mainHeading.style.display = 'none';
    //welcom with username
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //ake off focus from it
    inputLoginPin.blur();
    inputLoginUsername.blur();
    //show account detail
    containerApp.style.opacity = 100;
    //show Balance, Movements, Summary
    updateUI();
  } else {
    unhideFunc('Wrong Username or Password!');
  }
  //empty Login form
  inputLoginPin.value = inputLoginUsername.value = '';
}

//add EventListener for Login form
formLogin.addEventListener('submit', login);

//Operations functions
//Transfer
function transfer(e) {
  e.preventDefault();
  const receiverAccount = accounts.find(
    account => inputTransferTo.value === account.username
  );
  const amount = Number(inputTransferAmount.value);
  if (
    receiverAccount &&
    amount > 0 &&
    receiverAccount?.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    console.log('Valdi');
    updateUI();
    unhideFunc('Transfer Complete!');
  } else {
    unhideFunc('Invalid Transfer!');
  }
  inputTransferAmount.value = inputTransferTo.value = '';
}

//add EventListener for Transfer form
formTransfer.addEventListener('submit', transfer);

//Close
function close(e) {
  e.preventDefault();
  if (
    Number(inputClosePin.value) === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    const index = accounts.findIndex(
      account => inputCloseUsername.value === account.username
    );
    //since here we have currentAccount we could have used accounts.indexOf(currentAccount) but the findIndex method can handle any condition unlike indexOf which only check equivalent value to the one we sent in
    accounts.splice(index, 1);
    unhideFunc(`Successfuly removed the account!`);
    //seting UI back to Login form
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    mainHeading.style.display = 'block';
    //go back to top
    window.scrollTo(0, 0);
  } else {
    unhideFunc('Invalid account credential!');
  }
  inputClosePin.value = inputCloseUsername.value = '';
}

//add EventListener for Close form
formClose.addEventListener('submit', close);

//Loan
function loan(e) {
  e.preventDefault();
  console.log('here');
  //only if you have at least 1 deposit which is deposit >= 10% of loan requested money then you get the loan
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(move => move >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    unhideFunc(`Your Loan Request was accepted!`);
    //update ui to show loan in deposits
    updateUI();
  } else {
    unhideFunc('Your Loan Request was denied!');
  }
  inputLoanAmount.value = '';
}

//add EventListener for Close form
formLoan.addEventListener('submit', loan);

//add EventListener for Sort btn
let sorting = [false, 'asc', 'des'];
btnSort.addEventListener('click', function () {
  sorted =
    sorting.indexOf(sorted) < 2
      ? sorting[sorting.indexOf(sorted) + 1]
      : sorting[0];
  console.log(sorted);
  addMovement(currentAccount.movements);
});
