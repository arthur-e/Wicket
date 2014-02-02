/** @license
 *
 *  Copyright (C) 2012 K. Arthur Endsley (kaendsle@mtu.edu)
 *  Michigan Tech Research Institute (MTRI)
 *  3600 Green Court, Suite 100, Ann Arbor, MI, 48105
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * @augments Wkt.Wkt
 * A framework-dependent flag, set for each Wkt.Wkt() instance, that indicates
 * whether or not a closed polygon geometry should be interpreted as a rectangle.
 */
Wkt.Wkt.prototype.isRectangle = false;

/**
 * @augments Wkt.Wkt
 * An object of framework-dependent construction methods used to generate
 * objects belonging to the various geometry classes of the framework.
 */
Wkt.Wkt.prototype.construct = {
    /**
     * Creates the framework's equivalent point geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @param   component   {Object}    An optional component to build from
     * @return              {google.maps.Marker}
     */
    point: function (config, component) {
        var c = component || this.components;

        config = config || {};

        config.position = new google.maps.LatLng(c[0].y, c[0].x);

        return new google.maps.Marker(config);
    },

    /**
     * Creates the framework's equivalent multipoint geometry object.
     * @param   config  {Object}    An optional properties hash the object should use
     * @return          {Array}     Array containing multiple google.maps.Marker
     */
    multipoint: function (config) {
        var i, c, arr;

        c = this.components;

        config = config || {};

        arr = [];

        for (i = 0; i < c.length; i += 1) {
            arr.push(this.construct.point(config, c[i]));
        }

        return arr;
    },

    /**
     * Creates the framework's equivalent linestring geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @param   component   {Object}    An optional component to build from
     * @return              {google.maps.Polyline}
     */
    linestring: function (config, component) {
        var i, c;

        c = component || this.components;

        config = config || {
            editable: false
        };

        config.path = [];

        for (i = 0; i < c.length; i += 1) {
            config.path.push(new google.maps.LatLng(c[i].y, c[i].x));
        }

        return new google.maps.Polyline(config);
    },

    /**
     * Creates the framework's equivalent multilinestring geometry object.
     * @param   config  {Object}    An optional properties hash the object should use
     * @return          {Array}     Array containing multiple google.maps.Polyline instances
     */
    multilinestring: function (config) {
        var i, c, arr;

        c = this.components;

        config = config || {
            editable: false
        };

        config.path = [];

        arr = [];

        for (i = 0; i < c.length; i += 1) {
            arr.push(this.construct.linestring(config, c[i]));
        }

        return arr;
    },

    /**
     * Creates the framework's equivalent Box or Rectangle geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @param   component   {Object}    An optional component to build from
     * @return              {google.maps.Rectangle}
     */
    box: function (config, component) {
        var c = component || this.components;

        config = config || {};

        config.bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(c[0].y, c[0].x),
            new google.maps.LatLng(c[1].y, c[1].x));

        return new google.maps.Rectangle(config);
    },

    /**
     * Creates the framework's equivalent polygon geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @param   component   {Object}    An optional component to build from
     * @return              {google.maps.Polygon}
     */
    polygon: function (config, component) {
        var j, k, c, rings, verts;

        c = component || this.components;

        config = config || {
            editable: false // Editable geometry off by default
        };

        config.paths = [];

        rings = [];
        for (j = 0; j < c.length; j += 1) { // For each ring...

            verts = [];
            // NOTE: We iterate to one (1) less than the Array length to skip the last vertex
            for (k = 0; k < c[j].length - 1; k += 1) { // For each vertex...
                verts.push(new google.maps.LatLng(c[j][k].y, c[j][k].x));

            } // eo for each vertex

            if (j !== 0) { // Reverse the order of coordinates in inner rings
                if (config.reverseInnerPolygons == null || config.reverseInnerPolygons) {
                    verts.reverse();
                }
            }

            rings.push(verts);
        } // eo for each ring

        config.paths = config.paths.concat(rings);

        if (this.isRectangle) {
            return (function () {
                var bounds, v;

                bounds = new google.maps.LatLngBounds();

                for (v in rings[0]) { // Ought to be only 1 ring in a Rectangle
                    if (rings[0].hasOwnProperty(v)) {
                        bounds.extend(rings[0][v]);
                    }
                }

                return new google.maps.Rectangle({bounds: bounds});
            }());
        } else {
            return new google.maps.Polygon(config);
        }
    },

    /**
     * Creates the framework's equivalent multipolygon geometry object.
     * @param   config  {Object}    An optional properties hash the object should use
     * @return          {Array}     Array containing multiple google.maps.Polygon
     */
    multipolygon: function (config) {
        var i, c, arr;

        c = this.components;

        config = config || {
            editable: false
        };

        config.path = [];

        arr = [];

        for (i = 0; i < c.length; i += 1) {
            arr.push(this.construct.polygon(config, c[i]));
        }

        return arr;
    }

};

/**
 * @augments Wkt.Wkt
 * A framework-dependent deconstruction method used to generate internal
 * geometric representations from instances of framework geometry. This method
 * uses object detection to attempt to classify members of framework geometry
 * classes into the standard WKT types.
 * @param   obj {Object}    An instance of one of the framework's geometry classes
 * @return      {Object}    A hash of the 'type' and 'components' thus derived
 */
Wkt.Wkt.prototype.deconstruct = function (obj) {
    var features, i, j, multiFlag, verts, rings, tmp;

    // google.maps.Marker //////////////////////////////////////////////////////
    if (obj.constructor === google.maps.Marker) {

        return {
            type: 'point',
            components: [{
                x: obj.getPosition().lng(),
                y: obj.getPosition().lat()
            }]
        };

    }

    // google.maps.Polyline ////////////////////////////////////////////////////
    if (obj.constructor === google.maps.Polyline) {

        verts = [];
        for (i = 0; i < obj.getPath().length; i += 1) {
            tmp = obj.getPath().getAt(i);
            verts.push({
                x: tmp.lng(),
                y: tmp.lat()
            });
        }

        return {
            type: 'linestring',
            components: verts
        };

    }

    // google.maps.Polygon /////////////////////////////////////////////////////
    if (obj.constructor === google.maps.Polygon) {
        rings = [];

        for (i = 0; i < obj.getPaths().length; i += 1) { // For each polygon (ring)...
            tmp = obj.getPaths().getAt(i);

            verts = [];
            for (j = 0; j < obj.getPaths().getAt(i).length; j += 1) { // For each vertex...
                verts.push({
                    x: tmp.getAt(j).lng(),
                    y: tmp.getAt(j).lat()
                });
            }

            if (i !== 0) { // Reverse the order of coordinates in inner rings
                verts.reverse();
                verts.push({ // Add the first coordinate (now at the end, in inner rings) again for closure
                    x: tmp.getAt(tmp.length - 1).lng(),
                    y: tmp.getAt(tmp.length - 1).lat()
                });

            } else {
                verts.push({ // Add the first coordinate again for closure
                    x: tmp.getAt(0).lng(),
                    y: tmp.getAt(0).lat()
                });
            }

            rings.push(verts);
        }

        return {
            type: 'polygon',
            components: rings
        };

    }

    // google.maps.Rectangle ///////////////////////////////////////////////////
    if (obj.constructor === google.maps.Rectangle) {

        tmp = obj.getBounds();
        return {
            type: 'polygon',
            isRectangle: true,
            components: [
                [
                    { // NE corner
                        x: tmp.getNorthEast().lng(),
                        y: tmp.getNorthEast().lat()
                    },
                    { // SE corner
                        x: tmp.getNorthEast().lng(),
                        y: tmp.getSouthWest().lat()
                    },
                    { // SW corner
                        x: tmp.getSouthWest().lng(),
                        y: tmp.getSouthWest().lat()
                    },
                    { // NW corner
                        x: tmp.getSouthWest().lng(),
                        y: tmp.getNorthEast().lat()
                    },
                    { // NE corner (again, for closure)
                        x: tmp.getNorthEast().lng(),
                        y: tmp.getNorthEast().lat()
                    }
                ]
            ]
        };

    }

    if (Wkt.isArray(obj)) {
        features = [];

        for (i = 0; i < obj.length; i += 1) {
            features.push(this.deconstruct.call(this, obj[i]));
        }

        return {

            type: (function () {
                var k, type = obj[0].constructor;

                for (k = 0; k < obj.length; k += 1) {
                    // Check that all items have the same constructor as the first item
                    if (obj[k].constructor !== type) {
                        // If they don't, type is heterogeneous geometry collection
                        return 'geometrycollection';
                    }
                }

                switch (type) {
                case google.maps.Marker:
                    return 'multipoint';
                case google.maps.Polyline:
                    return 'multilinestring';
                case google.maps.Polygon:
                    return 'multipolygon';
                default:
                    return 'geometrycollection';
                }

            }()),
            components: (function () {
                // Pluck the components from each Wkt
                var i, comps;

                comps = [];
                for (i = 0; i < features.length; i += 1) {
                    if (features[i].components) {
                        comps.push(features[i].components);
                    }
                }

                return comps;
            }())

        };

    }

    // google.maps.Circle //////////////////////////////////////////////////////
    if (obj.getBounds && obj.getRadius) {
        // Circle is the only overlay class with both the getBounds and getRadius properties

        console.log('Deconstruction of google.maps.Circle objects is not yet supported');

    } else {
        console.log('The passed object does not have any recognizable properties.');
    }

};