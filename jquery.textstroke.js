/**
 * Created by oleg on 15.09.2015.
 */

/*global jQuery, document, window, console*/
(function ($) {
    "use strict";

    $.fn.textStroke = function (options) {

        var settings = $.extend({
                strokeColor : '#000',   // цвет линии
                textColor   : false,    // цвет текста
                textSize    : false,    // цвет текста
                size        : 1,        // размер линии (преобразуется к float)
                steps       : 24,       // кол-во генерируемых слоев
                limit       : 1e-6,     // минимальный порог для координат,
                native      : false,    // если true то для WebKit подобных браузеров будет использоваться webkitTextStroke
                svg         : true
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
        settings.svg = settings.svg && (window.SVGSVGElement !== undefined);
        keyCache = settings.strokeColor + '_' + settings.size + '_' + settings.steps;


        return this.each(function () {
            var $that = $(this),
                svgRoot,
                svgText;

            if (strokeSupport) {

                $that.css('-webkit-text-stroke', settings.size + 'px ' + settings.strokeColor);

            } else if (settings.svg) {

                svgRoot = $('<svg><text></text></svg>').css('height', settings.textSize || $that.css('font-size'));
                svgText = svgRoot.find('text');
                svgText.text($that.text());

                svgText.attr('x', 0);
                svgText.attr('y', settings.textSize || $that.css('font-size'));
                svgText.attr('class', $that.attr('class'));
                svgText.attr('font-size', settings.textSize || $that.css('font-size'));
                svgText.attr('font-weight', $that.css('font-weight'));
                svgText.attr('font-family', $that.css('font-family'));
                svgText.attr('stroke', settings.strokeColor);
                svgText.attr('stroke-width', settings.size);
                svgText.attr('fill', settings.textColor || 'none');

                // fix IE
                //svgRoot = '&nbsp;' + $('<div>').wrapInner(svgRoot).html() + '&nbsp;'

                $that.html('').append(svgRoot);

            } else {

                $that.css('textShadow', getStroke(keyCache));

            }

            if (settings.textColor && !settings.svg) {
                $that.css('color', settings.textColor);
            }

        });
    };

}(jQuery));