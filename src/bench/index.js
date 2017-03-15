var Collection = require('./model');
var View = require('./view');
//
module.exports = function (app) {
  return {
    bench: () => {
      var collection = new Collection();
      collection.app = app;
      collection.init(app.session);
      collection.on('error:reset', () => {
        app.trigger('error:reset');
      });
      collection.on('error:add', (error) => {
        app.trigger('error:add', error);
        app.trigger('bench:drop');
      });
      app.getView()
        .getRegion('main')
        .show(new View({
          collection: collection
        }));
      collection.listenTo(app, 'bench:drop', function () {
        collection.drop();
      });
    }
  };
};
