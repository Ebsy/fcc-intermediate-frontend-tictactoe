var playerSymbol;
var aiSymbol;
var message;

var playerMoves = [];
var aiMoves = [];

var squaresPlayed = 0;
var strats = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
];

Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};
$(document).ready(function() {
  resetBoard();

  $('#reset').on('click', function() {
    resetBoard();
  });

  // Choose Symbol
  $('.choose').on('click', function() {
    playerSymbol = $(this).text();
    aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
  });

  // Player clicks
  $('.square').on('click', function() {
    if ($(this).hasClass('played')) {
      return;
    }
    playerMoves.push(parseInt($(this).prop('id'), 0));
    changeState($(this), playerSymbol);
    if (incSquaresPlayed() === 'gameover') {
      return;
    }
    setTimeout(aiPlay, 500);
  });
});

function incSquaresPlayed() {
  squaresPlayed++;
  if (squaresPlayed === 9) {
    message = 'It\'s a Draw!';
    endGame();
    return 'gameover';
  }
}

function endGame() {
  $('.square').addClass('played');
  setTimeout(resetBoard, 1000);
}

function resetBoard() {
  $('#text').text(message);
  $('#choice').modal({
    backdrop: 'static',
    keyboard: false
  });
  $('.square').removeClass('Xplayed');
  $('.square').removeClass('Oplayed');
  $('.square').removeClass('played');
  squaresPlayed = 0;
  playerMoves = [];
  aiMoves = [];
}

function changeState(el, symb) {
  el.addClass(symb + 'played');
  el.addClass('played');
}

function aiPlay() {
  if (squaresPlayed === 9) {
    return;
  }
  incSquaresPlayed();
  console.log(playerMoves);
  if (playerMoves.length === 1) {
    if (!$('#5').hasClass('played')) {
      pickRandom(5);
      return;
    }
  }
  pickRandom(calcStrats());
  checkAIWin();
}

function checkAIWin() {
  for (var i = 0; i < strats.length; i++) {
    var ret = strats[i].diff(aiMoves);
    if (ret.length === 0) {
      message = 'The Computer Won, Try again!';
      endGame();
      return;
    }
  }
}

function calcStrats() {
  for (var i = 0; i < strats.length; i++) {
    var ret = strats[i].diff(playerMoves)
    if (ret.length === 1) {
      if ($('#' + ret).hasClass('played')) {
        continue;
      } else {
        return ret[0];
      }
    }
  }
  return 0;
}

function pickRandom(input) {
  var square;
  if (input === 0) {
    square = '#' + Math.floor(Math.random() * ((9 - 1) + 1) + 1);
  } else {
    square = '#' + input;
  }
  if ($(square).hasClass('played')) {
    pickRandom(0);
  } else {
    changeState($(square), aiSymbol);
    aiMoves.push(input);
  }
}
