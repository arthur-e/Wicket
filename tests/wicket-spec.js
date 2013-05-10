describe('Standard WKT Test Cases', function() {
    var wkt = new Wkt.Wkt();

    it('should read basic POINT string', function() {
        wkt.read('POINT(30 10)');

        expect(wkt.type).toBe('point');
        expect(wkt.components).toEqual([
            {x: 30, y: 10}
        ]);
    });

    it('should read basic LINESTRING string', function() {
        wkt.read('LINESTRING(30 10,10 30,40 40)');

        expect(wkt.type).toBe('linestring');
        expect(wkt.components).toEqual([
            {x: 30, y: 10},
            {x: 10, y: 30},
            {x: 40, y: 40}
        ]);
    });

    it('should read basic POLYGON string', function() {
        wkt.read('POLYGON((30 10,10 20,20 40,40 40,30 10))');

        expect(wkt.type).toBe('polygon');
        expect(wkt.isCollection()).toBe(true);
        expect(wkt.components).toEqual([
            [
                {x: 30, y: 10},
                {x: 10, y: 20},
                {x: 20, y: 40},
                {x: 40, y: 40},
                {x: 30, y: 10}
            ]
        ]);
    });

    it('should read basic POLYGON string formatted for a URL', function() {
        wkt.read('POLYGON((30+10,10+20,20+40,40+40,30+10))');

        expect(wkt.type).toBe('polygon');
        expect(wkt.isCollection()).toBe(true);
        expect(wkt.components).toEqual([
            [
                {x: 30, y: 10},
                {x: 10, y: 20},
                {x: 20, y: 40},
                {x: 40, y: 40},
                {x: 30, y: 10}
            ]
        ]);
    });

    it('should read basic POLYGON string with one (1) hole', function() {
        wkt.read('POLYGON((35 10,10 20,15 40,45 45,35 10),(20 30,35 35,30 20,20 30))');

        expect(wkt.type).toBe('polygon');
        expect(wkt.isCollection()).toBe(true);
        expect(wkt.components).toEqual([
            [
                {x: 35, y: 10},
                {x: 10, y: 20},
                {x: 15, y: 40},
                {x: 45, y: 45},
                {x: 35, y: 10}
            ], [
                {x: 20, y: 30},
                {x: 35, y: 35},
                {x: 30, y: 20},
                {x: 20, y: 30}
            ]
        ]);
    });

    it('should read basic MULTIPOINT string', function() {
        wkt.read('MULTIPOINT((10 40),(40 30),(20 20),(30 10))');

        expect(wkt.type).toBe('multipoint');
        expect(wkt.isCollection()).toBe(true);
        expect(wkt.components).toEqual([
            [{x: 10, y: 40}],
            [{x: 40, y: 30}],
            [{x: 20, y: 20}],
            [{x: 30, y: 10}]
        ]);
    });

    it('should read basic MULTIPOINT string without wrapped vertices', function() {
        wkt.read('MULTIPOINT(10 40,40 30,20 20,30 10)');

        expect(wkt.type).toBe('multipoint');
        expect(wkt.isCollection()).toBe(true);
        expect(wkt.components).toEqual([
            [{x: 10, y: 40}],
            [{x: 40, y: 30}],
            [{x: 20, y: 20}],
            [{x: 30, y: 10}]
        ]);
    });

    it('should read basic MULTILINESTRING string', function() {
        wkt.read('MULTILINESTRING((10 10,20 20,10 40),(40 40,30 30,40 20,30 10))');

        expect(wkt.type).toBe('multilinestring');
        expect(wkt.isCollection()).toBe(true);
        expect(wkt.components).toEqual([
            [
                {x: 10, y: 10},
                {x: 20, y: 20},
                {x: 10, y: 40}
            ], [
                {x: 40, y: 40},
                {x: 30, y: 30},
                {x: 40, y: 20},
                {x: 30, y: 10}
            ]
        ]);
    });

    it('should read basic MULTIPOLYGON string', function() {
        wkt.read('MULTIPOLYGON(((30 20,10 40,45 40,30 20)),((15 5,40 10,10 20,5 10,15 5)))');

        expect(wkt.type).toBe('multipolygon');
        expect(wkt.isCollection()).toBe(true);
        expect(wkt.components).toEqual([
            [
                [
                    {x: 30, y: 20},
                    {x: 10, y: 40},
                    {x: 45, y: 40},
                    {x: 30, y: 20},
                ]
            ], [
                [
                    {x: 15, y: 5},
                    {x: 40, y: 10},
                    {x: 10, y: 20},
                    {x: 5, y: 10},
                    {x: 15, y: 5}
                ]
            ]
        ]);
    });

    it('should read basic MULTIPOLYGON string with two (2) polygons, one with one (1) hole', function() {
        wkt.read('MULTIPOLYGON(((40 40,20 45,45 30,40 40)),((20 35,45 20,30 5,10 10,10 30,20 35),(30 20,20 25,20 15,30 20)))');

        expect(wkt.type).toBe('multipolygon');
        expect(wkt.isCollection()).toBe(true);
        expect(wkt.components).toEqual([
            [
                [
                    {x: 40, y: 40},
                    {x: 20, y: 45},
                    {x: 45, y: 30},
                    {x: 40, y: 40},
                ]
            ], [
                [
                    {x: 20, y: 35},
                    {x: 45, y: 20},
                    {x: 30, y: 5},
                    {x: 10, y: 10},
                    {x: 10, y: 30},
                    {x: 20, y: 35},
                ],
                [
                    {x: 30, y: 20},
                    {x: 20, y: 25},
                    {x: 20, y: 15},
                    {x: 30, y: 20}
                ]
            ]
        ]);
    });

});


