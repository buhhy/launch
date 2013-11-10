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
			"accept": function (aHelper) {
				if (aHelper.hasClass("element")) {
					var eType = aHelper.data("elementType");
					if (eType.indexOf(Launch.globals.elementType.standalone) !== -1)
						return true;
				}
				return false;
			},
			"drop": function (aEvent, aUi) {
				// get position relative to active canvas
				var thisPos = self.$el.offset();
				var thatPos = aUi.helper.offsetParent().offset();
				var itemPos = aUi.position;
				var newX =  itemPos.left - (thisPos.left - thatPos.left);
				var newY = itemPos.top - (thisPos.top - thatPos.top);

				var elemView = aUi.helper.data("model");
				elemView.reposition(newX, newY);
				elemView.detach();
				self.attachNewElementView(elemView);

				// clear in case of memory leak?
				aUi.helper.data("model", undefined);
			}
		});
	},

	"attachNewElementView": function (aElementView) {
		this.elements.push(aElementView);
		aElementView.attachTo(this.$el);
	}
});
