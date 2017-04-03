var Collection = require('./model');
var View = require('./view');
//
module.exports = function (app) {
  return {
    bench: () => {
      var collection = new Collection();
      collection.app = app;
      collection.init(app.session);
      collection.on('error:reset', function () {
        app.trigger('error:reset');
      });
      collection.on('error:add', function (error) {
        app.trigger('error:reset');
        app.trigger('error:add', error);
        app.trigger('errorAdd');
      });
      collection.listenTo(app, 'bench:refresh', function () {
        collection.refresh(this);
      });
      collection.listenTo(app, 'bench:drop', function () {
        collection.drop();
      });
      collection.listenTo(app, 'bench:save', function () {
        collection.save();
      });
      collection.on('menu:disabled', function () {
        app.trigger('menuDisabled');
      });
      collection.on('bench:done', function () {
        app.trigger('benchDone');
      });
      collection.on('bench:drop', function () {
        app.trigger('benchDrop');
      });
      app.trigger('menu:display');
      app.getView()
        .getRegion('main')
        .show(new View({
          collection: collection
        }));
    }
  };
};
