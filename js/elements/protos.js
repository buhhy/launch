Launch.views.ElementProtoView = Launch.views.View.extend({
	"elementMarkUp":  [
		"<li class='element-sample'>",
		"<header><%= title %></header>",
		"<article><img class='icon' src='<%= icon %>'></article>",
		"</li>"
	].join(""),

	"canvasView": undefined,
	"model": undefined,
	"targetParent": undefined,
	"scope": undefined,

	"initialize": function (aOptions) {
		this.canvasView = aOptions.canvasView;
		this.targetParent = this.canvasView.$el;
		this.scope = this.model.get("scope");
		this.buildElement();
		this.attachClickHandler();
	},

	"buildElement": function () {
		this.setElement(_.template(this.elementMarkUp, {
			"title": this.model.get("title"),
			"icon": this.model.get("icon")
		}));
	},

	"spawnChild": function () {
		return new Launch.views.FormElementView({
			"baseModel": this.model,
			"parent": $("body"),
			"editMode": true
		})
	},

	"attachClickHandler": function () {
		var self = this;
		self.$el.mousedown(function (aEvent) {
			var newEl = self.spawnChild();
			newEl.moveToMouseCursor(aEvent);
			newEl.$el.trigger(aEvent);
			aEvent.preventDefault();
		});
	}
});

Launch.views.QuestionProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[0]
});

Launch.views.ButtonProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[1]
});

Launch.views.TextboxProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[2]
});

Launch.views.RadioButtonProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[3]
});

Launch.views.TermsOfServiceProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[4]
});

Launch.views.ElementPalette = Launch.views.View.extend({
	"elements": [
		Launch.views.QuestionProtoView,
		Launch.views.ButtonProtoView,
		Launch.views.TextboxProtoView,
		Launch.views.RadioButtonProtoView,
		Launch.views.TermsOfServiceProtoView
	],

	"canvasView": undefined,

	"initialize": function (aOptions) {
		this.canvasView = aOptions.canvasView;
		_.each(this.elements, function (aElement, aIndex, aList) {
			var element = new aElement({
				"canvasView": this.canvasView
			});
			element.attachTo(this.$el);
		}, this);
	}
});

Launch.views.ElementCanvas = Launch.views.View.extend({
	"elements": [],

	"initialize": function () {
		var self = this;
		self.$el.droppable({
			"accept": ".element",
			"scope": Launch.globals.scope.standalone,
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
	},

	"attachNewElementView": function (aElementView) {
		this.elements.push(aElementView);
		aElementView.attachTo(this.$el);
	}
});
