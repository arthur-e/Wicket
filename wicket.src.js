/*global console, document, window*/
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
var Wkt = (function () { // Execute function immediately

    return {
        // The default delimiter for separating components of atomic geometry (coordinates)
        delimiter: ' ',

        isArray: function (obj) {
            return !!(obj && obj.constructor == Array);
        },

        /**
         * An object for reading WKT strings and writing geographic features
         * @param   {String}    An optional WKT string for immediate read
         * @param   {Wkt.Wkt}   A WKT object
         */
        Wkt: function (initializer) {
            var beginsWith, endsWith, trim;

            /**
             * @private
             */
            beginsWith = function (str, sub) {
                return str.substring(0, sub.length) === sub;
            };

            /**
             * @private
             */
            endsWith = function (str, sub) {
                return str.substring(str.length - sub.length) === sub;
            };

            /**
             * @private
             */
            trim = function (str, sub) {
                sub = sub || ' '; // Defaults to trimming spaces
                // Trim beginning spaces
                while (beginsWith(str, sub)) {
                    str = str.substring(1);
                }
                // Trim ending spaces
                while (endsWith(str, sub)) {
                    str = str.substring(0, str.length - 1);
                }
                return str;
            };

            /**
             * The default delimiter between X and Y coordinates.
             */
            this.delimiter = Wkt.delimiter;

            /**
             * Some regular expressions copied from OpenLayers.Format.WKT.js
             */
            this.regExes = {
                'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
                'spaces': /\s+|\+/, // Matches the '+' or the empty space
                'numeric': /-*\d+\.*\d+/,
                'comma': /\s*,\s*/,
                'parenComma': /\)\s*,\s*\(/,
                'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,
                'trimParens': /^\s*\(?(.*?)\)?\s*$/
            };

            /**
             * Returns true if the internal geometry is a collection of geometries.
             * @return  {Boolean}   Returns true when it is a collection
             */
            this.isCollection = function () {
                switch (this.type.slice(0, 5)) {
                case 'multi':
                    // Trivial; any multi-geometry is a collection
                    return true;
                case 'polyg':
                    // Polygons with holes are "collections" of rings
                    return true;
                default:
                    // Any other geometry is not a collection
                    return false;
                }
            };

            /**
             * The internal representation of geometry--the "components" of geometry.
             */
            this.components = undefined;

            /**
             * Sets internal geometry (components) from framework geometry (e.g.
             * Google Polygon objects or google.maps.Polygon).
             * @param   obj {Object}    The framework-dependent geometry representation
             * @return      {Wkt.Wkt}   The object itself
             */
            this.fromObject = function (obj) {
                var result = this.deconstruct.call(this, obj);
                this.components = result.components;
                this.isRectangle = result.isRectangle || false;
                this.type = result.type;
                return this;
            };

            /**
             * Creates external geometry objects based on a plug-in framework's
             * construction methods and available geometry classes.
             * @param   config  {Object}    An optional framework-dependent properties specification
             * @return          {Object}    The framework-dependent geometry representation
             */
            this.toObject = function (config) {
                return this.construct[this.type].call(this, config);
            };

            /**
             * Reads a WKT string, validating and incorporating it.
             * @param   wkt {String}    A WKT string
             * @return      {Array}     An Array of internal geometry objects
             */
            this.read = function (wkt) {
                var matches;
                matches = this.regExes.typeStr.exec(wkt);
                if (matches) {
                    this.type = matches[1].toLowerCase();
                    this.base = matches[2];
                    if (this.ingest[this.type]) {
                        this.components = this.ingest[this.type].apply(this, [this.base]);
                    }
                } else {
                    console.log("Invalid WKT string provided to read()");
                    throw {
                        name: "WKTError",
                        message: "Invalid WKT string provided to read()"
                    }
                }
                return this.components;
            }; // eo readWkt

            /**
             * Writes a WKT string.
             * @param   components  {Array}     An Array of internal geometry objects
             * @return              {String}    The corresponding WKT representation
             */
            this.write = function (components) {
                var i, pieces, data;

                components = components || this.components;

                pieces = [];

                pieces.push(this.type.toUpperCase() + '(');

                for (i = 0; i < components.length; i += 1) {
                    if (this.isCollection() && i > 0) {
                        pieces.push(',');
                    }

                    // There should be an extract function for the named type
                    if (!this.extract[this.type]) {
                        return null;
                    }

                    data = this.extract[this.type].apply(this, [components[i]]);
                    if (this.isCollection()) {
                        pieces.push('(' + data + ')');
                    } else {
                        pieces.push(data);
                        // If not at the end of the components, add a comma
                        if (i !== components.length - 1) {
                            pieces.push(',');
                        }
                    }
                }

                pieces.push(')');

                return pieces.join('');
            };

            /**
             * This object contains functions as property names that extract WKT
             * strings from the internal representation.
             */
            this.extract = {
                /**
                 * Return a WKT string representing atomic (point) geometry
                 * @param   point   {Object}    An object with x and y properties
                 * @return          {String}    The WKT representation
                 */
                'point': function (point) {
                    return point.x + this.delimiter + point.y;
                },
                /**
                 * Return a WKT string representing multiple atoms (points)
                 * @param   point   {Array}     Multiple x-and-y objects
                 * @return          {String}    The WKT representation
                 */
                'multipoint': function (multipoint) {
                    var i, parts = [];
                    for (i = 0; i < multipoint.length; i += 1) {
                        parts.push(this.extract.point.apply(this, [multipoint[i]]));
                    }
                    return parts.join(',');
                },
                /**
                 * Return a WKT string representing a chain (linestring) of atoms
                 * @param   point   {Array}     Multiple x-and-y objects
                 * @return          {String}    The WKT representation
                 */
                'linestring': function (linestring) {
                    // Extraction of linestrings is the same as for points
                    return this.extract.point.apply(this, [linestring]);
                },
                /**
                 * Return a WKT string representing multiple chains (multilinestring) of atoms
                 * @param   point   {Array}     Multiple of multiple x-and-y objects
                 * @return          {String}    The WKT representation
                 */
                'multilinestring': function (multilinestring) {
                    var i, parts = [];
                    for (i = 0; i < multilinestring.length; i += 1) {
                        parts.push('(' + this.extract.linestring.apply(this, [multilinestring[i]]) + ')');
                    }
                    return parts.join(',');
                },
                /**
                 * Return a WKT string representing multiple atoms in closed series (polygon)
                 * @param   point   {Array}     Collection of ordered x-and-y objects
                 * @return          {String}    The WKT representation
                 */
                'polygon': function (polygon) {
                    // Extraction of polygons is the same as for multipoints
                    return this.extract.multipoint.apply(this, [polygon]);
                },
                /**
                 * Return a WKT string representing multiple closed series (multipolygons) of multiple atoms
                 * @param   point   {Array}     Collection of ordered x-and-y objects
                 * @return          {String}    The WKT representation
                 */
                'multipolygon': function (multipolygon) {
                    var i, parts = [];
                    for (i = 0; i < multipolygon.length; i += 1) {
                        parts.push('(' + this.extract.polygon.apply(this, [multipolygon[i]]) + ')');
                    }
                    return parts.join(',');
                }
            };

            /**
             * This object contains functions as property names that ingest WKT
             * strings into the internal representation.
             */
            this.ingest = {

                /**
                 * Return point feature given a point WKT fragment.
                 * @param   str {String}    A WKT fragment representing the point
                 */
                'point': function (str) {
                    var coords = trim(str).split(this.regExes.spaces);
                    // In case a parenthetical group of coordinates is passed...
                    return [{ // ...Search for numeric substrings
                        x: parseFloat(this.regExes.numeric.exec(coords[0])[0]),
                        y: parseFloat(this.regExes.numeric.exec(coords[1])[0])
                    }];
                },

                /**
                 * Return a multipoint feature given a multipoint WKT fragment.
                 * @param   str {String}    A WKT fragment representing the multipoint
                 */
                'multipoint': function (str) {
                    var i, components, points;
                    components = [];
                    points = trim(str).split(this.regExes.comma);
                    for (i = 0; i < points.length; i += 1) {
                        components.push(this.ingest.point.apply(this, [points[i]]));
                    }
                    return components;
                },

                /**
                 * Return a linestring feature given a linestring WKT fragment.
                 * @param   str {String}    A WKT fragment representing the linestring
                 */
                'linestring': function (str) {
                    var i, multipoints, components;

                    // In our x-and-y representation of components, parsing
                    //  multipoints is the same as parsing linestrings
                    multipoints = this.ingest.multipoint.apply(this, [str]);

                    // However, the points need to be joined
                    components = [];
                    for (i = 0; i < multipoints.length; i += 1) {
                        components = components.concat(multipoints[i]);
                    }
                    return components;
                },

                /**
                 * Return a multilinestring feature given a multilinestring WKT fragment.
                 * @param   str {String}    A WKT fragment representing the multilinestring
                 */
                'multilinestring': function (str) {
                    var i, components, line, lines;
                    components = [];
                    lines = trim(str).split(this.regExes.parenComma);
                    for (i = 0; i < lines.length; i += 1) {
                        line = lines[i].replace(this.regExes.trimParens, '$1');
                        components.push(this.ingest.linestring.apply(this, [line]));
                    }
                    return components;
                },

                /**
                 * Return a polygon feature given a polygon WKT fragment.
                 * @param   str {String}    A WKT fragment representing the polygon
                 */
                'polygon': function (str) {
                    var i, j, components, subcomponents, ring, rings;
                    rings = trim(str).split(this.regExes.parenComma);
                    components = []; // Holds one or more rings
                    for (i = 0; i < rings.length; i += 1) {
                        ring = rings[i].replace(this.regExes.trimParens, '$1').split(this.regExes.comma);
                        subcomponents = []; // Holds the outer ring and any inner rings (holes)
                        for (j = 0; j < ring.length; j += 1) {
                            // Split on the empty space or '+' character (between coordinates)
                            subcomponents.push({
                                x: parseFloat(ring[j].split(this.regExes.spaces)[0]),
                                y: parseFloat(ring[j].split(this.regExes.spaces)[1])
                            });
                        }
                        components.push(subcomponents);
                    }
                    return components;
                },

                /**
                 * Return a multipolygon feature given a multipolygon WKT fragment.
                 * @param   str {String}    A WKT fragment representing the multipolygon
                 */
                'multipolygon': function (str) {
                    var i, components, polygon, polygons;
                    components = [];
                    polygons = trim(str).split(this.regExes.doubleParenComma);
                    for (i = 0; i < polygons.length; i += 1) {
                        polygon = polygons[i].replace(this.regExes.trimParens, '$1');
                        components.push(this.ingest.polygon.apply(this, [polygon]));
                    }
                    return components;
                },

                /**
                 * Return an array of features given a geometrycollection WKT fragment.
                 * @param   str {String}    A WKT fragment representing the geometry collection
                 */
                'geometrycollection': function (str) {
                    console.log('The geometrycollection WKT type is not yet supported.');
                }

            }; // eo ingest

            // An initial WKT string may be provided
            if (initializer && typeof initializer === 'string') {
                this.read(initializer);
            } else if (this.fromGeometry) { // Or, an initial geometry object to be read
                this.fromGeometry(initializer);
            }

        } // eo WKt.Wkt

    }; // eo return

}()); // eo Wkt
