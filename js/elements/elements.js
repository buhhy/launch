Launch.views.ElementView = Launch.views.View.extend({
	"scope": Launch.globals.scope.standalone,
	"parent": $("#elementCanvas"),
	"model": undefined,
	"elementMarkup": undefined,
	"editMode": false,
	"elementBoundsMarkup": "<div class='element'></div>",
	"createEditableMouseOffset": {
		"x": -15,
		"y": -10
	},

	"initialize": function (aOptions) {
		this.model = new Launch.models.Element({
			"objectType": aOptions.baseModel.objectType,
			"css": aOptions.baseModel.defaultProperties
		});
		this.elementMarkup = aOptions.baseModel.elementMarkup;
		this.editMode = aOptions.editMode;

		this.buildElement();

		if (this.editMode) {
			this.overrideDefaultClickHandlers();
			this.attachDragHandlers();
			this.attachResizeHandlers();
		}
	},

	"getCssFromEl": function () {
		return {
			"width": this.$el.css("width"),
			"height": this.$el.css("height"),
			"top": this.$el.css("top"),
			"left": this.$el.css("left")
		};
	},

	"buildElement": function () {
		if (this.editMode) {
			var $base = $(this.elementBoundsMarkup);
			$base.html(this.elementMarkup);
			this.setElement($base);
		} else {
			this.setElement(this.elementBoundsMarkup);
		}

		this.setCss("width");
		this.setCss("height");
	},

	"setCss": function(aKey) {
		var value = this.model.get("aKey");
		if (value !== undefined) {
			if (value === null)
				value = "";
			this.$el.css(aKey, value);
		}
	},

	"attachDragHandlers": function () {
		this.$el.draggable({
			"opacity": 0.8,
			"helper": "original",
			"appendTo": this.parent,
			"scope": this.scope,
			"cancel": false
		});
	},

	"attachResizeHandlers": function () {
		this.$el.resizable({
			"handle": "all"
		});
	},

	"moveToMouseCursor": function (aEvent) {
		this.$el.css("position", "absolute");
		this.$el.css("left",
			aEvent.pageX + this.createEditableMouseOffset.x);
		this.$el.css("top",
			aEvent.pageY + this.createEditableMouseOffset.y);
	}
});

Launch.views.QuestionElementView = Launch.views.ElementView.extend({
	"subviews": [],

	"initialize": function (aOptions) {
		Launch.views.ElementView.prototype.initialize.call(this, aOptions);
		this.model = new Launch.models.QuestionElement({
			"objectType": aOptions.objectType,
			"css": this.getCssFromEl()
		});
	},

	"attachDropHandlers": function () {
		this.$el.droppable({
			"accept": ".element",
			"scope": "form",
			"drop": function (aEvent, aUi) {

			}
		});
	}
});

Launch.views.FormElementView = Launch.views.ElementView.extend({
	"scope": Launch.globals.scope.form,
	"parent": undefined,

	"initialize": function (aOptions) {
		this.parent = aOptions.parent;
		Launch.views.ElementView.prototype.initialize.call(this, aOptions);
	}
});
