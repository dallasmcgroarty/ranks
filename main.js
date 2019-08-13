(function (window) {
  document.getElementById('player-input').addEventListener('submit', function (event) {
    event.preventDefault();
    var name = document.getElementById('player-name').value;
    console.log('new player ' + name + ' added');
    addNewPlayer();
  });
})(window);

function addNewPlayer () {
  var target = document.querySelector('.sticky-bottom');
  var newCard = document.createElement('div');
  var name = document.getElementById('player-name').value;
  var score = document.getElementById('player-score').value;
  newCard.setAttribute('class', 'card');
  newCard.innerHTML = "<div class='card-body'> <div class='name'>" + name + "</div> <div class='player-score'>" + score.toString() + '</div></div>';
  target.parentNode.insertBefore(newCard, target);
}
