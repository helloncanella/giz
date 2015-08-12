var canvas, tracker;

canvas = $('canvas');

tracker = new Tracker();

tracker.setMouseTracker(canvas);

canvas = new Canvas(canvas);
