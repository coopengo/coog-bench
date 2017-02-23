var storage = require('./storage');
var login = require('./login');
var logout = require('./logout');
//
module.exports = function (app) {
  app.then(() => storage.getSession()
    .then((session) => {
      if (session) {
        app.session = session;
        app.connect();
      }
    }));
  app.on('before:start', () => {
    var n = new login.Model();
    app.getView()
      .getRegion('menu')
      .show(new logout.Logout({
        model: n
      }));
  });
  return {
    login: () => {
      var m = new login.Model();
      var mo = new login.Model();
      m.on('login', (ok, info) => {
        if (ok) {
          app.session = info;
          app.connect();
          storage.setSession(info);
          app.trigger('error:reset');
          app.getView()
            .getRegion('menu')
            .show(new logout.Logout({
              model: mo
            }));
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
      app.getView()
        .getRegion('menu')
        .show(new logout.Blank({
          model: mo
        }));
    },
  };
};
