describe('Standard WKT Test Cases: ', function () {
    var cases, wkt;

    wkt = new Wkt.Wkt();

    cases = {

        point: {
            str: 'POINT(30 10)',
            cmp: [{
                x: 30,
                y: 10
            }],
            obj: new google.maps.Point(30, 10),
            json: {
                'coordinates': [30, 10],
                'type': 'Point'
            },
        },

        marker: {
            str: 'POINT(30 10)',
            cmp: [{
                x: 30,
                y: 10
            }],
            obj: new google.maps.Marker({
                position: new google.maps.LatLng(10, 30)
            })
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
            }],
            obj: new google.maps.Polyline({
                editable: false,
                path: [
                    new google.maps.LatLng(10, 30),
                    new google.maps.LatLng(30, 10),
                    new google.maps.LatLng(40, 40)
                ]
            }),
            json: {
                'coordinates': [
                    [30, 10],
                    [10, 30],
                    [40, 40]
                ],
                'type': 'LineString'
            },
        },

        polygon: {
            str: 'POLYGON((30 10,40 40,20 40,10 20,30 10))',
            cmp: [
                [{
                    x: 30,
                    y: 10
                }, {
                    x: 40,
                    y: 40
                }, {
                    x: 20,
                    y: 40
                }, {
                    x: 10,
                    y: 20
                }, {
                    x: 30,
                    y: 10
                }]
            ],
            obj: new google.maps.Polygon({
                editable: false,
                paths: [
                    [
                        new google.maps.LatLng(10, 30),
                        new google.maps.LatLng(40, 40),
                        new google.maps.LatLng(40, 20),
                        new google.maps.LatLng(20, 10)
                    ]
                ]
            }),
            json: {
                'coordinates': [
                    [
                        [30, 10],
                        [40, 40],
                        [20, 40],
                        [10, 20],
                        [30, 10]
                    ]
                ],
                'type': 'Polygon'
            },

        },

        polygon2: {
            str: 'POLYGON((35 10,45 45,15 40,10 20,35 10),(20 30,35 35,30 20,20 30))',
            cmp: [
                [{
                    x: 35,
                    y: 10
                }, {
                    x: 45,
                    y: 45
                }, {
                    x: 15,
                    y: 40
                }, {
                    x: 10,
                    y: 20
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
            obj: new google.maps.Polygon({
                editable: false,
                paths: [
                    [
                        new google.maps.LatLng(10, 35),
                        new google.maps.LatLng(45, 45),
                        new google.maps.LatLng(40, 15),
                        new google.maps.LatLng(20, 10)
                    ],
                    [ // Order in inner rings is reversed
                        new google.maps.LatLng(20, 30),
                        new google.maps.LatLng(35, 35),
                        new google.maps.LatLng(30, 20)
                    ]
                ]
            }),
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
            ],
            obj: [
                new google.maps.Marker({
                    position: new google.maps.LatLng(40, 10)
                }),
                new google.maps.Marker({
                    position: new google.maps.LatLng(30, 40)
                }),
                new google.maps.Marker({
                    position: new google.maps.LatLng(20, 20)
                }),
                new google.maps.Marker({
                    position: new google.maps.LatLng(10, 30)
                }),
            ],
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
            ],
            obj: [
                new google.maps.Polyline({
                    editable: false,
                    path: [
                        new google.maps.LatLng(10, 10),
                        new google.maps.LatLng(20, 20),
                        new google.maps.LatLng(40, 10)
                    ]
                }),
                new google.maps.Polyline({
                    editable: false,
                    path: [
                        new google.maps.LatLng(40, 40),
                        new google.maps.LatLng(30, 30),
                        new google.maps.LatLng(20, 40),
                        new google.maps.LatLng(10, 30)
                    ]
                })
            ],
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

        multipolygon: {
            str: 'MULTIPOLYGON(((30 20,45 40,10 40,30 20)),((15 5,40 10,10 20,5 10,15 5)))',
            cmp: [
                [
                    [{
                        x: 30,
                        y: 20
                    }, {
                        x: 45,
                        y: 40
                    }, {
                        x: 10,
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
            ],
            obj: [
                new google.maps.Polygon({
                    editable: false,
                    paths: [
                        [
                            new google.maps.LatLng(20, 30),
                            new google.maps.LatLng(40, 45),
                            new google.maps.LatLng(40, 10)
                        ]
                    ]
                }),
                new google.maps.Polygon({
                    editable: false,
                    paths: [
                        [
                            new google.maps.LatLng(5, 15),
                            new google.maps.LatLng(10, 40),
                            new google.maps.LatLng(20, 10),
                            new google.maps.LatLng(10, 5)
                        ]
                    ]
                })
            ],
            json: {
                'coordinates': [
                    [
                        [
                            [30, 20],
                            [45, 40],
                            [10, 40],
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
            jsonStr: '{"coordinates": [[[[30, 20], [45, 40], [10, 40], [30, 20]]], [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]]], "type": "MultiPolygon"}'
        },

        multipolygon2: {
            str: 'MULTIPOLYGON(((40 40,20 45,45 30,40 40)),((20 35,10 30,10 10,30 5,45 20,20 35),(30 20,20 15,20 25,30 20)))',
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
                        x: 10,
                        y: 30
                    }, {
                        x: 10,
                        y: 10
                    }, {
                        x: 30,
                        y: 5
                    }, {
                        x: 45,
                        y: 20
                    }, {
                        x: 20,
                        y: 35
                    }, ],
                    [{
                        x: 30,
                        y: 20
                    }, {
                        x: 20,
                        y: 15
                    }, {
                        x: 20,
                        y: 25
                    }, {
                        x: 30,
                        y: 20
                    }]
                ]
            ],
            obj: [
                new google.maps.Polygon({
                    editable: false,
                    paths: [
                        [
                            new google.maps.LatLng(40, 40),
                            new google.maps.LatLng(45, 20),
                            new google.maps.LatLng(30, 45)
                        ]
                    ]
                }),
                new google.maps.Polygon({
                    editable: false,
                    paths: [
                        [
                            new google.maps.LatLng(35, 20),
                            new google.maps.LatLng(30, 10),
                            new google.maps.LatLng(10, 10),
                            new google.maps.LatLng(5, 30),
                            new google.maps.LatLng(20, 45)
                        ],
                        [
                            new google.maps.LatLng(25, 20),
                            new google.maps.LatLng(15, 20),
                            new google.maps.LatLng(20, 30)
                        ]
                    ]
                })
            ],
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

        rectangle: {
            str: 'POLYGON((-50 20,0 20,0 0,-50 0,-50 20))',
            cmp: [
                [{
                    x: -50,
                    y: 20
                }, {
                    x: 0,
                    y: 20
                }, {
                    x: 0,
                    y: 0
                }, {
                    x: -50,
                    y: 0
                }, {
                    x: -50,
                    y: 20
                }]
            ],
            obj: new google.maps.Rectangle({
                bounds: new google.maps.LatLngBounds(new google.maps.LatLng(0, -50),
                    new google.maps.LatLng(20, 0))
            })
        },

        box: {
            str: 'BOX(0 0,20 20)',
            cmp: [{
                x: 0,
                y: 0
            }, {
                x: 20,
                y: 20
            }],
            obj: new google.maps.Rectangle({
                bounds: new google.maps.LatLngBounds(new google.maps.LatLng(0, 0),
                    new google.maps.LatLng(20, 20))
            }),
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
        },

        geometrycollection: {
            str: 'GEOMETRYCOLLECTION(POINT(30 10),LINESTRING(30 10,10 30,40 40),POLYGON((30 10,10 20,20 40,40 40,30 10)))',
            json: {
                "type": "GeometryCollection",
                "geometries": [{
                        "type": "Point",
                        "coordinates": [30, 10]
                    }, {
                        'type': 'LineString',
                        'coordinates': [
                            [30, 10],
                            [10, 30],
                            [40, 40]
                        ]
                    },

                    {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [30, 10],
                                [10, 20],
                                [20, 40],
                                [40, 40],
                                [30, 10]
                            ]
                        ]
                    }
                ]
            }
        }

    };

    dataObjects = new google.maps.Data;

    describe('Converting objects into WKT strings: ', function () {

        afterEach(function () {
            wkt.delimiter = ' ';
        });

        it('should convert a Marker instance into a basic POINT string', function () {
            wkt.fromObject(cases.point.obj);
            expect(wkt.type).toBe('point');
            expect(wkt.isCollection()).toBe(false);
            expect(wkt.components).toEqual(cases.point.cmp);
            expect(wkt.write()).toBe(cases.point.str);
        });

        it('should convert a Polyline instance into a basic LINESTRING string', function () {
            wkt.fromObject(cases.linestring.obj);
            expect(wkt.type).toBe('linestring');
            expect(wkt.isCollection()).toBe(false);
            expect(wkt.components).toEqual(cases.linestring.cmp);
            expect(wkt.write()).toBe(cases.linestring.str);
        });

        it('should convert a Polygon instance into a basic POLYGON string', function () {
            wkt.fromObject(cases.polygon.obj);
            expect(wkt.type).toBe('polygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.polygon.cmp);
            expect(wkt.write()).toBe(cases.polygon.str);
        });

        it('should convert a Polygon instance with a hole into a POLYGON string with the same hole', function () {
            wkt.fromObject(cases.polygon2.obj);
            expect(wkt.type).toBe('polygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.polygon2.cmp);
            expect(wkt.write()).toBe(cases.polygon2.str);
        });

        it('should convert a Rectangle instance into a POLYGON string', function () {
            wkt.fromObject(cases.rectangle.obj);
            expect(wkt.type).toBe('polygon');
            expect(wkt.isRectangle).toBe(true);
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.rectangle.cmp);
            expect(wkt.write()).toBe(cases.rectangle.str);
        });

        it('should convert an Array of Marker instances into a MULTIPOINT string', function () {
            wkt.fromObject(cases.multipoint.obj);
            expect(wkt.type).toBe('multipoint');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipoint.cmp);
            expect(wkt.write()).toBe(cases.multipoint.str);
        });

        it('should convert an Array of Polyline instances into a MULTILINESTRING string', function () {
            wkt.fromObject(cases.multilinestring.obj);
            expect(wkt.type).toBe('multilinestring');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multilinestring.cmp);
            expect(wkt.write()).toBe(cases.multilinestring.str);
        });

        it('should convert an Array of Polygon instances into a MULTIPOLYGON string', function () {
            wkt.fromObject(cases.multipolygon.obj);
            expect(wkt.type).toBe('multipolygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipolygon.cmp);
            expect(wkt.write()).toBe(cases.multipolygon.str);
        });

        it('should convert an Array of Polygon instances, some with holes, into a MULTIPOLYGON string with the same hole', function () {
            wkt.fromObject(cases.multipolygon2.obj);
            expect(wkt.type).toBe('multipolygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipolygon2.cmp);
            expect(wkt.write()).toBe(cases.multipolygon2.str);
        });

    });

    describe('Converting google.maps.Data objects into WKT strings: ', function () {

        afterEach(function () {
            wkt.delimiter = ' ';
        });

        it('should convert a google.maps.Data.Point instance into a basic POINT string', function () {
            var dataPoint = dataObjects.addGeoJson({
                "type": "Feature",
                geometry: cases.point.json
            })[0];
            wkt.fromObject(dataPoint.getGeometry());
            expect(wkt.type).toBe('point');
            expect(wkt.isCollection()).toBe(false);
            expect(wkt.components).toEqual(cases.point.cmp);
            expect(wkt.write()).toBe(cases.point.str);
        });

        it('should convert a google.maps.Data.LineString instance into a basic LINESTRING string', function () {
            var dataLineString = dataObjects.addGeoJson({
                "type": "Feature",
                geometry: cases.linestring.json
            })[0];
            wkt.fromObject(dataLineString.getGeometry());
            expect(wkt.type).toBe('linestring');
            expect(wkt.isCollection()).toBe(false);
            expect(wkt.components).toEqual(cases.linestring.cmp);
            expect(wkt.write()).toBe(cases.linestring.str);
        });

        it('should convert a google.maps.Data.Polygon instance into a basic POLYGON string', function () {
            var dataPolygon = dataObjects.addGeoJson({
                "type": "Feature",
                geometry: cases.polygon.json
            })[0];
            wkt.fromObject(dataPolygon.getGeometry());
            expect(wkt.type).toBe('polygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.polygon.cmp);
            expect(wkt.write()).toBe(cases.polygon.str);
        });

        it('should convert a google.maps.Data.Polygon instance with a hole into a POLYGON string with the same hole', function () {
            var dataPolygon2 = dataObjects.addGeoJson({
                "type": "Feature",
                geometry: cases.polygon2.json
            })[0];
            wkt.fromObject(dataPolygon2.getGeometry());
            expect(wkt.type).toBe('polygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.polygon2.cmp);
            expect(wkt.write()).toBe(cases.polygon2.str);
        });


        it('should convert a google.maps.Data.MultiPoint instance  into a MULTIPOINT string', function () {
            var dataMultiPoint = dataObjects.addGeoJson({
                "type": "Feature",
                geometry: cases.multipoint.json
            })[0];
            wkt.fromObject(dataMultiPoint.getGeometry());
            expect(wkt.type).toBe('multipoint');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipoint.cmp);
            expect(wkt.write()).toBe(cases.multipoint.str);
        });

        it('should convert a google.maps.Data.MultiLineString instance into a MULTILINESTRING string', function () {
            var dataMultiLineString = dataObjects.addGeoJson({
                "type": "Feature",
                geometry: cases.multilinestring.json
            })[0];
            wkt.fromObject(dataMultiLineString.getGeometry());
            expect(wkt.type).toBe('multilinestring');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multilinestring.cmp);
            expect(wkt.write()).toBe(cases.multilinestring.str);
        });

        it('should convert a google.maps.Data.MultiPolygon instance into a MULTIPOLYGON string', function () {
            var dataMultiPolygon = dataObjects.addGeoJson({
                "type": "Feature",
                geometry: cases.multipolygon.json
            })[0];
            wkt.fromObject(dataMultiPolygon.getGeometry());
            expect(wkt.type).toBe('multipolygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipolygon.cmp);
            expect(wkt.write()).toBe(cases.multipolygon.str);
        });

        it('should convert a google.maps.Data.MultiPolygon with holes, into a MULTIPOLYGON string with the same holes', function () {
            var dataMultiPolygon2 = dataObjects.addGeoJson({
                "type": "Feature",
                geometry: cases.multipolygon2.json
            })[0];
            wkt.fromObject(dataMultiPolygon2.getGeometry());
            expect(wkt.type).toBe('multipolygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipolygon2.cmp);
            expect(wkt.write()).toBe(cases.multipolygon2.str);
        });

        it('should convert a google.maps.Data.GeometryCollection into a GEOMETRYCOLLECTION string', function () {
            var dataGeometryCollection = dataObjects.addGeoJson({
                "type": "Feature",
                geometry: cases.geometrycollection.json
            })[0];

            wkt.fromObject(dataGeometryCollection.getGeometry());
            expect(wkt.type).toBe('geometrycollection');
            //expect(wkt.isCollection()).toBe(true);

        });

    });

    describe('Coverting WKT strings into objects: ', function () {

        afterEach(function () {
            wkt.delimiter = ' ';
        });

        it('should convert a basic POINT string to a Marker instance', function () {
            wkt.read(cases.marker.str);
            expect(wkt.type).toBe('point');
            expect(wkt.isCollection()).toBe(false);
            expect(wkt.components).toEqual(cases.marker.cmp);
            expect(wkt.toObject().getPosition().toString()).toEqual(cases.marker.obj.getPosition().toString());
        });

        it('should convert a basic LINESTRING string to a Polyline instance', function () {
            wkt.read(cases.linestring.str);
            expect(wkt.type).toBe('linestring');
            expect(wkt.isCollection()).toBe(false);
            expect(wkt.components).toEqual(cases.linestring.cmp);
            expect(wkt.toObject().getPath().getArray().toString()).toEqual(cases.linestring.obj.getPath().getArray().toString());
        });

        it('should convert a basic POLYGON string to a Polygon instance', function () {
            wkt.read(cases.polygon.str);
            expect(wkt.type).toBe('polygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.polygon.cmp);
            expect(wkt.toObject().getPaths().getArray().map(function (ring) {
                return ring.getArray();
            }).toString()).toEqual(cases.polygon.obj.getPaths().getArray().map(function (ring) {
                return ring.getArray();
            }).toString());
        });

        it('should convert a POLYGON string with a hole to a Polygon instance with the same hole', function () {
            wkt.read(cases.polygon2.str);
            expect(wkt.type).toBe('polygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.polygon2.cmp);
            expect(wkt.toObject().getPaths().getArray().map(function (ring) {
                return ring.getArray();
            }).toString()).toEqual(cases.polygon2.obj.getPaths().getArray().map(function (ring) {
                return ring.getArray();
            }).toString());
        });

        it('should convert a POLYGON string, with isRectangle=true, into a Rectangle instance', function () {
            wkt.read(cases.rectangle.str);
            wkt.isRectangle = true;
            expect(wkt.type).toBe('polygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.rectangle.cmp);
            expect(wkt.toObject().getBounds()).toEqual(cases.rectangle.obj.getBounds());
            expect(wkt.toObject().constructor).toEqual(google.maps.Rectangle);
        });

        it('should convert a MULTIPOINT string into an Array of Marker instances', function () {
            var m;

            wkt.read(cases.multipoint.str);
            expect(wkt.type).toBe('multipoint');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipoint.cmp);

            markers = wkt.toObject();
            for (m = 0; m < markers.length; m += 1) {
                expect(markers[m].getPosition().toString()).toEqual(cases.multipoint.obj[m].getPosition().toString());
            }
        });

        it('should convert a MULTILINESTRING string into an Array of Polyline instances', function () {
            wkt.read(cases.multilinestring.str);
            expect(wkt.type).toBe('multilinestring');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multilinestring.cmp);
            //console.debug({wkt:wkt.toObject(), cases:cases.multilinestring.obj});
            expect(wkt.toObject().map(function (linestring) {
                return linestring.getPath().getArray().map(function (point) {
                    return point.toString();
                });
            })).toEqual(cases.multilinestring.obj.map(function (linestring) {
                return linestring.getPath().getArray().map(function (point) {
                    return point.toString();
                });
            }));
        });

        it('should convert a MULTIPOLYGON string into an Array of Polygon instances', function () {
            wkt.read(cases.multipolygon.str);
            expect(wkt.type).toBe('multipolygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipolygon.cmp);

            expect(wkt.toObject().map(function (ring) {
                return ring.getPath().getArray().map(function (point) {
                    return point.toString();
                });
            })).toEqual(cases.multipolygon.obj.map(function (ring) {
                return ring.getPath().getArray().map(function (point) {
                    return point.toString();
                });
            }));

        });

        it('should convert a MULTIPOLYGON string with holes into an Array of Polygon instances with the same holes', function () {
            wkt.read(cases.multipolygon2.str);
            expect(wkt.type).toBe('multipolygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipolygon2.cmp);

             expect(wkt.toObject().map(function (ring) {
                return ring.getPath().getArray().map(function (point) {
                    return point.toString();
                });
            })).toEqual(cases.multipolygon2.obj.map(function (ring) {
                return ring.getPath().getArray().map(function (point) {
                    return point.toString();
                });
            }));
        });

        it('should convert a PostGIS 2DBOX string into a Rectangle instance', function () {
            wkt.read(cases.box.str);
            expect(wkt.type).toBe('box');
            expect(wkt.isCollection()).toBe(false);
            expect(wkt.components).toEqual(cases.box.cmp);
            expect(wkt.toObject().getBounds()).toEqual(cases.box.obj.getBounds());
        });

    });

});
