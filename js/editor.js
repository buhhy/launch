$(function () {
	var canvasView = new Launch.views.ElementCanvas({
		"el": "#elementCanvas"
	});

	var paletteView = new Launch.views.ElementPalette({
		"el": "#elementPalette",
		"canvasView": canvasView
	});
});

Launch.editor = {
	"currentId": -1,
	"getNextAvailableId": function () {
		this.currentId ++;
		return this.currentId;
	}
};