Launch.views.ElementView = Launch.views.View.extend({
	"$viewElements": {},
	"scope": undefined,
	"parent": undefined,
	"model": undefined,
	"elementMarkup": undefined,
	"elementType": undefined,
	"editMode": false,
	"modelClass": Launch.models.Element,
	"elementBoundsMarkup": "<div class='element'></div>",
	"createEditableMouseOffset": {
		"x": -15,
		"y": -10
	},

	"initialize": function (aOptions) {
		this.model = new this.modelClass({
			"objectType": aOptions.baseModel.get("objectType"),
			"css": aOptions.baseModel.get("defaultCss"),
			"properties": aOptions.baseModel.get("defaultProperties"),
		});
		this.elementMarkup = aOptions.baseModel.get("elementMarkup");
		this.elementType = aOptions.baseModel.get("elementType");
		this.scope = aOptions.baseModel.get("scope");
		this.editMode = aOptions.editMode;
		this.parent = aOptions.parent;

		this.buildElement();
		this.applyModel();

		if (this.editMode) {
			this.initializeEditable();
			this.attachDragHandlers();
			this.attachResizeHandlers();
		}
	},

	"applyModel": function (aModel) { },

	"initializeEditable": function () { },

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

		this.applyCss("width");
		this.applyCss("height");
	},

	"setCss": function (aKey, aValue) {
		var css = this.model.get("css");
		css[aKey] = aValue;
		this.model.set("css", css);
	},

	"applyCss": function (aKey) {
		var value = this.model.get("css")[aKey];
		if (value !== undefined) {
			if (value === null)
				value = "";
			this.$el.css(aKey, value);
		}
	},

	"reposition": function (aLeft, aTop) {
		console.log("repositioned: " + aLeft + ":" + aTop);
		this.setCss("left", aLeft);
		this.setCss("top", aTop);

		this.applyCss("left");
		this.applyCss("top");
	},

	"resize": function (aWidth, aHeight) {
		console.log("resized: " + aWidth + ":" + aHeight);
		this.setCss("width", aWidth);
		this.setCss("height", aHeight);

		this.applyCss("width");
		this.applyCss("height");
	},

	"attachDragHandlers": function () {
		var self = this;
		self.$el.draggable({
			"delay": 100,
			"opacity": 0.8,
			"helper": "original",
			"appendTo": this.parent,
			"cancel": "input.editable,textarea",
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
		var self = this;
		self.$el.resizable({
			"handles": "all",
			"stop": function (aEvent, aUi) {
				if (aUi.originalPosition.left != aUi.position.left ||
						aUi.originalPosition.top != aUi.position.top)
					self.reposition(aUi.position.left, aUi.position.top);
				if (aUi.originalSize.width != aUi.size.width ||
						aUi.originalSize.height != aUi.size.height)
					self.resize(aUi.size.width, aUi.size.height);
			}
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
	"modelClass": Launch.models.QuestionElement,

	"acceptDragFn": function (aHelper) {
		if (aHelper.hasClass("element")) {
			var eType = aHelper.data("elementType");
			if (eType.indexOf(Launch.globals.elementType.standalone) === -1 &&
					eType.indexOf(Launch.globals.elementType.form) !== -1)

				return true;
		}
		return false;
	},

	"applyModel": function (aModel) {
		var self = this;
		var $view = {
			"$qNumber": self.$el.find(".question-number"),
			"$qTitle": self.$el.find(".question-title")
		};
		self.$viewElements = $view;
	},

	"initializeEditable": function () {
		var self = this;
		self.attachDropHandler(self.acceptHandler);

		self.$viewElements.$qTitle.editable({
			"action": "dblclick"
		}, function (aNewValue) {
			if (aNewValue.old_value !== aNewValue.value)
				self.setTitle(aNewValue.value);
		});
	},

	"setTitle": function (aTitle) {
		var props = this.model.get("properties");
		props.title = aTitle;
		this.model.set("properties", props);
		this.$viewElements.$qTitle.text(aTitle);
	}
});

Launch.views.FormElementView = Launch.views.ElementView.extend({
	"scope": Launch.globals.scope.form
});

Launch.views.RadioButtonElementView = Launch.views.ElementView.extend({
	"applyModel": function (aModel) {
		var self = this;
		var $view = {
			"$rButton": self.$el.find(".radio-button"),
			"$rImage": self.$el.find(".radio-image"),
			"$rTitle": self.$el.find(".radio-title")
		};
		$view.$rButton;
		self.$viewElements = $view;
	},

	"initializeEditable": function () {

	}
});
