/// <reference path="../typings/index.d.ts" />
/// <reference path="../src/omniscient.d.ts" />
"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var react_router_1 = require("react-router");
var app_1 = require("./components/app");
var body_1 = require("./components/body");
ReactDOM.render(React.createElement(react_router_1.Router, {history: react_router_1.hashHistory}, React.createElement(react_router_1.Route, {path: "/", component: app_1.default}, React.createElement(react_router_1.IndexRedirect, {from: "/", to: "/index"}), React.createElement(react_router_1.Route, {path: "/:content", component: body_1.default}))), document.getElementById('aoba-main'));
