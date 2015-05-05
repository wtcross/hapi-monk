"use strict";
var Bluebird = require("bluebird");
var monk     = require("monk");
var _        = require("lodash");

exports.register = function (plugin, options, done) {
	options.url = options.url || "mongodb://localhost:27017";

	var db = monk(options.url);

	Bluebird.promisifyAll(db);

	plugin.expose("options", db.options);

	_.forEach(_.methods(db), function (method) {
		plugin.expose(method, db[method].bind(db));
	});

	done();
};

exports.register.attributes = {
	pkg : require("./package.json")
};
