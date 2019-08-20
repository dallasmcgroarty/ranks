// Set up event listeners and functions needed to run when the window is shown

(function (window) {
  retrieveAllPlayers();

  document.getElementById('player-input').addEventListener('submit', function (event) {
    event.preventDefault();
    checkPlayer();
  });

  document.getElementById('clear-all-btn').addEventListener('click', function (event) {
    event.preventDefault();
    clearAllPlayers();
  });

  document.getElementById('plus').addEventListener('click', function (event) {
    event.preventDefault();
    addScore();
  });

  document.getElementById('minus').addEventListener('click', function (event) {
    event.preventDefault();
    subtractScore();
  });
  /*
  // manages click events outside of the cards
  document.addEventListener('click', function (event) {
    if (event && !event.target.closest('.card')) {
      console.log('clicked out');
      var cards = document.querySelectorAll('.card');
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].style.width === '90%') {
          cards[i].style.width = '80%';
          cards[i].style.height = '160px';
        }
      }
    }
  });
  */
})(window);

// Add new player function. Checks if user entered info and creates a new card
function addNewPlayer (name, score) {
  var target = document.getElementById('functions');
  var newCard = document.createElement('div');
  newCard.setAttribute('class', 'card');
  // create new card with player name as id and score as id, ex: id='Tom', id='Tom-score'
  newCard.innerHTML = "<div class='card-body'> <div id=" + name + '>' + name + '</div> <div id=' + name + '-score>' + score + '</div></div>';
  target.parentNode.insertBefore(newCard, target);

  // adding event listener to manage which players is currently selected
  // on click enlarge selected card and de-enlarge all others
  newCard.addEventListener('click', function (event) {
    event.preventDefault();
    var cards = document.querySelectorAll('.card');
    console.log(name + ' selected');
    newCard.style.width = '90%';
    newCard.style.height = '100px';
    newCard.style.background = 'rgb(228, 224, 224)';
    for (var i = 0; i < cards.length; i++) {
      if (cards[i] !== newCard) {
        cards[i].style.width = '80%';
        cards[i].style.height = '85px';
        cards[i].style.background = 'white';
      }
    }
  });
  addToStorage(name, score);
}

// Add the new player to localStorage
function addToStorage (name, score) {
  // player object to hold player name and score
  const player = {
    userName: name,
    userScore: score
  };
  if (typeof (Storage) !== 'undefined') {
    window.localStorage.setItem(name, JSON.stringify(player));
    console.log('player added to localStorage');
  } else {
    console.log('localStorage not supported');
  }
}

// Get all players currently in localStorage
// This allows player cards to persist even if the page is changed or refreshed
function retrieveAllPlayers () {
  if (localStorage) {
    for (var i = 0; i < localStorage.length; i++) {
      var player = JSON.parse(localStorage.getItem(localStorage.key(i)));
      addNewPlayer(player['userName'], player['userScore']);
    }
    console.log('Existing players retreived');
  }
}

// check if player name and score exist then call addnewplayer
function checkPlayer () {
  var name = document.getElementById('player-name').value;
  var score = document.getElementById('player-score').value;
  if (!name) {
    console.log('no name entered');
  } else {
    console.log('new player ' + name + ' added');
    if (score === '') {
      score = 0;
    }
    addNewPlayer(name, score);
  }
  document.getElementById('player-name').value = '';
}

// Clear all players from the DOM tree and from local storage
function clearAllPlayers () {
  if (typeof (Storage) !== 'undefined') {
    var players = document.querySelectorAll('.card');
    if (players) {
      players.forEach(e => e.parentNode.removeChild(e));
      window.localStorage.clear();
      console.log('Players deleted. localStorage cleared');
    } else {
      console.log('No Players present');
    }
  } else {
    console.log('localStorage not supported');
  }
}

// subtract user score with score increment
function subtractScore () {
  if (!document.querySelector('.card')) {
    console.log('No players added');
    return;
  }
  var target = '';
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].style.width === '90%') {
      target = cards[i].innerText.replace(/[0-9]/g, '');
      target = target.slice(0, -1);
      console.log(target);
      break;
    }
  }
  if (target === '') {
    console.log('No player seleced');
    return;
  }
  var scoreIncrement = Number(document.getElementById('score-update').value);
  var curScore = Number(document.getElementById(target + '-score').innerText);
  // subtract from total
  var totalScore = curScore - scoreIncrement;
  // cant go negative, issues with negative number returning null on getelementbyid
  if (totalScore < 0) {
    totalScore = 0;
  }

  document.getElementById(target + '-score').innerText = totalScore;
  var player = JSON.parse(localStorage.getItem(target));
  player['userScore'] = totalScore;
  window.localStorage.setItem(target, JSON.stringify(player));
  console.log(target + 's score was updated');
}

// add score increment to user score
function addScore () {
  if (!document.querySelector('.card')) {
    console.log('No players added');
    return;
  }
  var target = '';
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].style.width === '90%') {
      // testing textConent over innerText for iOS
      target = cards[i].textContent.replace(/[0-9]/g, '');
      // slice(0,-1) for innerText, for textContent use slice(1,-1)
      target = target.slice(1, -1);
      console.log(target);
      break;
    }
  }
  if (target === '') {
    console.log('No player seleced');
    return;
  }
  var scoreIncrement = Number(document.getElementById('score-update').value);
  // testing textConent over innerText for iOS
  var curScore = Number(document.getElementById(target + '-score').textContent);
  // add to total
  var totalScore = curScore + scoreIncrement;
  // testing textConent over innerText for iOS
  document.getElementById(target + '-score').textContent = totalScore;
  var player = JSON.parse(localStorage.getItem(target));
  player['userScore'] = totalScore;
  window.localStorage.setItem(target, JSON.stringify(player));
  console.log(target + 's score was updated to');
}
