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
 */
var Wkt = (function() { // Execute function immediately

    return {

        /**
         * An object for reading WKT strings and writing geographic features
         */
        Wkt: function(wkt) {
            var beginsWith, endsWith, trim;

            // private
            beginsWith = function(str, sub) {
                return str.substring(0, sub.length) === sub;
            }

            // private
            endsWith = function(str, sub) {
                return str.substring(str.length - sub.length) === sub;
            }

            // private
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

            ////////////////////////////////////////////////////////////////////
            this.trim = trim;
            ////////////////////////////////////////////////////////////////////

            /**
             * Regular expressions copied from OpenLayers.Format.WKT.js
             */
            this.regExes = {
                'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
                'spaces': /\s+/,
                'comma': /\s*,\s*/,
                'parenComma': /\)\s*,\s*\(/,
                'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,
                'trimParens': /^\s*\(?(.*?)\)?\s*$/
            };

            /**
             * Reads a WKT string, validating and incorporating it
             */
            this.read = function(wkt) {
                var features, matches;
                matches = this.regExes.typeStr.exec(wkt);
                if (matches) {
                    this.type = matches[1].toLowerCase();
                    this.base = matches[2];
                    if (this.parse[this.type]) {
                        features = this.parse[this.type].apply(this, [this.base]);
                    }
                }
            return features;
            }; // eo read

            /**
             * "Subclasses" should implement the parse object and the methods
             * it contains so as to provide framework-dependent parsing of WKT
             * strings into geometry.
             */
            this.parse = {

                /**
                 * Return point feature given a point WKT fragment.
                 * @param {String} str A WKT fragment representing the point
                 */
                'point': function(str) {
                },

                /**
                 * Return a multipoint feature given a multipoint WKT fragment.
                 * @param {String} A WKT fragment representing the multipoint
                 */
                'multipoint': function(str) {
                },
                
                /**
                 * Return a linestring feature given a linestring WKT fragment.
                 * @param {String} A WKT fragment representing the linestring
                 */
                'linestring': function(str) {
                },

                /**
                 * Return a multilinestring feature given a multilinestring WKT fragment.
                 * @param {String} A WKT fragment representing the multilinestring
                 */
                'multilinestring': function(str) {
                },
                
                /**
                 * Return a polygon feature given a polygon WKT fragment.
                 * @param {String} A WKT fragment representing the polygon
                 */
                'polygon': function(str) {
                    var i, j, matches, path, ring, rings;
                    path = [];
                    rings = trim(str).split(this.regExes.parenComma);
                    for (i=0; i < rings.length; i+=1) {
                        ring = rings[i].replace(this.regExes.trimParens, '$1').split(this.regExes.comma);
                        for (j=0; j < ring.length; j+=1) {
                            // Split on the empty space or '+' character (between coordinates)
                            // TODO matches = this.regExes.numeric.exec(ring[j]); // Match numeric coordinates
                            path.push({
                                x: ring[j].split(this.regExes.spaces)[0],
                                y: ring[j].split(this.regExes.spaces)[1]
                            });
                        }
                    }
                    return path;
                },

                /**
                 * Return a multipolygon feature given a multipolygon WKT fragment.
                 * @param {String} A WKT fragment representing the multipolygon
                 */
                'multipolygon': function(str) {
                },

                /**
                 * Return an array of features given a geometrycollection WKT fragment.
                 * @param {String} A WKT fragment representing the geometrycollection
                 */
                'geometrycollection': function(str) {
                }

            }; // eo parse

            // An initial WKT string may be provided
            if (wkt) {
                this.read(wkt);
            }

        } // eo WKt.Wkt

    } // eo return

}()); // eo Wkt
