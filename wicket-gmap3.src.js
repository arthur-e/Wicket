/**
 * A hash mapping the WKT geometries to the framework's geometry types.
 */
Wkt.Wkt.prototype.geometries = {
    'point': google.maps.Marker,
    'multipoint': google.maps.Marker,
    'linestring': google.maps.Polyline,
    'multilinestring': google.maps.Polyline,
    'polygon': google.maps.Polygon,
    'multipolygon': google.maps.Polygon
};

/**
 * A framework-dependent flag, set for each Wkt.Wkt() instance, that indicates
 * whether or not a closed polygon geometry should be interpreted as a rectangle.
 */
Wkt.Wkt.prototype.isRectangle = false;

/**
 * The framework's custom method for creating internal geometry from framework
 * geometry (e.g. Google Rectangle objects or google.maps.Rectangle)
 */
Wkt.Wkt.prototype.readGeometry = function() {
    var constructor = this.geometries[this.type];
};
