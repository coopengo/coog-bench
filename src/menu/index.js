var Model = require('./model');
var View = require('./view');
//
module.exports = function (app) {
  app.on('before:start', function () {
    var model = new Model();
    model.listenTo(this, 'menu:display', function () {
      app.getView()
        .getRegion('menu')
        .show(new View.Menu({
          model: model
        }));
    });
    model.listenTo(this, 'menu:hide', function () {
      app.getView()
        .getRegion('menu')
        .reset();
    });
    model.on('save', function () {
      app.trigger('bench:save');
    });
    model.on('drop', function () {
      app.trigger('bench:drop');
    });
    model.on('logout', function () {
      app.trigger('session:logout');
    });
  });
};
