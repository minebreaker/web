/// <reference path="../../typings/index.d.ts" />
"use strict";
var React = require("react");
var react_router_1 = require("react-router");
var omniscient = require('omniscient');
var Header = omniscient(function () {
    return React.createElement("div", {className: "navbar navbar-default navbar-fixed-top", role: "navigation"}, React.createElement("div", {className: "container"}, React.createElement("div", {className: "navbar-header"}, React.createElement("button", {type: "button", className: "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#toggle", "aria-expanded": "false"}, React.createElement("span", {className: "sr-only"}, "Toggle navigation"), React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"})), React.createElement("a", {className: "navbar-brand"}, "Aoba")), React.createElement("div", {className: "collapse navbar-collapse", id: "toggle"}, React.createElement("ul", {className: "nav navbar-nav navbar-right"}, React.createElement("li", null, React.createElement(react_router_1.Link, {className: "navlink", to: "index"}, "Top"))))));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
