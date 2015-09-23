(function(createjs) {
    'use strict';

    var next, shape, start, stroke;

    var drawMode = false,
        stage = new createjs.Stage('canvas'),
        precision = 40,
        origin = {
            x: 0,
            y: 0
        },
        last = origin;

    var getAABB = function(stroke) {

        var aabb, highest, lowest, point;

        var i = 0;

        while (i < stroke.length) {
            point = stroke[i];
            if (!lowest && !highest) {
                lowest = JSON.parse(JSON.stringify(point));
                highest = JSON.parse(JSON.stringify(point));
                i++;
                continue;
            }
            if (point.x > highest.x) {
                highest.x = point.x;
            }
            if (point.x < lowest.x) {
                lowest.x = point.x;
            }
            if (point.y > highest.y) {
                highest.y = point.y;
            }
            if (point.y < lowest.y) {
                lowest.y = point.y;
            }
            i++;
        }
        aabb = {
            topLeft: {
                x: lowest.x,
                y: lowest.y
            },
            width: highest.x - lowest.x,
            height: highest.y - lowest.y
        };
        return aabb;
    };


    stage.on('stagemousedown', function() {
        drawMode = true;
    });

    stage.on('stagemousemove', function(event) {
        if (drawMode) {
            if (!shape) {
                shape = new createjs.Shape();
                shape.x = event.stageX;
                shape.y = event.stageY;
                stroke = [];
                start = origin;
                stroke.push(start);
                stage.addChild(shape)
                    .graphics.beginStroke('red')
                    .update();
            }
            next = {
                x: event.stageX - shape.x,
                y: event.stageY - shape.y
            };
            shape.graphics.lineTo(next.x, next.y);
            stage.update();
            stroke.push(next);
        }
    });

    stage.on('stagemouseup', function() {

        drawMode = false;
        last = stroke[stroke.length - 1];

        var aShape, initialPosition, point, reseted;

        var aabbMeasures = getAABB(stroke),
            width = aabbMeasures.width,
            height = aabbMeasures.height,
            topLeft = {
                x: aabbMeasures.topLeft.x,
                y: aabbMeasures.topLeft.y
            };


        var distance = Math.sqrt(Math.pow(last.x - origin.x, 2) +
            Math.pow(last.y - origin.y, 2));

        if (precision > distance) {

            shape.graphics.lineTo(origin.x, origin.y);

            for (var j = 0, len = stroke.length; j < len; j++) {
                point = stroke[j];

                if (!reseted) {
                    reseted = true;
                    shape.graphics.clear();
                    shape.graphics.beginStroke('red').beginFill('red').moveTo(origin.x, origin.y);
                }

                shape.graphics.lineTo(point.x, point.y);

                if (point.x === last.x && point.y === last.y) {
                    shape.graphics.lineTo(origin.x, origin.y).closePath();
                }
            }

        }

        stage.update();

        shape.setBounds(topLeft.x, topLeft.y, width, height);

        debugger;

        aShape = shape;

        aShape.on('pressmove', function(event) {
            drawMode = false;

            var delta, newPosition;

            if (!initialPosition) {
                initialPosition = {};
                initialPosition.x = event.stageX;
                initialPosition.y = event.stageY;
            } else {
                newPosition = {};
                newPosition.x = event.stageX;
                newPosition.y = event.stageY;
                delta = {};
                delta.x = newPosition.x - initialPosition.x;
                delta.y = newPosition.y - initialPosition.y;
                event.target.x += delta.x;
                event.target.y += delta.y;
                initialPosition = newPosition;
            }

            return stage.update();
        });
        stage.update();

        shape = null;
    });
})(createjs);
