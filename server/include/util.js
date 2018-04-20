Future = Npm.require('fibers/future');

getDistinct = function(field, collection) {
  var fut = new Future();
  collection._collection.rawCollection().distinct(field).
    then(distinctValues => fut.return(distinctValues));
  return fut.wait();
}

