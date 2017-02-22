var Collection = require('./model');
var View = require('./view');
var drop = require('./drop');
//
module.exports = function (app) {
  return {
    bench: () => {
      app.trigger('errors:reset');
      var collection = new Collection();
      collection.app = app;
      collection.init(app.session);
      collection.on('error:reset', () => {
        app.errors.reset();
        app.getView()
          .getRegion('actions')
          .show(new drop.Blank({
            collection: collection
          }));
      });
      collection.on('error:add', (error) => {
        app.errors.add({
          message: error
        });
        app.getView()
          .getRegion('actions')
          .show(new drop.Drop({
            collection: collection
          }));
      });
      app.getView()
        .getRegion('main')
        .show(new View({
          collection: collection
        }));
    }
  };
};
