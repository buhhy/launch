Launch.views.ElementProtoView = Launch.views.View.extend({
	"defaults": {
		"objectType": null,
		"title": "",
		"description": undefined,
		"width": null,
		"height": null
	},

	"model": undefined,
	"targetParent": $("#elementCanvas"),
	"scope": Launch.globals.scope.standalone,

	"initialize": function (aOptions) {
		this.model = aOptions.model;
		aOptions = aOptions || {};
		_.defaults(aOptions, this.defaults);
		this.options = aOptions;

		this.setElement("<div class='element'></div>");
		this.setCss("width", aOptions.width);
		this.setCss("height", aOptions.height);
		this.attachDragHandlers();

		if (this.options.element) {
			this.$el.html(this.options.element);
			this.$el.data("objectType", this.options.objectType);
			this.overrideDefaultClickHandlers();
		}
	},

	"attachDragHandlers": function () {
		this.$el.draggable({
			"delay": 200,
			"helper": "clone",
			"opacity": 0.8,
			"appendTo": this.canvas,
			"cancel": false
		});
	},

	"setCss": function(aKey, aValue) {
		if (aValue !== undefined) {
			if (aValue === null)
				aValue = "";
			this.$el.css(aKey, aValue);
		}
	},

	"setEnabled": function (aEnabled) {}
});

Launch.views.ButtonProtoView = Launch.views.ElementProtoView.extend({
	"defaults": {
		"objectType": 1,
		"title": "Button Element",
		"description": "A push button :O",
		"width": 200,
		"element": [
			"<input type='button' class='button' value='Button'>"
		].join("")
	},

	"super": Launch.views.ElementProtoView.prototype,
	"$element": null,

	"initialize": function (aOptions) {
		aOptions = aOptions || {};
		_.defaults(aOptions, this.defaults);
		this.super.initialize.call(this, aOptions);
		this.$element = this.$el.find("input");
	},

	"setEnabled": function (aEnabled) {
		if (aEnabled)
			this.$element.removeProp("disabled");
		else
			this.$element.prop("disabled", true);
	}
});

Launch.views.ElementPalette = Launch.views.View.extend({
	"listElement":  [
		"<li class='element-sample'>",
		"<header><%= title %></header>",
		"<article></article>",
		"</li>"
	].join(""),

	"elements": [
		Launch.views.ButtonProtoView
	],

	"initialize": function () {
		_.each(this.elements, function (aElement, aIndex, aList) {
			var element = new aElement();
			var $listEl = $(_.template(this.listElement, {
				"title": element.options.title
			}));
			element.attachTo($listEl.children("article"));
			this.$el.append($listEl);
		}, this);
	}
});

Launch.views.ElementCanvas = Launch.views.View.extend({
	"elements": [],

	"initialize": function () {
		var self = this;
		self.$el.droppable({
			"accept": ".element",
			"drop": function (aEvent, aUi) {
				var type = aUi.draggable.data("objectType");

				// only proto objects have this object type property
				if (type) {
					var cloned = aUi.helper.clone();
					cloned.css("opacity", 1.0);
					self.$el.append(cloned);
					self.elements.push(new Launch.views.ElementView({
						"el": cloned,
						"objectType": type,
						"editMode": true
					}));
				}
			}
		});
	}
});
