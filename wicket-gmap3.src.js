Wkt.Wkt.prototype.construct = {
    /**
     * Creates the framework's equivalent point geometry object.
     * @param   config  {Object}    An optional properties hash the object should use
     * @param   component   {Object}    An optional component to build from
     * @return          {google.maps.Marker}
     */
    'point': function(config, component) {
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
    'multipoint': function(config) {
        var i, c, arr;

        c = this.components;

        config = config || {};

        arr = [];

        for (i=0; i < c.length; i+=1) {
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
    'linestring': function(config, component) {
        var i, c;

        c = component || this.components;

        config = config || {
            editable: false,
            path: []
        };

        for (i=0; i < c.length; i+=1) {
            config.path.push(new google.maps.LatLng(c[i].y, c[i].x));
        }

        return new google.maps.Polyline(config);
    },

    /**
     * Creates the framework's equivalent multilinestring geometry object.
     * @param   config  {Object}    An optional properties hash the object should use
     * @return          {Array}     Array containing multiple google.maps.Polyline instances
     */
    'multilinestring': function(config) {
        var i, c, arr;

        c = this.components;

        config = config || {
            editable: false,
            path: []
        };

        arr = [];

        for (i=0; i < c.length; i+=1) {
            arr.push(this.construct.linestring(config, c[i]));
        }

        return arr;
    },

    /**
     * Creates the framework's equivalent polygon geometry object.
     * @param   config      {Object}    An optional properties hash the object should use
     * @param   component   {Object}    An optional component to build from
     * @return              {google.maps.Polygon}
     */
    'polygon': function(config, component) {
        var i, j, c, arr;

        c = component || this.components;

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
            return new google.maps.Polygon(config);
        }
    },

    /**
     * Creates the framework's equivalent multipolygon geometry object.
     * @param   config  {Object}    An optional properties hash the object should use
     * @return          {Array}     Array containing multiple google.maps.Polygon
     */
    'multipolygon': function(config) {
        var i, c, arr;

        c = this.components;

        arr = [];

        for (i=0; i < c.length; i+=1) {
            arr.push(this.construct.polygon(config, c[i]));
        }

        return arr;
    }

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
