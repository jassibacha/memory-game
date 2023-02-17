const gameContainer = document.getElementById('game');
const startButton = document.querySelector('.start');
const resetButton = document.querySelector('.reset');
const timerWrap = document.querySelector('.timer span');
const scoreDiv = document.querySelector('.score span');
const highscoreDiv = document.querySelector('.highscore span');
const messageDiv = document.querySelector('.message');
let flippedCount = 0;
let matchCompare = [];
let matchCount = 0;
let timer = 00;
let timeCount = 0;
let score = 50;
// What this does is evaluates the left side first and returns if there's a value
let highscore = localStorage.getItem('highscoreSave') ?? 0;
console.log('High Score: ' + highscore);

/* NOTE FOR ME 
Highscore works, but now we need the message to work.  -- DONE
Also we want the timer to start if any card is pressed and it isn't active.. or make cards not work I guess?
Then we need to do localStorage for the highScore --- DONE. */

scoreDiv.innerText = score;
highscoreDiv.innerText = highscore;

function updateTimer() {
    timeCount = timeCount + 1;
    timerWrap.innerText = timeCount;
}
startButton.addEventListener('click', function (e) {
    e.target.classList.add('disabled');
    startGame();
});

// The button has an on-click event handler that calls this
function startGame() {
    timeCount = 0;
    timer = 0;
    flippedCount = 0;
    matchCompare = [];
    matchCount = 0;
    allCards.forEach((card) => {
        card.classList.remove('clicked');
        card.classList.remove('is-flipped');
        card.classList.remove('matched');
        card.dataset.selected = false;
        card.dataset.matched = false;
    });
    if (!messageDiv.classList.contains('hide')) {
        messageDiv.classList.add('hide');
    }

    timer = setInterval(updateTimer, 1000);
    score = 50;
    scoreDiv.innerText = score;

    // It will be a whole second before the time changes, so we'll call the update once ourselves
    updateTimer();
}

// What to do when the timer runs out
function gameOver() {
    // This cancels the setInterval, so the updateTimer stops getting called
    clearInterval(timer);
    startButton.classList.remove('disabled');
    resetButton.classList.remove('disabled');

    if (highscore < score) {
        console.log('New high score! ' + score);
        highscore = score;
        highscoreDiv.innerText = highscore;

        localStorage.setItem('highscoreSave', highscore);
        console.log(localStorage.getItem('highscoreSave'));

        messageDiv.innerHTML =
            'New High Score!! You got <span class="win-score">' +
            highscore +
            '</span> points!';
        messageDiv.classList.toggle('hide');
    } else {
        messageDiv.innerHTML =
            'You win! Congrats! Your score is <span class="win-score">' +
            score +
            '</span>!';
        messageDiv.classList.toggle('hide');
    }
}

resetButton.addEventListener('click', resetGame);

function resetGame() {
    console.log('Resetting game.');
    allCards.forEach((card) => {
        card.classList.remove('clicked');
        card.classList.remove('is-flipped');
        card.classList.remove('matched');
        card.dataset.selected = false;
        card.dataset.matched = false;
    });

    if (!messageDiv.classList.contains('hide')) {
        messageDiv.classList.add('hide');
    }
    startButton.classList.remove('disabled');
    resetButton.classList.remove('disabled');
    clearInterval(timer);

    timeCount = 0;
    timer = 00;
    timerWrap.innerText = timeCount;
    score = 50;
    scoreDiv.innerText = score;
    // Clear this array to start over
    matchCompare = [];
    // Reset flippedCount to 0
    flippedCount = 0;
    matchCount = 0;
}

/*
 * Cards | Red = Andy, Blue = Franco Wink, Green = Puss In Boots,
 * Orange = Kekw, Purple = Squirtle, New = SmileKitty
 */
const GIFS = [
    'andy',
    'franco',
    'puss',
    'kekw',
    'squirtle',
    'smilekitty',
    'minions',
    'pedro',
    'andy',
    'franco',
    'puss',
    'kekw',
    'squirtle',
    'smilekitty',
    'minions',
    'pedro',
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

let shuffledGifs = shuffle(GIFS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForGifs(gifArray) {
    for (let gif of gifArray) {
        // create a new div
        const newDiv = document.createElement('div');
        newDiv.classList.add('wrap');
        const newCard = document.createElement('div');
        const newFront = document.createElement('div');
        const newBack = document.createElement('div');

        newDiv.appendChild(newCard);
        newCard.classList.add('card');
        // give it a class attribute for the value we are looping over
        newCard.classList.add(gif);
        newCard.dataset.gif = gif;
        newCard.dataset.selected = false;
        newCard.dataset.matched = false;

        newFront.classList.add('card-face', 'front');
        newFront.innerHTML = '<div class="question">?</div>';
        newBack.classList.add('card-face', 'back');
        //newBack.innerHTML = color;

        newCard.appendChild(newFront);
        newCard.appendChild(newBack);

        // call a function handleCardClick when a div is clicked on
        newCard.addEventListener('click', handleCardClick);

        // append the div to the element with an id of game
        gameContainer.append(newDiv);
    }
}

// TODO: Implement this function!
function handleCardClick(event) {
    // Make sure flippedCount isn't bigger than 2, and that the card hasn't already been clicked. Otherwise stop this event listener
    if (
        flippedCount === 2 ||
        event.target.parentElement.classList.contains('clicked')
    ) {
        return;
    }

    flippedCount++;

    console.log(
        'Clicked ' + event.target.parentElement.dataset.gif,
        '. flippedCount: ' + flippedCount
    );
    //console.log('flippedCount: ' + flippedCount);

    // We click the card-face front div, not the main card div, so we need to select parentElement to edit card div
    event.target.parentElement.classList.add('clicked', 'is-flipped');
    event.target.parentElement.dataset.selected = true;

    matchCompare.push(event.target.parentElement);
    // This seems to let us look at the 2 colors
    //matchCompare.push(event.target.dataset.color);

    console.log(matchCompare);

    /* Tips from TA
    What I would consider doing is adding a value or etc to each card, and added a card value to say an array, and then adding a second one, and then compare them. 
    There are many ways to do this. I would grab the data informationa nd see if it matches with the second turn. All you would have to do is compare arr[0] with arr[1]
    and if it matches or doesnt match, set the same array to a [] so it is empty again. DONT FORGET to reset the array!!
    */

    if (flippedCount === 2) {
        //const clickedTwo = document.querySelectorAll('.clicked');
        //const matchedColors = clickedTwo.querySelector();
        console.log('1: ' + matchCompare[0] + ', 2: ' + matchCompare[1]);
        // Do they match? The colors.
        if (matchCompare[0].dataset.gif === matchCompare[1].dataset.gif) {
            matchCount++;
            score--;
            scoreDiv.innerText = score;
            console.log(
                'They matched! Both ' +
                    matchCompare[0].dataset.gif +
                    ' matchCount: ' +
                    matchCount +
                    '/' +
                    allMatched
            );
            // forEach! Iterates over them because they're a DOM element
            matchCompare.forEach((match) => {
                match.dataset.matched = true;
                match.classList.add('matched');
            });
            if (matchCount === allMatched) {
                // Game is over, they're done. We need to save the time it took and let them reset.
                console.log(
                    'All cards matched. Game done! Took ' +
                        timeCount +
                        ' seconds.'
                );
                // Moved High score to gameOver
                gameOver();
            }
            matchCompare = [];
            flippedCount = 0;
        } else {
            console.log('Not a match, time to wipe cards. (1s delay)');
            score--;
            scoreDiv.innerText = score;
            // 1s delay so they see the color!
            setTimeout(function () {
                wipeCards();
            }, 1000);
        }
    }
}

function wipeCards() {
    // Iterate over allCards (called after load) and remove clicked from applicable
    allCards.forEach((card) => {
        if (card.classList.contains('clicked')) {
            console.log('Removing from', card);
            card.classList.remove('clicked');
            card.dataset.selected = false;
        }
        if (card.classList.contains('matched')) {
            console.log(
                'Card has has "matched" css class, dont remove flipped class'
            );
        } else {
            //console.log('This card isnt matched, remove flipped class');
            card.classList.remove('is-flipped');
        }
    });
    // Clear this array to start over, if they didn't match!
    matchCompare = [];
    // Reset flippedCount to 0
    flippedCount = 0;
}

// when the DOM loads
createDivsForGifs(shuffledGifs);

const allCards = document.querySelectorAll('.card');

const allMatched = allCards.length / 2;
