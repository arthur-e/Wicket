Wkt.Wkt.prototype.isRectangle = false;

Wkt.Wkt.prototype.construct = {
    point: function (config, component) {
        var coord = component || this.components;
        if (coord instanceof Array) {
            coord = coord[0];
        }

        return L.marker(this.coordsToLatLng(coord), config);
    },

    multipoint: function (config) {
        var layers = [],
            coords = this.components,
            latlng;

        for (var i = 0, len = coords.length; i < len; i++) {
            layers.push(this.construct.point.call(this, config, coords[i]));
        }

        return L.featureGroup(layers, config);
    },

    linestring: function (config, component) {
        var coords = component || this.components,
            latlngs = this.coordsToLatLngs(coords);

        return L.polyline(latlngs, config);
    },

    multilinestring: function (config) {
        var coords = this.components,
            latlngs = this.coordsToLatLngs(coords, 1);

        return L.multiPolyline(latlngs, config);
    },

    polygon: function (config) {
        var coords = this.components,
            latlngs = this.coordsToLatLngs(coords, 1);
        return L.polygon(latlngs, config);
    },

    multipolygon: function (config) {
        var coords = this.components,
            latlngs = this.coordsToLatLngs(coords, 2);

        return L.multiPolygon(latlngs, config);
    }
};

L.Util.extend(Wkt.Wkt.prototype, {
    coordsToLatLngs: L.GeoJSON.coordsToLatLngs,
    coordsToLatLng: function (coords, reverse) {
        var lat = reverse ? coords.x : coords.y,
            lng = reverse ? coords.y : coords.x;

        return L.latLng(lat, lng, true);
    }
});
