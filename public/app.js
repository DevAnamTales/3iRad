import { getAllUsers, updateUser } from "../server-request.js";

const player1Dropdown = document.getElementById("player1");
const player2Dropdown = document.getElementById("player2");
const startGameBtn = document.getElementById("startGameBtn");
const gameBoard = document.getElementById("game-board");
const playerDisplay = document.getElementById("player-display");
const board = document.querySelector(".board");

let player1, player2, currentPlayer;

async function populateDropdown(dropdown) {
  const allUsers = await getAllUsers();
  allUsers.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.text = user.name;
    dropdown.add(option);
  });
}


// Populate the dropdowns
populateDropdown(player1Dropdown);
populateDropdown(player2Dropdown);


function checkForWinner(board) {
  const cells = board.children;
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      cells[a].innerText &&
      cells[a].innerText === cells[b].innerText &&
      cells[b].innerText === cells[c].innerText
    ) {
      // Call updateGameStatus when there is a winner
      updateGameStatus(player1, player2, 1, "won");
      console.log("function is called")
      return true; // We have a winner
    }
  }

  return false; // No winner yet
}

function isBoardFull(board) {
  const cells = board.children;
  for (const cell of cells) {
    if (!cell.innerText) {
      return false; // At least one cell is empty
    }
  }

  // If the loop completes without returning, the board is full
  updateGameStatus(player1, player2, 1, "tie");
  return true; // Board is full
}

function isGameOver(board) {
  // For example, check if there's a winner or if the board is full
  return checkForWinner(board) || isBoardFull(board);
}

startGameBtn.addEventListener("click", startGame);

function startGame() {
  player1 = player1Dropdown.value;
  player2 = player2Dropdown.value;

  // Log player values to check if they are retrieved correctly
  console.log("Player 1:", player1);
  console.log("Player 2:", player2);

  // Display the game board
  console.log("Displaying game board...");
  gameBoard.style.display = "grid";
  initializeGame();
}

function initializeGame() {
  currentPlayer = player1;
  playerDisplay.innerText = `Current Player: ${currentPlayer}`;

  // Clear the board
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.addEventListener("click", () => handleCellClick(i));
    board.appendChild(cell);
  }
}

function handleCellClick(index) {
  // Add a log statement to check if the function is called
  console.log("handleCellClick is called");

  const cell = board.children[index];

  // Check if the cell is already occupied or if the game is over
  if (cell.innerText || isGameOver(board)) {
    return;
  }

  // Update the cell with the current player's symbol
  cell.innerText = currentPlayer === player1 ? "X" : "O";

  // Check for a winner
  if (checkForWinner(board)) {
    alert(`Player ${currentPlayer} wins!`);

    // Add a log statement before calling updateGameStatus
    console.log("Calling updateGameStatus");


    // Call updateGameStatus when there is a winner
    updateGameStatus(player1, player2, 1, "won"); 
    initializeGame(); // Restart the game
    return;
  }

  // Check for a tie
  if (isBoardFull(board)) {
    alert("It's a tie!");

    // Add a log statement before calling updateGameStatus
    console.log("Calling updateGameStatus");

    // Call updateGameStatus when it's a tie
    updateGameStatus(player1, player2, 1, "tie"); 
    initializeGame(); // Restart the game
    return;
  }

  // Switch to the next player
  currentPlayer = currentPlayer === player1 ? player2 : player1;
  playerDisplay.innerText = `Current Player: ${currentPlayer}`;
}

async function updateGameStatus(userId, opponentId, rounds, result) {
  try {
    console.log("Calling updateGameStatus");
    const allUsers = await getAllUsers();
    console.log("All users:", allUsers);

    // Log user IDs in array for reference
    const userIDsInArray = allUsers.map((user) => user.id);
    console.log("User IDs in array:", userIDsInArray);

    const userToUpdate = allUsers.find((user) => user.id == userId);
    console.log("User to Update (ID:", userId, "):", userToUpdate);

    if (userToUpdate) {
      console.log("Game status before update:", userToUpdate.gamestatus);

      const opponentIndex = userToUpdate.gamestatus.findIndex(
        (game) => game.opponent === opponentId
      );

      if (opponentIndex !== -1) {
        userToUpdate.gamestatus[opponentIndex].rounds += rounds;
        userToUpdate.gamestatus[opponentIndex].result = result;
      } else {
        userToUpdate.gamestatus.push({
          opponent: opponentId,
          rounds: rounds,
          result: result,
        });
      }

      // Log user information before the update
      console.log("Before Update:", userToUpdate);

      // Update the user in the JSON file
      const updatedUser = await updateUser(userId, userToUpdate);
      console.log("After Update:", updatedUser);

      console.log("Game status after update:", updatedUser.gamestatus);
    } else {
      console.log("User not found with ID:", userId);
    }
  } catch (error) {
    console.error("Error updating game status:", error);
  }
}

