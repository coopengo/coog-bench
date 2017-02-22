var Collection = require('./model');
var View = require('./view');
var drop = require('./drop');
//
module.exports = function (app) {
  return {
    bench: () => {
      var collection = new Collection();
      collection.app = app;
      collection.init(app.session);
      collection.on('error:reset', () => {
        app.trigger('error:reset');
        app.getView()
          .getRegion('actions')
          .show(new drop.Blank({
            collection: collection
          }));
      });
      collection.on('error:add', (error) => {
        app.trigger('error:add', error);
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
