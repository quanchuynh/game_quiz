import { Mongo } from "meteor/mongo";

QuizCollection = new Mongo.Collection('quiz_list');

CategoryQuizCollection = new Mongo.Collection('category_quiz_list');

/* Quiz IDs already used by a game */
GameCategoryQuizId = new Mongo.Collection('game_category_quiz');

/* Games created by users. The name is used as ID. */
CreatedGame = new Mongo.Collection("created_game");

export const QuestionState = new Mongo.Collection("question_state");
