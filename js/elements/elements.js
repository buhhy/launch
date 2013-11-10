Launch.views.ElementView = Launch.views.View.extend({
	"scope": undefined,
	"parent": undefined,
	"model": undefined,
	"elementMarkup": undefined,
	"elementType": undefined,
	"editMode": false,
	"elementBoundsMarkup": "<div class='element'></div>",
	"createEditableMouseOffset": {
		"x": -15,
		"y": -10
	},

	"initialize": function (aOptions) {
		this.model = new Launch.models.Element({
			"objectType": aOptions.baseModel.get("objectType"),
			"css": aOptions.baseModel.get("defaultProperties")
		});
		this.elementMarkup = aOptions.baseModel.get("elementMarkup");
		this.elementType = aOptions.baseModel.get("elementType");
		this.scope = aOptions.baseModel.get("scope");
		this.editMode = aOptions.editMode;
		this.parent = aOptions.parent;

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

	"setCss": function (aKey) {
		var value = this.model.get("aKey");
		if (value !== undefined) {
			if (value === null)
				value = "";
			this.$el.css(aKey, value);
		}
	},

	"reposition": function (aX, aY) {
		this.model.set("left", aX);
		this.model.set("top", aY);

		this.setCss("left");
		this.setCss("top");
	},

	"attachDragHandlers": function () {
		var self = this;
		self.$el.draggable({
			"opacity": 0.8,
			"helper": "original",
			"appendTo": this.parent,
			"cancel": false,
			"start": function (aEvent, aUi) {
				aUi.helper.data("model", self);
				aUi.helper.data("elementType", self.elementType);
			},
			"stop": function (aEvent, aUi) {
				// clear in case of memory leak?
				aUi.helper.data("model", undefined);
			},
			"revert": function (aValid) {
				if (!aValid) {
					self.$el.fadeOut(200, function() {
						$(this).detach();
					});
				}
				return false;
			}
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
