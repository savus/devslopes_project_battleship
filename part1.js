const readlineSync = require('readline-sync'); 

const alphabetList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const gridSize = 3;
let struckLocations = {};
let numberOfShips = 2;
let shipLocations = [];
let gameOver = false;

const buildGrid = (size) => {
   let grid = [];
   for (let i = 0; i < size; i++) {
      grid[i] = [];
      for (let j = 0; j < size; j++) {
         grid[i][j] = alphabetList[i] + (j+1); 
      }
   }
   return grid;
} 

let grid = buildGrid(gridSize);

const printHeaders = () => {
   let result = ' '.repeat(3);
   for (let i = 0; i < gridSize; i++) {
      result += i + ' '.repeat(2);
   }
   return result;
}

const printGrid = () => {
   const headers = printHeaders();
   console.log(headers);

   grid.forEach((column, i) => {
      let strRow = alphabetList[i] + ' ';
      for (const cell of column) {
         strRow += '|' + cell;
      }
      strRow += '|';
      console.log(strRow);
   })
}


const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const randomSpace = () => grid[getRandomInt(gridSize)][getRandomInt(gridSize)];

const placeShips = () => {
   let ship1 = randomSpace();   
   let ship2 = randomSpace();

   if (ship1 === ship2) {
      return placeShips();
   } else {
      shipLocations.push(ship1,ship2);
   }
}

const alreadyHit = (coords) => struckLocations[coords];

const didMiss = (coords) => {
   if(!struckLocations[coords] && !shipLocations.includes(coords)) {
      struckLocations[coords] = 1;
      return true;
   }
   return false;
}

const checkIfGameOver = () => numberOfShips === 0;

const strikeShip = (coords) => {
   struckLocations[coords] = 1;
   numberOfShips--;
   if(checkIfGameOver()) {
      gameOver = true;
   }
}

const performAttack = () => {
   let userInput = readlineSync.question('Enter a location to strike ie \'A2\' ');
   if (alreadyHit(userInput)) {
      readlineSync.keyIn('You have already hit this location. Miss!');
   } else if (didMiss(userInput)) {
      readlineSync.keyIn(' You have missed!')
   } else {
      strikeShip(userInput);
      if(gameOver) {
         return true;
      } else {
         readlineSync.keyIn(' Hit! You sunk a battleship. 1 ship remaining.');
      }
   }
   return performAttack();
}

const playAgain = () => {
   struckLocations = {};
   numberOfShips = 2;
   shipLocations = [];
   grid = buildGrid(gridSize);
   gameOver = false;
}

const beginGame = () => {
   readlineSync.keyIn('Press any key to continue');
   placeShips();
   if (performAttack()) {
      
      if(readlineSync.keyInYN('You have destroyed all battleships. Would you like to play again? Y/N')){
         playAgain();
         beginGame();
      }
      else {
         return;
      }
   }
}

beginGame();