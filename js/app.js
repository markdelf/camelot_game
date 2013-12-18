App = Ember.Application.create();

App.Router.map(function() {
  this.resource('game', function(){
  	this.resource('state');
  });
});

App.GameRoute = Ember.Route.extend({
  model: function() {
    var b = new Board();
    b.init();
    return b;
  }
});

App.StateRoute = Ember.Route.extend({
	model: function() {

	}
});

App.StateController = Ember.ObjectController.extend({
	turn: null
});
