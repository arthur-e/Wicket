// Examples are modified from: http://en.wikipedia.org/wiki/Well-known_text#Geometric_objects
var point, linestring, polygon, polygon2, multipoint, multipoint2, multilinestring, multilinestring2, multipolygon, multipolygon2, runTests;

point = {
    str: 'POINT(30 10)',
    wrap: false
};

linestring = {
    str: 'LINESTRING(30 10,10 30,40 40)',
    wrap: false
};

// A closed polygon without any holes
polygon = {
    str: 'POLYGON((30 10,10 20,20 40,40 40,30 10))',
    wrap: false
};

// A polygon formatted for a URL (no spaces)
polygon2 = {
    str: 'POLYGON((30+10,10+20,20+40,40+40,30+10))',
    wrap: false
};

// A polygon with a hole in it
polygon3 = {
    str: 'POLYGON((35 10,10 20,15 40,45 45,35 10),(20 30,35 35,30 20,20 30))',
    wrap: false
};

// One way of describing multiple points
multipoint = {
    str: 'MULTIPOINT((10 40),(40 30),(20 20),(30 10))',
    wrap: true
};

// Another way of describing the same multiple points
multipoint2 = {
    str: 'MULTIPOINT(10 40,40 30,20 20,30 10)',
    wrap: false
};

multilinestring = {
    str: 'MULTILINESTRING((10 10,20 20,10 40),(40 40,30 30,40 20,30 10))',
    wrap: false
};

// Two polygons without holes
multipolygon = {
    str: 'MULTIPOLYGON(((30 20,10 40,45 40,30 20)),((15 5,40 10,10 20,5 10,15 5)))',
    wrap: false
};

// A multipolygon formatted for a URL (no spaces)
multipolygon2 = {
    str: 'MULTIPOLYGON(((30+20,10+40,45+40,30+20)),((15+5,40+10,10+20,5+10,15+5)))',
    wrap: false
};

// One polygon with a hole, one without
multipolygon3 = {
    str: 'MULTIPOLYGON(((40 40,20 45,45 30,40 40)),((20 35,45 20,30 5,10 10,10 30,20 35),(30 20,20 25,20 15,30 20)))',
    wrap: false
};

runTests = function() {
    var i, cases, wkt, obj;
    cases = [
        point,
        linestring,
        polygon,
        polygon2, 
        polygon3, // Google Maps API extension can't handle this (can't distinguish holes from polygons)
        multipoint, 
        multipoint2,
        multilinestring,
        multipolygon, 
        multipolygon2,
        multipolygon3 // Google Maps API extension can't handle this (can't distinguish holes from polygons)
    ];

    for (i = 0; i < cases.length; i += 1) {
        console.log("Running test case " + i);

        wkt = new Wkt.Wkt();

        wkt.read(cases[i].str);
        obj = wkt.toObject();

        foo = obj; // Implied global

        wkt = new Wkt.Wkt();
        wkt.fromObject(obj);

        if (cases[i].str.indexOf('+') > 0) {
            wkt.delimiter = '+';
        }

        wkt.wrapVertices = cases[i].wrap;

        if (wkt.write() !== cases[i].str) {
            console.log("Exception in runTests()");
            throw {
                name: "AssertionError",
                message: ('Output "' + wkt.write() + '" did not match expected "' + cases[i].str + '"')
            }
        }
    }

    console.log('All tests were successful!');

    return true;
}


