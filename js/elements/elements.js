Launch.views.ElementView = Launch.views.View.extend({
	"$viewElements": undefined,
	"scope": undefined,
	"model": undefined,
	"elementMarkup": undefined,
	"elementMarkup": undefined,
	"elementType": undefined,
	"editMode": false,
	"modelClass": Launch.models.Element,
	"elementBoundsMarkup": "<div class='element'></div>",
	"createEditableMouseOffset": {
		"x": -15,
		"y": -10
	},

	"tooltips": [],

	"initialize": function (aOptions) {
		Launch.views.View.prototype.initialize.call(this, aOptions);

		this.model = aOptions.model || new this.modelClass({
			"objectType": aOptions.baseModel.get("objectType"),
			"css": $.extend(true, {}, aOptions.baseModel.get("defaultCss")),
			"properties": $.extend(true, {}, aOptions.baseModel.get("defaultProperties")),
		});

		this.viewElements = {};
		this.elementMarkup = aOptions.baseModel.get("elementMarkup");
		this.elementType = aOptions.baseModel.get("elementType");
		this.scope = aOptions.baseModel.get("scope");
		this.editMode = aOptions.editMode;
		this.tooltips = [];

		if (this.editMode) {
			this.setProperty("elementId", Launch.editor.getNextAvailableId());
		}

		this.preApplyModel();
		this.buildElement();
		this.applyModel();

		if (this.editMode) {
			this.initializeEditable();
			this.attachDragHandler();
			this.attachResizeHandler();
		}
	},

	"onDestroy": function () {
		_.each(this.tooltips, function (aElem) {
			aElem.destroy();
		});
	},

	"preApplyModel": function () { },

	"initializeEditable": function () { },

	"buildElement": function () {
		var templated = _.template(this.elementMarkup, this.model.get("properties"));
		var $base = $(this.elementBoundsMarkup);

		if (this.editMode &&
				Launch.editor.getViewState() === Launch.editor.viewStates.preview)
			$base.addClass("preview");

		$base.html(templated);
		this.setElement($base);
	},

	"applyModel": function (aModel) {
		this.applyCss("width");
		this.applyCss("height");
		this.applyCss("top");
		this.applyCss("left");
		this.$el.css("position", "absolute");
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

	"attachDragHandler": function () {
		var self = this;
		self.$el.draggable({
			"delay": 100,
			"opacity": 0.8,
			"helper": "original",
			"appendTo": $("body"),
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
						self.detachFromView(true);
					});
				}
				return false;
			}
		});
	},

	"attachResizeHandler": function () {
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

	"attachEditableFieldHandler": function ($aElem, aCallback) {
		var self = this;
		$aElem.editable({
			"action": "dblclick"
		}, function (aNewValue) {
			if (aNewValue.old_value !== aNewValue.value)
				aCallback.call(self, aNewValue.value);
		});
	},

	"attachEditablePopoverHandler": function ($aElem, aParams, aCallback) {
		var self = this;
		$aElem.qtip({
			"content": _.template(Launch.editor.simplePopoverTemplate, aParams),
			"position": {
				"my": "left center",
				"at": "right center",
				"adjust": {
					"x": 7
				}
			},
			"show": {
				"event": "click",
				"effect": function (aOffset) {
					$(this).fadeIn(200);
				}
			},
			"hide": {
				"event": "unfocus",
				"effect": function (aOffset) {
					$(this).fadeOut(200);
				}
			},
			"style": {
				"classes": "qtip-rounded",
				"tip": {
					"corner": true
				}
			},
			"events": {
				"render": function (aEvent, aApi) {
					$("input[data-widget='editTextbox']").keyup(function (aEvent) {
						// enter pressed
						if (aEvent.which == 13) {
							aCallback.call(self, $(this).val());
							aApi.hide();
						} else if (aEvent.which == 27) {
							aApi.hide();
						}
					});
				},
				"visible": function (aEvent, aApi) {
					$(this).find("input[data-widget='editTextbox']").focus();
				}
			}
		});

		self.tooltips.push($aElem.qtip("api"));
	},

	"moveToMouseCursor": function (aEvent) {
		this.$el.css("position", "absolute");
		this.$el.css("left",
			aEvent.pageX + this.createEditableMouseOffset.x);
		this.$el.css("top",
			aEvent.pageY + this.createEditableMouseOffset.y);
	},

	"fetchModelTree": function () {
		var collection = new Launch.models.ElementCollection();

		_.each(this.childViews, function (aElemView) {
			collection.add(aElemView.fetchModelTree());
		});

		this.model.set("children", collection);

		return this.model;
	},

	"fetchResponseTree": function () { }
});

Launch.views.QuestionElementView = Launch.views.ElementView.extend({
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
		Launch.views.ElementView.prototype.applyModel.call(this, aModel);
		this.$viewElements = {
			"$qNumber": this.$el.find("[data-widget='questionNumber']"),
			"$qTitle": this.$el.find("[data-widget='questionTitle']")
		};
	},

	"initializeEditable": function () {
		this.attachEditableFieldHandler(
			this.$viewElements.$qTitle, this.setTitle);
		this.attachEditableFieldHandler(
			this.$viewElements.$qNumber, this.setNumber);
		this.attachDropHandler();
	},

	"setTitle": function (aTitle) {
		this.setProperty("title", aTitle);
		this.$viewElements.$qTitle.html(aTitle);
	},

	"setNumber": function (aNumber) {
		this.setProperty("number", aNumber);
		this.$viewElements.$qNumber.html(aNumber);
	},

	"onNewElementAdded": function (aElementView) {
		aElementView.setQuestionId(this.model.get("properties").elementId);
	},

	"fetchResponseTree": function () {
		var props = this.model.get("properties");
		var responses = _.map(this.childViews, function (aElemView) {
			return aElemView.fetchResponseTree();
		}, this);

		return $.extend(true, {
			"answers": responses
		}, props);
	}
});

Launch.views.FormElementView = Launch.views.ElementView.extend({
	"scope": Launch.globals.scope.form,
	"questionId": undefined,

	// "initialize": function (aOptions) {
	// 	Launch.views.ElementView.prototype.initialize.call(this, aOptions);
	// },

	// "initializeEditable": function () {
	// },

	"preApplyModel": function () {
		if (this.editMode) {
			this.setProperty("inputId", "formInput" + this.model.get("properties").elementId);
		}
	},

	"setQuestionId": function (aId) {
		this.questionId = aId;
		this.setProperty("questionId", this.questionId);
		this.onSetQuestionId(aId);
	},

	"onSetQuestionId": function (aId) {}
});

Launch.views.RadioButtonElementView = Launch.views.FormElementView.extend({
	"applyModel": function (aModel) {
		Launch.views.ElementView.prototype.applyModel.call(this, aModel);
		var self = this;
		var $view = {
			"$rLabel": self.$el.find("[data-widget='radioLabel']"),
			"$rButton": self.$el.find("[data-widget='radioButton']"),
			"$rImage": self.$el.find("[data-widget='radioImage']"),
			"$rTitle": self.$el.find("[data-widget='radioTitle']")
		};
		var props = this.model.get("properties");

		$view.$rButton.prop("checked", props.radioChecked);

		self.$viewElements = $view;
	},

	"initializeEditable": function () {
		this.attachEditableFieldHandler(
			this.$viewElements.$rTitle, this.setTitle);

		this.attachEditablePopoverHandler(
			this.$viewElements.$rImage,
			{ "label": "Enter image url:" },
			this.setImageUrl);
	},

	"setTitle": function (aTitle) {
		this.setProperty("title", aTitle);
		this.$viewElements.$rTitle.html(aTitle);
	},

	"setImageUrl": function (aUrl) {
		this.setProperty("iconUrl", aUrl);
		this.$viewElements.$rImage.prop("src", aUrl);
	},

	"onSetQuestionId": function (aId) {
		var groupName = "radioGroup" + aId;
		this.setProperty("radioGroupName", groupName);
		this.$viewElements.$rButton.prop("name", groupName);
	}
});

Launch.views.TermsOfUseElementView = Launch.views.FormElementView.extend({
	"applyModel": function (aModel) {
		Launch.views.ElementView.prototype.applyModel.call(this, aModel);
		var self = this;
		self.$viewElements = {
			"$rText": self.$el.find("[data-widget='tosText']"),
			"$rCheckbox": self.$el.find("[data-widget='agreeCheckbox']"),
			"$rPrompt": self.$el.find("[data-widget='agreePrompt']")
		};
	},

	"initializeEditable": function (aModel) {
		this.questionId = Launch.editor.getNextAvailableId();
		this.setProperty("questionId", this.questionId);
	},
});

Launch.views.ButtonElementView = Launch.views.FormElementView.extend({
	"applyModel": function (aModel) {
		Launch.views.ElementView.prototype.applyModel.call(this, aModel);
		this.$viewElements = {
			"$rButton": this.$el.find("[data-widget='button']")
		};
	},

	"initializeEditable": function (aModel) {
		this.attachEditablePopoverHandler(
			this.$viewElements.$rButton,
			{ "label": "Enter button text:" },
			this.setButtonLabel);
	},

	"setButtonLabel": function (aLabel) {
		this.setProperty("label", aLabel);
		this.$viewElements.$rButton.prop("value", aLabel);
	}
});

Launch.views.TextboxElementView = Launch.views.FormElementView.extend({
	"applyModel": function (aModel) {
		Launch.views.ElementView.prototype.applyModel.call(this, aModel);
		this.$viewElements = {
			"$rTextbox": this.$el.find("[data-widget='textbox']")
		};
	},

	"initializeEditable": function (aModel) {
		this.attachEditablePopoverHandler(
			this.$viewElements.$rTextbox,
			{ "label": "Enter input placeholder text:" },
			this.setPlaceholder);
	},

	"setPlaceholder": function (aPlaceholder) {
		this.setProperty("placeholder", aPlaceholder);
		this.$viewElements.$rTextbox.prop("placeholder", aPlaceholder);
	}
});

Launch.views.TextElementView = Launch.views.FormElementView.extend({
	"applyModel": function (aModel) {
		Launch.views.ElementView.prototype.applyModel.call(this, aModel);
		this.$viewElements = {
			"$rTitle": this.$el.find("[data-widget='title']")
		};
	},

	"initializeEditable": function (aModel) {
		this.attachEditableFieldHandler(
			this.$viewElements.$rTitle, this.setTitle);
	},

	"setTitle": function (aTitle) {
		this.setProperty("title", aTitle);
		this.$viewElements.$rTitle.html(aTitle);
	}
});
