Wkt.Wkt.prototype.construct = {
    /**
     * Creates the framework's equivalent point geometry object.
     * @param   config  {Object}    A hash of properties the object should use
     * @return          {google.maps.Marker}
     */
    'point': function(config) {
        var c = this.components;

        config = config || {
        };

        config.position = new google.maps.LatLng(c[0].y, c[0].x);

        return new google.maps.Marker(config);
    },

    /**
     * Creates the framework's equivalent multipoint geometry object.
     * @param   config  {Object}    A hash of properties the object should use
     * @return          {Array}     Array containing multiple google.maps.Marker
     */
    'multipoint': function(config) {
        var i, c, arr;

        c = this.components;

        arr = [];

        for (i=0; i < c.length; i+=1) {
            config = config || {};
            config.position = new google.maps.LatLng(c[i].y, c[i].x);
            arr.push(new google.maps.Marker(config));
        }

        return arr;
    },

    /**
     * Creates the framework's equivalent multipoint geometry object.
     * @param   config  {Object}    A hash of properties the object should use
     * @return          {Array}     Array containing multiple google.maps.Marker
     */
    'linestring': function(config) {
        var i, c;

        c = this.components;

        config = config || {
            editable: false,
            path: []
        };

        for (i=0; i < c.length; i+=1) {
            config.path.push(new google.maps.LatLng(c[i].y, c[i].x));
        }

        return new google.maps.Polyline(config);
    },
    'multilinestring': google.maps.Polyline,

    /**
     * Creates the framework's equivalent polygon geometry object.
     * @param   config  {Object}    A hash of properties the object should use
     * @return          {google.maps.Polygon}
     */
    'polygon': function(config) { // google.maps.Polygon
        var i, j, c, obj, arr;

        c = this.components;

        config = config || {
            editable: false, // Editable geometry off by default
            path: []
        };

        for (i=0; i < c.length; i+=1) {
            arr = [];
            for (j=0; j < c[i].length; j+=1) {
                arr.push(new google.maps.LatLng(c[i][j].y, c[i][j].x));
            }
            if (c.length === 1) { // If just one ring (no inner rings)...
                config.path = arr;
            } else { // Must be inner rings, make an Array of Arrays
                config.path.push(arr);
            }
        }

        if (this.isRectangle) {
            console.log('Rectangles are not yet supported; set the isRectangle property to false (default).');
        } else {
            obj = new google.maps.Polygon(config);
        }

        return obj;
    },
    'multipolygon': google.maps.Polygon    
};

/**
 * A framework-dependent flag, set for each Wkt.Wkt() instance, that indicates
 * whether or not a closed polygon geometry should be interpreted as a rectangle.
 */
Wkt.Wkt.prototype.isRectangle = false;

/**
 * The framework's custom method for creating internal geometry from framework
 * geometry (e.g. Google Rectangle objects or google.maps.Rectangle).
 */
Wkt.Wkt.prototype.fromGeometry = function() {
};

/**
 * The framework's custom method for creating external geometry objects based on
 * the available framework geometry classes.
 */
Wkt.Wkt.prototype.toGeometry = function(config) {
    return this.construct[this.type].call(this, config);
};
