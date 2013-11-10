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
	"simplePopoverTemplate": [
		"<label><%= label %></label>",
		"<input type='text' data-widget='editTextbox'>"
	].join(""),
	"currentId": -1,
	"getNextAvailableId": function () {
		this.currentId ++;
		return this.currentId;
	}
};