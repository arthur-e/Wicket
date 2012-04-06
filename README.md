##########
# Wicket #
##########

################
## Motivation ##
################

##############
## Colophon ##
##############

###################
### Conventions ###
###################

The conventions I've adopted in writing this library:
* The Crockford-ian module pattern with a single global (namespace) variable
* The most un-Crockford-ian use of new to instantiate new Objects (when this is required, the Object begins with a capital letter e.g. new Wkt())
* The namespace is the only name beginning with a capital letter that doesn't need to and shouldn't be preceded by new
* The namespace is the result of a function allowing for private members
* Tricky operators (++ and --) and type-coercing operators (== and !=) are not used

########################
### Acknowledgements ###
########################
The following open sources were borrowed from; they retain all their original rights:
* The OpenLayers 2.7 WKT module (OpenLayers.Format.WKT)
* Chris Pietshmann's [article on converting Bing Maps shapes (VEShape) to WKT](http://pietschsoft.com/post/2009/04/04/Virtual-Earth-Shapes-%28VEShape%29-to-WKT-%28Well-Known-Text%29-and-Back-using-JavaScript.aspx)
* Charles R. Schmidt's and the Python Spatial Analysis Laboratory's (PySAL) WKT writer

##################
## Introduction ##
##################
WKT geometries are stored internally using the following convention. The atomic unit of geometry is the coordinate pair (e.g. latitude and longitude) which is represented by an Object with x and y properties. An Array with a single coordinate pair represents a a single point (i.e. POINT feature)

    [ {x: -83.123, y: 42.123} ]

An Array of multiple points (an Array of Arrays) specifies a "collection" of points (i.e. a MULTIPOINT feature):

    [
        [ {x: -83.123, y: 42.123} ],
        [ {x: -83.234, y: 42.234} ]
    ]

An Array of multiple coordinates specifies a collection of connected points in an ordered sequence (i.e. LINESTRING feature):

    [
        {x: -83.12, y: 42.12},
        {x: -83.23, y: 42.23},
        {x: -83.34, y: 42.34}
    ]

The difference between the two is specified elsewhere (in the Wkt instance's type) and must be retained.

An Array can also contain other Arrays. In these cases, the contained Arrays can represent a single polygon (i.e. POLYGON feature):

    [
     [
        {x: -83, y: 42},
        {x: -83, y: 43},
        {x: -82, y: 43},
        {x: -82, y: 42},
        {x: -83, y: 42}
     ]
    ]

Or a MULTIPOLYGON feature:

    [ 
     [
      [
        {x: -83, y: 42}, {x: -83, y: 43}, {x: -82, y: 43},
        {x: -82, y: 42}, {x: -83, y: 42}
      ]
     ],
     [ 
      [
        {x: -70, y: 40}, {x: -70, y: 41}, {x: -69, y: 41},
        {x: -69, y: 40}, {x: -70, y: 40}
      ]
     ],
    ]

Or a POLYGON with inner rings (holes) in it where the outer ring is the polygon envelope and comes first; subsequent Arrays are inner rings (holes):

    [ 
     [
        {x: 35, y: 10}, {x: 10, y: 20}, {x: 15, y: 40},
        {x: 45, y: 45}, {x: 35, y: 10}
     ],
     [
        {x: 20, y: 30}, {x: 35, y: 35}, {x: 30, y: 20},
        {x: 20, y: 30}
     ]
    ]

