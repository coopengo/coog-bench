var Session = require('tryton-session');
var BENCH_MODEL = 'utils.benchmark_class';

function rpc(session, model, method, args, context) {
  if (!session) {
    return Promise.reject('Bench Model - rpc() : Session not found');
  }
  if (args === undefined) {
    args = [];
  }
  if (context === undefined) {
    context = {};
  }
  return session.rpc('model.' + model + '.' + method, args, context);
}
//
function parseBenchRes(value) {
  var newlst = [];
  var ret = {};
  var lst = value.split(',');
  if (lst.length != 4) {
    return;
  }
  var removeChar = function (str, start, stop) {
    if (!stop) {
      stop = start;
    }
    if (str.startsWith(start)) {
      str = str.substr(1, str.length - 1);
    }
    if (str.endsWith(stop)) {
      str = str.substr(0, str.length - 1);
    }
    return str;
  };
  lst.forEach((str) => {
    newlst.push(removeChar(str, ' '));
  });
  ret.iter = newlst[0].split(' ')[0];
  ret.avg = newlst[1].split(' : ')[1];
  ret.min = removeChar(newlst[2].split(' ')[2], '(', ')');
  ret.max = removeChar(newlst[3].split(' ')[1], '(', ')');
  return ret;
}
var bench = {
  getAll: function (session) {
    return rpc(session, BENCH_MODEL, '_benchmark_list');
  },
  call: function (session, method, conserveData) {
    return rpc(session, BENCH_MODEL, method)
      .then((ret) => {
        if (!conserveData) {
          return parseBenchRes(ret);
        }
      });
  },
};
exports.bench = bench;
//
var db = {
  prepare: function (session) {
    return rpc(session, BENCH_MODEL, '_benchmark_setup');
  },
  cleanup: function (session) {
    return rpc(session, BENCH_MODEL, '_benchmark_teardown')
      .then(null, (err) => console.log(err));
  }
};
exports.db = db;
//
var local = {
  set: function (item, value) {
    localStorage.setItem(item, value);
  },
  get: function (item) {
    return localStorage.getItem(item);
  },
};
exports.local = local;
//
var session = {
  connect: function (server, database, username, password) {
    var session = new Session(server, database);
    return session.start(username, password)
      .then(() => session);
  },
  save: function (session) {
    return session.pack()
      .then((data) => {
        local.set('session', data);
      });
  },
  retrieve: function () {
    var data = local.get('session');
    if (data) {
      return Session.unpack(data)
        .then((session) => session.check()
          .then((ok) => ok ? session : null));
    }
    else {
      return Promise.resolve(null);
    }
  },
};
exports.session = session;
