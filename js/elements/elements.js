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
		this.preApplyModel();
		this.applyModel();

		if (this.editMode) {
			this.initializeEditable();
			this.attachDragHandlers();
			this.attachResizeHandlers();
		}
	},

	"applyModel": function (aModel) { },

	"preApplyModel": function () { },

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

	"setProperty": function (aKey, aValue) {
		var properties = this.model.get("properties");
		properties[aKey] = aValue;
		this.model.set("properties", properties);
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

	"attachEditableFieldHandlers": function ($aElem, aCallback) {
		var self = this;
		$aElem.editable({
			"action": "dblclick"
		}, function (aNewValue) {
			if (aNewValue.old_value !== aNewValue.value)
				aCallback.call(self, aNewValue.value);
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
	"questionId": undefined,

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
			"$qNumber": self.$el.find("[data-widget='questionNumber']"),
			"$qTitle": self.$el.find("[data-widget='questionTitle']")
		};
		self.$viewElements = $view;
	},

	"initializeEditable": function () {
		this.attachEditableFieldHandlers(
			this.$viewElements.$qTitle, this.setTitle);
		this.attachDropHandler();
		this.questionId = Launch.editor.getNextAvailableId();
	},

	"setTitle": function (aTitle) {
		this.setProperty("title", aTitle);
		this.$viewElements.$qTitle.text(aTitle);
	},

	"onNewElementAdded": function (aElementView) {
		aElementView.setQuestionId(this.questionId);
	}
});

Launch.views.FormElementView = Launch.views.ElementView.extend({
	"scope": Launch.globals.scope.form,
	"questionId": undefined,
	"formId": undefined,

	// "initialize": function (aOptions) {
	// 	Launch.views.ElementView.prototype.initialize.call(this, aOptions);
	// },

	// "initializeEditable": function () {
	// },

	"preApplyModel": function () {
		if (this.editMode) {
			this.formId = Launch.editor.getNextAvailableId();
			this.setProperty("inputId", "formInput" + this.formId);
		}
	},

	"setQuestionId": function (aId) {
		this.questionId = aId;
		this.onSetQuestionId(aId);
	},

	"onSetQuestionId": function (aId) {}
});

Launch.views.RadioButtonElementView = Launch.views.FormElementView.extend({
	"applyModel": function (aModel) {
		var self = this;
		var $view = {
			"$rLabel": self.$el.find("[data-widget='radioLabel']"),
			"$rButton": self.$el.find("[data-widget='radioButton']"),
			"$rImage": self.$el.find("[data-widget='radioImage']"),
			"$rTitle": self.$el.find("[data-widget='radioTitle']")
		};
		var props = this.model.get("properties");

		$view.$rButton.prop("checked", props.radioChecked);
		$view.$rButton.prop("id", props.inputId);
		$view.$rButton.prop("name", props.radioGroupName);
		$view.$rLabel.prop("for", props.inputId);
		$view.$rImage.prop("src", props.iconUrl);
		$view.$rTitle.html(props.optionTitle);

		self.$viewElements = $view;
	},

	"initializeEditable": function () {
		this.attachEditableFieldHandlers(
			this.$viewElements.$rTitle, this.setTitle);
	},

	"setTitle": function (aTitle) {
		this.setProperty("title", aTitle);
		this.$viewElements.$rTitle.html(aTitle);
	},

	"onSetQuestionId": function (aId) {
		var groupName = "radioGroup" + aId;
		this.setProperty("radioGroupName", groupName);
		this.$viewElements.$rButton.prop("name", groupName);
	}
});

Launch.views.TermsOfUseElementView = Launch.views.FormElementView.extend({
	"applyModel": function (aModel) {
		var self = this;
		var $view = {
			"$rText": self.$el.find("[data-widget='tosText']"),
			"$rCheckbox": self.$el.find("[data-widget='agreeCheckbox']"),
			"$rPrompt": self.$el.find("[data-widget='agreePrompt']")
		};
		var props = this.model.get("properties");
		$view.$rText.html(props.tosText);
		$view.$rCheckbox.prop("id", props.inputId);
		$view.$rPrompt.prop("for", props.inputId);
		$view.$rPrompt.html(props.agreePrompt);
		self.$viewElements = $view;
	},

	"initializeEditable": function () {

	}
});
