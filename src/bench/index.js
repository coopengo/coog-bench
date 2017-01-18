var Collection = require('./model');
var View = require('./view');
//
module.exports = function (app) {
  return {
    bench: () => {
      var collection = new Collection(null, {
        session: app.session
      });
      collection.initBenchs();
      app.showView(new View({
        collection: collection
      }));
    }
  };
};
