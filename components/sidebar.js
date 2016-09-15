/// <reference path="../../typings/index.d.ts" />
"use strict";
var React = require("react");
var react_router_1 = require("react-router");
var omniscient = require('omniscient');
var Sidebar = omniscient(function () {
    return React.createElement("div", {className: "col-md-2 hidden-xs hidden-sm", role: "navigation"}, React.createElement("div", {className: "container affix"}, React.createElement("p", null, React.createElement(react_router_1.Link, {to: "/index"}, "Top")), React.createElement("p", null, React.createElement(react_router_1.Link, {to: "/sample"}, "Sample"))));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
