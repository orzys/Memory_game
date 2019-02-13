var tableWithCards = [];
var firstShowed = false;
var secondShowed = false;
var showedCardNumber;
var score = 0;
var pairsInGame = 8;
var seconds = 0, minutes = 0, hours = 0;
var attempts = 0;

$('#start').on('click', Start);
$('#reset').hide();
$('#title').html('Memory Game');



function Start() {
    Stopwatch();
    createBoard();
    arrangeCards();
    addActionsToCards();
}


function createBoard() {
    var HTMLcode = '';
    for (var i = 0; i < 16; i++) {
        HTMLcode += '<div class="card" id="c' + i + '"></div>';
    }
    $('#memoryGameDiv').html(HTMLcode);
    $('#score').html("Znalezione pary: " + score);
    $('#pairsInGame').html("Pary do znalezienia: " + pairsInGame);
    $('#attempts').html("Próby: " + attempts);
    $("#stopwatch").html("h: " + hours + " m: " + minutes + " s: " + seconds);
}

function arrangeCards() {
    var cards = [];
    var numberOfCards = 15;


    for (var i = 0, j = 0; i < 8; i++ , j = j + 2) {
        var pathToPicture = i + '.png';
        cards[j] = pathToPicture;
        cards[j + 1] = pathToPicture;
    }

    for (var i = 0; i < cards.length; i++) {
        var randomNumber = Math.floor(Math.random() * numberOfCards); //losowanie liczb od 0 do 15
        tableWithCards[i] = cards[randomNumber];
        cards[randomNumber] = cards[numberOfCards];
        numberOfCards--;
    }

}


function checkPairs(cardNumber) {
    if (secondShowed == false) {
        var pathToPicture = "url(img/picturesToMemory/" + tableWithCards[cardNumber] + ")";
        $("#c" + cardNumber).css('background-image', pathToPicture).addClass('showedCard');
        if (firstShowed == false) {
            firstShowed = true;
            showedCardNumber = cardNumber;
            secondShowed = false;
        }
        else {
            if (tableWithCards[showedCardNumber] == tableWithCards[cardNumber]) {
                secondShowed = true;
                $('audio#correctAnswerSoundEffect')[0].play();
                setTimeout(function () { hideCards(showedCardNumber, cardNumber) }, 1000);
                score++;
                pairsInGame--;
                attempts++;
            }
            else {
                secondShowed = true;
                $('audio#wrongAnswerSoundEffect')[0].play();
                setTimeout(function () { coverCards(showedCardNumber, cardNumber) }, 1000);;
                attempts++;
            }
            
            firstShowed = false;
            $('#score').html("Znalezione pary: " + score);
            $('#pairsInGame').html("Pary do znalezienia: " + pairsInGame);
            $('#attempts').html("Próby: " + attempts);
            if (pairsInGame == 0) {
                
                setTimeout(function () { 
                    $('audio#endGameSoundEffect')[0].play();
                    endGame();
                    $('#endGame').html("Wygrałeś! Odkryłeś " + score + " par. Potrzebowałeś " + minutes + " minut, " + seconds + " sekund i " + attempts + " prób.");
                    $('#score').hide();
                    $('#pairsInGame').hide();
                    $('#attempts').hide();
                    $("#stopwatch").hide();
                    $('#title').hide();
                    $('#reset').show();
                 }, 1500);
                
            }
        }
    }
}



function addActionsToCards() {
    for (var i = 0; i < 16; i++)
        document.getElementById("c" + i).addEventListener('click', checkPairs.bind(null, i));
}

function hideCards(firstCard, secondCard) {
    $("#c" + firstCard).animate({ opacity: 0 })
    $("#c" + secondCard).animate({ opacity: 0 })
    secondShowed = false;
}

function coverCards(firstCard, secondCard) {
    var pathToPicture = "url(img/picturesToMemory/snowflake.jpg)";
    $("#c" + firstCard).css('background-image', pathToPicture).removeClass('showedCard');
    $("#c" + secondCard).css('background-image', pathToPicture).removeClass('showedCard');;
    secondShowed = false;
}

function Stopwatch() {
    window.stopwatch = setInterval(function () {
        seconds++;
        if (seconds > 59) {
            seconds = 0;
            minutes++;
            if (minutes > 59) {
                minutes = 0;
                hours++;
            }
        }
        $("#stopwatch").html("h: " + hours + " m: " + minutes + " s: " + seconds);
    }, 1000);
}

function endGame() {
    clearInterval(window.stopwatch);
}

function resetGame()
{
    Start();
    $('#endGame').fadeOut();
    $('#reset').hide()
}