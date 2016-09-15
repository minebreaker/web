/// <reference path="../../typings/index.d.ts" />
/// <reference path="../marked.d.ts" />
"use strict";
var React = require("react");
var sidebar_1 = require("./sidebar");
var queryContent_1 = require("../queryContent");
var omniscient = require('omniscient');
var marked = require('marked');
var Body = omniscient(function (props) {
    var content = queryContent_1.default(props.params.content);
    return React.createElement("div", {className: "container"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-10"}, React.createElement("h1", null, content.settings.title), React.createElement("div", {dangerouslySetInnerHTML: { __html: marked(content.content) }})), React.createElement(sidebar_1.default, null)));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Body;
