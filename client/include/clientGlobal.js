userAnswer = {gameId: 0, quizId: 0, questionId: 0, answer: true};
createGamePath = '/create-game';
addPlayerPath = '/add-player';
joinGamePath = '/join-game';
watchGamePath = '/watch-game'; 

/* React component after login */
createGame = 'create';
addPlayer = 'add';
joinGame = 'join';
watchGame = 'watch';

getComponentAfterLogin = function() {
    if (window.location.href.includes(createGamePath)) return createGame;
    if (window.location.href.includes(addPlayerPath)) return addPlayer;
    if (window.location.href.includes(joinGamePath)) return joinGame;
    if (window.location.href.includes(watchGamePath)) return watchGame;
    return watchGame;
};


