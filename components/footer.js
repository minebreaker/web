/// <reference path="../../typings/index.d.ts" />
"use strict";
var React = require('react');
var omniscient = require('omniscient');
var Footer = omniscient(function () {
    return React.createElement("div", {className: "navbar navbar-default navbar-fixed-bottom", role: "navigation"}, React.createElement("div", {className: "container"}, React.createElement("p", {className: "navbar-text"}, "Aoba 0.1.0 alpha"), React.createElement("p", {className: "navbar-text navbar-right"}, "Made with ", React.createElement("span", {className: "glyphicon glyphicon-heart", "aria-hidden": "true"}), " by", React.createElement("a", {className: "navlink", href: "https://bitbucket.org/minebreaker_tf/aoba", target: "blank"}, " Aoba"))));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Footer;
