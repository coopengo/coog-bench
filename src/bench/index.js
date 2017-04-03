var model = require('./model');
var view = require('./view');
//
module.exports = function (app) {
  return {
    bench: () => {
      var benchs = new model.Benchs();
      benchs.app = app;
      benchs.init(app.session);
      benchs.on('start', function () {
        app.trigger('bench:start');
        app.trigger('error:reset');
      });
      benchs.on('done', function (error) {
        app.trigger('bench:done');
        if (error) {
          app.trigger('error:add', error);
        }
      });
      benchs.listenTo(app, 'bench:reinit', function () {
        this.reinit();
      });
      benchs.listenTo(app, 'bench:drop', function () {
        this.drop();
      });
      benchs.listenTo(app, 'bench:save', function () {
        this.save();
      });
      app.trigger('menu:display');
      app.getView()
        .getRegion('main')
        .show(new view.Benchs({
          collection: benchs
        }));
    }
  };
};
