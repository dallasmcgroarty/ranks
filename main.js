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
})(window);

// Add new player function. Checks if user entered info and creates a new card
function addNewPlayer (name, score) {
  var target = document.querySelector('.sticky-bottom');
  var newCard = document.createElement('div');
  newCard.setAttribute('class', 'card');
  // create new card with player name as id and score as id, ex: id='Tom', id='Tom-score'
  newCard.innerHTML = "<div class='card-body'> <div id=" + name + '>' + name + '</div> <div id=' + name + '-score>' + score.toString() + '</div></div>';
  target.parentNode.insertBefore(newCard, target);

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
      console.log('Existing players retreived');
    }
  }
}

// check if player name and score exist then call addnewplayer
function checkPlayer () {
  var name = document.getElementById('player-name').value;
  var score = document.getElementById('player-score').value;
  if (!name || !score) {
    console.log('no name or score entered');
  } else {
    console.log('new player ' + name + ' added');
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

function subtractScore (name, score) {

}

function addScore (name, score) {

}
