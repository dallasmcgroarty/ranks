(function (window) {
  document.getElementById('player-input').addEventListener('submit', function (event) {
    event.preventDefault();
    addNewPlayer();
  });
})(window);

function addNewPlayer () {
  var target = document.querySelector('.sticky-bottom');
  var newCard = document.createElement('div');
  var name = document.getElementById('player-name').value;
  var score = document.getElementById('player-score').value;
  if (!name || !score) {
    console.log('no name or score entered');
  } else {
    console.log('new player ' + name + ' added');
    newCard.setAttribute('class', 'card');
    newCard.innerHTML = "<div class='card-body'> <div class='name'>" + name + "</div> <div class='player-score'>" + score.toString() + '</div></div>';
    target.parentNode.insertBefore(newCard, target);
  }
}
