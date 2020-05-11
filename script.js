var Original_Board; // initializes the original board that keeps track of each square in the board.
const Player = 'X'; // the human player is set to X.
const AI = 'O'; // the ai player is set to O. 

// Array that shows the winning combinations of the tic tac toe board. 
const winCombos = [
    [0, 1, 2], // if the top row is covered, then it is a win.
    [3, 4, 5], // if the middle row is covered, then it is a win.
    [6, 7, 8], // if the bottom row is covered, then it is a win.  
    [0, 3, 6], // if left column is covered, then it is a win. 
    [1, 4, 7], // if middle column is covered, then it is a win. 
    [2, 5, 8], // if right column is covered, then it is a win. 
    [0, 4, 8], // if diagonally from top left to bottom right is covered, then it is a win. 
    [6, 4, 2] // if diagonally from top right to bottom left is covered, then it is a win. 
]

/*
The cells variable will store a cell reference from the html file, 
and the querySelectorAll will select all the references.  
*/
const cells = document.querySelectorAll('.cell');

// Function that starts the game. 
startGame();

// Defines the startGame function when the game starts. 
// (Note: it will rerun when you hit the "Play again!" button.)
function startGame() {

    // We select the endgame element, and set the display property to "none" as shown in the css file. 
    document.querySelector(".endgame").style.display = "none"

    // Sets every array going from 0 to 9. 
    Original_Board = Array.from(Array(9).keys());

    // For loop that goes through each cell of the board. 
    for (var i = 0; i < cells.length; i++){
        cells[i].innerText = ''; // Represents each item in the cells as the for loop goes through them, and make nothing appear in the cell. 

        // When someone wins, the cells that are part of the winning combination will be high lighted.
        // When the game restarts, then we will have no background color. 
        cells[i].style.removeProperty('background-color');  

        /*
        When user clicks on the cells, that is when this line of code will call for the 'click' function. 
        */
        cells[i].addEventListener('click', turnClick, false);
    }
}

// Defines the turnClick function that passes in a square.
function turnClick(square) {

    // Can't click on a cell that has already been clicked. 
    // if the id number is equal to the 'number', then neither human or ai have played in that cell. 
    if (typeof Original_Board[square.target.id] == 'number') {
        turn(square.target.id, Player) // Human player doing the clicking. 

    // If it's not a tie, then player will take a turn. 
    if (!checkTie()) turn(bestSpot(), AI)
    }       
}

// Defines the turn function that takes in two parameteres: squareId and the player. 
function turn(squareId, player) {
    
    // Sets the board array at the id that we clicked to player. 
    Original_Board[squareId] = player; 

    // Update the display so we will see where we clicked and set the innerText to equal player.  
    document.getElementById(squareId).innerText = player;

    // When a turn is taken, we are going to check if the game has been won. 
    let gameWon = checkWin(Original_Board, player)

    // If the game is won then the game over will display that the game has won. 
    if (gameWon) gameOver(gameWon)
}

// Declared the Check win function that will receive the board and the player. 
function checkWin(board, player){

    /*
    We will use the reduce method that will go through every element of the board
    array and give back one single value.
    
    The accumulator 'a' is what will give back the value at the end, and initialize 
    it to an empty array -> []. 

    The 'e' is the element of the board array that we are going through. 
    
    The 'i' is the index. 

    Therefore, if the element (aka 'e') is the same as the player, then we are going 
    to concat 'i' meaning we are going to take the accumulator array (aka the [] at 
    the end) and add the index 'i' to the array. 

    Otherwise, if the element (aka 'e') does not equal the player, then we are going to 
    return the accumulator (aka 'a') as it was meaning we are not add anything to the 
    accumulator.   
    */
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);

    // Set the game won to null, if no one wins. 
    let gameWon = null; 

    // for of loop that checks if the game has been won. 
    for (let [index, win] of winCombos.entries()) {

        /*
        win.every means that we will go through every win (meaning 
        the straight lines in the game) we are going to check if 
        plays.indexOf element is greater than negative one meaning
        that if the player has played in every spot of the board that
        counts as a win.
        
        If that is the case, then the player has won. 
        */
        if (win.every(elem => plays.indexOf(elem) > -1)) {

            // We know which combo the player won at, and which player has won. 
            gameWon = {index: index, player: player};

            break; // We break from the function afterwards. 
        }

    }

    return gameWon; // We return game won. 
}

// Defines the "Game Over" function that accepts gameWon.
function gameOver(gameWon) {

    // A for of loop that high lights all the squares for the winner. 
    for (let index of winCombos[gameWon.index]) {

        // Background color that determines on who one the game. 
        document.getElementById(index).style.backgroundColor = 

            /*
            If the human player wins, then the background color will 
            be red, otherwise it will be blue. 
            */
            gameWon.player == Player ? "red" : "blue"
    }

    /* 
    A for loop that goes through every cell to make sure the user can
    not click on that cell anymore.  
    */
   for (var i = 0; i < cells.length; i++){
       cells[i].removeEventListener('click', turnClick, false) // removes the click event listener to make sure the user can't click on any cells. 
   }

   // ternary operator that inside the declareWinner function that says the human player wins or loses.
   declareWinner(gameWon.player == Player ? "Awesome! You won! :)" : "You lose! Better luck next time!");   
}

// function that declares the winner. 
function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who; // comes from the <div class="text"></div> from the html file. 
}

// function that defines the empty squares. 
function emptySquares(){
    return Original_Board.filter(s => typeof s == 'number'); // filter every element of the original board to see if the type of element equals a number.
}

// fuction that finds the best spot for the ai player to play. 
function bestSpot() {
    return minimax(Original_Board, AI).index; // Calls the minimax function that calls the original board and ai player. 
}

// function that checks if there is a draw. 
function checkTie() {

    // length equals 0 means that every cell is filled up with no victor. 
    if (emptySquares().length == 0) {

        // for loop that highlights every cell green when there is a tie. 
        for (var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "green"; // highlights the cells green. 
            cells[i].removeEventListener('click', turnClick, false); // user can't click anywhere after the game is tied. 
        }
        declareWinner("DRAW!") // Outputs this message when the game is tied. 
        return true; // Returns true so that way the message can be displayed. 
    }
    return false; // if the game is not tied, then we will return false. 
}

// defines the minimax function with the new board and player arguments. 
function minimax(newBoard, player){

    // find the available spots using the empty squares function. 
    var availSpots = emptySquares(newBoard);

    // We will check for terminal states to see if the human player wins. 
    if (checkWin(newBoard, player)){

        // return -10 if 'X' wins. 
        return {
            score: -10
        };
    }

    // We will check for terminal states to see if the ai player wins. 
    else if (checkWin(newBoard, AI)) {

        // return 10 if 'O' wins. 
        return {
            score: 10 
        };
    }

    // if there is no more room to play, then it is a draw. 
    else if (availSpots.length === 0) {

        // return 0 if there is a tie. 
        return {
            score: 0
        };
    }

    // The declared array "moves" collects the scores for the empty spots to evaluate later. 
    var moves = []; 
    
    // This for loop loops through empty spots while collecting each moves index and score in an object called move. 
    for (var i = 0; i < availSpots.length; i++) {

        /*
        Sets the index number of the empty spot that was stored as a number in the original board to the index
        property of the move object. 
        */
        var move = {}
        move.index = newBoard[availSpots[i]]; 

        // sets the empty spot on the new board to the current player. 
        newBoard[availSpots[i]] = player; 

        /*
         if the human and ai player are the same, then store the object
         of the minimax function call that includes a score property to the
         score property of the move object. 
        */
        if (player == AI) {
            var result = minimax(newBoard, Player);
            move.score = result.score;
        }
        else {
            var result = minimax(newBoard, AI);
            move.score = result.score;
        }

        // The minimax resets the new board to what it was before
        newBoard[availSpots[i]] = move.index;

        // Pushes the moves object to the moves array
        moves.push(move);
    }

    // The minimax algorithm needs to evaluate the best move and the move array. 
    var bestMove; 

    // if player is ai player
    if (player === AI) {
        var bestScore = -10000; // sets the best score variable to -10000.

        // for loop that sets the variable to a low number and loops through the array. 
        for (var i = 0; i < moves.length; i++){

            // if move has higher score than best score, then the algorithm stores that move. 
            if (moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    else {
        var bestScore = 10000; // sets the best score variable to 10000.

        // for loop that sets the variable to a low number and loops through the array. 
        for (var i = 0; i < moves.length; i++){

            // if move is less than best score, then the algorithm stores that move. 
            if (moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // minimax returns the object stored in best move. 
    return moves[bestMove];
}

