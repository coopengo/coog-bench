var Model = require('./model');
var View = require('./view');
//
module.exports = function (app) {
  app.on('before:start', () => {
    var model = new Model();
    app.getView()
      .getRegion('menu')
      .show(new View.Menu({
        model: model
      }));
    model.listenTo(app, 'menu:display', function () {
      app.getView()
        .getRegion('menu')
        .show(new View.Menu({
          model: model
        }));
    });
    model.listenTo(app, 'menu:nodisplay', function () {
      app.getView()
        .getRegion('menu')
        .show(new View.Blank({
          model: model
        }));
    });
  });
};
