/**
 * Created by oleg on 15.09.2015.
 */

/*global jQuery, document, console*/
(function ($) {
    "use strict";

    $.fn.textstroke = function (options) {

        var settings = $.extend({
                strokeColor : '#000',   // цвет линии
                textColor   : true,     // цвет текста
                size        : 1,        // размер линии (преобразуется к float)
                steps       : 24,       // кол-во генерируемых слоев
                limit       : 1e-6,     // минимальный порог для координат,
                native      : false     // если true то для WebKit подобных браузеров будет использоваться webkitTextStroke
            }, options),

            keyCache,
            strokeCache = {},

            el = document.createElement('div'),
            strokeSupport = (el.style.webkitTextStroke !== undefined) && settings.native,

            getStroke = function (key) {
                var rules = [], i, x, y,
                    angle = 2 * Math.PI,
                    angleOffset = angle / settings.steps;

                if (!strokeCache[key]) {

                    for (i = 0; i <= angle; i += angleOffset) {
                        x = settings.size * Math.cos(i);
                        y = settings.size * Math.sin(i);

                        x = (Math.abs(x) < settings.limit) ? '0' : x.toString();
                        y = (Math.abs(y) < settings.limit) ? '0' : y.toString();

                        rules.push(x + "px " + y + "px 0px " + settings.strokeColor);
                    }

                    strokeCache[key] = rules.join();
                }

                return strokeCache[key];
            };

        settings.size = parseFloat(settings.size);
        keyCache = settings.strokeColor + '_' + settings.size + '_' + settings.steps;


        return this.each(function () {

            if (strokeSupport) {
                $(this).css('-webkit-text-stroke', settings.size + 'px ' + settings.strokeColor);
            } else {
                $(this).css('textShadow', getStroke(keyCache));
            }

            if (settings.textColor) {
                $(this).css('color', settings.textColor);
            }

        });
    };

}(jQuery));