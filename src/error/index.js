var Collection = require('./model');
var View = require('./view');
//
module.exports = function (app) {
  app.on('before:start', () => {
    var collection = new Collection();
    collection.listenTo(app, 'error:add', function (error) {
      this.set({
        message: 'Error : ' + error,
      });
    });
    collection.listenTo(app, 'error:reset', function () {
      this.reset();
    });
    app.getView()
      .getRegion('error')
      .show(new View({
        collection: collection
      }));
  });
};
