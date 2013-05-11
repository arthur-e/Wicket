# Wicket #

Updated **May 11, 2013**. Wicket is a lightweight library for translating between [Well-Known Text (WKT)](http://en.wikipedia.org/wiki/Well-known_text) and various client-side mapping frameworks:
* [Leaflet](http://arthur-e.github.com/Wicket/)
* [Google Maps API](http://arthur-e.github.com/Wicket/sandbox-gmaps3.html)
* [ESRI ArcGIS JavaScript API](http://arthur-e.github.com/Wicket/sandbox-arcgis.html)

Check out a [live demo](http://arthur-e.github.com/Wicket/sandbox-gmaps3.html). 

## License ##

Wicket is released under the [GNU General Public License version 3 (GPLv3)](http://www.gnu.org/licenses/gpl.html).
Accordingly:

> This program is free software: you can redistribute it and/or modify
> it under the terms of the GNU General Public License as published by
> the Free Software Foundation, either version 3 of the License, or
> (at your option) any later version.

## Documentation ##

Read the documentation [here](http://arthur-e.github.io/Wicket/doc/out/). Documentation can be generated with [JSDoc 3](https://github.com/jsdoc3/jsdoc). I'm not a JSDoc 3 expert; feel free to revise the tags.

    git clone git://github.com/jsdoc3/jsdoc.git
    ./jsdoc /var/www/static/wicket/wicket.src.js

Or, with Node installed:

    sudo npm install -g git://github.com/jsdoc3/jsdoc.git
    jsdoc /var/www/static/wicket/wicket.src.js

Either way, make sure you invoke `jsdoc` from a directory you can write to; it will output documentation to your current working directory.

## Build Information ##

**Minified versions** of JavaScript files were generated using Google's [Closure compiler](https://developers.google.com/closure/compiler/docs/gettingstarted_app).
Once installed, minification can be invoked at the command line, as in the following example:

    java -jar /usr/local/closure/compiler.jar --compilation_level WHITESPACE_ONLY --js wicket-leaflet.src.js --js_output_file wicket-leaflet.js 

There is now a script included that will do this automatically for all of Wicket's source code:

    . refactor.sh

**Testing** Wicket is easy if you already have [Jasmine](https://github.com/pivotal/jasmine) installed. Here's a quick script to (describe how to) install it if you don't:

    sudo mkdir -p /var/www/static/
    cd /var/www/static/
    sudo git clone git://github.com/pivotal/jasmine.git
    cd jasmine/dist
    sudo unzip ./*.zip

Once you have Jasmine installed and the paths match those expected in `tests/SpecRunner.html` (or you changed them to match your Jasmine installation) then just point your browser to `localhost/static/wicket/tests/SpecRunner.html`.

## Example ##
The following examples work in any of the mapping environments, as Wicket has a uniform API regardless of the client-side mapping library you're using.

    // Create a new Wicket instance
    var wkt = new Wkt.Wkt();
    
    // Read in any kind of WKT string
    wkt.read("POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))");
    
    // Access and modify the underlying geometry
    console.log(wkt.components);
    // "[ [ {x: 30, y: 10}, {x: 10, y: 30}, ...] ]"
    wkt.components[0][1].x = 15;
    
    // Create a geometry object, ready to be mapped!
    wkt.toObject();
    
Wicket will read from the geometry objects of any mapping client it understands.

    var wkt = new Wkt.Wkt();
    
    // Deconstruct an existing point (or "marker") feature
    wkt.fromObject(somePointObject);
    
    console.log(wkt.components);
    // "[ {x: 10, y: 30} ]"
    
    // Serialize a WKT string from that geometry
    wkt.write();
    // "POINT(10 30)"

## Colophon ##

### Motivation ###

Wicket was created out of the need for a lightweight Javascript library that can translate Well-Known Text (WKT) strings into geographic features.
This problem arose in the context of [OpenClimateGIS](https://github.com/arthur-e/OpenClimateGIS), a web framework for accessing and subsetting online climate data.

OpenClimateGIS emits WKT representations of user-defined geometry.
The API Explorer allowed users to define arbitrary areas-of-interest (AOIs) and view predefined AOIs on a Google Maps API instance.
So, initially, the problem was converting between WKT strings and Google Maps API features.
While other mapping libraries, such as [OpenLayers](http://www.openlayers.org), have very nice WKT libraries built-in, the Google Maps API, as of this writing, does not.
In the (apparent) absence of a lightweight, easy-to-use WKT library in Javascript, I set out to create one.

That is what Wicket aspires to be: lightweight, framework-agnostic, and useful.
I hope it achieves these goals.
If you find it isn't living up to that and you have ideas on how to improve it, please fork the code or [drop me a line](mailto:kaendsle@mtu.edu).

### Acknowledgements ###

Wicket borrows heavily from the experiences of others who came before us:

* The OpenLayers 2.7 WKT module (OpenLayers.Format.WKT)
* Chris Pietshmann's [article on converting Bing Maps shapes (VEShape) to WKT](http://pietschsoft.com/post/2009/04/04/Virtual-Earth-Shapes-%28VEShape%29-to-WKT-%28Well-Known-Text%29-and-Back-using-JavaScript.aspx)
* Charles R. Schmidt's and the Python Spatial Analysis Laboratory's (PySAL) WKT writer

Contributors: [cuyahoga](https://github.com/cuyahoga), [Tom Nightingale (thegreat)](https://github.com/thegreat), [Aaron Ogle](https://github.com/atogle), [James Seppi](https://github.com/jseppi)

### Conventions ###

The base library, wicket.js, contains the Wkt.Wkt base object.
This object doesn't do anything on its own except read in WKT strings, allow the underlying geometry to be manipulated programmatically, and write WKT strings.
By loading additional libraries, such as wicket-gmap3.js, users can transform between between WKT and the features of a given framework (e.g. google.maps.Polygon instances). 
The intent is to add support for new frameworks as additional Javascript files that alter the Wkt.Wkt prototype.

**To extend Wicket**, nominally by writing bindings for a new mapping library, add a new file with a name like wicket-libname.src.js (and corresponding minified version wicket-libname.js) where "libname" is some reasonably short, well-known name for the mapping library.

## Concepts ##

WKT geometries are stored internally using the following convention. The atomic unit of geometry is the coordinate pair (e.g. latitude and longitude) which is represented by an Object with x and y properties. An Array with a single coordinate pair represents a a single point (i.e. POINT feature):

    [ {x: -83.123, y: 42.123} ]
    
    // POINT(-83.123 42.123)

An Array of multiple points (an Array of Arrays) specifies a "collection" of points (i.e. a MULTIPOINT feature):

    [
        [ {x: -83.123, y: 42.123} ],
        [ {x: -83.234, y: 42.234} ]
    ]
    // MULTIPOINT(-83.123 42.123,-83.234 42.234)

An Array of multiple coordinates specifies a collection of connected points in an ordered sequence (i.e. LINESTRING feature):

    [
        {x: -83.12, y: 42.12},
        {x: -83.23, y: 42.23},
        {x: -83.34, y: 42.34}
    ]
    // LINESTRING(-83.12 42.12,-83.23 42.23,-83.34 42.34)

An Array can also contain other Arrays. In these cases, the contained Array(s) can each represent one of two geometry types.
The contained Array might reprsent a single polygon (i.e. POLYGON feature):

    [
        [
            {x: -83, y: 42},
            {x: -83, y: 43},
            {x: -82, y: 43},
            {x: -82, y: 42},
            {x: -83, y: 42}
        ]
    ]
    // POLYGON(-83 42,-83 43,-82 43,-82 42,-83 42)

The above example cannot represent a LINESTRING feature (one of the few type-based constraints on the internal representations), however it may represent a MULTILINESTRING feature. Both POLYGON and MULTILINESTRING features are internally represented the same way. The difference between the two is specified elsewhere (in the Wkt instance's type) and must be retained. In this particular example (above), we can see that the first coordinate in the Array is repeated at the end, meaning that the geometry is closed. We can therefore infer it represents a POLYGON and not a MULTILINESTRING even before we plot it. Wicket retains the *type* of the feature and will always remember which it is.

Similarly, multiple nested Arrays might reprsent a MULTIPOLYGON feature:

    [ 
        [
            [
                {x: -83, y: 42},
                {x: -83, y: 43},
                {x: -82, y: 43},
                {x: -82, y: 42},
                {x: -83, y: 42}
            ]
        ],
        [ 
            [
                {x: -70, y: 40},
                {x: -70, y: 41},
                {x: -69, y: 41},
                {x: -69, y: 40},
                {x: -70, y: 40}
            ]
        ]
    ]
    // MULTIPOLYGON(((-83 42,-83 43,-82 43,-82 42,-83 42),(-70 40,-70 41,-69 41,-69 40,-70 40)))

Or a POLYGON with inner rings (holes) in it where the outer ring is the polygon envelope and comes first; subsequent Arrays are inner rings (holes):

    [ 
        [
            {x: 35, y: 10},
            {x: 10, y: 20},
            {x: 15, y: 40},
            {x: 45, y: 45},
            {x: 35, y: 10}
        ],
        [
            {x: 20, y: 30},
            {x: 35, y: 35},
            {x: 30, y: 20},
            {x: 20, y: 30}
        ]
    ]
    // POLYGON((35 10,10 20,15 40,45 45,35 10),(20 30,35 35,30 20,20 30))

Or they might represent a MULTILINESTRING where each nested Array is a different LINESTRING in the collection. Again, Wicket remembers the correct *type* of feature even though the internal representation is ambiguous.
