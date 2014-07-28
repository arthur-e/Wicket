var Wkt = require('../wicket');
var expect = require('chai').expect;

describe('Consistent Design Patterns', function() {

    it('should read WKT string when instantiated', function() {
        var wkt = new Wkt.Wkt('POINT(30 10)');

        expect(wkt.components).deep.equal([{
            x: 30,
            y: 10
        }]);
    });

    it('should correctly identify an Array', function() {
        expect(Wkt.isArray([0, 1])).equal(true);
        expect(Wkt.isArray({
            x: 0,
            y: 1
        })).equal(false);
        expect(Wkt.isArray(0)).equal(false);
        expect(Wkt.isArray(new Date())).equal(false);
    });

});

describe('Standard WKT Test Cases: ', function() {
    var cases, wkt;

    wkt = new Wkt.Wkt();

    cases = {

        point: {
            str: 'POINT(30 10)',
            cmp: [{
                x: 30,
                y: 10
            }]
        },

        linestring: {
            str: 'LINESTRING(30 10,10 30,40 40)',
            cmp: [{
                x: 30,
                y: 10
            }, {
                x: 10,
                y: 30
            }, {
                x: 40,
                y: 40
            }]
        },

        polygon: {
            str: 'POLYGON((30 10,10 20,20 40,40 40,30 10))',
            cmp: [
                [{
                    x: 30,
                    y: 10
                }, {
                    x: 10,
                    y: 20
                }, {
                    x: 20,
                    y: 40
                }, {
                    x: 40,
                    y: 40
                }, {
                    x: 30,
                    y: 10
                }]
            ]
        },

        polygon2: {
            str: 'POLYGON((35 10,10 20,15 40,45 45,35 10),(20 30,35 35,30 20,20 30))',
            cmp: [
                [{
                    x: 35,
                    y: 10
                }, {
                    x: 10,
                    y: 20
                }, {
                    x: 15,
                    y: 40
                }, {
                    x: 45,
                    y: 45
                }, {
                    x: 35,
                    y: 10
                }],
                [{
                    x: 20,
                    y: 30
                }, {
                    x: 35,
                    y: 35
                }, {
                    x: 30,
                    y: 20
                }, {
                    x: 20,
                    y: 30
                }]
            ]
        },

        multipoint: {
            str: 'MULTIPOINT((10 40),(40 30),(20 20),(30 10))',
            cmp: [
                [{
                    x: 10,
                    y: 40
                }],
                [{
                    x: 40,
                    y: 30
                }],
                [{
                    x: 20,
                    y: 20
                }],
                [{
                    x: 30,
                    y: 10
                }]
            ]
        },

        multipoint2: {
            str: 'MULTIPOINT(10 40,40 30,20 20,30 10)',
            cmp: [
                [{
                    x: 10,
                    y: 40
                }],
                [{
                    x: 40,
                    y: 30
                }],
                [{
                    x: 20,
                    y: 20
                }],
                [{
                    x: 30,
                    y: 10
                }]
            ]
        },

        multilinestring: {
            str: 'MULTILINESTRING((10 10,20 20,10 40),(40 40,30 30,40 20,30 10))',
            cmp: [
                [{
                    x: 10,
                    y: 10
                }, {
                    x: 20,
                    y: 20
                }, {
                    x: 10,
                    y: 40
                }],
                [{
                    x: 40,
                    y: 40
                }, {
                    x: 30,
                    y: 30
                }, {
                    x: 40,
                    y: 20
                }, {
                    x: 30,
                    y: 10
                }]
            ]
        },

        multipolygon: {
            str: 'MULTIPOLYGON(((30 20,10 40,45 40,30 20)),((15 5,40 10,10 20,5 10,15 5)))',
            cmp: [
                [
                    [{
                        x: 30,
                        y: 20
                    }, {
                        x: 10,
                        y: 40
                    }, {
                        x: 45,
                        y: 40
                    }, {
                        x: 30,
                        y: 20
                    }, ]
                ],
                [
                    [{
                        x: 15,
                        y: 5
                    }, {
                        x: 40,
                        y: 10
                    }, {
                        x: 10,
                        y: 20
                    }, {
                        x: 5,
                        y: 10
                    }, {
                        x: 15,
                        y: 5
                    }]
                ]
            ]
        },

        multipolygon2: {
            str: 'MULTIPOLYGON(((40 40,20 45,45 30,40 40)),((20 35,45 20,30 5,10 10,10 30,20 35),(30 20,20 25,20 15,30 20)))',
            cmp: [
                [
                    [{
                        x: 40,
                        y: 40
                    }, {
                        x: 20,
                        y: 45
                    }, {
                        x: 45,
                        y: 30
                    }, {
                        x: 40,
                        y: 40
                    }, ]
                ],
                [
                    [{
                        x: 20,
                        y: 35
                    }, {
                        x: 45,
                        y: 20
                    }, {
                        x: 30,
                        y: 5
                    }, {
                        x: 10,
                        y: 10
                    }, {
                        x: 10,
                        y: 30
                    }, {
                        x: 20,
                        y: 35
                    }, ],
                    [{
                        x: 30,
                        y: 20
                    }, {
                        x: 20,
                        y: 25
                    }, {
                        x: 20,
                        y: 15
                    }, {
                        x: 30,
                        y: 20
                    }]
                ]
            ]
        },

        box: {
            str: 'BOX(0 0,20 20)',
            cmp: [{
                x: 0,
                y: 0
            }, {
                x: 20,
                y: 20
            }]
        }

    };

    describe('Reading WKT Strings: ', function() {

        afterEach(function() {
            wkt.delimiter = ' ';
        });

        it('should read basic POINT string', function() {
            wkt.read(cases.point.str);

            expect(wkt.type).equal('point');
            expect(wkt.isCollection()).equal(false);
            expect(wkt.components).deep.equal(cases.point.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.point.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.point.cmp);
        });

        it('should read basic LINESTRING string', function() {
            wkt.read(cases.linestring.str);

            expect(wkt.type).equal('linestring');
            expect(wkt.isCollection()).equal(false);
            expect(wkt.components).deep.equal(cases.linestring.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.linestring.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.linestring.cmp);
        });

        it('should read basic POLYGON string', function() {
            wkt.read(cases.polygon.str);

            expect(wkt.type).equal('polygon');
            expect(wkt.isCollection()).equal(true);
            expect(wkt.components).deep.equal(cases.polygon.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.polygon.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.polygon.cmp);
        });

        it('should read basic POLYGON string with one (1) hole', function() {
            wkt.read(cases.polygon2.str);

            expect(wkt.type).equal('polygon');
            expect(wkt.isCollection()).equal(true);
            expect(wkt.components).deep.equal(cases.polygon2.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.polygon2.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.polygon2.cmp);
        });

        it('should read basic MULTIPOINT string with wrapped vertices', function() {
            wkt.read(cases.multipoint.str);

            expect(wkt.type).equal('multipoint');
            expect(wkt.isCollection()).equal(true);
            expect(wkt.components).deep.equal(cases.multipoint.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.multipoint.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.multipoint.cmp);
        });

        it('should read basic MULTIPOINT string without wrapped vertices', function() {
            wkt.read(cases.multipoint2.str);

            expect(wkt.type).equal('multipoint');
            expect(wkt.isCollection()).equal(true);
            expect(wkt.components).deep.equal(cases.multipoint2.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.multipoint2.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.multipoint2.cmp);
        });

        it('should read basic MULTILINESTRING string', function() {
            wkt.read(cases.multilinestring.str);

            expect(wkt.type).equal('multilinestring');
            expect(wkt.isCollection()).equal(true);
            expect(wkt.components).deep.equal(cases.multilinestring.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.multilinestring.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.multilinestring.cmp);
        });

        it('should read basic MULTIPOLYGON string', function() {
            wkt.read(cases.multipolygon.str);

            expect(wkt.type).equal('multipolygon');
            expect(wkt.isCollection()).equal(true);
            expect(wkt.components).deep.equal(cases.multipolygon.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.multipolygon.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.multipolygon.cmp);
        });

        it('should read basic MULTIPOLYGON string with two (2) polygons, one with one (1) hole', function() {
            wkt.read(cases.multipolygon2.str);

            expect(wkt.type).equal('multipolygon');
            expect(wkt.isCollection()).equal(true);
            expect(wkt.components).deep.equal(cases.multipolygon2.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.multipolygon2.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.multipolygon2.cmp);
        });

        it('should read basic PostGIS 2DBOX string', function() {
            wkt.read(cases.box.str);

            expect(wkt.type).equal('box');
            expect(wkt.isCollection()).equal(false);
            expect(wkt.components).deep.equal(cases.box.cmp);

            // Now try it for URLs
            wkt.delimiter = '+';
            wkt.read(cases.box.str.replace(/ /g, '+'));
            expect(wkt.components).deep.equal(cases.box.cmp);
        });

    }); // eo describe()

    describe('Writing Well-Formed WKT Strings: ', function() {

        afterEach(function() {
            wkt.wrapVertices = false;
            wkt.delimiter = ' ';
        });

        it('should write basic POINT string', function() {
            wkt.components = cases.point.cmp;
            wkt.type = 'point';

            expect(wkt.write()).equal(cases.point.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.point.str.replace(/ /g, '+'));
        });

        it('should write basic LINESTRING string', function() {
            wkt.components = cases.linestring.cmp;
            wkt.type = 'linestring';

            expect(wkt.write()).equal(cases.linestring.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.linestring.str.replace(/ /g, '+'));
        });

        it('should write basic POLYGON string', function() {
            wkt.components = cases.polygon.cmp;
            wkt.type = 'polygon';

            expect(wkt.write()).equal(cases.polygon.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.polygon.str.replace(/ /g, '+'));
        });

        it('should write basic POLYGON string with one (1) hole', function() {
            wkt.components = cases.polygon2.cmp;
            wkt.type = 'polygon';

            expect(wkt.write()).equal(cases.polygon2.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.polygon2.str.replace(/ /g, '+'));
        });

        it('should write basic MULTIPOINT string with wrapped vertices', function() {
            wkt.components = cases.multipoint.cmp;
            wkt.type = 'multipoint';
            wkt.wrapVertices = true;

            expect(wkt.write()).equal(cases.multipoint.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.multipoint.str.replace(/ /g, '+'));
        });

        it('should write basic MULTIPOINT string without wrapped vertices', function() {
            wkt.components = cases.multipoint2.cmp;
            wkt.type = 'multipoint';
            wkt.wrapVertices = false;

            expect(wkt.write()).equal(cases.multipoint2.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.multipoint2.str.replace(/ /g, '+'));
        });

        it('should write basic MULTILINESTRING string', function() {
            wkt.components = cases.multilinestring.cmp;
            wkt.type = 'multilinestring';

            expect(wkt.write()).equal(cases.multilinestring.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.multilinestring.str.replace(/ /g, '+'));
        });

        it('should write basic MULTIPOLYGON string', function() {
            wkt.components = cases.multipolygon.cmp;
            wkt.type = 'multipolygon';

            expect(wkt.write()).equal(cases.multipolygon.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.multipolygon.str.replace(/ /g, '+'));
        });

        it('should write basic MULTIPOLYGON string with two (2) polygons, one with one (1) hole', function() {
            wkt.components = cases.multipolygon2.cmp;
            wkt.type = 'multipolygon';

            expect(wkt.write()).equal(cases.multipolygon2.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.multipolygon2.str.replace(/ /g, '+'));
        });

        it('should write basic PostGIS 2DBOX string', function() {
            wkt.components = cases.box.cmp;
            wkt.type = 'box';

            expect(wkt.write()).equal(cases.box.str);

            // Now try it for URLs
            wkt.delimiter = '+';
            expect(wkt.write()).equal(cases.box.str.replace(/ /g, '+'));
        });

    });

}); // eo describe()

describe('Arbitrary WKT Test Cases: ', function() {
    var cases, wkt;

    wkt = new Wkt.Wkt();

    function randomLat(a, b) {
        var n;

        a = a || 0;
        b = b || 90;
        n = Math.random() * (a + (b - a));
        return (Math.random() < 0.5) ? -n : n;
    };

    function randomLng(a, b) {
        var n;

        a = a || 0;
        b = b || 180;
        n = Math.random() * (a + (b - a));
        return (Math.random() < 0.5) ? -n : n;
    };

    function randomCoords(n, a1, b1, a2, b2) {
        var i, c, cs;

        i = 0;
        a1 = a1 || 0;
        b1 = b1 || 180;
        a2 = a2 || 0;
        b2 = b2 || 90;
        cs = [];

        while (i < n) {
            cs.push({
                x: randomLng(a1, b1),
                y: randomLat(a2, b2)
            });
            i += 1;
        }

        return cs;
    };

    it('should be able to read WKT strings with bizarre whitespace', function() {
        wkt.read('  LINESTRING  ( 30  10, 10 30, 40 40) ');
        expect(wkt.write()).equal('LINESTRING(30 10,10 30,40 40)');
    });

    it('should be able to read WKT strings with (somewhat) arbitrary precision', function() {
        wkt.read('MULTIPOINT((9.12345 40),(40 30),(20 19.999999),(30 10.000001))');
        expect(wkt.write()).equal('MULTIPOINT((9.12345 40),(40 30),(20 19.999999),(30 10.000001))');
    });

    describe('Working with Random Coordinates: ', function() {
        var c;

        it('should read and write arbitrary POINT string', function() {
            c = wkt.components = randomCoords(1);
            wkt.type = 'point';

            expect(wkt.read(wkt.write()).components).deep.equal(c);
        });

        it('should read and write long, arbitrary LINESTRING string', function() {
            c = wkt.components = randomCoords(100);
            wkt.type = 'linestring';

            expect(wkt.read(wkt.write()).components).deep.equal(c);
        });

        it('should read and write long, arbitrary POLYGON string', function() {
            c = wkt.components = [randomCoords(100)];
            wkt.type = 'polygon';

            expect(wkt.read(wkt.write()).components).deep.equal(c);
        });

    });
});

describe('Edge Cases: ', function() {
    var wkt = new Wkt.Wkt();

    afterEach(function() {
        wkt.wrapVertices = false;
        wkt.delimiter = ' ';
    });

    it('should read a POINT string with single-digit coordinates', function() {
        var test = {
            str: 'POINT(4 4)',
            cmp: [{
                x: 4,
                y: 4
            }]
        };

        wkt.read(test.str);

        expect(wkt.type).equal('point');
        expect(wkt.isCollection()).equal(false);
        expect(wkt.components).deep.equal(test.cmp);

        // Now try it for URLs
        wkt.delimiter = '+';
        wkt.read(test.str.replace(/ /g, '+'));
        expect(wkt.components).deep.equal(test.cmp);
    });

    it('should read a LINESTRING string with single-digit coordinates', function() {
        var test = {
            str: 'LINESTRING(4 4,3 5,6 7)',
            cmp: [{
                x: 4,
                y: 4
            }, {
                x: 3,
                y: 5
            }, {
                x: 6,
                y: 7
            }]
        };

        wkt.read(test.str);

        expect(wkt.type).equal('linestring');
        expect(wkt.isCollection()).equal(false);
        expect(wkt.components).deep.equal(test.cmp);

        // Now try it for URLs
        wkt.delimiter = '+';
        wkt.read(test.str.replace(/ /g, '+'));
        expect(wkt.components).deep.equal(test.cmp);
    });

    it('should read a POLYGON string with single-digit coordinates', function() {
        var test = {
            str: 'POLYGON((4 4,3 5,6 7,7 5,4 4))',
            cmp: [
                [{
                    x: 4,
                    y: 4
                }, {
                    x: 3,
                    y: 5
                }, {
                    x: 6,
                    y: 7
                }, {
                    x: 7,
                    y: 5
                }, {
                    x: 4,
                    y: 4
                }]
            ]
        };

        wkt.read(test.str);

        expect(wkt.type).equal('polygon');
        expect(wkt.isCollection()).equal(true);
        expect(wkt.components).deep.equal(test.cmp);

        // Now try it for URLs
        wkt.delimiter = '+';
        wkt.read(test.str.replace(/ /g, '+'));
        expect(wkt.components).deep.equal(test.cmp);
    });

    it('should read a POLYGON string with excess precision', function() {
        var test = {
            str: 'POLYGON((4.1234 4,3 5,6 7,7 5.5678,4 4))',
            cmp: [
                [{
                    x: 4.1234,
                    y: 4
                }, {
                    x: 3,
                    y: 5
                }, {
                    x: 6,
                    y: 7
                }, {
                    x: 7,
                    y: 5.5678
                }, {
                    x: 4,
                    y: 4
                }]
            ]
        };

        wkt.read(test.str);

        expect(wkt.type).equal('polygon');
        expect(wkt.isCollection()).equal(true);
        expect(wkt.components).deep.equal(test.cmp);

        // Now try it for URLs
        wkt.delimiter = '+';
        wkt.read(test.str.replace(/ /g, '+'));
        expect(wkt.components).deep.equal(test.cmp);
    });

}); // eo describe()

describe('Merged WKT Test Cases: ', function() {
    var cases = {

        pointA: {
            str: 'POINT(30 10)',
            cmp: [{
                x: 30,
                y: 10
            }]
        },

        pointB: {
            str: 'POINT(25 45)',
            cmp: [{
                x: 25,
                y: 45
            }]
        },

        linestringA: {
            str: 'LINESTRING(25 15,15 35,35 35)',
            cmp: [{
                x: 25,
                y: 15
            }, {
                x: 15,
                y: 35
            }, {
                x: 35,
                y: 35
            }]
        },

        linestringB: {
            str: 'LINESTRING(30 10,10 30,40 40)',
            cmp: [{
                x: 30,
                y: 10
            }, {
                x: 10,
                y: 30
            }, {
                x: 40,
                y: 40
            }]
        },

        polygonA: {
            str: 'POLYGON((30 10,10 20,20 40,40 40,30 10))',
            cmp: [
                [{
                    x: 30,
                    y: 10
                }, {
                    x: 10,
                    y: 20
                }, {
                    x: 20,
                    y: 40
                }, {
                    x: 40,
                    y: 40
                }, {
                    x: 30,
                    y: 10
                }]
            ]
        },

        polygonB: {
            str: 'POLYGON((35 15,15 25,25 45,45 45,35 15))',
            cmp: [
                [{
                    x: 35,
                    y: 15
                }, {
                    x: 15,
                    y: 25
                }, {
                    x: 25,
                    y: 45
                }, {
                    x: 45,
                    y: 45
                }, {
                    x: 35,
                    y: 15
                }]
            ]
        },

        polygon2A: {
            str: 'POLYGON((35 10,10 20,15 40,45 45,35 10),(20 30,35 35,30 20,20 30))',
            cmp: [
                [{
                    x: 35,
                    y: 10
                }, {
                    x: 10,
                    y: 20
                }, {
                    x: 15,
                    y: 40
                }, {
                    x: 45,
                    y: 45
                }, {
                    x: 35,
                    y: 10
                }],
                [{
                    x: 20,
                    y: 30
                }, {
                    x: 35,
                    y: 35
                }, {
                    x: 30,
                    y: 20
                }, {
                    x: 20,
                    y: 30
                }]
            ]
        },

        polygon2B: {
            str: 'POLYGON((135 110,110 120,115 140,145 145,135 110),(120 130,135 135,130 120,120 130))',
            cmp: [
                [{
                    x: 135,
                    y: 110
                }, {
                    x: 110,
                    y: 120
                }, {
                    x: 115,
                    y: 140
                }, {
                    x: 145,
                    y: 145
                }, {
                    x: 135,
                    y: 110
                }],
                [{
                    x: 120,
                    y: 130
                }, {
                    x: 135,
                    y: 135
                }, {
                    x: 130,
                    y: 120
                }, {
                    x: 120,
                    y: 130
                }]
            ]
        },

        multipointA: {
            str: 'MULTIPOINT((10 40),(40 30),(20 20),(30 10))',
            cmp: [
                [{
                    x: 10,
                    y: 40
                }],
                [{
                    x: 40,
                    y: 30
                }],
                [{
                    x: 20,
                    y: 20
                }],
                [{
                    x: 30,
                    y: 10
                }]
            ]
        },

        multipointB: {
            str: 'MULTIPOINT((15 45),(45 35),(25 25),(35 15))',
            cmp: [
                [{
                    x: 15,
                    y: 45
                }],
                [{
                    x: 45,
                    y: 35
                }],
                [{
                    x: 25,
                    y: 25
                }],
                [{
                    x: 35,
                    y: 15
                }]
            ]
        },

        multilinestringA: {
            str: 'MULTILINESTRING((10 10,20 20,10 40),(40 40,30 30,40 20,30 10))',
            cmp: [
                [{
                    x: 10,
                    y: 10
                }, {
                    x: 20,
                    y: 20
                }, {
                    x: 10,
                    y: 40
                }],
                [{
                    x: 40,
                    y: 40
                }, {
                    x: 30,
                    y: 30
                }, {
                    x: 40,
                    y: 20
                }, {
                    x: 30,
                    y: 10
                }]
            ]
        },

        multilinestringB: {
            str: 'MULTILINESTRING((15 15,25 25,15 45),(45 45,35 35,45 25,35 15))',
            cmp: [
                [{
                    x: 15,
                    y: 15
                }, {
                    x: 25,
                    y: 25
                }, {
                    x: 15,
                    y: 45
                }],
                [{
                    x: 45,
                    y: 45
                }, {
                    x: 35,
                    y: 35
                }, {
                    x: 45,
                    y: 25
                }, {
                    x: 35,
                    y: 15
                }]
            ]
        },

        multipolygonA: {
            str: 'MULTIPOLYGON(((30 20,10 40,45 40,30 20)),((15 5,40 10,10 20,5 10,15 5)))',
            cmp: [
                [
                    [{
                        x: 30,
                        y: 20
                    }, {
                        x: 10,
                        y: 40
                    }, {
                        x: 45,
                        y: 40
                    }, {
                        x: 30,
                        y: 20
                    }, ]
                ],
                [
                    [{
                        x: 15,
                        y: 5
                    }, {
                        x: 40,
                        y: 10
                    }, {
                        x: 10,
                        y: 20
                    }, {
                        x: 5,
                        y: 10
                    }, {
                        x: 15,
                        y: 5
                    }]
                ]
            ]
        },

        multipolygonB: {
            str: 'MULTIPOLYGON(((130 120,110 140,145 140,130 120)),((115 15,140 110,110 120,15 110,115 15)))',
            cmp: [
                [
                    [{
                        x: 130,
                        y: 120
                    }, {
                        x: 110,
                        y: 140
                    }, {
                        x: 145,
                        y: 140
                    }, {
                        x: 130,
                        y: 120
                    }, ]
                ],
                [
                    [{
                        x: 115,
                        y: 15
                    }, {
                        x: 140,
                        y: 110
                    }, {
                        x: 110,
                        y: 120
                    }, {
                        x: 15,
                        y: 110
                    }, {
                        x: 115,
                        y: 15
                    }]
                ]
            ]
        }

    };

    it('should merge POINT strings together', function() {
        var a = new Wkt.Wkt(cases.pointA.str),
            b = new Wkt.Wkt(cases.pointB.str);

        a.merge(b);
        expect(a.type).equal('multipoint');
        expect(b.type).equal('point');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(false);
        expect(a.write()).equal('MULTIPOINT((30 10),(25 45))');
        expect(a.components).deep.equal([
            [{
                x: 30,
                y: 10
            }, {
                x: 25,
                y: 45
            }]
        ]);

    });

    it('should merge LINESTRING strings together', function() {
        var a = new Wkt.Wkt(cases.linestringA.str),
            b = new Wkt.Wkt(cases.linestringB.str);

        a.merge(b);
        expect(a.type).equal('multilinestring');
        expect(b.type).equal('linestring');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(false);
        expect(a.write()).equal('MULTILINESTRING((25 15,15 35,35 35),(30 10,10 30,40 40))');
        expect(a.components).deep.equal([
            [{
                x: 25,
                y: 15
            }, {
                x: 15,
                y: 35
            }, {
                x: 35,
                y: 35
            }],
            [{
                x: 30,
                y: 10
            }, {
                x: 10,
                y: 30
            }, {
                x: 40,
                y: 40
            }]
        ]);

    });

    it('should merge POLYGON strings together', function() {
        var a = new Wkt.Wkt(cases.polygonA.str),
            b = new Wkt.Wkt(cases.polygonB.str);

        a.merge(b);
        expect(a.type).equal('multipolygon');
        expect(b.type).equal('polygon');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(true);
        expect(a.write()).equal('MULTIPOLYGON(((30 10,10 20,20 40,40 40,30 10)),((35 15,15 25,25 45,45 45,35 15)))');
        expect(a.components).deep.equal([
            [
                [{
                    x: 30,
                    y: 10
                }, {
                    x: 10,
                    y: 20
                }, {
                    x: 20,
                    y: 40
                }, {
                    x: 40,
                    y: 40
                }, {
                    x: 30,
                    y: 10
                }]
            ],
            [
                [{
                    x: 35,
                    y: 15
                }, {
                    x: 15,
                    y: 25
                }, {
                    x: 25,
                    y: 45
                }, {
                    x: 45,
                    y: 45
                }, {
                    x: 35,
                    y: 15
                }]
            ]
        ]);

    });

    it('should merge POLYGON strings together even if they have holes', function() {
        var a = new Wkt.Wkt(cases.polygon2A.str),
            b = new Wkt.Wkt(cases.polygon2B.str);

        a.merge(b);
        expect(a.type).equal('multipolygon');
        expect(b.type).equal('polygon');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(true);
        expect(a.write()).equal('MULTIPOLYGON(((35 10,10 20,15 40,45 45,35 10),(20 30,35 35,30 20,20 30)),((135 110,110 120,115 140,145 145,135 110),(120 130,135 135,130 120,120 130)))');
        expect(a.components).deep.equal([
            [
                [{
                    x: 35,
                    y: 10
                }, {
                    x: 10,
                    y: 20
                }, {
                    x: 15,
                    y: 40
                }, {
                    x: 45,
                    y: 45
                }, {
                    x: 35,
                    y: 10
                }],
                [{
                    x: 20,
                    y: 30
                }, {
                    x: 35,
                    y: 35
                }, {
                    x: 30,
                    y: 20
                }, {
                    x: 20,
                    y: 30
                }]
            ],
            [
                [{
                    x: 135,
                    y: 110
                }, {
                    x: 110,
                    y: 120
                }, {
                    x: 115,
                    y: 140
                }, {
                    x: 145,
                    y: 145
                }, {
                    x: 135,
                    y: 110
                }],
                [{
                    x: 120,
                    y: 130
                }, {
                    x: 135,
                    y: 135
                }, {
                    x: 130,
                    y: 120
                }, {
                    x: 120,
                    y: 130
                }]
            ]
        ]);

    });

    it('should merge MULTIPOINT strings together', function() {
        var a = new Wkt.Wkt(cases.multipointA.str),
            b = new Wkt.Wkt(cases.multipointB.str);

        a.merge(b);
        expect(a.type).equal('multipoint');
        expect(b.type).equal('multipoint');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(true);
        expect(a.write()).equal('MULTIPOINT((10 40),(40 30),(20 20),(30 10),(15 45),(45 35),(25 25),(35 15))');
        expect(a.components).deep.equal([
            [{
                x: 10,
                y: 40
            }],
            [{
                x: 40,
                y: 30
            }],
            [{
                x: 20,
                y: 20
            }],
            [{
                x: 30,
                y: 10
            }],
            [{
                x: 15,
                y: 45
            }],
            [{
                x: 45,
                y: 35
            }],
            [{
                x: 25,
                y: 25
            }],
            [{
                x: 35,
                y: 15
            }]
        ]);

    });

    it('should merge MULTILINESTRING strings together', function() {
        var a = new Wkt.Wkt(cases.multilinestringA.str),
            b = new Wkt.Wkt(cases.multilinestringB.str);

        a.merge(b);
        expect(a.type).equal('multilinestring');
        expect(b.type).equal('multilinestring');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(true);
        expect(a.write()).equal('MULTILINESTRING((10 10,20 20,10 40),(40 40,30 30,40 20,30 10),(15 15,25 25,15 45),(45 45,35 35,45 25,35 15))');
        expect(a.components).deep.equal([
            [{
                x: 10,
                y: 10
            }, {
                x: 20,
                y: 20
            }, {
                x: 10,
                y: 40
            }],
            [{
                x: 40,
                y: 40
            }, {
                x: 30,
                y: 30
            }, {
                x: 40,
                y: 20
            }, {
                x: 30,
                y: 10
            }],
            [{
                x: 15,
                y: 15
            }, {
                x: 25,
                y: 25
            }, {
                x: 15,
                y: 45
            }],
            [{
                x: 45,
                y: 45
            }, {
                x: 35,
                y: 35
            }, {
                x: 45,
                y: 25
            }, {
                x: 35,
                y: 15
            }]
        ]);

    });

    it('should merge MULTIPOLYGON strings together', function() {
        var a = new Wkt.Wkt(cases.multipolygonA.str),
            b = new Wkt.Wkt(cases.multipolygonB.str);

        a.merge(b);
        expect(a.type).equal('multipolygon');
        expect(b.type).equal('multipolygon');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(true);
        expect(a.write()).equal('MULTIPOLYGON(((30 20,10 40,45 40,30 20)),((15 5,40 10,10 20,5 10,15 5)),((130 120,110 140,145 140,130 120)),((115 15,140 110,110 120,15 110,115 15)))');
        expect(a.components).deep.equal([
            [
                [{
                    x: 30,
                    y: 20
                }, {
                    x: 10,
                    y: 40
                }, {
                    x: 45,
                    y: 40
                }, {
                    x: 30,
                    y: 20
                }, ]
            ],
            [
                [{
                    x: 15,
                    y: 5
                }, {
                    x: 40,
                    y: 10
                }, {
                    x: 10,
                    y: 20
                }, {
                    x: 5,
                    y: 10
                }, {
                    x: 15,
                    y: 5
                }]
            ],
            [
                [{
                    x: 130,
                    y: 120
                }, {
                    x: 110,
                    y: 140
                }, {
                    x: 145,
                    y: 140
                }, {
                    x: 130,
                    y: 120
                }, ]
            ],
            [
                [{
                    x: 115,
                    y: 15
                }, {
                    x: 140,
                    y: 110
                }, {
                    x: 110,
                    y: 120
                }, {
                    x: 15,
                    y: 110
                }, {
                    x: 115,
                    y: 15
                }]
            ]
        ]);

    });

    it('should merge POINT strings into MULTIPOINT strings', function() {
        var a = new Wkt.Wkt(cases.multipointA.str),
            b = new Wkt.Wkt(cases.pointB.str);

        a.merge(b);
        expect(a.type).equal('multipoint');
        expect(b.type).equal('point');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(false);
        expect(a.write()).equal('MULTIPOINT((10 40),(40 30),(20 20),(30 10),(25 45))');
        expect(a.components).deep.equal([
            [{
                x: 10,
                y: 40
            }],
            [{
                x: 40,
                y: 30
            }],
            [{
                x: 20,
                y: 20
            }],
            [{
                x: 30,
                y: 10
            }],
            [{
                x: 25,
                y: 45
            }]
        ]);

    });

    it('should merge LINESTRING strings into MULTILINESTRING strings', function() {
        var a = new Wkt.Wkt(cases.multilinestringA.str),
            b = new Wkt.Wkt(cases.linestringB.str);

        a.merge(b);
        expect(a.type).equal('multilinestring');
        expect(b.type).equal('linestring');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(false);
        expect(a.write()).equal('MULTILINESTRING((10 10,20 20,10 40),(40 40,30 30,40 20,30 10),(30 10,10 30,40 40))');
        expect(a.components).deep.equal([
            [{
                x: 10,
                y: 10
            }, {
                x: 20,
                y: 20
            }, {
                x: 10,
                y: 40
            }],
            [{
                x: 40,
                y: 40
            }, {
                x: 30,
                y: 30
            }, {
                x: 40,
                y: 20
            }, {
                x: 30,
                y: 10
            }],
            [{
                x: 30,
                y: 10
            }, {
                x: 10,
                y: 30
            }, {
                x: 40,
                y: 40
            }]
        ]);

    });

    it('should merge POLYGON strings into MULTIPOLYGON strings', function() {
        var a = new Wkt.Wkt(cases.multipolygonA.str),
            b = new Wkt.Wkt(cases.polygonB.str);

        a.merge(b);
        expect(a.type).equal('multipolygon');
        expect(b.type).equal('polygon');
        expect(a.isCollection()).equal(true);
        expect(b.isCollection()).equal(true);
        expect(a.write()).equal('MULTIPOLYGON(((30 20,10 40,45 40,30 20)),((15 5,40 10,10 20,5 10,15 5)),((35 15,15 25,25 45,45 45,35 15)))');
        expect(a.components).deep.equal([
            [
                [{
                    x: 30,
                    y: 20
                }, {
                    x: 10,
                    y: 40
                }, {
                    x: 45,
                    y: 40
                }, {
                    x: 30,
                    y: 20
                }, ]
            ],
            [
                [{
                    x: 15,
                    y: 5
                }, {
                    x: 40,
                    y: 10
                }, {
                    x: 10,
                    y: 20
                }, {
                    x: 5,
                    y: 10
                }, {
                    x: 15,
                    y: 5
                }]
            ],
            [
                [{
                    x: 35,
                    y: 15
                }, {
                    x: 15,
                    y: 25
                }, {
                    x: 25,
                    y: 45
                }, {
                    x: 45,
                    y: 45
                }, {
                    x: 35,
                    y: 15
                }]
            ]
        ]);

    });

});

describe('GeoJSON Cases:', function() {
    var cases = { // See: http://en.wikipedia.org/wiki/GeoJSON#Geometries

        point: {
            str: 'POINT(30 10)',
            json: {
                'coordinates': [30, 10],
                'type': 'Point'
            },
            jsonStr: '{"coordinates": [30, 10], "type": "Point"}'
        },

        linestring: {
            str: 'LINESTRING(30 10,10 30,40 40)',
            json: {
                'coordinates': [
                    [30, 10],
                    [10, 30],
                    [40, 40]
                ],
                'type': 'LineString'
            },
            jsonStr: '{"coordinates": [[30, 10], [10, 30], [40, 40]], "type": "LineString"}'
        },

        polygon: {
            str: 'POLYGON((30 10,10 20,20 40,40 40,30 10))',
            json: {
                'coordinates': [
                    [
                        [30, 10],
                        [10, 20],
                        [20, 40],
                        [40, 40],
                        [30, 10]
                    ]
                ],
                'type': 'Polygon'
            },
            jsonStr: '{"coordinates": [[[30, 10], [10, 20], [20, 40], [40, 40], [30, 10]]], "type": "Polygon"}'
        },

        polygon2: {
            str: 'POLYGON((35 10,45 45,15 40,10 20,35 10),(20 30,35 35,30 20,20 30))',
            json: {
                'coordinates': [
                    [
                        [35, 10],
                        [45, 45],
                        [15, 40],
                        [10, 20],
                        [35, 10]
                    ],
                    [
                        [20, 30],
                        [35, 35],
                        [30, 20],
                        [20, 30]
                    ]
                ],
                'type': 'Polygon'
            },
            jsonStr: '{"coordinates": [[[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]], [[20, 30], [35, 35], [30, 20], [20, 30]]], "type": "Polygon"}'
        },

        multipolygon: {
            str: 'MULTIPOLYGON(((30 20,10 40,45 40,30 20)),((15 5,40 10,10 20,5 10,15 5)))',
            json: {
                'coordinates': [
                    [
                        [
                            [30, 20],
                            [10, 40],
                            [45, 40],
                            [30, 20]
                        ]
                    ],
                    [
                        [
                            [15, 5],
                            [40, 10],
                            [10, 20],
                            [5, 10],
                            [15, 5]
                        ]
                    ]
                ],
                'type': 'MultiPolygon'
            },
            jsonStr: '{"coordinates": [[[[30, 20], [10, 40], [45, 40], [30, 20]]], [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]]], "type": "MultiPolygon"}'
        },

        multipolygon2: {
            str: 'MULTIPOLYGON(((40 40,20 45,45 30,40 40)),((20 35,10 30,10 10,30 5,45 20,20 35),(30 20,20 15,20 25,30 20)))',
            json: {
                'coordinates': [
                    [
                        [
                            [40, 40],
                            [20, 45],
                            [45, 30],
                            [40, 40]
                        ]
                    ],
                    [
                        [
                            [20, 35],
                            [10, 30],
                            [10, 10],
                            [30, 5],
                            [45, 20],
                            [20, 35]
                        ],
                        [
                            [30, 20],
                            [20, 15],
                            [20, 25],
                            [30, 20]
                        ]
                    ]
                ],
                'type': 'MultiPolygon'
            },
            jsonStr: '{"coordinates": [[[[40, 40], [20, 45], [45, 30], [40, 40]]], [[[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]], [[30, 20], [20, 15], [20, 25], [30, 20]]]], "type": "MultiPolygon"}'
        },

        multipoint: {
            str: 'MULTIPOINT((10 40),(40 30),(20 20),(30 10))',
            json: {
                'coordinates': [
                    [10, 40],
                    [40, 30],
                    [20, 20],
                    [30, 10]
                ],
                'type': 'MultiPoint'
            },
            jsonStr: '{"coordinates": [[10, 40], [40, 30], [20, 20], [30, 10]], "type": "MultiPoint"}'
        },

        multilinestring: {
            str: 'MULTILINESTRING((10 10,20 20,10 40),(40 40,30 30,40 20,30 10))',
            json: {
                'coordinates': [
                    [
                        [10, 10],
                        [20, 20],
                        [10, 40]
                    ],
                    [
                        [40, 40],
                        [30, 30],
                        [40, 20],
                        [30, 10]
                    ]
                ],
                'type': 'MultiLineString'
            },
            jsonStr: '{"coordinates": [[[10, 10], [20, 20], [10, 40]], [[40, 40], [30, 30], [40, 20], [30, 10]]], "type": "MultiLineString"}'
        },

        box: {
            str: 'BOX(0 0,20 20)',
            json: {
                'coordinates': [
                    [
                        [0, 0],
                        [0, 20],
                        [20, 20],
                        [20, 0],
                        [0, 0]
                    ]
                ],
                'type': 'Polygon',
                'bbox': [0, 0, 20, 20]
            }
        }

    };

    describe('GeoJSON Construction:', function() {

        it('should create valid JSON for WKT Point type', function() {
            var a = new Wkt.Wkt(cases.point.str);
            expect(a.toJson()).deep.equal(cases.point.json);
        });

        it('should create valid JSON for WKT LineString type', function() {
            var a = new Wkt.Wkt(cases.linestring.str);
            expect(a.toJson()).deep.equal(cases.linestring.json);
        });

        it('should create valid JSON for WKT Polygon type', function() {
            var a = new Wkt.Wkt(cases.polygon.str);
            expect(a.toJson()).deep.equal(cases.polygon.json);
        });

        it('should create valid JSON for WKT Polygon type with a hole', function() {
            var a = new Wkt.Wkt(cases.polygon2.str);
            expect(a.toJson()).deep.equal(cases.polygon2.json);
        });

        it('should create valid JSON for WKT MultiPolygon type', function() {
            var a = new Wkt.Wkt(cases.multipolygon.str);
            expect(a.toJson()).deep.equal(cases.multipolygon.json);
        });

        it('should create valid JSON for WKT MultiPolygon type with a hole', function() {
            var a = new Wkt.Wkt(cases.multipolygon2.str);
            expect(a.toJson()).deep.equal(cases.multipolygon2.json);
        });

        it('should create valid JSON for WKT MultiPoint type', function() {
            var a = new Wkt.Wkt(cases.multipoint.str);
            expect(a.toJson()).deep.equal(cases.multipoint.json);
        });

        it('should create valid JSON for WKT MultiLineString type', function() {
            var a = new Wkt.Wkt(cases.multilinestring.str);
            expect(a.toJson()).deep.equal(cases.multilinestring.json);
        });

        it('should create valid JSON for WKT Box type', function() {
            var a = new Wkt.Wkt(cases.box.str);
            expect(a.toJson()).deep.equal(cases.box.json);
        });

    });

    describe('GeoJSON Deconstruction (from Objects):', function() {

        it('should write the WKT string corresponding to a GeoJSON Point', function() {
            var a = new Wkt.Wkt(cases.point.json);
            expect(a.write()).deep.equal(cases.point.str);
        });

        it('should write the WKT string corresponding to a GeoJSON LineString', function() {
            var a = new Wkt.Wkt(cases.linestring.json);
            expect(a.write()).deep.equal(cases.linestring.str);
        });

        it('should write the WKT string corresponding to a GeoJSON Polygon', function() {
            var a = new Wkt.Wkt(cases.polygon.json);
            expect(a.write()).deep.equal(cases.polygon.str);
        });

        it('should write the WKT string corresponding to a GeoJSON Polygon with a hole', function() {
            var a = new Wkt.Wkt(cases.polygon2.json);
            expect(a.write()).deep.equal(cases.polygon2.str);
        });

        it('should write the WKT string corresponding to a GeoJSON MultiPolygon', function() {
            var a = new Wkt.Wkt(cases.multipolygon.json);
            expect(a.write()).deep.equal(cases.multipolygon.str);
        });

        it('should write the WKT string corresponding to a GeoJSON MultiPolygon with a hole', function() {
            var a = new Wkt.Wkt(cases.multipolygon2.json);
            expect(a.write()).deep.equal(cases.multipolygon2.str);
        });

        it('should write the WKT string corresponding to a GeoJSON MultiPoint', function() {
            var a = new Wkt.Wkt(cases.multipoint.json);
            expect(a.write()).deep.equal(cases.multipoint.str);
        });

        it('should write the WKT string corresponding to a GeoJSON MultiLineString', function() {
            var a = new Wkt.Wkt(cases.multilinestring.json);
            expect(a.write()).deep.equal(cases.multilinestring.str);
        });

    });

    describe('GeoJSON Deconstruction (from Strings):', function() {
        it('should provide support for JSON.parse() in the environment...', function() {
            expect(typeof JSON).deep.equal('object');
            expect(typeof JSON.parse).deep.equal('function');
        });

        it('should parse a GeoJSON Point string', function() {
            var a = new Wkt.Wkt(cases.point.jsonStr);
            expect(a.write()).deep.equal(cases.point.str);
        });

        it('should parse a GeoJSON LineString string', function() {
            var a = new Wkt.Wkt(cases.linestring.jsonStr);
            expect(a.write()).deep.equal(cases.linestring.str);
        });

        it('should parse a GeoJSON Polygon string', function() {
            var a = new Wkt.Wkt(cases.polygon.jsonStr);
            expect(a.write()).deep.equal(cases.polygon.str);
        });

        it('should parse a GeoJSON Polygon string with a hole', function() {
            var a = new Wkt.Wkt(cases.polygon2.jsonStr);
            expect(a.write()).deep.equal(cases.polygon2.str);
        });

        it('should parse a GeoJSON MultiPolygon string', function() {
            var a = new Wkt.Wkt(cases.multipolygon.jsonStr);
            expect(a.write()).deep.equal(cases.multipolygon.str);
        });

        it('should parse a GeoJSON MultiPolygon string with a hole', function() {
            var a = new Wkt.Wkt(cases.multipolygon2.jsonStr);
            expect(a.write()).deep.equal(cases.multipolygon2.str);
        });

        it('should parse a GeoJSON MultiPoint string', function() {
            var a = new Wkt.Wkt(cases.multipoint.jsonStr);
            expect(a.write()).deep.equal(cases.multipoint.str);
        });

        it('should parse a GeoJSON MultiLineString string', function() {
            var a = new Wkt.Wkt(cases.multilinestring.jsonStr);
            expect(a.write()).deep.equal(cases.multilinestring.str);
        });

    });

});
