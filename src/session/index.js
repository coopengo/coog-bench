var storage = require('./storage');
var login = require('./login');
//
module.exports = function (app) {
  app.then(() => storage.getSession()
    .then((session) => {
      if (session) {
        app.session = session;
        app.connect();
      }
    }));
  return {
    login: () => {
      var m = new login.Model();
      m.on('login', (ok, info) => {
        if (ok) {
          app.session = info;
          app.connect();
          storage.setSession(info);
          app.trigger('error:reset');
          app.trigger('menu:display');
        }
        else {
          app.trigger('error:add', info.error);
        }
      });
      app.getView()
        .getRegion('main')
        .show(new login.View({
          model: m
        }));
      app.trigger('menu:nodisplay');
    },
  };
};
