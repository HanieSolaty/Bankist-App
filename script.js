'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2023-08-06T14:43:26.374Z',
    '2023-08-12T18:49:59.371Z',
    '2023-08-13T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
/* const account1 = {
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
 */
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
const btnLogout = document.querySelector('.logout');

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

//display formated Money based on local User
function displayMoney({ currency, locale }, value) {
  const options = {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  };
  return new Intl.NumberFormat(locale, options).format(Math.abs(value));
}

//Dispaly Date Function
function displayDate(recDate = new Date(), time = false, locale = 'en-US') {
  //TODO we have the Locales for Intl API to have  national formated date but I prefer same formatiing always
  //using Intl API approach with help locale attr of account
  //TODO for more locale/ISO code you can see ISO language table
  //TODO navigator.language will return the local system ISO code
  const optionsDateTime = {
    minute: '2-digit',
    hour: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  const optionsDate = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  recDate = new Date(recDate);
  const formatedDate = time
    ? new Intl.DateTimeFormat(locale, optionsDateTime).format(recDate)
    : new Intl.DateTimeFormat(locale, optionsDate).format(recDate);
  return formatedDate;

  //my own formating date functionality
  /* let objDate = {
    year: recDate.getFullYear(),
    month: recDate.getMonth() + 1,
    day: recDate.getDate(),
    hour: recDate.getHours(),
    min: recDate.getMinutes(),
  };
  Object.entries(objDate).forEach(([key, val]) => {
    objDate[key] = key !== 'year' ? String(val).padStart(2, 0) : val;
  });
  const strDate = `${objDate.day}/${objDate.month}/${objDate.year}`;
  return !time ? strDate : strDate + `, ${objDate.hour}:${objDate.min}`; */
}

//display recent date in terms like today, yesterday , 3 day ago and etc
function displayRecentDate(recDate = new Date()) {
  recDate = new Date(recDate);

  //Recreating date with only year and month and date so they don't include hour and min and sec because it's very complicated to find number of passed day if they were in date(), Example: if a transaction was done at 11pm and we check our account again at 1am to tomarrow then only 2h hass passed and daysPassed var would show that but techincaly the transaction would have been done yesterday, but we would have to say Today!!! and with only year/month/day even if the transaction was done yesterday (2h ago) we will stil get yesterday since we have no idea at what hour or min or sec
  let todayDate = new Date();
  todayDate = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate()
  );

  recDate = new Date(
    recDate.getFullYear(),
    recDate.getMonth(),
    recDate.getDate()
  );
  //return value will be time difference between these dates but in mili seconds so we convert it to days
  const daysPassed = (todayDate - recDate) / (1000 * 60 * 60 * 24);
  //if not in recent week the displayDate function should be used so this function will return false
  if (daysPassed >= 8) return false;
  return daysPassed === 0
    ? 'Today'
    : daysPassed === 1
    ? 'Yesterday'
    : `${daysPassed}  days ago`;
}

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

function addMovementsToUI({ movements, movementsDates, locale }) {
  //moves are the sorted version of movement based on sorted var
  const moveAndDate = movements.map((mov, i) => [mov, movementsDates[i]]);
  let moves = sorted
    ? moveAndDate
        .slice()
        .sort((a, b) => (sorted === 'asc' ? a[0] - b[0] : b[0] - a[0]))
    : moveAndDate;

  containerMovements.innerHTML = ``;
  moves.forEach((move, i) => {
    const type = move[0] > 0 ? `deposit` : `withdrawal`;
    const movementsRow = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${
            displayRecentDate(move[1]) || displayDate(move[1], false, locale)
          }</div>
          <div class="movements__value">${displayMoney(
            currentAccount,
            move[0]
          )}</div>
        </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, movementsRow);
  });
}

function calcBalance(curAcc) {
  const movements = curAcc.movements;
  const balance = movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = displayMoney(currentAccount, balance);
  curAcc.balance = balance;
}

function calcSummary({ movements, interestRate }) {
  const sumIn = movements
    .filter(move => move > 0)
    .reduce((sum, move) => sum + move, 0);
  labelSumIn.textContent = displayMoney(currentAccount, sumIn);

  const sumOut = movements
    .filter(move => move < 0)
    .reduce((sum, move) => sum + move, 0);
  labelSumOut.textContent = displayMoney(currentAccount, sumOut);

  const sumInterset = movements
    .filter(move => move > 0)
    .map(move => (move * interestRate) / 100)
    .reduce((sum, move) => sum + move, 0);
  labelSumInterest.textContent = displayMoney(currentAccount, sumInterset);
}

let currentAccount, timer, loanTimer;

function startLogOutInactiveUser() {
  //This function is to log out user, if they are inactive for 5 min
  let timeRemaining = 180;
  function tick() {
    const min = String(Math.floor(timeRemaining / 60)).padStart(2, 0);
    const sec = String(Math.floor(timeRemaining % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (timeRemaining === 0) {
      logOut();
      unhideFunc('Logged out beacuse you were inactive for 3 mintues!');
    }
    timeRemaining--;
  }
  tick();
  timer = setInterval(tick, 1000);
}

function updateUI() {
  //calc and display current balance
  calcBalance(currentAccount);
  //calc and display account movements
  addMovementsToUI(currentAccount);
  //calc and display current summary
  calcSummary(currentAccount);
}

//Log out function excute if user has been inactive for some time or logout btn clicked
function logOut() {
  if (loanTimer) clearTimeout(loanTimer);
  if (timer) clearInterval(timer);
  //seting UI back to Login form(Basically Log out)
  labelWelcome.textContent = 'Log in to get started';
  mainHeading.style.display = 'block';
  containerApp.style.opacity = 0;
  //reseting login form and removing logout btn
  btnLogout.style.display = 'none';
  formLogin.style.display = 'flex';
  //go back to top
  window.scrollTo(0, 0);
}

//add Event listner to log out btn
btnLogout.addEventListener('click', logOut);

function login(e) {
  e.preventDefault();
  currentAccount = accounts.find(
    account => inputLoginUsername.value.trim() === account.username
  );
  if (currentAccount?.pin === Number(inputLoginPin.value) && currentAccount) {
    //start Timer to log out user after 5 min(if inactive)
    if (loanTimer) clearTimeout(loanTimer);
    if (timer) clearInterval(timer);
    startLogOutInactiveUser();

    //hide login form and show log out btn
    btnLogout.style.display = 'block';
    formLogin.style.display = 'none';
    //hide Welcom back text
    mainHeading.style.display = 'none';
    //welcom with username
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //showing current Date when you log in, (undefined, true) 1th arg will be set to current date and time in func and second is to show both date and time not date only(default)
    labelDate.textContent = displayDate(undefined, true, currentAccount.locale);
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
function pushNewMove(account, amount) {
  account.movements.push(amount);
  account.movementsDates.push(new Date().toISOString());
}

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
    pushNewMove(currentAccount, -amount);
    pushNewMove(receiverAccount, amount);
    updateUI();
    unhideFunc('Transfer Complete!');
  } else {
    unhideFunc('Invalid Transfer!');
  }

  //transfer is an activity so we reset the timer for log out inactive users
  clearInterval(timer);
  startLogOutInactiveUser();
  //Reseting UI
  inputTransferAmount.blur();
  inputTransferTo.blur();
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
    logOut();
  } else {
    unhideFunc('Invalid account credential!');
  }
  inputClosePin.blur();
  inputCloseUsername.blur();
  inputClosePin.value = inputCloseUsername.value = '';
}

//add EventListener for Close form
formClose.addEventListener('submit', close);

//Loan
function loan(e) {
  e.preventDefault();
  console.log('here');
  //only if you have at least 1 deposit which is deposit >= 10% of loan requested money then you get the loan
  unhideFunc(`Your Loan Request is submitted and is being reviewed!`);
  const amount = Number(inputLoanAmount.value);
  loanTimer = setTimeout(() => {
    if (
      amount > 0 &&
      currentAccount.movements.some(move => move >= amount * 0.1)
    ) {
      pushNewMove(currentAccount, Math.floor(amount));
      unhideFunc(`Your Loan Request was accepted!`);
      //update ui to show loan in deposits
      updateUI();
    } else {
      unhideFunc('Your Loan Request was denied!');
    }
  }, 10000);
  //loan request is an activity so we reset the timer for log out inactive users
  clearInterval(timer);
  startLogOutInactiveUser();
  //Reseting UI
  inputLoanAmount.blur();
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
  //sorting is an activity so we reset the timer for log out inactive users
  clearInterval(timer);
  startLogOutInactiveUser();
  //display sorted
  addMovementsToUI(currentAccount);
});
