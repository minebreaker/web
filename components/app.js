/// <reference path="../../typings/index.d.ts" />
"use strict";
var React = require("react");
var header_1 = require("./header");
var footer_1 = require("./footer");
var omniscient = require('omniscient');
var App = omniscient(function (props) {
    return React.createElement("div", null, React.createElement(header_1.default, null), React.createElement("div", null, props.children), React.createElement(footer_1.default, null));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
