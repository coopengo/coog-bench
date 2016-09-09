/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var Marionette = __webpack_require__(2);
	var login = __webpack_require__(3);
	var bench = __webpack_require__(9);
	var form = __webpack_require__(19);
	var api = __webpack_require__(7);
	//
	var App = Marionette.Application.extend({
	  region: '#bench-root',
	  initialize: function () {
	    this.router = new Marionette.AppRouter();
	    this.router.processAppRoutes(this, {
	      'login': 'showLogin',
	      '': 'showBench'
	    });
	  },
	  onStart: function (app, options) {
	    form.setTemplates();
	    this.session = options.session;
	    Backbone.history.start();
	  },
	  onConnect: function (session) {
	    this.session = session;
	    api.session.save(session);
	    this.router.navigate('', {
	      trigger: true
	    });
	  },
	  showLogin: function () {
	    var model = new login.Model();
	    this.listenTo(model, 'connect:ok', (session) => {
	      this.triggerMethod('connect', session);
	    });
	    this.showView(new login.View({
	      model: model
	    }));
	  },
	  showBench: function () {
	    if (this.session) {
	      this.showView(new bench.View({
	        session: this.session
	      }));
	    }
	    else {
	      this.router.navigate('login', {
	        trigger: true,
	      });
	    }
	  }
	});
	//
	var app = new App();
	//
	api.session.retrieve()
	  .then((session) => app.start({
	    session: session
	  }));
	module.exports = app;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = Backbone;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = Backbone.Marionette;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var Marionette = __webpack_require__(2);
	var loginTpl = __webpack_require__(4);
	var loginFormTpl = __webpack_require__(5);
	var loginErrorTpl = __webpack_require__(6);
	var api = __webpack_require__(7);
	//
	exports.Model = Backbone.Model.extend({
	  schema: {
	    server: {
	      type: 'Text',
	      validators: ['required']
	    },
	    database: {
	      type: 'Text',
	      validators: ['required']
	    },
	    username: {
	      type: 'Text',
	      validators: ['required']
	    },
	    password: {
	      type: 'Password',
	      validators: ['required']
	    }
	  },
	  initialize: function () {
	    this.set('server', 'http://localhost:7999');
	  },
	  connect: function () {
	    api.session.connect(this.get('server'), this.get('database'), this.get(
	        'username'), this.get('password'))
	      .then((session) => {
	        this.trigger('connect:ok', session);
	      }, (error) => {
	        this.trigger('connect:ko', error);
	      });
	  }
	});
	//
	var LoginForm = Backbone.Form.extend({
	  template: loginFormTpl
	});
	var LoginError = Marionette.View.extend({
	  template: loginErrorTpl
	});
	exports.View = Marionette.View.extend({
	  className: 'pure-g',
	  template: loginTpl,
	  regions: {
	    form: '#login-form',
	    error: '#login-error'
	  },
	  ui: {
	    connect: 'button'
	  },
	  triggers: {
	    'click @ui.connect': 'connect'
	  },
	  onRender: function () {
	    var form = new LoginForm({
	      model: this.model
	    });
	    this.on('connect', () => {
	      var errors = form.commit({
	        validate: true
	      });
	      if (!errors) {
	        this.model.connect();
	      }
	    });
	    this.listenTo(this.model, 'connect:ko', (error) => {
	      var v = new LoginError({
	        model: new Backbone.Model({
	          message: error
	        })
	      });
	      this.showChildView('error', v);
	    });
	    this.showChildView('form', form);
	  }
	});


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="pure-u-1-3"> </div>\n<div id="login-form" class="pure-u-1-3"> </div>\n<div class="pure-u-1-3"> </div>\n';

	}
	return __p
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<form class="pure-form pure-form-aligned">\n  <fieldset>\n    <div class="pure-control-group" data-fields="server"></div>\n    <div class="pure-control-group" data-fields="database"></div>\n    <div class="pure-control-group" data-fields="username"></div>\n    <div class="pure-control-group" data-fields="password"></div>\n    <div id="login-error"></div>\n    <div class="pure-controls"><button type="submit" class="pure-button pure-button-primary">Connect</button></div>\n  </fieldset>\n</form>\n';

	}
	return __p
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<p>\n  ' +
	((__t = ( message )) == null ? '' : __t) +
	'\n</p>\n';

	}
	return __p
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Session = __webpack_require__(8);
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = Session;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var view = __webpack_require__(10);
	exports.View = view.main;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Marionette = __webpack_require__(2);
	var benchCollection = __webpack_require__(11);
	var tableTpl = __webpack_require__(14);
	var rowTpl = __webpack_require__(15);
	var mainTpl = __webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	//
	var row = Marionette.View.extend({
	  tagName: 'tr',
	  className: 'bench-body',
	  template: rowTpl,
	  ui: {
	    button: '.benchmark-selector-btn',
	    row: '',
	  },
	  modelEvents: {
	    'change:enable': 'actEnableChange',
	    'change:status': 'render'
	  },
	  events: {
	    'click @ui.button': 'handleButtonClick',
	    'click @ui.row': 'handleButtonClick',
	  },
	  triggers: {
	    'click @ui.button': 'clicked',
	  },
	  handleButtonClick: function () {
	    this.model.toggle();
	  },
	  actEnableChange: function (model, val) {
	    if (val) {
	      this.$el.removeClass('bench-disable');
	    }
	    else {
	      this.$el.addClass('bench-disable');
	    }
	    this.render();
	  },
	  switchClass: function (cls) {
	    this.$el.removeClass('body-ready');
	    this.$el.removeClass('body-loaded');
	    this.$el.removeClass('body-loading');
	    this.$el.addClass(cls);
	  },
	  onRender: function () {
	    switch (this.model.get('status')) {
	    case 'working':
	      this.switchClass('body-loading');
	      break;
	    case 'done':
	      this.switchClass('body-loaded');
	      break;
	    case 'prepared':
	      this.switchClass('body-ready');
	      break;
	    }
	    return this;
	  }
	});
	exports.row = row;
	//
	var TableBody = Marionette.CollectionView.extend({
	  tagName: 'tbody',
	  childView: row,
	  childViewEventPrefix: 'bench',
	});
	//
	var table = Marionette.View.extend({
	  tagName: 'div',
	  className: 'pure-g',
	  template: tableTpl,
	  ui: {
	    checkbox: '.bench-all-checkbox',
	    button: '#start-btn'
	  },
	  regions: {
	    body: {
	      el: 'tbody',
	      replaceElement: true
	    }
	  },
	  events: {
	    'click @ui.checkbox': 'handleCheckboxClick',
	    'click @ui.button': 'handleButtonClick'
	  },
	  childViewEvents: {
	    'bench:clicked': 'updateCheckbox'
	  },
	  initialize: function () {
	    this.benchRunning = false;
	    this.timedout = false;
	  },
	  updateCheckbox: function () {
	    var checked = !this.collection.getModulesDisabled()
	      .length;
	    this.getUI('checkbox')[0].checked = checked;
	  },
	  onRender: function () {
	    this.showChildView('body', new TableBody({
	      collection: this.collection
	    }));
	    var checked = !this.collection.getModulesDisabled()
	      .length;
	    this.getUI('checkbox')[0].checked = checked;
	  },
	  handleCheckboxClick: function () {
	    var state = this.getUI('checkbox')[0].checked;
	    this.collection.each((bench) => {
	      bench.enable(state);
	    });
	  },
	  handleButtonClick: function () {
	    this.collection.preBench();
	  },
	});
	exports.table = table;
	//
	exports.main = Marionette.View.extend({
	  template: mainTpl,
	  regions: {
	    'lst': '#benchList'
	  },
	  initialize: function (options) {
	    this.collection = new benchCollection(null, {
	      session: options.session
	    });
	    this.collection.initBenchs();
	    this.tableView = new table({
	      collection: this.collection
	    });
	  },
	  onRender: function () {
	    this.showChildView('lst', this.tableView);
	  },
	});


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var _ = __webpack_require__(12);
	var model = __webpack_require__(13);
	var api = __webpack_require__(7);
	//
	module.exports = Backbone.Collection.extend({
	  model: model.bench,
	  initialize: function (attrs, options) {
	    this.session = options.session;
	    this.benchRunning = false;
	  },
	  getModulesDisabled: function () {
	    return this.where({
	      enable: false
	    });
	  },
	  getModulesEnabled: function () {
	    return this.where({
	      enable: true
	    });
	  },
	  getModulesUsingDB: function () {
	    return this.where({
	      useDB: true,
	      enable: true
	    });
	  },
	  initBenchs: function () {
	    var newBench = (desc) => {
	      var cls = desc[1].server_side ? model.bench : model.custom;
	      var bench = new cls({
	        title: desc[1].name,
	        method: desc[0],
	        useDB: desc[1].requires_setup
	      }, {
	        'session': this.session
	      });
	      this.add(bench);
	    };
	    api.bench.getAll(this.session)
	      .then((ret) => {
	        ret.methods.forEach(newBench);
	      });
	  },
	  preBench: function () {
	    var benchLst = this.getModulesEnabled();
	    if (!benchLst) {
	      console.log('Nothing to bench');
	      return Promise.resolve;
	    }
	    if (!this.session) {
	      console.log('Invalid session');
	      return Promise.resolve;
	    }
	    if (this.benchRunning) {
	      console.log('Bench already started');
	      return Promise.resolve;
	    }
	    this.benchRunning = true;
	    this.startBench(benchLst)
	      .then(() => {
	        this.benchRunning = false;
	      }, (err) => {
	        console.log('bench failed');
	        if (err) {
	          console.log(err);
	        }
	      });
	  },
	  handleError: function (err) {
	    if (!err) {
	      return Promise.reject();
	    }
	    if (err[0] == '403: Forbidden') {
	      console.log('Timedout');
	      this.trigger('timedout');
	    }
	    else if (err[0].startsWith('Benchmark table already ')) {
	      // non bloking exception
	      return;
	    }
	    console.log('bench KO', err);
	    return Promise.reject();
	  },
	  startBench: function (benchLst) {
	    var prm = Promise.resolve();
	    var setupDB = false;
	    // check if database must be prepared
	    if (this.getModulesUsingDB()
	      .length) {
	      setupDB = true;
	      prm = api.db.prepare(this.session)
	        .then(null, this.handleError);
	    }
	    // start benching
	    prm = _.reduce(benchLst, (memo, bench) => {
	      bench.reset();
	      return memo.then(
	        () => {
	          return bench.callBench()
	            .then(null, this.handleError);
	        }, this.handleError);
	    }, prm);
	    // clean database if prepared
	    if (setupDB) {
	      prm = prm.then(
	        () => {
	          return api.db.cleanup(this.session);
	        }, () => {
	          return Promise.reject();
	        });
	    }
	    return prm;
	  },
	});


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = _;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var api = __webpack_require__(7);
	//
	var bench = Backbone.Model.extend({
	  defaults: function () {
	    return {
	      title: 'no title',
	      method: 'no method',
	      enable: true,
	      useDB: true,
	    };
	  },
	  initialize: function (attributes, options) {
	    this.reset();
	    this.session = options.session;
	  },
	  reset: function () {
	    this.set({
	      status: 'prepared',
	      score: '- -',
	      iter: '-',
	      avg: '--',
	      min: '--',
	      max: '--'
	    });
	  },
	  toggle: function () {
	    if (this.collection.benchRunning) {
	      console.log('bench is running');
	    }
	    else {
	      this.set({
	        enable: !this.get('enable')
	      });
	    }
	  },
	  enable: function (val) {
	    if (this.collection.benchRunning) {
	      console.log('bench is running');
	    }
	    else {
	      this.set('enable', val);
	    }
	  },
	  callBench: function () {
	    this.set('status', 'working');
	    return api.bench.call(this.session, this.get('method'))
	      .then(
	        (ret) => {
	          if (ret) {
	            this.set(ret);
	            this.set('status', 'done');
	          }
	        }, (err) => {
	          this.set('status', 'prepared');
	          return Promise.reject(err);
	        });
	  },
	});
	exports.bench = bench;
	//
	var custom = bench.extend({
	  callBench: function () {
	    var prm = Promise.resolve();
	    var iter = 100;
	    var times = [];
	    var start, end;
	    this.set('status', 'working');
	    var throwError = function (err) {
	      this.set('status', 'prepared');
	      return Promise.reject(err);
	    };
	    var newCall = () => {
	      start = (new Date())
	        .getTime();
	      return api.bench.call(this.session, this.get('method'), true)
	        .then(() => {
	          end = (new Date())
	            .getTime();
	          times.push(((end - start) / 1000));
	        }, throwError);
	    };
	    for (var i = iter; i > 0; i--) {
	      prm = prm.then(newCall);
	    }
	    return prm.then(() => {
	      times.sort();
	      var min = times.shift();
	      var max = times.pop();
	      var avg = times.reduce((a, b) => a + b) / times.length;
	      this.set({
	        status: 'done',
	        iter: iter,
	        avg: avg.toFixed(5),
	        min: min.toFixed(5),
	        max: max.toFixed(5)
	      });
	    });
	  }
	});
	exports.custom = custom;


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="pure-u-1">\n  <table class="pure-table pure-table-horizontal bench-table">\n    <thead>\n      <tr>\n        <th class="align-center bench-all-checkbox-container"> <input class="bench-all-checkbox" id="table-checkbox" type="checkbox" name="enable">          </th>\n        <th class="align-center"></th>\n        <th class="align-center">Iteration</th>\n        <th class="align-center">Average</th>\n        <th class="align-center">Minimum</th>\n        <th class="align-center">Maximum</th>\n        <!-- <th class="align-center" >Score</th> -->\n      </tr>\n    </thead>\n    <tbody id="bench-container"></tbody>\n  </table>\n</div>\n<div class="pure-u-1"> <button class="pure-button" id="start-btn">Start Bench</button> </div>\n';

	}
	return __p
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
	function print() { __p += __j.call(arguments, '') }
	with (obj) {
	__p += '<td class="bench-checkbox-container align-center">\n  ';
	 if (enable == false) { ;
	__p += ' <button class="pure-button benchmark-selector-btn bench-selector-ko"><span>&nbsp;</span></button>\n    ';
	 } else { ;
	__p += ' <button class="pure-button benchmark-selector-btn bench-selector-ok"><span>&nbsp;</span></button>\n      ';
	 } ;
	__p += '\n</td>\n<td class="">\n  ' +
	__e( title ) +
	'\n</td>\n<td class="align-center">\n  ' +
	__e( iter ) +
	'\n</td>\n<td class="align-center">\n  ' +
	__e( avg ) +
	'\n</td>\n<td class="align-center">\n  ' +
	__e( min ) +
	'\n</td>\n<td class="align-center">\n  ' +
	__e( max ) +
	'\n</td>\n';

	}
	return __p
	}

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="pure-g">\n  <div class="pure-u-1 pure-u-md-1-6 pure-u-lg-1-4"></div>\n  <div class="pure-u-1 pure-u-md-1-6 pure-u-lg-1-2">\n    <div id="benchList"></div>\n  </div>\n  <div class="pure-u-1 pure-u-md-1-6 pure-u-lg-1-4"></div>\n</div>\n';

	}
	return __p
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 18 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var B = __webpack_require__(1);
	var formFieldTpl = __webpack_require__(20);
	__webpack_require__(21);
	//
	exports.setTemplates = function () {
	  B.Form.Field.template = formFieldTpl;
	  B.Form.Field.errorClassName = 'bench-field-error';
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
	function print() { __p += __j.call(arguments, '') }
	with (obj) {
	__p += '<div class="form-control-group field-' +
	((__t = ( key )) == null ? '' : __t) +
	'"> <label for="' +
	((__t = ( editorId )) == null ? '' : __t) +
	'">\n    ';
	 if (titleHTML){ ;
	__p +=
	((__t = ( titleHTML )) == null ? '' : __t) +
	'\n    ';
	 } else { ;
	__p +=
	__e( title );
	 } ;
	__p += '\n  </label> <span data-editor></span> <span data-error></span></div>\n';

	}
	return __p
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);