(function ($, window) {
    'use strict';

    var getRandom = function (min, max) {
        return Math.floor( Math.random() * (max - min + 1) ) + min;
    };

    var oldest = new Date(1989, 3, 16).getTime(); // 16 Apl. 1989

    var genearteUrl = function (date) {
        return 'http://dilbert.com/strip/' +
            date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' +
            date.getDate();
    };

    $(function () {
        var app = $('#app');

        app.append(
            $('<button/>', {
                id: 'regenerator',
                text: 'click'
            }));

        $('#regenerator').on({
            'click': function () {
                var date = new Date(getRandom(oldest, Date.now()));
                window.open(genearteUrl(date), '_blank')
            }
        });

    });

}(window.jQuery, window));
