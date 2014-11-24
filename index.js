"use strict";
var monk    = require("monk");
var _       = require("lodash");

exports.register = function (plugin, options, done) {
	options.url = options.url || "mongodb://localhost:27017";

	var db = monk(options.url);

	plugin.expose("options", db.options);

	_.forEach(_.methods(db), function (method) {
		plugin.expose(method, db[method]);
	});

	done();
};

exports.register.attributes = {
	pkg : require("./package.json")
};
