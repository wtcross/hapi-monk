"use strict";
var monk       = require("monk");
var expect     = require("chai").expect;
var sinon      = require("sinon");
var _          = require("lodash");
var proxyquire = require("proxyquire").noCallThru();

describe("The hapi-monk plugin", function () {
	var plugin;
	var expose;
	var hapiMonk;

	before(function () {
		monk = sinon.stub();

		expose = sinon.stub();
		plugin = {
			expose : expose
		};

		hapiMonk = proxyquire("..", {
			"monk" : monk
		});
	});

	describe("attributes", function () {
		var attributes;

		before(function () {
			attributes = hapiMonk.register.attributes;
		});

		it("has the correct name", function () {
			expect(attributes.name, "wrong name").to.equal("hapi-monk");
		});

		it("has the correct version", function () {
			var version = require("../package.json").version;
			expect(attributes.version, "wrong version").to.equal(version);
		});
	});

	describe("being registered", function () {
		var db = {
			one     : function () {},
			two     : function () {},
			options : {}
		};

		before(function () {
			monk.returns(db);
		});

		after(function () {
			monk.reset();
		});

		describe("without a url specified", function () {
			before(function (done) {
				hapiMonk.register(plugin, {}, done);
			});

			after(function () {
				monk.reset();
				expose.reset();
			});

			it("uses the correct default URL", function () {
				expect(monk.calledOnce, "monk not called").to.be.true;
				expect(monk.calledWith("mongodb://localhost:27017"), "wrong url").to.be.true;
			});
		});

		describe("with a url specified", function () {
			var result;
			var url = "foo";

			before(function (done) {
				result = hapiMonk.register(plugin, { url : url }, done);
			});

			after(function () {
				expose.reset();
			});

			it("uses the url", function () {
				expect(monk.calledOnce, "monk not called").to.be.true;
				expect(monk.calledWith(url), "wrong url").to.be.true;
			});

			it("exposes the database options", function () {
				expect(plugin.expose.calledWith("options"), "not exposed").to.be.true;
			});

			it("exposes methods present on database object returned", function () {
				_.forEach(_.methods(db), function (method) {
					expect(plugin.expose.calledWith(method), "db method `" + method + "` not exposed").to.be.true;
				});
			});
		});
	});
});