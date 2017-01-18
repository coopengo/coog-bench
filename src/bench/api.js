var BENCH_MODEL = 'utils.benchmark_class';

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
exports.setup = function (session) {
  return session.rpc('model.' + BENCH_MODEL + '._benchmark_setup');
};
exports.teardown = function (session) {
  return session.rpc('model.' + BENCH_MODEL + '._benchmark_teardown');
};
exports.list = function (session) {
  return session.rpc('model.' + BENCH_MODEL + '._benchmark_list');
};
exports.execute = function (session, method, conserveData) {
  return session.rpc('model.' + BENCH_MODEL + '.' + method)
    .then((ret) => {
      if (!conserveData) {
        return parseBenchRes(ret);
      }
    });
};
