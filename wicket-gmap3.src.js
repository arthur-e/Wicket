Wkt.Wkt.prototype.construct = {
    'point': google.maps.Marker,
    'multipoint': google.maps.Marker,
    'linestring': google.maps.Polyline,
    'multilinestring': google.maps.Polyline,

    /**
     * Creates the equivalent polygon geometry object.
     * @param   config  {Object}    A hash of properties the object should use
     * @return          {google.maps.Polygon}
     */
    'polygon': function(config) { // google.maps.Polygon
        var c, obj;

        c = this.components;

        config = config || {
            editable: false, // Editable geometry off by default
            path: (function() {
                for (i=0; i < c.length; i+=1) {
                    config.path.push(new google.maps.LatLng(c[i].y, c[i].x));
                }
            }()) // Execute immediately
        };

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
    return this.construct[this.type].call(this, [config]);
};
