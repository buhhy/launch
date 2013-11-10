Launch.views.ElementCanvas = Launch.views.View.extend({
	"initialize": function (aOptions) {
		Launch.views.View.prototype.initialize.call(this, aOptions);
	},

	"attachViews": function (aViews) {
		_.each(aViews, function (aElemView) {
			this.attachNewElementView(aElemView);
		}, this);
	},

	"fetchResponseTree": function () {
		return _.map(this.childViews, function (aElemView) {
			return aElemView.fetchResponseTree();
		}, this);
	}
});

Launch.views.Survey = Backbone.View.extend({
	"events": {
		"submit #elementCanvas": "submitSurvey"
	},

	"initialize": function () {
		this.canvasView = new Launch.views.ElementCanvas({
			"el": "#elementCanvas"
		});

		this.firebase = new Firebase("https://etude.firebaseio.com/surveys/test");
		this.loadData();
	},

	"loadData": function () {
		var self = this;

		$.ajax({
			"method": "get",
			"url": "https://etude.firebaseio.com/surveys/test.json"
		}).success(function (aResults) {
			var collection = new Launch.models.ElementCollection();
			collection.reset(aResults);
			self.canvasView.attachViews(self.buildViewHierarchy(collection));
		});
	},

	"buildViewHierarchy": function (aCollection) {
		return aCollection.map(function (aModel) {
			var baseModel = Launch.getElementProtoForObjectType(aModel.get("objectType"));
			var view = new (baseModel.get("viewClass"))({
				"model": aModel,
				"baseModel": baseModel
			});
			var subviews = this.buildViewHierarchy(aModel.get("children"));

			_.each(subviews, function (aElemView) {
				view.attachNewElementView(aElemView);
			}, this);

			return view;
		}, this);
	},

	"submitSurvey": function (aEvent) {
		aEvent.preventDefault();
		console.log(this.canvasView.fetchResponseTree());
	}
});