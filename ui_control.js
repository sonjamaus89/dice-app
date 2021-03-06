const gameContainer = document.getElementById('game-container');

if (!gameContainer) {
  throw new Error('Roll dice was not loaded!');
}

const balanceTxt = gameContainer.querySelector('#balance');
const downBetAmountButton = gameContainer.querySelector('#bet-amount #down');
const upBetAmountButton = gameContainer.querySelector('#bet-amount #up');
const submitRollButton = gameContainer.querySelector('#submit-roll');
const rollDiceImg = gameContainer.querySelector('#roll-dice');
const betAmount = gameContainer.querySelector('#bet-amount #amount');
const betResult = gameContainer.querySelector('#bet-result');
const betResultAmountTxt = gameContainer.querySelector('#bet-result #amount');
const betResultLabelTxt = gameContainer.querySelector('#bet-result #label');
const messageBox = gameContainer.querySelector('#message-box');
const loading = document.body.querySelector('#loading');

let messageBoxTimeout;

const hideAppLoading = () => {
  loading && (loading.style.display = 'none');
};

const showMessage = (message, { timeout = 5000, type } = {}) => {
  if (!message) return;
  
  messageBox.className = '';
  const mesageEl = messageBox.querySelector('span');

  if (type) {
    messageBox.classList.add(type);
  }

  const prefix = type === 'error' ? 'Opps!\n' : '';

  mesageEl.innerText = `${prefix} ${message}`;
  messageBox.style.maxHeight = '100px';

  // clear prv msg
  if (messageBoxTimeout) {
    clearTimeout(messageBoxTimeout);
    messageBoxTimeout = null;
  }

  messageBoxTimeout = setTimeout(() => {
    messageBox.style.maxHeight = '0px';
  }, timeout);
};

const setBalanceTxt = ({ balance, symbol }) => {
  balance = Number(balance) || 0;
  balanceTxt && (balanceTxt.innerText = `${balance} ${symbol}`);
};

const setBetAmountTxt = balance => {
  balance = Number(balance) || 0;
  betAmount && (betAmount.value = balance);
};

const setBetWin = ({ winAmount, label = 'YOU WIN' }) => {
  winAmount = Number(winAmount) || 0;
  betResultAmountTxt && (betResultAmountTxt.innerText = winAmount);
  betResultLabelTxt && (betResultLabelTxt.innerText = label);
  betResult.style.display = 'flex';
};

const setBetLose = ({ loseAmount, label = 'YOU LOSE' }) => {
  loseAmount = Number(loseAmount) || 0;
  betResultAmountTxt && (betResultAmountTxt.innerText = loseAmount);
  betResultLabelTxt && (betResultLabelTxt.innerText = label);
  betResult.style.display = 'flex';
};

const getBalance = () => {
  const balance = Number(balanceTxt.innerText);
  if (typeof balance === 'number' && balance >= 0) {
    return balance;
  }

  return 0;
};

const getBetAmount = () => {
  const balance = Number(betAmount.value);
  if (typeof balance === 'number' && balance >= 0) {
    return balance;
  }

  return 0;
};

// register events
const onPressDownBetAmount = callback => {
  downBetAmountButton.addEventListener('click', callback);
};

const onPressUpBetAmount = callback => {
  upBetAmountButton.addEventListener('click', callback);
};

const onPressSubmitRoll = callback => {
  submitRollButton.addEventListener('click', function(e) {
    if (typeof callback === 'function') {
      callback(e);
      betResult.style.display = 'none';
    }
  });
};

const onSelectRollDice = callback => {
  const dices = document.querySelectorAll('.roll-dice-icon');
  dices.forEach(dice => {
    const diceNumber = dice.getAttribute('name');
    dice.addEventListener('click', () => callback(diceNumber));
  });
};

const setMaxAmountForBetAmountInput = maxAmount => {
  betAmount && betAmount.addEventListener('input', function (event) {
    
    const value = Number(event.target.value);

    if (!value) {
      betAmount.setCustomValidity('Please input a valid amount.');
    } else {
      betAmount.setCustomValidity('');
    }

    if (value > maxAmount) {
      betAmount.setCustomValidity(`Max amount you can bet is ${maxAmount}.`);
    } else {
      betAmount.setCustomValidity('');
    }
  });
};

const selectDice = diceNumber => {
  const activeClass = 'roll-dice-icon-active';
  const name = diceNumber;
  const diceEl = document.querySelector(`div[name='${name}']`);
  const activeEls = document.querySelectorAll('.roll-dice-icon-active');
  activeEls.forEach(el => el.classList.remove(activeClass));
  diceEl && diceEl.classList.add(activeClass);
};

const rollTo = number => {
  const dice1 = require('./assets/dice-1.png');
  const dice2 = require('./assets/dice-2.png');
  const dice3 = require('./assets/dice-3.png');
  const dice4 = require('./assets/dice-4.png');
  const dice5 = require('./assets/dice-5.png');
  const dice6 = require('./assets/dice-6.png');
  let dice = dice6;

  switch(number) {
  case 1:
    dice = dice1;
    break;
  case 2:
    dice = dice2;
    break;
  case 3:
    dice = dice3;
    break;
  case 4:
    dice = dice4;
    break;
  case 5:
    dice = dice5;
    break;
  case 6:
    dice = dice6;
    break;
  default:
    dice = dice6;
  }

  rollDiceImg.style.backgroundImage = `url('${dice.default}')`;
};

async function animateDice(betDiceNumber) {
  const delay = () => new Promise(r => setTimeout(r, 200));
  for(let i =1; i<= 6; i++) {
    selectDice(i);
    await delay();
  }
  selectDice(betDiceNumber);
}

export default {
  setBalanceTxt,
  getBalance,
  setBetAmountTxt,
  onPressDownBetAmount,
  onPressUpBetAmount,
  onPressSubmitRoll,
  setBetWin,
  setBetLose,
  setMaxAmountForBetAmountInput,
  getBetAmount,
  rollTo,
  selectDice,
  onSelectRollDice,
  showMessage,
  animateDice,
  hideAppLoading
};