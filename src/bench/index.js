var model = require('./model');
var view = require('./view');
//
module.exports = function (app) {
  return {
    bench: () => {
      var benchs = new model.Benchs();
      benchs.app = app;
      benchs.init(app.session);
      app.trigger('menu:display');
      app.getView()
        .getRegion('main')
        .show(new view.Benchs({
          collection: benchs
        }));
      benchs.listenTo(app, 'bench:reinit', function () {
        this.reinit();
      });
      benchs.listenTo(app, 'bench:drop', function () {
        this.drop();
      });
      benchs.listenTo(app, 'bench:save', function () {
        this.save();
      });
      benchs.on('start', function () {
        app.trigger('bench:start');
        this.trigger('change:active', true);
        app.trigger('error:reset');
      });
      benchs.on('done', function (error) {
        app.trigger('bench:done');
        this.trigger('change:active', false);
        if (error) {
          app.trigger('error:add', error);
        }
      });
    }
  };
};
