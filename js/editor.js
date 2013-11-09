$(function () {
	var canvasView = new Launch.views.ElementCanvas({
		"el": "#elementCanvas"
	});

	var paletteView = new Launch.views.ElementPalette({
		"el": "#elementPalette",
		"canvasView": canvasView
	});
});
