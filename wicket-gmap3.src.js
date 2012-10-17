/*global Wkt, google, document, window, console*/
/**
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
google.maps.Marker.prototype.type = 'marker';
google.maps.Polyline.prototype.type = 'polyline';
google.maps.Polygon.prototype.type = 'polygon';
google.maps.Rectangle.prototype.type = 'rectangle';
google.maps.Circle.prototype.type = 'circle';

/**
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
    'point': function (config, component) {
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
    'multipoint': function (config) {
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
     * Creates the framework's equivalent multipoint geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @param   component   {Object}    An optional component to build from
     * @return              {google.maps.Polyline}
     */
    'linestring': function (config, component) {
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
    'multilinestring': function (config) {
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
     * Creates the framework's equivalent polygon geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @return              {google.maps.Polygon}
     */
    'polygon': function (config) {
        var j, k, c, rings, verts;

        c = this.components;

        config = config || {
            editable: false // Editable geometry off by default
        };

        config.paths = [];

        rings = [];
        for (j = 0; j < c.length; j += 1) { // For each ring...

            verts = [];
            for (k = 0; k < c[j].length; k += 1) { // For each vertex...
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
            console.log('Rectangles are not yet supported; set the isRectangle property to false (default).');
        } else {
            return new google.maps.Polygon(config);
        }
    },

    /**
     * Creates the framework's equivalent multipolygon geometry object.
     * @param   config  {Object}    An optional properties hash the object should use
     * @return          {Array}     Array containing multiple google.maps.Polygon
     */
    'multipolygon': function (config) {
        var i, j, k, c, rings, verts;

        c = this.components;

        config = config || {
            editable: false // Editable geometry off by default
        };

        config.paths = []; // Must ensure this property is available

        for (i = 0; i < c.length; i += 1) { // For each polygon...

            rings = [];
            for (j = 0; j < c[i].length; j += 1) { // For each ring...

                verts = [];
                for (k = 0; k < c[i][j].length; k += 1) { // For each vertex...
                    verts.push(new google.maps.LatLng(c[i][j][k].y, c[i][j][k].x));

                } // eo for each vertex

/*              // This is apparently not needed in multipolygon cases
                if (j !== 0) { // Reverse the order of coordinates in inner rings
                    verts.reverse();
                }
*/
                rings.push(verts);
            } // eo for each ring

            config.paths = config.paths.concat(rings);

        } // eo for each polygon

        return new google.maps.Polygon(config);
    }

};

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

    // google.maps.Marker //////////////////////////////////////////////////////
    if (obj.getPosition && typeof obj.getPosition === 'function') {
        // Only Markers, among all overlays, have the getPosition property

        return {
            type: 'point',
            components: [{
                x: obj.getPosition().lng(),
                y: obj.getPosition().lat()
            }]
        };

    // google.maps.Polyline ////////////////////////////////////////////////////
    } else if (obj.getPath && !obj.getPaths) {
        // Polylines have a single path (getPath) not paths (getPaths)

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

    // google.maps.Polygon /////////////////////////////////////////////////////
    } else if (obj.getPaths) {
        // Polygon is the only class with the getPaths property

        // TODO Polygons with holes cannot be distinguished from multipolygons
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

            verts.push({ // Add the first coordinate again for closure
                x: tmp.getAt(0).lng(),
                y: tmp.getAt(0).lat()
            });

            // Since we can't distinguish between single polygons with holes
            //  and multipolygons, we always create multipolygons
            if (obj.getPaths().length > 1) {
                verts = [verts]; // Wrap multipolygons once more (collection)
            }

            rings.push(verts);
        }

        return {
            type: 'polygon',
            components: rings
        };

    // google.maps.Rectangle ///////////////////////////////////////////////////
    } else if (obj.getBounds && !obj.getRadius) {
        // Rectangle is only overlay class with getBounds property and not getRadius property

        tmp = obj.getBounds();
        return {
            type: 'polygon',
            isRectangle: true,
            components: [
                [
                    { // NW corner
                        x: tmp.getSouthWest().lng(),
                        y: tmp.getNorthEast().lat()
                    },
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
                    { // NW corner (again, for closure)
                        x: tmp.getSouthWest().lng(),
                        y: tmp.getNorthEast().lat()
                    }
                ]
            ]
        };

    // google.maps.Circle //////////////////////////////////////////////////////
    } else if (obj.getBounds && obj.getRadius) {
        // Circle is the only overlay class with both the getBounds and getRadius properties

        console.log('Deconstruction of google.maps.Circle objects is not yet supported');

    } else {
        console.log('The passed object does not have any recognizable properties.');
    }

};

/**
 * A framework-dependent flag, set for each Wkt.Wkt() instance, that indicates
 * whether or not a closed polygon geometry should be interpreted as a rectangle.
 */
Wkt.Wkt.prototype.isRectangle = false;
