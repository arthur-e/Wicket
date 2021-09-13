define([
    'wicket-arcgis-amd',
    'esri/geometry/Point',
    'esri/geometry/Polyline',
    'esri/geometry/Polygon',
    'esri/geometry/Multipoint'
], function (
    Wkt,
    Point,
    Polyline,
    Polygon,
    Multipoint
) {

    describe('Standard Arcgis 3 WKT Test Cases: ', function () {
        var cases, wkt;
        wkt = new Wkt.Wkt();

        cases = {

            point: {
                str: 'POINT(30 10)',
                cmp: [{
                    x: 30,
                    y: 10
                }],
                obj: new Point({ x: 30, y: 10 }),
                json: {
                    'coordinates': [30, 10],
                    'type': 'Point'
                },
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
                obj: new Polyline([
                    [30, 10],
                    [10, 30],
                    [40, 40]
                ]),
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
                obj: new Polygon(
                    [
                        [
                            [30, 10],
                            [40, 40],
                            [20, 40],
                            [10, 20],
                            [30, 10]
                        ]
                    ]
                ),
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
                str: 'POLYGON((35 10,45 45,15 40,10 20,35 10),(21 30,35 35,30 20,21 30))',
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
                        x: 21,
                        y: 30
                    }, {
                        x: 35,
                        y: 35
                    }, {
                        x: 30,
                        y: 20
                    }, {
                        x: 21,
                        y: 30
                    }]
                ],
                obj: new Polygon(
                    [
                        [
                            [35, 10],
                            [45, 45],
                            [15, 40],
                            [10, 20],
                            [35, 10]
                        ],
                        [ // Order in inner rings is reversed
                            [21, 30],
                            [35, 35],
                            [30, 20],
                            [21, 30]
                        ]
                    ]
                ),
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
                            [21, 30],
                            [35, 35],
                            [30, 20],
                            [21, 30]
                        ]
                    ],
                    'type': 'Polygon'
                },
                jsonStr: '{"coordinates": [[[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]], [[21, 30], [35, 35], [30, 20], [21, 30]]], "type": "Polygon"}'
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
                obj: new Multipoint({
                    points: [
                        [10, 40],
                        [40, 30],
                        [20, 20],
                        [30, 10]
                    ]
                }),
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
                    new Polyline([
                        [10, 10],
                        [20, 20],
                        [10, 40]
                    ]),
                    new Polyline([
                        [40, 40],
                        [30, 30],
                        [40, 20],
                        [30, 10]
                    ])
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
                        },]
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
                obj: new Polygon(
                    [
                        [30, 20],
                        [45, 40],
                        [10, 40],
                        [30, 20]
                    ],
                    [
                        [15, 5],
                        [40, 10],
                        [10, 20],
                        [5, 10],
                        [15, 5]
                    ]
                ),
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
                        },]
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
                        },],
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
                    new Polygon([
                        [40, 40],
                        [20, 45],
                        [45, 30],
                        [40, 40]
                    ]),
                    new Polygon([
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
                    ])
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
        };


        afterEach(function () {
            wkt.delimiter = ' ';
        });

        it('should convert a Esri Point into a basic POINT string', function () {
            wkt.fromObject(cases.point.obj);
            expect(wkt.type).toBe('point');
            expect(wkt.isCollection()).toBe(false);
            expect(wkt.components).toEqual(cases.point.cmp);
            expect(wkt.write()).toBe(cases.point.str);
        });

        it('should convert a Esri Polyline instance into a basic LINESTRING string', function () {
            wkt.fromObject(cases.linestring.obj);
            expect(wkt.type).toBe('linestring');
            expect(wkt.isCollection()).toBe(false);
            expect(wkt.components).toEqual(cases.linestring.cmp);
            expect(wkt.write()).toBe(cases.linestring.str);
        });

        it('should convert a Esri Polygon instance into a basic POLYGON string', function () {
            wkt.fromObject(cases.polygon.obj);
            expect(wkt.type).toBe('polygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.polygon.cmp);
            expect(wkt.write()).toBe(cases.polygon.str);
        });


        it('should convert an Esri Multipoint instances into a MULTIPOINT string', function () {
            wkt.fromObject(cases.multipoint.obj);
            expect(wkt.type).toBe('multipoint');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipoint.cmp);
            expect(wkt.write()).toBe(cases.multipoint.str);
        });

        it('should convert an Array of Esri Polyline instances into a MULTILINESTRING string', function () {
            wkt.fromObject(cases.multilinestring.obj);
            expect(wkt.type).toBe('multilinestring');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multilinestring.cmp);
            expect(wkt.write()).toBe(cases.multilinestring.str);
        });

        it('should convert an Array of Esri Polygon instances into a MULTIPOLYGON string', function () {
            wkt.fromObject(cases.multipolygon.obj);
            expect(wkt.type).toBe('multipolygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.multipolygon.cmp);
            expect(wkt.write()).toBe(cases.multipolygon.str);
        });

        it('should convert a Esri Polygon instance with a hole into a POLYGON string with the same hole', function () {
            wkt.fromObject(cases.polygon2.obj);
            expect(wkt.type).toBe('polygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.components).toEqual(cases.polygon2.cmp);
            expect(wkt.write()).toBe(cases.polygon2.str);
        });

        it('should convert an Array of Esri Polygon instances, some with holes, into a MULTIPOLYGON string with the same hole', function () {
            wkt.fromObject(cases.multipolygon2.obj);
            expect(wkt.type).toBe('multipolygon');
            expect(wkt.isCollection()).toBe(true);
            expect(wkt.write()).toBe(cases.multipolygon2.str);
            expect(wkt.components).toEqual(cases.multipolygon2.cmp);
        });
    });

});
