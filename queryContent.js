/// <reference path="../typings/index.d.ts" />
/// <reference path="./jquery.d.ts" />
"use strict";
var $ = require('jquery');
function queryContent(param) {
    var path = param.replace(".", "/");
    var prefix = 'content/';
    var content;
    try {
        var settings = syncAjax(prefix + path + '.json');
        var markdown = syncAjax(prefix + path + '.md');
        content = {
            settings: settings,
            content: markdown
        };
    }
    catch (e) {
        return errorTemplate();
    }
    return content;
}
var Settings = (function () {
    function Settings(title) {
        this.title = title;
    }
    return Settings;
}());
function errorTemplate() {
    return {
        content: 'Sorry, something is wrong with the page.',
        settings: {
            title: 'Error'
        }
    };
}
/**
 * JSONの場合Objectが返るので注意
 *
 * @url url
 * @returns {any}
 */
function syncAjax(url) {
    var data = '';
    $.ajax({
        url: url,
        async: false,
        success: function (res) { return data = res; },
        error: function (res) {
            console.log('error: ' + url);
            console.log(res);
        }
    });
    return data;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = queryContent;
