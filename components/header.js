/// <reference path="../../typings/index.d.ts" />
"use strict";
var React = require("react");
var react_router_1 = require("react-router");
var omniscient = require('omniscient');
var Header = omniscient(function () {
    return React.createElement("div", {className: "navbar navbar-default navbar-fixed-top", role: "navigation"}, React.createElement("div", {className: "container"}, React.createElement("div", {className: "navbar-header"}, React.createElement("a", {className: "navbar-brand"}, "Aoba")), React.createElement("p", {className: "navbar-text navbar-right"}, React.createElement(react_router_1.Link, {to: "index"}, "Top"))));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
