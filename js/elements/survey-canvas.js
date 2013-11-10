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
		return _.filter(_.map(this.childViews, function (aElemView) {
			return aElemView.fetchResponseTree();
		}), function (aElemView) {
			return aElemView !== undefined && aElemView !== null;
		});
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

		this.firebase = new Firebase(Launch.globals.firebase.root);
		this.loadData();
	},

	"loadData": function () {
		var self = this;
		var url = Launch.globals.firebase.root + "/" +
				Launch.globals.firebase.template + ".json";

		$.ajax({
			"method": "get",
			"url": url
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
		var db = this.firebase.child(Launch.globals.firebase.results);
		var json = this.canvasView.fetchResponseTree();

		// for (var i = 0; i < json.length; i++) {
		// 	var elem = json[i];
		// 	if (elem.answers) {
		// 		for (var j = 0; j < elem.answers; j++) {
		// 			var adb = db.child(elem.elementId).child;
		// 			var answer = elem.answers[j];
		// 		}
		// 	}
		// }

		db.push(json, function (aError) {
			alert("Saved!");
		});
	}
});