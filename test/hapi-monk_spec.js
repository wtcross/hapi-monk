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
		var pkg = require("../package.json");

		before(function () {
			attributes = hapiMonk.register.attributes;
		});

		it("has pkg", function () {
			expect(attributes.pkg, "not an object").to.be.an("object");
			expect(attributes.pkg, "not right package").to.equal(pkg);
		});
	});

	describe("being registered", function () {
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
			var db = {
				one : function () {},
				two : function () {}
			};

			before(function (done) {
				monk.returns(db);

				result = hapiMonk.register(plugin, { url : url }, done);
			});

			after(function () {
				monk.reset();
				expose.reset();
			});

			it("uses the url", function () {
				expect(monk.calledOnce, "monk not called").to.be.true;
				expect(monk.calledWith(url), "wrong url").to.be.true;
			});

			it("exposes methods present on database object returned", function () {
				_.forEach(_.methods(db), function (method) {
					expect(plugin.expose.calledWith(method), "db method `" + method + "` not exposed").to.be.true;
				});
			});
		});
	});
});