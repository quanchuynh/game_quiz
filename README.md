# game_quiz
# Feature
#   1. Winner choose next category, time per question (min: 3, max: 15, default: 10 seconds)
#   2. Organizer choose how many quizzes per game
#   3. Each game has an unique game ID. Each game, has a set of players
#   4. Score board also display question, then correction question before next question
#   5. Quizzes in a game are unique (no repeating quiz)
#   
#   1. Blaze templates in React
#      meteor add gadicc:blaze-react-component
#   2. meteor add react-meteor-data  (for integrating meteor data system). Use withTracker
#   3. Will need to "meteor remove autopublish" to limit automatic publish

#   import React from 'react';
#   import Blaze from 'meteor/gadicc:blaze-react-component';
#   
#   const App = () => (
#     <div>
#       <Blaze template="itemsList" items={items} />
#     </div>
#   );
