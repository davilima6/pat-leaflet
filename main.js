require.config({
    baseUrl: "src",
    paths: {
        "leaflet":           "bower_components/leaflet/dist/leaflet-src",
        "L.fullscreen":      "bower_components/Leaflet.fullscreen/dist/Leaflet.fullscreen",
        "L.providers":       "bower_components/leaflet-providers/leaflet-providers",
        "L.geosearch":       "bower_components/L.GeoSearch/src/js/l.control.geosearch",
        "L.geosearch.bing":  "bower_components/L.GeoSearch/src/js/l.geosearch.provider.bing",
        "L.geosearch.esri":  "bower_components/L.GeoSearch/src/js/l.geosearch.provider.esri",
        "L.geosearch.google": "bower_components/L.GeoSearch/src/js/l.geosearch.provider.google",
        "L.geosearch.openstreetmap": "bower_components/L.GeoSearch/src/js/l.geosearch.provider.openstreetmap",
        "L.markercluster":   "bower_components/leaflet.markercluster/dist/leaflet.markercluster-src",
        "L.awesomemarkers":  "bower_components/Leaflet.awesome-markers/dist/leaflet.awesome-markers",
        "L.locatecontrol":   "bower_components/leaflet.locatecontrol/src/L.Control.Locate",
        "L.minimap":         "bower_components/leaflet-MiniMap/dist/Control.MiniMap.min",
        "L.sleep":           "bower_components/Leaflet.Sleep/Leaflet.Sleep",
        // BASE DEPENDENCIES
        "jquery":            "bower_components/jquery/dist/jquery",
        "jquery.browser":    "bower_components/jquery.browser/dist/jquery.browser",
        "logging":           "bower_components/logging/src/logging",
        "pat-base":          "bower_components/patternslib/src/core/base",
        "pat-compat":        "bower_components/patternslib/src/core/compat",
        "pat-jquery-ext":    "bower_components/patternslib/src/core/jquery-ext",
        "pat-logger":        "bower_components/patternslib/src/core/logger",
        "pat-mockup-parser": "bower_components/patternslib/src/core/mockup-parser",
        "pat-parser":        "bower_components/patternslib/src/core/parser",
        "pat-registry":      "bower_components/patternslib/src/core/registry",
        "pat-utils":         "bower_components/patternslib/src/core/utils",
        "underscore":        "bower_components/underscore/underscore"

    },
    "shim": {
        "L.fullscreen": { deps: ["leaflet"] },
        "L.geosearch": { deps: ["leaflet"] },
        "L.geosearch.bing": { deps: ["L.geosearch"] },
        "L.geosearch.esri": { deps: ["L.geosearch"] },
        "L.geosearch.google": { deps: ["L.geosearch"] },
        "L.geosearch.openstreetmap": { deps: ["L.geosearch"] },
        "L.markercluster": { deps: ["leaflet"] },
        "L.awesomemarkers": { deps: ["leaflet"] },
        "L.locatecontrol": { deps: ["leaflet"] },
        "L.minimap": { deps: ["leaflet"] },
        "L.sleep": { deps: ["leaflet"] },
        "logging": { "exports": "logging" }
    },
    wrapShim: true
});

require(["jquery", "pat-registry", "pat-leaflet"], function($, registry, pattern) {
    window.patterns = registry;
    $(document).ready(function() {
        registry.init();
    });
});
