(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "jquery",
            "pat-base",
            "pat-registry",
            "pat-parser",
            "pat-logger",
            "leaflet",
            "L.fullscreen",
            "L.providers",
            "L.geosearch",
            "L.geosearch.esri",
            "L.markercluster",
            "L.awesomemarkers"
        ], function() {
            return factory.apply(this, arguments);
        });
    } else {
        // If require.js is not available, you'll need to make sure that these
        // global variables are available.
        factory($, patterns.Base, patterns, patterns.Parser, patterns.logger,
            patterns.Leaflet, patterns.L.fullscreen, patterns.L.providers,
            patterns.L.geosearch, patterns.L.geosearch.esri,
            patterns.L.markercluster, patterns.L.awesomemarkers);
    }
}(this, function($, Base, registry, Parser, logger, L) {
    "use strict";

    var log = logger.getLogger("pat-leaflet");
    log.debug("pattern loaded");

    var parser = new Parser("leaflet");

    parser.addArgument("fullscreencontrol", true);
    parser.addArgument("image_path", "src/bower_components/Leaflet.awesome-markers/dist/images");

    parser.addArgument("editable", false);
    parser.addArgument("input_latitude_selector", undefined);
    parser.addArgument("input_longitude_selector", undefined);

    return Base.extend({
        name: "leaflet",
        trigger: ".pat-leaflet",
        map: undefined,

        init: function initUndefined () {
            this.options = parser.parse(this.$el);

            var baseLayers,
                geopoints,
                markers,
                bounds,
                geosearch;

            // MAP INIT
            this.map = new L.Map(this.$el[0], {
                fullscreenControl: this.options.fullscreencontrol
            });

            L.Icon.Default.imagePath = this.options.image_path;

            // Layers
            baseLayers = {
                "Map": L.tileLayer.provider("OpenStreetMap.Mapnik"),
                "Satellite": L.tileLayer.provider("Esri.WorldImagery"),
                "Topographic": L.tileLayer.provider("OpenTopoMap"),
                "Toner": L.tileLayer.provider("Stamen.Toner")
            };
            baseLayers.Map.addTo(this.map); // default map
            L.control.layers(baseLayers).addTo(this.map);

            // ADD MARKERS
            geopoints = this.$el.data().geopoints;
            if (geopoints) {
                markers = this.create_markers(geopoints, this.options.editable);
                this.map.addLayer(markers);

                // autozoom
                bounds = markers.getBounds();
                this.map.fitBounds(bounds);
            }

            if (this.options.editable) {
                this.map.on("geosearch_showlocation", function(e) {
                    if (markers) {
                        this.map.removeLayer(markers);
                    }
                    var coords = e.Location;
                    this.update_inputs(coords.Y, coords.X);
                    this.bind_draggable_marker(e.Marker);
                });

                // GEOSEARCH
                geosearch = new L.Control.GeoSearch({
                    showMarker: true,
                    draggable: this.options.editable,
                    provider: new L.GeoSearch.Provider.Esri()
                    //provider: new L.GeoSearch.Provider.Google()
                    //provider: new L.GeoSearch.Provider.OpenStreetMap()
                });
                geosearch.addTo(this.map);
            }

            log.debug("pattern initialized");
        },

        green_marker: L.AwesomeMarkers.icon({
            markerColor: "green"
        }),

        update_inputs: function(lat, lng) {
            $(this.options.input_latitude_selector).attr("value", lat);
            $(this.options.input_longitude_selector).attr("value", lng);
        },

        bind_draggable_marker: function(marker) {
            marker.on("dragend", function(e) {
                var coords = e.target.getLatLng();
                this.update_inputs(coords.lat, coords.lng);
            });
        },

        create_markers: function(geopoints, editable) {
            // return MarkerClusterGroup from geopoints
            // geopoints = [{lat: NUMBER, lng: NUMBER, popup: STRING}]
            var markers = new L.MarkerClusterGroup();
            for (var i = 0, size = geopoints.length; i < size; i++) {
                var geopoint = geopoints[i],
                    marker;
                marker = new L.Marker([geopoint.lat, geopoint.lng], {
                    icon: this.green_marker,
                    draggable: editable
                });
                if (geopoint.popup) {
                    marker.bindPopup(geopoint.popup);
                }
                if (editable) {
                    this.bind_draggable_marker(marker);
                }
                markers.addLayer(marker);
            }
            return markers;
        }

    });
}));
