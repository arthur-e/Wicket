/**
 * Colophon
 *
 * The conventions I've adopted in writing this library:
 * - The Crockford-ian module pattern with a single global (namespace) variable
 * - The most un-Crockford-ian use of new to instantiate new Objects (when this
 *      is required, the Object begins with a capital letter e.g. new Wkt())
 * - The namespace is the only name beginning with a capital letter that doesn't
 *      need to and shouldn't be preceded by new
 * - The namespace is the result of a function allowing for private members
 * - Tricky operators (++ and --) and type-coercing operators (== and !=) are
 *      not used
 *
 * The following open sources were borrowed from; they retain all their original
 * rights:
 * - The OpenLayers 2.7 WKT module (OpenLayers.Format.WKT)
 * - Chris Pietshmann's article on converting Bing Maps shapes (VEShape) to WKT
 *      http://pietschsoft.com/post/2009/04/04/Virtual-Earth-Shapes-%28VEShape%29-to-WKT-%28Well-Known-Text%29-and-Back-using-JavaScript.aspx
 * - Charles R. Schmidt's and the Python Spatial Analysis Laboratory's (PySAL)
 *      WKT writer
 *
 * WKT geometries are stored internally using the following convention. The
 * atomic unit of geometry is the coordinate pair (e.g. latitude and longitude)
 * which is represented by an Object with x and y properties. An Array with a
 * single coordinate pair represents a a single point (i.e. POINT feature)
 *
 *  [ {x: -83.123, y: 42.123} ]
 *
 * An Array of multiple coordinates can specify either a collection of unconnected
 * points (i.e. MULTIPOINT feature) or a collection of connected points in an
 * ordered sequence (i.e. LINESTRING feature):
 *
 *  [ {x: -83.12, y: 42.12}, {x: -83.23, y: 42.23}, {x: -83.34, y: 42.34} ]
 *
 * The difference between the two is specified elsewhere (in the Wkt instance's
 * type) and must be retained.
 *
 * An Array can also contain other Arrays. In these cases, the contained Arrays
 * can represent a single polygon (i.e. POLYGON feature):
 *
 * [ [ {x: -83, y: 42}, {x: -83, y: 43}, {x: -82, y: 43}, {x: -82, y: 42}, {x: -83, y: 42} ] ]
 *
 * Or a MULTIPOLYGON feature:
 *
 * [ 
 *  [
 *   [ {x: -83, y: 42}, {x: -83, y: 43}, {x: -82, y: 43}, {x: -82, y: 42}, {x: -83, y: 42} ]
 *  ],
 *  [ 
 *   [ {x: -70, y: 40}, {x: -70, y: 41}, {x: -69, y: 41}, {x: -69, y: 40}, {x: -70, y: 40} ]
 *  ],
 * ]
 *
 * Or a polygon with inner rings (holes) in it where the outer ring is the 
 * polygon envelope and comes first; subsequent Arrays are inner rings (holes):
 *
 * [ 
 *  [
 *   [ {x: 35, y: 10}, {x: 10, y: 20}, {x: 15, y: 40}, {x: 45, y: 45}, {x: 35, y: 10} ],
 *   [ {x: 20, y: 30}, {x: 35, y: 35}, {x: 30, y: 20}, {x: 20, y: 30} ]
 *  ]
 * ]
 *
 */
var Wkt = (function() { // Execute function immediately

    return {

        /**
         * An object for reading WKT strings and writing geographic features
         * @param {String} An optional WKT string for immediate read
         * @param {<Wkt.Wkt>} A WKT object
         */
        Wkt: function(initializer) {
            var beginsWith, endsWith, trim;

            /**
             * @private
             */
            beginsWith = function(str, sub) {
                return str.substring(0, sub.length) === sub;
            };

            /**
             * @private
             */
            endsWith = function(str, sub) {
                return str.substring(str.length - sub.length) === sub;
            };

            /**
             * @private
             */
            trim = function(str, sub) {
                sub = sub || ' '; // Defaults to trimming spaces
                // Trim beginning spaces
                while(beginsWith(str, sub)) {
                    str = str.substring(1);
                }
                // Trim ending spaces
                while(endsWith(str, sub)) {
                    str = str.substring(0, str.length - 1);
                }
                return str;
            };

            /**
             * The default delimiter between X and Y coordinates.
             */
            this.delimiter = ' ';

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
            this.isCollection = function() {
                switch (this.type.slice(0,5)) {
                    case 'multi':
                        // Trivial; any multi-geometry is a collection
                        isCollection = true;
                        break;
                    case 'polyg':
                        // But polygons with holes are "collections" of rings
                        if (this.components.length > 1) { // Single polygon with hole(s)
                            isCollection = true;
                        } else {
                            isCollection = false; // Just a single polygon
                        }
                        break;
                    default:
                        // Any other geometry is not a collection
                        isCollection = false;
                }
            };

            /**
             * Reads a WKT string, validating and incorporating it
             */
            this.read = function(wkt) {
                var matches;
                matches = this.regExes.typeStr.exec(wkt);
                if (matches) {
                    this.type = matches[1].toLowerCase();
                    this.base = matches[2];
                    if (this.ingest[this.type]) {
                        this.components = this.ingest[this.type].apply(this, [this.base]);
                    }
                }
            return this.components;
            }; // eo readWkt

            /**
             * Writes a geometry object, which is defined by the framework in
             * use; this method should only be defined in extensions.
             */
            //this.toGeometry = undefined;

            /**
             * Reads a geometry object, which is defined by the framework in
             * use; this method should only be defined in extensions.
             */
            //this.fromGeometry = undefined;

            this.write = function(components) {
                var i, pieces, type, data;

                components = components || this.components;

                pieces = [];

                pieces.push(this.type.toUpperCase() + '(');

                for (i=0; i < components.length; i+=1) {
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
                        if (i !== components.length-1) {
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
                 *
                 */
                'point': function(point) {
                    return point.x + this.delimiter + point.y;
                },
                /**
                 *
                 */
                'multipoint': function(multipoint) {
                    var i, parts = [];
                    for (i=0; i < multipoint.length; i+=1) {
                        parts.push(this.extract.point.apply(this, [multipoint[i]]));
                    }
                    return parts.join(',');
                },
                /**
                 *
                 */
                'linestring': function(linestring) {
                    // Extraction of linestrings is the same as for multipoints
                    return this.extract.multipoint.apply(this, [linestring]);
                },
                /**
                 *
                 */
                'multilinestring': function(multilinestring) {
                    var i, parts = [];
                    for (i=0; i < multilinestring.length; i+=1) {
                        parts.push('(' + this.extract.linestring.apply(this, [multilinestring[i]]) + ')');
                    }
                    return parts.join(',');
                },
                /**
                 *
                 */
                'polygon': function(polygon) {
                    // Extraction of polygons is the same as for multipoints
                    return this.extract.multipoint.apply(this, [polygon]);
                },
                /**
                 *
                 */
                'multipolygon': function(multipolygon) {
                    var i, parts = [];
                    for (i=0; i < multipolygon.length; i+=1) {
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
                 * @param {String} str A WKT fragment representing the point
                 */
                'point': function(str) {
                    var coords = trim(str).split(this.regExes.spaces);
                    // In case a parenthetical group of coordinates is passed...
                    return [{ // ...Search for numeric substrings
                        x: parseFloat(this.regExes.numeric.exec(coords[0])[0]),
                        y: parseFloat(this.regExes.numeric.exec(coords[1])[0])
                    }];
                },

                /**
                 * Return a multipoint feature given a multipoint WKT fragment.
                 * @param {String} A WKT fragment representing the multipoint
                 */
                'multipoint': function(str) {
                    var i, components, points;
                    components = [];
                    points = trim(str).split(this.regExes.comma);
                    for (i=0; i < points.length; i+=1) {
                        components.push(this.ingest.point.apply(this, [points[i]]));
                    }
                    return components;
                },
                
                /**
                 * Return a linestring feature given a linestring WKT fragment.
                 * @param {String} A WKT fragment representing the linestring
                 */
                'linestring': function(str) {
                    // In our x-and-y representation of components, parsing
                    //  multipoints is the same as parsing linestrings
                    return this.ingest.multipoint.apply(this, [str]);
                },

                /**
                 * Return a multilinestring feature given a multilinestring WKT fragment.
                 * @param {String} A WKT fragment representing the multilinestring
                 */
                'multilinestring': function(str) {
                    var i, components, line, lines;
                    components = [];
                    lines = trim(str).split(this.regExes.parenComma);
                    for (i=0; i < lines.length; i+=1) {
                        line = lines[i].replace(this.regExes.trimParens, '$1');
                        components.push(this.ingest.linestring.apply(this, [line]));
                    }
                    return components;
                },
                
                /**
                 * Return a polygon feature given a polygon WKT fragment.
                 * @param {String} A WKT fragment representing the polygon
                 */
                'polygon': function(str) {
                    var i, j, components, subcomponents, ring, rings;
                    rings = trim(str).split(this.regExes.parenComma);
                    components = []; // Holds one or more rings
                    for (i=0; i < rings.length; i+=1) {
                        ring = rings[i].replace(this.regExes.trimParens, '$1').split(this.regExes.comma);
                        subcomponents = []; // Holds the outer ring and any inner rings (holes)
                        for (j=0; j < ring.length; j+=1) {
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
                 * @param {String} A WKT fragment representing the multipolygon
                 */
                'multipolygon': function(str) {
                    var i, components, polygon, polygons;
                    components = [];
                    polygons = trim(str).split(this.regExes.doubleParenComma);
                    for (i=0; i < polygons.length; i+=1) {
                        polygon = polygons[i].replace(this.regExes.trimParens, '$1');
                        components.push(this.ingest.polygon.apply(this, [polygon]));
                    }
                    return components;
                },

                /**
                 * Return an array of features given a geometrycollection WKT fragment.
                 * @param {String} A WKT fragment representing the geometrycollection
                 */
                'geometrycollection': function(str) {
                }

            }; // eo ingest

            // An initial WKT string may be provided
            if (initializer && typeof initializer === 'string') {
                this.read(initializer);
            } else if (this.fromGeometry) { // Or, an initial geometry object to be read
                this.fromGeometry(initializer);
            }

        } // eo WKt.Wkt

    } // eo return

}()); // eo Wkt
