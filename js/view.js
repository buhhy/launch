Launch.views.View = Backbone.View.extend({
	"childElements": undefined,
	"parentView": undefined,

	"initialize": function (aOptions) {
		this.childElements = [];
	},

	/**
	 * Detaches a view from its parent, and calls the parent's detach callback
	 */
	"detachFromView": function (aDestroy) {
		if (this.parentView)
			this.parentView.onChildDetached(this);
		if (aDestroy)
			this.onDestroy();
		this.$el.detach();
	},

	/**
	 * Attaches to a Backbone View
	 */
	"attachToView": function (aElemView) {
		this.parentView = aElemView;
		aElemView.$el.append(this.$el);
	},


	"acceptDragFn": function (aHelper) {
		return true;
	},

	"attachDropHandler": function ($elem) {
		var self = this;
		$elem = $elem || self.$el;
		$elem.droppable({
			"accept": $.proxy(this.acceptDragFn, this),
			"drop": function (aEvent, aUi) {
				// get position relative to active canvas
				var thisPos = self.$el.offset();
				var thatPos = aUi.helper.offsetParent().offset();
				var itemPos = aUi.position;
				var newX =  itemPos.left - (thisPos.left - thatPos.left);
				var newY = itemPos.top - (thisPos.top - thatPos.top);

				var elemView = aUi.helper.data("model");
				elemView.reposition(newX, newY);

				if (self !== elemView.parentView)
					self.attachNewElementView(elemView);

				// clear in case of memory leak?
				aUi.helper.data("model", undefined);
			}
		});
	},

	"attachNewElementView": function (aElementView) {
		aElementView.detachFromView();
		this.childElements.push(aElementView);
		aElementView.attachToView(this);
		this.onNewElementAdded(aElementView);
	},

	"onDestroy": function () { },

	"onNewElementAdded": function (aElementView) { },

	"onChildDetached": function (aChildView) {
		for (var i = 0; i < this.childElements.length; i++) {
			if (this.childElements[i] === aChildView) {
				this.childElements.splice(i, 1);
				console.log(i);
				break;
			}
		}
	}
});
