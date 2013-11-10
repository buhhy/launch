Launch.views.View = Backbone.View.extend({
	"elements": [],

	"attachTo": function($aEl) {
		$aEl.append(this.$el);
	},

	"detach": function() {
		this.$el.detach();
	},

	"overrideDefaultClickHandlers": function () {
		this.$el.find("input").click(function (aEvent) {
			aEvent.preventDefault();
		});
	},

	"attachDropHandler": function (aAccept) {
		var self = this;
		self.$el.droppable({
			"accept": $.proxy(aAccept, this),
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
