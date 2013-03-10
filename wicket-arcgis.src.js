/*global dojo, esri, Wkt, console*/
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

/* @preserve
 * NOTE: The ESRI ArcGIS API extension requirest JavaScript 1.6 or higher, due
    its dependence on the Array functions map, indexOf, and lastIndexOf
 */

Wkt.Wkt.prototype.isRectangle = false;

/**
 * An object of framework-dependent construction methods used to generate
 * objects belonging to the various geometry classes of the framework.
 */
Wkt.Wkt.prototype.construct = {
    /**
     * Creates the framework's equivalent point geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @param   component   {Object}    An optional component to build from
     * @return              {esri.geometry.Point}
     */
    point: function (config, component) {
        var coord = component || this.components;
        if (coord instanceof Array) {
            coord = coord[0];
        }

        if (config) {
            // Allow the specification of a coordinate system
            coord.spatialReference = config.spatialReference | config.srs;
        }

        return new esri.geometry.Point(coord);
    },

    /**
     * Creates the framework's equivalent multipoint geometry object.
     * @param   config  {Object}    An optional properties hash the object should use
     * @return          {esri.geometry.Multipoint}
     */
    multipoint: function (config) {
        config = config || {};
        config.spatialReference = (config.spatialReference || config.srs) ? config.spatialReference || config.srs : undefined;

        return new esri.geometry.Multipoint({
            // Create an Array of [x, y] coords from each point among the components
            points: this.components.map(function (i) {
                if (Wkt.isArray(i)) {
                    i = i[0]; // Unwrap coords
                }
                return [i.x, i.y];
            }),
            spatialReference: config.spatialReference
        });
    },

    /**
     * Creates the framework's equivalent linestring geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @return              {esri.geometry.Polyline}
     */
    linestring: function (config) {
        config = config || {};
        config.spatialReference = (config.spatialReference || config.srs) ? config.spatialReference || config.srs : undefined;

        return new esri.geometry.Polyline({
            // Create an Array of paths...
            paths: [
                this.components.map(function (i) {
                    return [i.x, i.y];
                })
            ],
            spatialReference: config.spatialReference
        });
    },

    /**
     * Creates the framework's equivalent multilinestring geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @return              {esri.geometry.Polyline}
     */
    multilinestring: function (config) {
        config = config || {};
        config.spatialReference = (config.spatialReference || config.srs) ? config.spatialReference || config.srs : undefined;

        return new esri.geometry.Polyline({
            // Create an Array of paths...
            paths: this.components.map(function (i) {
                // ...Within which are Arrays of coordinate pairs (vertices)
                return i.map(function (j) {
                    return [j.x, j.y];
                });
            }),
            spatialReference: config.spatialReference
        });
    },

    /**
     * Creates the framework's equivalent polygon geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @return              {esri.geometry.Polygon}
     */
    polygon: function (config) {
        config = config || {};
        config.spatialReference = (config.spatialReference || config.srs) ? config.spatialReference || config.srs : undefined;

        return new esri.geometry.Polygon({
            // Create an Array of rings...
            rings: this.components.map(function (i) {
                // ...Within which are Arrays of coordinate pairs (vertices)
                return i.map(function (j) {
                    return [j.x, j.y];
                });
            }),
            spatialReference: config.spatialReference
        });
    },

    /**
     * Creates the framework's equivalent multipolygon geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @return              {esri.geometry.Polygon}
     */
    multipolygon: function (config) {
        config = config || {};
        config.spatialReference = (config.spatialReference || config.srs) ? config.spatialReference || config.srs : undefined;

        return new esri.geometry.Polygon({
            // Create an Array of rings...
            rings: this.components.map(function (i) {
                // ...Within which are Arrays of (outer) rings (polygons)
                return i.map(function (j) {
                    // ...Within which are (possibly) Arrays of (inner) rings (holes)
                    return j.map(function (k) {
                        console.log(k);
                        return [k.x, k.y];
                    });
                })[0];
            }),
            spatialReference: config.spatialReference
        });
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
};
