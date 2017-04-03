var model = require('./model');
var view = require('./view');
//
module.exports = function (app) {
  app.on('before:start', function () {
    var menu = new model.Menu();
    // Incoming
    menu.listenTo(this, 'menu:display', function () {
      app.getView()
        .getRegion('menu')
        .show(new view.Menu({
          model: menu
        }));
    });
    menu.listenTo(this, 'menu:hide', function () {
      app.getView()
        .getRegion('menu')
        .reset();
    });
    menu.listenTo(this, 'bench:start', function () {
      this.trigger('change:active', true);
    });
    menu.listenTo(this, 'bench:done', function () {
      this.trigger('change:active', false);
    });
    // Outgoing
    menu.on('reinit drop save logout', function () {
      app.trigger('error:reset');
    });
    menu.on('reinit', function () {
      app.trigger('bench:reinit');
    });
    menu.on('drop', function () {
      app.trigger('bench:drop');
    });
    menu.on('save', function () {
      app.trigger('bench:save');
    });
    menu.on('logout', function () {
      app.trigger('session:logout');
    });
  });
};
