const cells = document.querySelectorAll(".cell");

const GameBoard = (() => {
    const board = [new Array(3).fill(null),
                   new Array(3).fill(null),
                   new Array(3).fill(null),];

    const indexArr = {"c1": {x: 0 , y:0},
                      "c2": {x: 0 , y:1},
                      "c3": {x: 0 , y:2},
                      "c4": {x: 1 , y:0},
                      "c5": {x: 1 , y:1},
                      "c6": {x: 1 , y:2},
                      "c7": {x: 2 , y:0},
                      "c8": {x: 2 , y:1},
                      "c9": {x: 2 , y:2},
    }
    const start = () => {   
        console.log("It's a start function");
    }

    const isFull = () => {
        for (const index in indexArr) {
            if (Object.hasOwnProperty.call(indexArr, index)) {
                if(!board[indexArr[index].x][indexArr[index].y]) return false;
            }
        }
        return true;
    }
    const reset = () => {
        game = true;
        cells.forEach(cell => {
            cell.innerHTML = "";
        });
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = null;
            }
        }
    }

    const result = (box) => {
        const currX = indexArr[box].x;
        const currY = indexArr[box].y;
        const currMark = board[currX][currY];
        let result = true;
        function diagonalWin() {
            if(diag() || counterDiag()){
                return true;
            }
            return result;

            function counterDiag() {
                result = true;
                for (let i = 0; i < 3; i++) {
                    if (currMark !== board[i][2 - i]) {
                        result = false;
                        break;
                    }
                }
                return result;
            }

            function diag() {
                result = true;
                for (let i = 0; i < 3; i++) {
                    if (currMark !== board[i][i]) {
                        result = false;
                        break;
                    }
                }
                return result;
            }
        }

        function verticalWin() {
            result = true;
            for (let i = 0; i < 3; i++) {
                if (currMark !== board[currX][i]) {
                    result = false;
                    break;
                }
            }
            return result;
        }

        function horizontalWin() {
            result = true;
            for (let i = 0; i < 3; i++) {
                if (currMark !== board[i][currY]) {
                    result = false;
                    break;
                }
            }
            return result;
        }

        if(diagonalWin() || verticalWin() || horizontalWin())
            return true;
        return result;
    }

    const markMove = (box, label) => {
        board[indexArr[box].x][indexArr[box].y] = label;
    }
    return {
        start,
        markMove,
        reset,
        result,
        isFull,
        board,
    }
})();

const DOMWriter = ((doc) =>{
    const query = (target, content) => {
        doc.querySelector(target).innerHTML = content;
    }
    const xWriter = (target) =>{
        doc.querySelector(target).innerHTML = "X";
    }
    const oWriter = (target) => {
        doc.querySelector(target).innerHTML = "O";
    }
    return {
        query,
        xWriter,
        oWriter,
    }
})(document);


let game = true;
let flag = 0;
cells.forEach((cell) => {
    cell.addEventListener("click", ()=>{
        if(game){
            if (cell.innerHTML === "") {
                const id = cell.getAttribute("id");
                if(flag%2 == 0){
                    DOMWriter.xWriter(`#${id}`);
                    GameBoard.markMove(id, "x");
                    if(GameBoard.result(id)){
                        Modal.open("X won", true);
                        game = false;
                    }
                    else if(GameBoard.isFull()){
                        Modal.open("It's a draw!", false);
                        game = false;
                    }
                    flag++;
                }else{
                    DOMWriter.oWriter(`#${id}`);
                    GameBoard.markMove(id, "o");
                    if(GameBoard.result(id)){
                        game = false;
                        Modal.open("O won", true);
                    }
                    else if(GameBoard.isFull()){
                        Modal.open("It's a draw!", false);
                        game = false;
                    }
                    flag++;
                }
            }
        }
    })
});

const reset = document.querySelector("#reset");
reset.addEventListener("click", ()=>{
    GameBoard.reset();
})

const WinnerMoment = ((doc) =>{
    const winner = (player) =>{
        
    }
})(document)

const Modal = (() => {
    const modal = document.querySelector(".modal");
    const content = document.querySelector(".modal-body");
    const open = (msg, confetti) =>{
        content.innerHTML = `<h1>${msg}</h1>`
        modal.style.display = "block";
        if(confetti) confettiElement.style.display = "block";
    }
    const close = () =>{
        confettiElement.style.display = "none";
        modal.style.display = "none";
    }
    return {
        open,
        close,
    }
})()

const closeBut = document.querySelector("#close-new");
closeBut.addEventListener("click", ()=>{
    Modal.close();
    GameBoard.reset();
})

const close = document.querySelector("#close");
close.addEventListener("click", ()=>{
    Modal.close();
})

var confettiElement = document.getElementById('my-canvas');
var confettiSettings = { target: confettiElement };
var confetti = new ConfettiGenerator(confettiSettings);
confetti.render();