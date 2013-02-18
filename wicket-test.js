// Examples are modified from: http://en.wikipedia.org/wiki/Well-known_text#Geometric_objects
var point, linestring, polygon, polygon2, multipoint, multipoint2, multilinestring, multilinestring2, multipolygon, multipolygon2, runTests;

point = 'POINT(30 10)';

linestring = 'LINESTRING(30 10,10 30,40 40)';

// A closed polygon without any holes
polygon = 'POLYGON((30 10,10 20,20 40,40 40,30 10))';

// A polygon formatted for a URL (no spaces)
polygon2 = 'POLYGON((30+10,10+20,20+40,40+40,30+10))'; 

// A polygon with a hole in it
polygon3 = 'POLYGON((35 10,10 20,15 40,45 45,35 10), (20 30,35 35,30 20,20 30))';

// One way of describing multiple points
multipoint = 'MULTIPOINT((10 40),(40 30),(20 20),(30 10))';

// Another way of describing the same multiple points
multipoint2 = 'MULTIPOINT(10 40,40 30,20 20,30 10)';

multilinestring = 'MULTILINESTRING((10 10,20 20,10 40),(40 40,30 30,40 20,30 10))';

// Anothe way of describing the same multiple lines
multilinestring2 = 'MULTILINESTRING(((10 10),(20 20),(10 40)),((40 40),(30 30),(40 20),(30 10)))';

// Two polygons without holes
multipolygon = 'MULTIPOLYGON(((30 20,10 40,45 40,30 20)),((15 5,40 10,10 20,5 10,15 5)))';

// A multipolygon formatted for a URL (no spaces)
multipolygon2 = 'MULTIPOLYGON(((30+20,10+40,45+40,30+20)),((15+5,40+10,10+20,5+10,15+5)))';

// One polygon with a hole, one without
multipolygon3 = 'MULTIPOLYGON(((40 40,20 45,45 30,40 40)),((20 35,45 20,30 5,10 10,10 30,20 35),(30 20,20 25,20 15,30 20)))';

runTests = function() {
    var i, cases, wkt, obj;
    cases = [
        point,
        linestring,
        polygon,
        polygon2, 
        //multipoint, 
        //multipoint2, 
        //multilinestring,
        //multilinestring2, 
        multipolygon, 
        multipolygon2,
        multipolygon3
    ];

    for (i = 0; i < cases.length; i += 1) {
        wkt = new Wkt.Wkt();

        wkt.read(cases[i]);
        obj = wkt.toObject();

        wkt = new Wkt.Wkt();
        wkt.fromObject(obj);

        if (cases[i].indexOf('+') > 0) {
            wkt.delimiter = '+';
        }

        if (wkt.write() !== cases[i]) {
            console.log("Exception in runTests()");
            foo = obj;
            throw {
                name: "AssertionError",
                message: ('Expect output "' + wkt.write() + '" did not match input "' + cases[i] + '"')
            }
        }
    }

    console.log('All tests were successful!');
}


