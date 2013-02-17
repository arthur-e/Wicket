/*global L, Wkt, console*/
Wkt.Wkt.prototype.isRectangle = false;

/**
 * Accepts an Array (arr) of LatLngs from which it extracts each one as a
 *  vertex; calls itself recursively to deal with nested Arrays.
 */
Wkt.coordsFromLatLngs = function (arr) {
    var i, j, coords;

    coords = [];
    for (i = 0; i < arr.length; i += 1) {
        if (Wkt.isArray(arr[i])) {
            coords.push(this.coordsFromLatLngs(arr[i]));

        } else {
            coords.push({
                x: arr[i].lng,
                y: arr[i].lat
            });
        }
    }

    return coords;
};

/**
 * An object of framework-dependent construction methods used to generate
 * objects belonging to the various geometry classes of the framework.
 */
Wkt.Wkt.prototype.construct = {
    point: function (config, component) {
        var coord = component || this.components;
        if (coord instanceof Array) {
            coord = coord[0];
        }

        return L.marker(this.coordsToLatLng(coord), config);
    },

    multipoint: function (config) {
        var i,
            layers = [],
            coords = this.components,
            latlng;

        for (i = 0; i < coords.length; i += 1) {
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
    // TODO Take one fewer vertices, as Leaflet does not expect a closing vertex
    //  (which in WKT is the first vertex repeated)
    coordsToLatLngs: L.GeoJSON.coordsToLatLngs,
    // TODO Why doesn't the coordsToLatLng function in L.GeoJSON already suffice?
    coordsToLatLng: function (coords, reverse) {
        var lat = reverse ? coords.x : coords.y,
            lng = reverse ? coords.y : coords.x;

        return L.latLng(lat, lng, true);
    }
});

/**
 * A framework-dependent deconstruction method used to generate internal
 * geometric representations from instances of framework geometry. This method
 * uses object detection to attempt to classify members of framework geometry
 * classes into the standard WKT types.
 * @param   obj {Object}    An instance of one of the framework's geometry classes
 * @return      {Object}    A hash of the 'type' and 'components' thus derived
 */
Wkt.Wkt.prototype.deconstruct = function (obj) {
    var i, j, verts, rings, tmp;

    // L.Marker ////////////////////////////////////////////////////////////////
    if (obj.setIcon && typeof obj.setIcon === 'function') {
        // Only Markers, among all Leaflet objects, have the setIcon method

        return {
            type: 'point',
            components: [{
                x: obj.getLatLng().lng,
                y: obj.getLatLng().lat
            }]
        };
    }

    // L.Rectangle /////////////////////////////////////////////////////////////
    if (obj.spliceLatLngs && typeof obj.spliceLatLngs === 'function'
            // Rectangle inherits spliceLatLngs() from Polygon, like Polyline,
            //  but neither of those have the setBounds method
            && obj.setBounds && typeof obj.setBounds === 'function') {

        // Rectangles have to be detected BEFORE Polygons/Polylines in order for
        // them to be recognized as POLYGONS and not POLYLINES
        tmp = obj.getBounds(); // L.LatLngBounds instance
        return {
            type: 'polygon',
            isRectangle: true,
            components: [
                [
                    { // NW corner
                        x: tmp.getSouthWest().lng,
                        y: tmp.getNorthEast().lat
                    },
                    { // NE corner
                        x: tmp.getNorthEast().lng,
                        y: tmp.getNorthEast().lat
                    },
                    { // SE corner
                        x: tmp.getNorthEast().lng,
                        y: tmp.getSouthWest().lat
                    },
                    { // SW corner
                        x: tmp.getSouthWest().lng,
                        y: tmp.getSouthWest().lat
                    },
                    { // NW corner (again, for closure)
                        x: tmp.getSouthWest().lng,
                        y: tmp.getNorthEast().lat
                    }
                ]
            ]
        };

    }

    // L.Polyline //////////////////////////////////////////////////////////////
    // L.Polygon ///////////////////////////////////////////////////////////////
    if (obj.spliceLatLngs && typeof obj.spliceLatLngs === 'function') {
        // Both Polylines and Polygons have the spliceLatLngs method, which
        //  means we have a decision to make! We will infer the WKT geometry
        //  type based on...

        verts = [];
        tmp = obj.getLatLngs();

        // ...whether or not the path is closed. It will be a LINESTRING if
        //  the path is not closed (first and last coordinate pairs are the same).
        if (!tmp[0].equals(tmp[tmp.length - 1])) {

            for (i = 0; i < tmp.length; i += 1) {
                verts.push({
                    x: tmp[i].lng,
                    y: tmp[i].lat
                });
            }

            return {
                type: 'linestring',
                components: verts
            };

        }

        // ...It will be a POLYGON if the path is closed.
        rings = [];

        // First, we deal with the boundary points
        for (i = 0; i < obj._latlngs.length; i += 1) {
            verts.push({ // Add the first coordinate again for closure
                x: tmp[i].lng,
                y: tmp[i].lat
            });
        }

        verts.push({ // Add the first coordinate again for closure
            x: tmp[0].lng,
            y: tmp[0].lat
        });

        rings.push(verts);

        // Now, any holes
        if (obj._holes.length > 0) {
            rings.push(Wkt.coordsFromLatLngs(obj._holes)[0]);
        }

        return {
            type: 'polygon',
            components: rings
        };

    }

    // L.Circle ////////////////////////////////////////////////////////////////
    if (obj.getBounds && obj.getRadius) {
        // Circle is the only overlay class with both the getBounds and getRadius properties

        console.log('Deconstruction of L.Circle objects is not yet supported');

    } else {
        console.log('The passed object does not have any recognizable properties.');
    }

};
