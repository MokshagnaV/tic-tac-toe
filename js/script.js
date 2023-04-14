const cells = document.querySelectorAll(".cell");
const indexes = ["c1","c2","c3","c4","c5","c6","c7","c8","c9"]

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

    const isFree = (box) => {
        return board[indexArr[box].x][indexArr[box].y];
    }
    return {
        start,
        markMove,
        reset,
        result,
        isFull,
        isFree,
        board
    }
})();

const DOMWriter = ((doc) =>{
    const xWriter = (target) =>{
        doc.querySelector(target).innerHTML = "X";
    }
    const oWriter = (target) => {
        doc.querySelector(target).innerHTML = "O";
    }
    return {
        xWriter,
        oWriter,
    }
})(document);


let game = true;
let singleGame = true;

const MultiGameController = (() => {
    const players = [
        {
            name: "playerOne",
            label: "X"
        },
        {
            name: "playerTwo",
            label: "O"
        }
    ]

    let activePlayer = players[0];

    const setPlayerOne = (pOne) =>{
        players[0].name = pOne;
    }

    const setPlayerTwo = (pTwo) =>{
        players[1].name = pTwo;
    }

    const playerChange = () => {
       activePlayer = activePlayer === players[0]? players[1]: players[0];
    }
    
    const getPlayer = () => activePlayer;

    return {
        setPlayerOne,
        setPlayerTwo,
        playerChange,
        getPlayer,
    }
})();

const SingleGameController = (()=>{
    const players = [
        {
            name: "Human",
            label: "X",
        },
        {
            name: "AI",
            label: "O",
        }
    ]

    const setPlayerName = (pname)=>{
        players[0].name = pname;
    }
    const setPlayerLabel = (plabel) => {
        if(players[0].label !== plabel){
            players[1].label = players[0].label;
            players[0].label = plabel;
        }
    }
    let activePlayer = players[0];
    const playerChange = () => {
        activePlayer = activePlayer === players[0]? players[1]: players[0];
    }
    const getPlayer = () => activePlayer;
 
    const getAIResponse = () =>{
        let resp = indexes[parseInt(Math.random()*8)];
        while(GameBoard.isFree(resp)){
            resp = indexes[parseInt(Math.random()*8)];
        }
        return resp;
    }
    return{
        setPlayerLabel,
        setPlayerName,
        playerChange,
        getPlayer,
        getAIResponse,
    }
})()

cells.forEach((cell) => {
    cell.addEventListener("click", ()=>{
        if(game && !singleGame){
            if (cell.innerHTML === "") {
                const id = cell.getAttribute("id");
                if(MultiGameController.getPlayer().label == "X"){
                    DOMWriter.xWriter(`#${id}`);
                    GameBoard.markMove(id, "x");
                    if(GameBoard.result(id)){
                        Modal.open(`${MultiGameController.getPlayer().name} [${MultiGameController.getPlayer().label}] Won`, true);
                        game = false;
                    }
                    else if(GameBoard.isFull()){
                        Modal.open("It's a draw!", false);
                        game = false;
                    }
                    MultiGameController.playerChange();
                }else{
                    DOMWriter.oWriter(`#${id}`);
                    GameBoard.markMove(id, "o");
                    if(GameBoard.result(id)){
                        game = false;
                        Modal.open(`${MultiGameController.getPlayer().name} [${MultiGameController.getPlayer().label}] Won`, true);
                    }
                    else if(GameBoard.isFull()){
                        Modal.open("It's a draw!", false);
                        game = false;
                    }
                    MultiGameController.playerChange();
                }
            }
        }else if(game){
            if (cell.innerHTML === "") {
                const id = cell.getAttribute("id");
                const label = SingleGameController.getPlayer().label;
                if(label == 'X'){
                    DOMWriter.xWriter(`#${id}`);
                }else{
                    DOMWriter.oWriter(`#${id}`);
                }
                GameBoard.markMove(id, label);
                if(GameBoard.result(id)){
                    Modal.open(`${SingleGameController.getPlayer().name} [${label}] Won`, true);
                    game = false;
                    return;
                }
                else if(GameBoard.isFull()){
                    Modal.open("It's a draw!", false);
                    game = false;
                    return;
                }
                SingleGameController.playerChange();
                const AIresp = SingleGameController.getAIResponse();
                const AIlabel = SingleGameController.getPlayer().label;
                if(AIlabel == 'X'){
                    DOMWriter.xWriter(`#${AIresp}`);
                }else{
                    DOMWriter.oWriter(`#${AIresp}`);
                }
                // console.log(`AI Done Writing on ${AIresp} ${AIlabel}`)
                GameBoard.markMove(AIresp, SingleGameController.getPlayer().label);
                if(GameBoard.result(AIresp)){
                    Modal.open(`${SingleGameController.getPlayer().name} [${AIlabel}] Won`, true);
                    game = false;
                }
                else if(GameBoard.isFull()){
                    Modal.open("It's a draw!", false);
                    game = false;
                }
                SingleGameController.playerChange();
            }
        }
    })
});

const reset = document.querySelector("#reset");
reset.addEventListener("click", ()=>{
    GameBoard.reset();
})

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

const boxes = document.querySelectorAll(".player-select");

const sel_buts = document.querySelectorAll(".sel-but");
sel_buts.forEach((but)=> {
    but.addEventListener("click", () => {
        if(!but.classList.contains("active")){
            singleGame = singleGame ? false: true
            sel_buts.forEach((but) => {
                but.classList.remove("active");
            })
            but.classList.add("active");
            boxes.forEach(box =>{
                if(box.getAttribute("id") === but.getAttribute("id")){
                    box.style.display = "block";
                }else{
                    box.style.display = "none";
                }
            })
        }
    })
})

const p1 = document.querySelector("#p1");
p1.addEventListener("input", ()=>{
    MultiGameController.setPlayerOne(p1.value);
})
const p2 = document.querySelector("#p2");
p2.addEventListener("input", ()=>{
    MultiGameController.setPlayerTwo(p2.value);
})

const sp1 = document.querySelector("#sp1");
sp1.addEventListener("input", ()=>{
    SingleGameController.setPlayerName(sp1.value);
})
const slabel = document.querySelector("#slabel");
slabel.addEventListener("input", ()=>{  
    SingleGameController.setPlayerLabel(slabel.value);
})