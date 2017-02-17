var Collection = require('./model');
var View = require('./view');
//
module.exports = function (app) {
  app.on('before:start', () => {
    var collection = new Collection();
    app.errors = collection;
    app.getView()
      .getRegion('error')
      .show(new View({
        collection: collection
      }));
  });
};
