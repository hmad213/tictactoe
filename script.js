gameBoard = (function () {
    const board = [["", "", ""], ["", "", ""], ["", "", ""]];

    const getEmptySpaces = function () {
        let coordinates = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] === "") {
                    coordinates.push(`${i}, ${j}`);
                }
            }
        }
        return coordinates;
    }

    return { board, getEmptySpaces };
})();

gameController = (function () {
    player1 = createPlayer("Player1", "X", 0);
    player2 = createPlayer("Player2", "O", 0);

    player1Start = true;
    player1Turn = true;

    let getPlayer1Turn = function () {
        return player1Turn;
    }

    let checkWin = function () {
        for (let i = 0; i < 3; i++) {
            if (gameBoard.board[i][0] === gameBoard.board[i][1] && gameBoard.board[i][1] === gameBoard.board[i][2] && gameBoard.board[i][0] !== "") return true;
            if (gameBoard.board[0][i] === gameBoard.board[1][i] && gameBoard.board[1][i] === gameBoard.board[2][i] && gameBoard.board[0][i] !== "") return true;
        }
        if (gameBoard.board[0][0] === gameBoard.board[1][1] && gameBoard.board[1][1] === gameBoard.board[2][2] && gameBoard.board[0][0] !== "") return true;
        if (gameBoard.board[2][0] === gameBoard.board[1][1] && gameBoard.board[1][1] === gameBoard.board[0][2] && gameBoard.board[1][1] !== "") return true;
        return false;
    }

    let checkGameOver = function (){
        if(checkWin() || gameBoard.getEmptySpaces().length === 0){
            return true;
        }
    }

    let makeMove = function (row, col) {
        if (gameBoard.getEmptySpaces().includes(`${row}, ${col}`)) {
            if (player1Turn) {
                gameBoard.board[row][col] = player1.character;
            } else {
                gameBoard.board[row][col] = player2.character;
            }
            player1Turn = !player1Turn;
            return true;
        }
        return false;
    }

    let resetGame = function () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameBoard.board[i][j] = "";
            }
        }
        player1Start = !player1Start;
        player1Turn = player1Start;
    }

    return { player1, player2, getPlayer1Turn, checkWin, makeMove, resetGame, checkGameOver };
})();

displayController = (function () {
    let rounds;
    let boxes = document.querySelectorAll(".box");
    let resultDiv = document.querySelector(".result");
    let menu = document.querySelector(".menu");
    let game = document.querySelector(".game");

    let startGame = function () {
        let p1name = document.querySelector("#p1name").value;
        let p2name = document.querySelector("#p2name").value;

        gameController.player1.name = p1name !== "" ? p1name : "Player 1";
        gameController.player2.name = p2name !== "" ? p2name : "Player 2";

        menu.style.display = "none";
        game.style.display = "flex";
        rounds = 1;
        updateGame()
    };

    let updateGame = function () {
        document.querySelector(".game .content > h2").textContent = `Round ${rounds}`

        let turnPara = document.querySelector(".game .content > p");
        let p1ScoreDiv = document.querySelector(".scores > .p1Score");
        let p2ScoreDiv = document.querySelector(".scores > .p2Score");

        if (gameController.getPlayer1Turn()) {
            turnPara.textContent = `${gameController.player1.name}'s turn`;
        } else {
            turnPara.textContent = `${gameController.player2.name}'s turn`;
        }

        for (let i = 0; i < boxes.length; i++) {
            boxes[i].textContent = gameBoard.board[i % 3][Math.floor(i / 3)];
            if (boxes[i].textContent === "X") {
                boxes[i].style.color = "#0F4392";
            } else {
                boxes[i].style.color = "#FF4949";
            }
        }

        p1ScoreDiv.querySelector("p").textContent = gameController.player1.score;
        p2ScoreDiv.querySelector("p").textContent = gameController.player2.score;
        p1ScoreDiv.querySelector("h4").textContent = gameController.player1.name;
        p2ScoreDiv.querySelector("h4").textContent = gameController.player2.name;
    }

    let endGameDisplay = function (){
        resultDiv.style.display = "block";
        if(gameController.checkWin()){
            if(!gameController.getPlayer1Turn()){
                resultDiv.textContent = `${gameController.player1.name} wins`;
                gameController.player1.score++;
            }else{
                resultDiv.textContent = `${gameController.player2.name} wins`;
                gameController.player2.score++;
            }
        }else{
            resultDiv.textContent = `Draw`;
        }

        gameController.resetGame();
        rounds++;
    }

    let restartGame = function() {
        gameController.resetGame();
        rounds = 1;
        gameController.player1.name = "Player 1";
        gameController.player2.name = "Player 2";
        gameController.player1.score = 0;
        gameController.player2.score = 0;
        menu.style.display = "flex";
        game.style.display = "none";
    }

    resultDiv.addEventListener("click", () => {
        resultDiv.style.display = "none";
        updateGame();
    })

    document.querySelector(".menu > .content > button").addEventListener("click", startGame);
    document.querySelector(".reset").addEventListener("click", () => {
        gameController.resetGame();
        updateGame();
    });

    document.querySelector(".restart").addEventListener("click", restartGame);

    boxes.forEach((box) => box.addEventListener("click", (event) => {
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i] === box) {
                if (gameController.makeMove(i % 3, Math.floor(i / 3))) {
                    updateGame();
                    if(gameController.checkGameOver()){
                        endGameDisplay();
                    }
                }
            }
        }
    }))
})();

function createPlayer(name, character, score) {
    return { name, character, score };
}