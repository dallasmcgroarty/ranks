// Set up event listeners and functions needed to run when the window is shown

// use if (ga) to check if google analytics is loaded
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

  document.getElementById('reset-all-btn').addEventListener('click', function (event) {
    event.preventDefault();
    resetAllScores();
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
  var target = document.getElementById('card-set');
  var newCard = document.createElement('div');
  newCard.setAttribute('class', 'card');
  // create new card with player name as id and score as id, ex: id='Tom', id='Tom-score'
  newCard.innerHTML = "<div class='card-body'> <div id=" + name + '>' + name + '</div> <div id=' + name + '-score>' + score + '</div></div>';
  target.appendChild(newCard);

  // adding event listener to manage which players is currently selected
  // on click enlarge selected card and de-enlarge all others
  newCard.addEventListener('click', function (event) {
    event.preventDefault();
    var cards = document.querySelectorAll('.card');
    console.log(name + ' selected');
    // check for tablet
    if (window.innerWidth > 1000 && window.innerWidth < 1400) {
      newCard.style.width = '80%';
      newCard.style.height = '210px';
      newCard.style.background = 'rgb(228, 224, 224)';
      for (var i = 0; i < cards.length; i++) {
        if (cards[i] !== newCard) {
          cards[i].style.width = '70%';
          cards[i].style.height = '200px';
          cards[i].style.background = 'white';
        }
      } // check for desktop/laptop
    } else if (window.innerWidth >= 1400) {
      newCard.style.width = '50%';
      newCard.style.height = '110px';
      newCard.style.background = 'rgb(228, 224, 224)';
      for (var i = 0; i < cards.length; i++) {
        if (cards[i] !== newCard) {
          cards[i].style.width = '40%';
          cards[i].style.height = '100px';
          cards[i].style.background = 'white';
        }
      } // else were on mobile
    } else {
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
      // wierd error with localstorage not sure what this string below is
      if (localStorage.getItem(localStorage.key(i)) === '483d05ce-41b1-4855-82ea-4617a7890a0e' || localStorage.getItem(localStorage.key(i)) === null) {
        continue;
      } else {
        var player = JSON.parse(localStorage.getItem(localStorage.key(i)));
      }
      if (player) {
        addNewPlayer(player['userName'], player['userScore']);
      }
    }
    console.log('Existing players retreived');
    // order players when window loads
    orderPlayers(1);
  }
}

// check if player name and score exist then call addnewplayer
function checkPlayer () {
  var name = document.getElementById('player-name').value;
  var score = document.getElementById('player-score').value;
  if (!name) {
    console.log('no name entered');
  } else if (JSON.parse(localStorage.getItem(name))) {
    console.log('Player already exists');
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

// reset all player scores back to 0
function resetAllScores () {
  if (!document.querySelector('.card')) {
    console.log('No players added');
    return;
  }
  var target = '';
  var player = {};
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    target = cards[i].textContent.replace(/[0-9]/g, '');
    target = target.slice(1, -1);
    // use player name to get the player score and set textContent to 0
    document.getElementById(target + '-score').textContent = '0';
    // then set the players score to 0 in localstorage
    player = JSON.parse(localStorage.getItem(target));
    player['userScore'] = '0';
    window.localStorage.setItem(target, JSON.stringify(player));
  }
  console.log('All player scores reset to 0');
}

// subtract user score with score increment
function subtractScore () {
  let target = getTarget();

  if (target === '') {
    console.log('No player seleced');
    return;
  }

  if (document.getElementById('score-update').value === 0 || document.getElementById('score-update').value === '0' || 
      document.getElementById('score-update').value === '') {
    return;
  }
  
  var scoreIncrement = Number(document.getElementById('score-update').value);
  // textConent over innerText for iOS
  var curScore = Number(document.getElementById(target + '-score').textContent);
  // subtract from total
  var totalScore = curScore - scoreIncrement;

  // textContent over innerText for iOS
  document.getElementById(target + '-score').textContent = totalScore;
  var player = JSON.parse(localStorage.getItem(target));
  player['userScore'] = totalScore.toString();

  window.localStorage.setItem(target, JSON.stringify(player));
  console.log(target + 's score was updated');
  // order players dynamically while updating scores
  orderPlayers(0);
}

// add score increment to user score
function addScore () {
  let target = getTarget();
  if (target === '') {
    console.log('No player seleced');
    return;
  }

  if (document.getElementById('score-update').value === 0 || document.getElementById('score-update').value === '0' || 
      document.getElementById('score-update').value === '') {
    return;
  }

  var scoreIncrement = Number(document.getElementById('score-update').value);
  // textConent over innerText for iOS
  var curScore = Number(document.getElementById(target + '-score').textContent);
  // add to total
  var totalScore = curScore + scoreIncrement;
  // textConent over innerText for iOS
  document.getElementById(target + '-score').textContent = totalScore;
  var player = JSON.parse(localStorage.getItem(target));
  player['userScore'] = totalScore.toString();

  window.localStorage.setItem(target, JSON.stringify(player));
  console.log(target + 's score was updated');
  // order players dynamically while updating scores
  orderPlayers(0);
}

// order players function orders players from highest score to lowest
// then appends them back to the DOM under the parent class 'card-set'
// removes animation after initial load as well
function orderPlayers (animate) {
  var playerArr = [];
  var target = document.getElementById('card-set');
  var cards = document.querySelectorAll('.card');

  for (var p in cards) {
    if (cards[p].nodeType === 1) {
      if (animate === 1) {
        cards[p].classList.remove('no-animate');
      } else {
        cards[p].classList.add('no-animate');
      }
      playerArr.push(cards[p]);
    }
  }

  // sort greatest to least
  playerArr.sort(function (a, b) {
    var x = Number(a.textContent.replace(/[^\d.-]/g, ''));
    var y = Number(b.textContent.replace(/[^\d.-]/g, ''));
    if (x > y) {
      return -1;
    }
    if (x < y) {
      return 1;
    }
    return 0;
  });

  // re-append nodes
  for (var x = 0; x < playerArr.length; ++x) {
    target.appendChild(playerArr[x]);
  }
}

// function to get the current target selected
function getTarget () {
  if (!document.querySelector('.card')) {
    console.log('No players added');
    return;
  }
  var target = '';
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    // check if on tablet or desktop
    if (window.innerWidth > 1000 && window.innerWidth < 1400) {
      if (cards[i].style.width === '80%') {
        target = cards[i].textContent.replace(/[0-9]/g, '');
        target = target.slice(1, -1);
        target = target.trim();
        break;
      } // check if on desktop/laptop
    } else if (window.innerWidth >= 1400) {
      if (cards[i].style.width === '50%') {
        target = cards[i].textContent.replace(/[0-9]/g, '');
        target = target.slice(1, -1);
        target = target.trim();
        break;
      } // else mobile
    } else {
      if (cards[i].style.width === '90%') {
        // textConent over innerText for iOS
        target = cards[i].textContent.replace(/[0-9]/g, '');
        target = target.slice(1, -1);
        target = target.trim();
        break;
      }
    }
  }
  return target;
}
