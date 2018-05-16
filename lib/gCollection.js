import { Mongo } from "meteor/mongo";

QuizCollection = new Meteor.Collection('quiz_list');

CategoryQuizCollection = new Meteor.Collection('category_quiz_list');

/* Quiz IDs already used by a game */
GameCategoryQuizId = new Meteor.Collection('game_category_quiz');

export const QuestionState = new Mongo.Collection("question_state");
