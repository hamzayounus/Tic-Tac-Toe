let board = [];
let gameOver = true;
let userTurn = true;

function highlightWin(cells) {
  cells.forEach((cell) => $(`.c${cell} p`).addClass("win"));
  let index = cells[0].split("").map(Number);
  if (board[index[0]][index[1]] == "O") {
    $("h2").text("I Won!");
  } else if (board[index[0]][index[1]] == "X") {
    $("h2").text("You Won!");
  }
  $("h2").addClass("win");
  return;
}

function checkForWin(board) {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2] &&
      board[i][0] !== "-"
    ) {
      return [`${i}0`, `${i}1`, `${i}2`];
    }

    if (
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i] &&
      board[0][i] !== "-"
    ) {
      return [`0${i}`, `1${i}`, `2${i}`];
    }
  }

  if (
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[0][0] !== "-"
  ) {
    return ["00", "11", "22"];
  }
  if (
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0] &&
    board[0][2] !== "-"
  ) {
    return ["02", "11", "20"];
  }
}

function bestChoice() {
  let tempBoard;
  let firstEmpty = [];
  let tempWinO;
  let tempWinX;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "-") {
        if (firstEmpty.length === 0) {
          firstEmpty = [i, j];
        }
        tempBoard = JSON.parse(JSON.stringify(board));
        tempBoard[i][j] = "O";
        tempWinO = checkForWin(tempBoard);
        if (tempWinO) {
          return [i, j];
        }
      }
    }
  }
  if(!tempWinO){
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "-") {
          if (firstEmpty.length === 0) {
            firstEmpty = [i, j];
          }
          tempBoard = JSON.parse(JSON.stringify(board));
          tempBoard[i][j] = "X";
          tempWinX = checkForWin(tempBoard);
          if (tempWinX) {
            return [i, j];
          }
        }
      }
    }
  }

  if (board[1][1] === "-") {
    return [1, 1];
  }

  return firstEmpty;
}

function userSequence() {
  if (!gameOver && userTurn) {
    $("h2").text("Your Turn");
  }
}

function ghostSquence() {
  $("h2").text("My Turn");
  if (gameOver || userTurn) {
    return;
  } else {
    let best = bestChoice();
    if (best) {
      let row = best[0];
      let col = best[1];
      setTimeout(() => {
        updateBoard(row, col, "O");
        if (!gameOver) {
          userTurn = true;
          userSequence();
        }
      }, 1000);
    }
  }
}

function updateBoxes() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "X") {
        $(`.c${i}${j}`).html("<p>X</p>");
      } else if (board[i][j] === "O") {
        $(`.c${i}${j}`).html("<p>O</p>");
      } else if (board[i][j] === "-") {
        $(`.c${i}${j}`).html("<p></p>");
      }
    }
  }
}

function updateBoard(row, col, sign) {
  if (board[row][col] == "-" && !gameOver) {
    board[row][col] = sign;
    updateBoxes();
    let winner = checkForWin(board);
    if (winner) {
      highlightWin(winner);
      gameOver = true;
      setTimeout(() => {
        init();
      }, 3000);
    } else if (board.flat().every((cell) => cell !== "-")) {
      $("h2").text("It's a Draw!");
      $("h2").addClass("win");
      gameOver = true;
      setTimeout(() => {
        init();
      }, 3000);
    }
  }
}

function start() {
  gameOver = false;
  userTurn = true;
  board = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];
  updateBoxes();
  let boxes = document.querySelectorAll(".box");
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", function (event) {
      let boxClass = event.target.classList[1];
      let row = boxClass.charAt(1);
      let col = boxClass.charAt(2);
      if (board[row][col] == "-" && userTurn && !gameOver) {
        updateBoard(row, col, "X");
        userTurn = false;
        if (!gameOver) {
          ghostSquence();
        }
      }
    });
  }
  userSequence();
}

function init() {
  $("h2").removeClass("win");
  $("h2").text("Press A Key To Start");
  gameOver = false;
  document.addEventListener("keypress", function () {
    start();
  });
}

init();
