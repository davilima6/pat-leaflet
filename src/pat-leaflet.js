(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "jquery",
            "pat-base",
            "pat-registry",
            "pat-parser",
            "pat-logger"
        ], function() {
            return factory.apply(this, arguments);
        });
    } else {
        // If require.js is not available, you'll need to make sure that these
        // global variables are available.
        factory($, patterns.Base, patterns, patterns.Parser, patterns.logger);
    }
}(this, function($, Base, registry, Parser, logger) {
    "use strict";

    var log = logger.getLogger("pat-leaflet");
    log.debug("pattern loaded");

    var parser = new Parser("leaflet");
    /* If you'd like your pattern to be configurable via the
     * data-pat-leaflet attribute, then you need to
     * specify the available arguments here, by calling parser.addArgument.
     *
     * The addArgument method takes the following parameters:
     *  - name: The required name of the pattern property which you want to make
     *      configurable.
     *  - default_value: An optional default string value of the property if the user
     *      doesn't provide one.
     *  - choices: An optional set (Array) of values that the property might take.
     *      If specified, values outside of this set will not be accepted.
     *  - multiple: An optional boolean value which specifies wether the
     *      property can be multivalued or not.
     *
     *  For example:
     *      parser.addArgument('color', 'blue', ['red', 'green', 'blue'], false);
     */
    parser.addArgument("text", "Patternslib pat-leaflet demo with default options.");

    return Base.extend({
        name: "leaflet",
        trigger: ".pat-leaflet",

        init: function initUndefined () {
            this.options = parser.parse(this.$el);
            this.$el.html(this.options.text);
            log.debug("pattern initialized");
        }
    });
}));
