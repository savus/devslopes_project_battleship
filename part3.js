const readlineSync = require('readline-sync'); 

const alphabetList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const gridSize = 10;
let gameOver = false;
let enemysVisible = false;
let gridGUI = true;
const boardSymbols = {
   empty: ' ',
   miss: 'O',
   occupied: 'H',
   hit: 'X'
};

const getRandomInt = (max) => {
   return Math.floor(Math.random() * Math.floor(max));
}

const buildGrid = (size) => {
   const grid = [];
   
   for (let i = 0; i < size; i++) {
      grid[i] = [];
      for (let j = 0; j < size; j++) {
         grid[i][j] = boardSymbols.empty;
      }
   }
   return grid;
}

let grid = buildGrid(gridSize);

const printHeaders = () => {
   let result = '  ';
   grid.forEach((row, index) => {
      result += (index + 1) + ' ';
   });
   return result;
}

const printGrid = () => {
if (gridGUI) {
      let headers = printHeaders(grid);
      console.log(headers);
   
      for (let i = 0; i < gridSize; i++) {
         let strRow = alphabetList[i] + '';
         for (let cell of grid[i]) {
            if (cell === boardSymbols.occupied) {
               if (enemysVisible) {
                  strRow += '|' + cell;
               } else {
                  strRow += '| ';
               }
            } else {
               strRow += '|' + cell;
            }
         }
         strRow += '|';
         console.log(strRow);
      }
   }
}

class Ship {
   constructor(name, length) {
      this.name = name;
      this.length = length;
      this.locations = [];
      this.isHorizontal = Math.random() <= 0.5;
      this.lives = this.length;
   }

   resetLocations() {
      this.locations = [];
   }

   resetLives() {
      this.lives = this.length;
   }
}

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

let numberOfShips = ships.length;

const validatePlacement = (col, row, ship) => {
   for (let i = 0; i < ship.length; i++) {
      let xIndex = (ship.isHorizontal) ? i : 0;
      let yIndex = (!ship.isHorizontal) ? i : 0;
      if(grid[col + yIndex][row + xIndex] !== boardSymbols.empty) {
         return false;
      }
   }
   return true;
}

const placePieces = (col, row, ship) => {
   for (let i = 0; i < ship.length; i++) {
      let xIndex = (ship.isHorizontal) ? i : 0;
      let yIndex = (!ship.isHorizontal) ? i : 0;
      ship.locations.push({x: row + xIndex, y: col + yIndex});
      grid[col + yIndex][row + xIndex] = boardSymbols.occupied; 
   }
}

const placeShip = (ship) => {
   let row = getRandomInt(gridSize);
   let col = getRandomInt(gridSize);
   let direction = (ship.isHorizontal) ? row : col;

   if ( direction + ship.length > gridSize) {
         (ship.isHorizontal) ? row = gridSize - ship.length : col = gridSize - ship.length;
   }

   if (!validatePlacement(col, row, ship)) {
      return placeShip(ship);
   }

   placePieces(col, row, ship);
}

const getCoords = (userInput) => {
   let letter = alphabetList.indexOf(userInput.charAt(0));
   let number = Number(userInput.slice(1)) - 1;
   let gridChar = grid[letter][number];      
   return {y: letter, x: number, symbol: gridChar};
}

const didMiss = (coords) => {
   return coords.symbol === boardSymbols.empty;
}

const alreadyHit = (coords) => {
   return coords.symbol === boardSymbols.miss || coords.symbol === boardSymbols.hit;
}

const isSunk = (ship) => {
   return ship.lives === 0;
}

const damageShip = (coords) => {
   ships.forEach((ship) => {
      for (let location of ship.locations) {
         if (coords.x === location.x && coords.y === location.y) {
            ship.lives--;
            let message = ` It\'s a HIT!`;  
            if (isSunk(ship)) {
               message += ` You sunk a ${ship.name}! `
               numberOfShips--;
               if (numberOfShips > 0) {
                  message += ` ${numberOfShips} of ships remaining!`;
               }
            }
            readlineSync.keyIn(message);
         }
      }
   });
}

const isGameOver = () => {
   return numberOfShips === 0;
}

const performAttack = () => {

   let userInput = readlineSync.question('Enter a location to strike ie \'A2\'');
   let coords = getCoords(userInput);

   if (alreadyHit(coords)) {
      readlineSync.keyIn('You have already picked this location. Miss!'); 
   } else if (didMiss(coords)) {
      readlineSync.keyIn('You have missed!');
      grid[coords.y][coords.x] = boardSymbols.miss;
   } else {
      damageShip(coords);
      grid[coords.y][coords.x] = boardSymbols.hit;
      gameOver = isGameOver();
   } 

   printGrid();
   if (gameOver) {
      readlineSync.keyIn('All ships are destroyed! You win!');
   }

}

const resetValues = () => {
   grid = buildGrid(gridSize);
   gameOver = false;
   numberOfShips = ships.length;
   ships.forEach((ship) => {
      ship.resetLocations();
      ship.resetLives();
   });
}

const beginGame = () => {
   resetValues();
   readlineSync.keyIn('Press any key to continue');
   printGrid();
   ships.forEach((ship) => placeShip(ship));
   while(!gameOver) {
      performAttack();
   }

   if(readlineSync.keyInYN('Would you like to play again?')) {
      beginGame();
   }
   return;
}

beginGame();