userAnswer = {gameId: 0, quizId: 0, questionId: 0, answer: true};

createGamePath = '/create-game';
addPlayerPath = '/add-player';
joinGamePath = '/join-game';
watchGamePath = '/watch-game'; 
changePasswordPath = '/change-password'; 
logOutPath = '/log-out';

SignInPath = '/SignIn';
SignUpPath = '/SignUp';
HomePath = '/';
PracticePath = '/Practice';
GamePath = "Game";  /* this is only a label not a path. */
SignInTitle = 'Sign In';  /* toggle between sign in and log out */

/* React component after login */
createGame = 'create';
addPlayer = 'add';
joinGame = 'join';
watchGame = 'watch';
/* */
changePassword = 'change-password';

getComponentAfterLogin = function() {
    if (window.location.href.includes(createGamePath)) return createGame;
    if (window.location.href.includes(addPlayerPath)) return addPlayer;
    if (window.location.href.includes(joinGamePath)) return joinGame;
    if (window.location.href.includes(watchGamePath)) return watchGame;
    return watchGame;
};

getSelectedNav = function() {
    if (window.location.href.includes(SignInPath)) return SignInPath;
    if (window.location.href.includes(changePasswordPath)) return SignInPath;
    if (window.location.href.includes(logOutPath)) return SignInPath;

    if (window.location.href.includes(SignUpPath)) return SignUpPath;
    if (window.location.href.includes(PracticePath)) return PracticePath;

    if (window.location.href.includes(createGamePath)) return GamePath;
    if (window.location.href.includes(addPlayerPath)) return GamePath;
    if (window.location.href.includes(joinGamePath)) return GamePath;
    if (window.location.href.includes(watchGamePath)) return GamePath;

    return HomePath;
};


