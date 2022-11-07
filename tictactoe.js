var player; //Bot is player 1 "O"
var isTimed = $('#timeActivated').is(":checked");
var ingame;
var time = 0;
var board = [["","",""],["","",""],["","",""]];
var stand = [0,0];
var canPlace = true;
var againstBot = $('#againstBot').is(":checked");
var difficulty = $('#difficultySlider').val();

function setPlayer(p) {
    player = p;
    if (player == 0) p = "X";
    else p = "O";
    $('#currentPlayer').text("Aktueller Spieler: " + p);
}

function setTimer() {
    var timeText = Math.round(time*100)/100;
    if(isTimed) $('#timePerRound').text("Zeit: " + timeText + "s");
}

function checkWinnerWithColor(){
    var winner = false;
    var p = "";
    if (player == 0) p = "X";
    else p = "O";
    for (let i = 0; i < 3; i++) {
        if(board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != "") {
            winner = true;
            $('#ttt' + (i*3+0)).attr("data-color", p + "W");
            $('#ttt' + (i*3+1)).attr("data-color", p + "W");
            $('#ttt' + (i*3+2)).attr("data-color", p + "W");
        }
        if(board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != "") {
            winner = true;
            $('#ttt' + (0*3+i)).attr("data-color", p + "W");
            $('#ttt' + (1*3+i)).attr("data-color", p + "W");
            $('#ttt' + (2*3+i)).attr("data-color", p + "W");
        }
    }
    if(board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != "") {
        winner = true;
        $('#ttt' + (0*3+0)).attr("data-color", p + "W");
        $('#ttt' + (1*3+1)).attr("data-color", p + "W");
        $('#ttt' + (2*3+2)).attr("data-color", p + "W");
    }
    if(board[2][0] == board[1][1] && board[1][1] == board[0][2] && board[2][0] != ""){
        winner = true;
        $('#ttt' + (2*3+0)).attr("data-color", p + "W");
        $('#ttt' + (1*3+1)).attr("data-color", p + "W");
        $('#ttt' + (0*3+2)).attr("data-color", p + "W");
    }
    return winner;
}

function refreshBoard(){
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            $('#ttt' + (i*3+j)).text(board[i][j]);
            $('#ttt' + (i*3+j)).attr("data-color", board[i][j]);
        }
    }
}

function timer(){
    if(ingame && (!canPlace || !isTimed)) return;
    setTimer();

    if(time <= 0){
        canPlace = false;
        player = player == 1 ? 0 : 1;
        setTimeout(winner,1500);
        return;
    }

    time -= 0.01
    setTimeout(timer, 10);
}

function resetGame(){
    ingame = false;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = "";
        }
    }
    player = Math.floor(Math.random() * 2);
    time = $('#timeSlider').val();
    setTimer();
    setPlayer(player);
    refreshBoard();
    if(againstBot && player==1) botMove();
}

function winner(){
    stand[player] += 1;
    updateStand();
    resetGame();
    canPlace = true;
}

function isFull(){
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[i][j] == "") return false;
        }
    }
    return true;
}

function updateStand(){
    $('#ergebnis').text("(X) " + stand[0] + " - " + stand[1] + " (O)");
}

function play(elem){
    var row = parseInt(elem.attr('data-row'))-1;
    var col = parseInt(elem.attr('data-col'))-1;

    if(board[row][col] != "") return; 
    
    if(player == 0) board[row][col] = "X";
    else board[row][col] = "O";

    refreshBoard();
    if(checkWinnerWithColor()) {
        canPlace = false;
        setTimeout(winner,1500);
        return;
    }
    if(isFull()){
        setTimeout(resetGame,1500);
        return;
    }
    time = $('#timeSlider').val();

    if(player==0) player = 1;
    else player = 0;
    setPlayer(player);

    if(againstBot && player==1) botMove();
}

function veryEasyMove(){
    do{
        var num = Math.floor(Math.random()*9);
        var row = Math.floor(num / 3);
        var col = num % 3;
    } while(board[row][col] != "");

    var elem = $('#ttt' + (row*3+col));
    play(elem);
}



class Move
{
    constructor()
    {
        let row,col;
    }
}

function evaluate(board)
{
    for(let row = 0; row < 3; row++)
    {
        if (board[row][0] == board[row][1] &&
            board[row][1] == board[row][2])
        {
            if (board[row][0] == "O")
                return +10;

            else if (board[row][0] == "X")
                return -10;
        }
    }

    for(let col = 0; col < 3; col++)
    {
        if (board[0][col] == board[1][col] &&
            board[1][col] == board[2][col])
        {
            if (board[0][col] == "O")
                return +10;

            else if (board[0][col] == "X")
                return -10;
        }
    }

    if (board[0][0] == board[1][1] && board[1][1] == board[2][2])
    {
        if (board[0][0] == "O")
            return +10;

        else if (board[0][0] == "X")
            return -10;
    }

    if (board[0][2] == board[1][1] &&
        board[1][1] == board[2][0])
    {
        if (board[0][2] == "O")
            return +10;

        else if (board[0][2] == "X")
            return -10;
    }

    return 0;
}



function minimax(board, depth, isMax, maxDepth)
{
    let score = evaluate(board);

    if (score == 10)
        return score;

    if (score == -10)
        return score;

    if (isFull(board) == true || depth == maxDepth)
        return 0;

    if (isMax)
    {
        let best = -1000;

        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {

                if (board[i][j]=="")
                {

                    board[i][j] = "O";

                    best = Math.max(best, minimax(board, depth + 1, !isMax, maxDepth));

                    board[i][j] = "";
                }
            }
        }
        return best;
    }

    else
    {
        let best = 1000;

        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                if (board[i][j] == "")
                {
                    board[i][j] = "X";

                    best = Math.min(best, minimax(board, depth + 1, !isMax, maxDepth));

                    board[i][j] = "";
                }
            }
        }
        return best;
    }
}


function findBestMove(board, maxDepth)
{
    let bestVal = -1000;
    let bestMove = new Move();
    bestMove.row = -1;
    bestMove.col = -1;

    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 3; j++)
        {
            if (board[i][j] == "")
            {
                board[i][j] = "O";

                let moveVal = minimax(board, 0, false, maxDepth);

                board[i][j] = "";

                if (moveVal > bestVal)
                {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }
    return bestMove;
}

function easyMove(){
    var bestMove = findBestMove(board, 3);
    console.log(bestMove.row, bestMove.col);
    var elem = $('#ttt' + (bestMove.row*3+bestMove.col));
    play(elem);
}

function middleMove(){
    var bestMove = findBestMove(board, 5);
    console.log(bestMove.row, bestMove.col);
    var elem = $('#ttt' + (bestMove.row*3+bestMove.col));
    play(elem);
}

function hardMove(){
    var bestMove = findBestMove(board, 7);
    console.log(bestMove.row, bestMove.col);
    var elem = $('#ttt' + (bestMove.row*3+bestMove.col));
    play(elem);
}

function veryHardMove(){
    var bestMove = findBestMove(board, 9);
    console.log(bestMove.row, bestMove.col);
    var elem = $('#ttt' + (bestMove.row*3+bestMove.col));
    play(elem);
}

function botMove(){
    if (difficulty == "1") setTimeout(veryEasyMove,1000);
    else if (difficulty == "2") setTimeout(easyMove,1000);
    else if (difficulty == "3") setTimeout(middleMove,1000);
    else if (difficulty == "4") setTimeout(hardMove,1000);
    else if (difficulty == "5") setTimeout(veryHardMove,1000);
}

$('.tb').click(function(){
    if(againstBot && player==1) return;
    if(canPlace){
        if(!ingame){
            ingame = true;
            timer();
        }
        var elem = $(this);
        play(elem);
    }
});

function diffi(dif){
    switch(dif){
        case "1": return "sehr leicht";
        case "2": return "leicht";
        case "3": return "mittel";
        case "4": return "schwer";
        case "5": return "sehr schwer";
    }
    return "undefined";
}

$('#timeSlider').on('input change', function(){
    var t = $('#timeSlider').val();
    if(isTimed) $('#timePerRound').text("Zeit pro Zug: " + t + "s");
    else $('#timePerRound').text("");
});

$('#timeActivated').on('change', function(){
    var t = $('#timeActivated').is(":checked");
    var te = $('#timeSlider').val();
    isTimed = t;
    if(isTimed) $('#timePerRound').text("Zeit pro Zug: " + te + "s");
    else $('#timePerRound').text(" ");
});

$('#difficultySlider').on('input change', function(){
    var t = $('#difficultySlider').val();
    difficulty = t;
    dif = diffi(t);
    if(againstBot) $('#difficulty').text("Schwierigkeit: " + dif);
    else $('#difficulty').text("");
});

$('#againstBot').on('change', function(){
    var t = $('#againstBot').is(":checked");
    var te = $('#difficultySlider').val();
    againstBot = t;
    dif = diffi(te);
    if(againstBot) $('#difficulty').text("Schwierigkeit: " + dif);
    else $('#difficulty').text("");
    if(!ingame && againstBot && player==1) botMove();
});

$(document).keypress(function(event){
    var keycode = parseInt((event.keyCode ? event.keyCode : event.which));
    if(keycode >= 49 && keycode <= 57){
        if(againstBot && player==1) return;
        var m = keycode - 49;
        var elem = $('#ttt' + ((2-Math.floor(m/3))*3+(m%3)));
        play(elem);
    }
});

resetGame();