Future = Npm.require('fibers/future');
import moment from 'moment';

getDistinct = function(field, collection) {
  var fut = new Future();
  collection._collection.rawCollection().distinct(field).
    then(distinctValues => fut.return(distinctValues));
  return fut.wait();
}

Array.prototype.diff = function(a) {
  return this.filter((i) => a.indexOf(i) < 0);
};

getNewGameId = function() {
  return moment().format("YYYY-MM-DD_HH_mm_ss") + "_" + parseInt(Math.random() * 1000) % 10;
}

getRandomIndex = function(arrayLength) {
  var randNumber = parseInt(Math.random() * 100000);
  return randNumber % arrayLength;
}
