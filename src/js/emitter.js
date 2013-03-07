/**
  Just wrap Backbone events,
  could easily be replaced with custom implementation
**/

define(['backbone'
], function(Backbone) {
  'use strict';

  var Emitter = function() {};

  Emitter.prototype.on = Backbone.Events.on;
  Emitter.prototype.off = Backbone.Events.off;
  Emitter.prototype.trigger = Backbone.Events.trigger;

  return Emitter;
});