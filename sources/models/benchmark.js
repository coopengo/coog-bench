// [Model]  Bench

var $       = require('jquery'),
  Backbone  = require('backbone');
Backbone.$  = $;

var BENCH_MODEL = 'utils.benchmark_class';
var Notificator = require('../collections/notification');

module.exports = Backbone.Model.extend({
  defaults: function() {
    // status : created, started, loading, done
    return {
      title     : 'no title',
      method    : 'no method',
      enable    : true,
      use_db    : true,
      custom    : false,
      score     : '',
      status    : 'created',
      iter      : '',
      avg       : '',
      min       : '',
      max       : ''
    };
  },
  toggle: function() {
    this.save({enable: !this.get('enable')});
  },
  set_session: function(session) {
    this.session = session;
  },
  call_bench: function() {
    Notificator.new_notif(this.attributes.title + ' benchmarking started..');
    this.save({status: 'loading'});

    return this.rpc(this.session, BENCH_MODEL, this.attributes.method)
      .then((result) => {
        var attr = this.read_result(result);
        if (attr) {
            this.save(attr);
            this.save({status: 'done'});
        }
      });

  },
  rpc: function (session, model_name, method_name, args, context) {
    if (!session){
    Notificator.new_notif('no session setted in Bench Model', 'error');
      return;
    }
    if (args === undefined) {
      args = [];
    }
    if (context === undefined) {
      context = {};
    }
    return session.rpc('model.' + model_name + '.' + method_name, args, context);
  },

  read_result: function(value) {
    var newlst = [];
    var ret = {};
    var lst = value.split(',');
    if (lst.length != 4){ return; }

    var remove_char = function(str, start, stop) {
        if (!stop) {stop = start;}
        if (str.startsWith(start)) { str = str.substr(1, str.length -1);}
        if (str.endsWith(stop)) { str = str.substr(0, str.length -1);}
        return str;
    };

    lst.forEach((str) => {
        newlst.push(remove_char(str, ' '));
    });
    // iterations
    ret.iter = newlst[0].split(' ')[0];
    // avg
    ret.avg = newlst[1].split(' : ')[1];
    // min
    ret.min = remove_char(newlst[2].split(' ')[2], '(', ')');
    // max
    ret.max = remove_char(newlst[3].split(' ')[1], '(', ')');

    return ret;
  },
});
