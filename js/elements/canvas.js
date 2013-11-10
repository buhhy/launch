Launch.views.ElementCanvas = Launch.views.View.extend({
	"acceptDragFn": function (aHelper) {
		if (aHelper.hasClass("element")) {
			var eType = aHelper.data("elementType");
			if (eType.indexOf(Launch.globals.elementType.standalone) !== -1)
				return true;
		}
		return false;
	},

	"initialize": function (aOptions) {
		Launch.views.View.prototype.initialize.call(this, aOptions);
		this.attachDropHandler(this.acceptHandler);
	}
});

Launch.views.ElementPalette = Launch.views.View.extend({
	"elementClasses": [
		Launch.views.TextProtoView,
		Launch.views.QuestionProtoView,
		Launch.views.ButtonProtoView,
		Launch.views.TextboxProtoView,
		Launch.views.RadioButtonProtoView,
		Launch.views.TermsOfServiceProtoView
	],

	"canvasView": undefined,

	"initialize": function (aOptions) {
		Launch.views.View.prototype.initialize.call(this, aOptions);

		this.canvasView = aOptions.canvasView;
		_.each(this.elementClasses, function (aElement, aIndex, aList) {
			var element = new aElement({
				"canvasView": this.canvasView
			});
			element.attachToView(this);
		}, this);
	}
});

Launch.views.Editor = Backbone.View.extend({
	"events": {
		"click #btnPreview": "togglePreview",
		"click #btnSave": "save",
		"click #btnDone": "done"
	},

	"initialize": function () {
		this.canvasView = new Launch.views.ElementCanvas({
			"el": "#elementCanvas"
		});

		this.paletteView = new Launch.views.ElementPalette({
			"el": "#elementPalette",
			"canvasView": this.canvasView
		});
	},

	"togglePreview": function (aEvent) {
		var $el = $(this);
		var previewOn = !$el.prop("data-preview");

		if (previewOn) {
			$el.addClass("active");
			$(".element").addClass("preview");
			Launch.editor.setViewState(Launch.editor.viewStates.preview);
		} else {
			$el.removeClass("active");
			$(".element").removeClass("preview");
			Launch.editor.setViewState(Launch.editor.viewStates.edit);
		}

		$el.prop("data-preview", previewOn);
	}
});