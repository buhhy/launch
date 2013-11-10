$(function () {
	new Launch.views.Editor({
		"el": document.body
	});
});

Launch.editor = {
	"simplePopoverTemplate": [
		"<label><%= label %></label>",
		"<input type='text' data-widget='editTextbox'>"
	].join(""),

	"viewStates": {
		"edit": 0,
		"preview": 1
	},

	"viewState": 0,
	"currentId": -1,

	"setViewState": function (aNewState) {
		this.viewState = aNewState;
	},
	"getViewState": function () {
		return this.viewState;
	},
	"getNextAvailableId": function () {
		this.currentId ++;
		return this.currentId;
	}
};