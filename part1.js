const readlineSync = require('readline-sync');

 const boardLocations = [
   "A1", "A2", "A3",
   "B1", "B2", "B3",
   "C1", "C2", "C3"
 ];

 const alreadyHitLocations = {};
 
 let ship1 = '';
 let ship2 = '';
 let numberOfShips = 0;


 const randomizeLocations = () => {
   ship1 = boardLocations[Math.floor(Math.random() * boardLocations.length)];
   ship2 = boardLocations[Math.floor(Math.random() * boardLocations.length)];
   if (ship1 === ship2) {
      return randomizeLocations();
   }
   else {
      return true;
   }
 }

 const promptToStrike = () => {
   let userInput = readlineSync.question('Enter a location to strike ie \'A2\' ');
   
   if (alreadyHitLocations[userInput] > 0) {
      console.log('You have already picked this location. Miss!');
   } else if (userInput === ship1 || userInput === ship2) {

      numberOfShips--;
      alreadyHitLocations[userInput] = 1;
      if (numberOfShips > 0) {
         console.log('Hit! You have sunk a battleship. 1 ship remaining'); 
      }

   } else {
      alreadyHitLocations[userInput] = 1;
      console.log('You have missed!');
   }

   if (numberOfShips > 0) {
      return promptToStrike();
   } else {
      return true;
   }
 }

const startGame = () => {
   readlineSync.keyIn('Press any key to start game ');

   numberOfShips = 2;

   if (randomizeLocations()) {
      for (const key in boardLocations) {
         alreadyHitLocations[boardLocations[key]] = 0;
      }

      if(promptToStrike()) {
         if(readlineSync.keyInYN('You have destroyed all battleships, would you like to play again?')) {
            return startGame();
         }
      }
      return;
   }
}

startGame();