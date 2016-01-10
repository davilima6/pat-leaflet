(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "jquery",
            "pat-base",
            "pat-registry",
            "pat-parser",
            "pat-logger",
            "Leaflet",
        ], function() {
            return factory.apply(this, arguments);
        });
    } else {
        // If require.js is not available, you'll need to make sure that these
        // global variables are available.
        factory($, patterns.Base, patterns, patterns.Parser, patterns.logger); // jshint ignore:line
    }
}(this, function($, Base, registry, Parser, logger, L) {
    "use strict";

    var log = logger.getLogger("pat-leaflet");
    log.debug("pattern loaded");

    var parser = new Parser("leaflet");
    parser.addArgument("mapcenterlat", "50.636");
    parser.addArgument("mapcenterlon", "5.566");
    parser.addArgument("mapzoom", "13");

    return Base.extend({
        name: "leaflet",
        trigger: ".pat-leaflet",

        init: function initUndefined () {
            this.options = parser.parse(this.$el);
            var map = new L.map(this.$el[0]);
            map.setView([this.options.mapcenterlat, this.options.mapcenterlon], this.options.mapzoom);

            L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            }).addTo(map);

            this.$el.html(this.options.text);
            log.debug("pattern initialized");
        }
    });
}));
