import { Mongo } from "meteor/mongo";

QuizCollection = new Mongo.Collection('quiz_list');

CategoryQuizCollection = new Mongo.Collection('category_quiz_list');

/* Quiz IDs already used by a game */
GameCategoryQuizId = new Mongo.Collection('game_category_quiz');

/* Games created by users. The name is used as ID. */
CreatedGame = new Mongo.Collection("created_game");

/* List of quizzes in a game */
GameQuizList = new Mongo.Collection("game_quiz_list");

/* Track current question in each quiz for a specific game. */
TrackQuizQuestion = new Mongo.Collection("track_quiz"); /* gameName, quizId, currentQuestion, lastQuestion */

/* Track who gets correct answer for given question, quiz, and game . */
TrackCorrectPlayer = new Mongo.Collection("track_correct_player"); /* gameName, quizId, question ID, player */

export const QuestionState = new Mongo.Collection("question_state");
