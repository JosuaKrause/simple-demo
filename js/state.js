/**
 * Created by krause on 2015-04-06 03:23pm.
 */

function State() {
  var that = this;
  var featureA = null;
  this.featureA = function(_) {
    if(!arguments.length) return featureA;
    featureA = _;
  };
  var featureB = null;
  this.featureB = function(_) {
    if(!arguments.length) return featureB;
    featureB = _;
  };
  var ixs = [];
  this.ixs = function(_) {
    if(!arguments.length) return ixs;
    ixs = _;
    ixs.sort(d3.ascending);
  };
  var selIxs = [];
  this.selIxs = function(_) {
    if(!arguments.length) return selIxs;
    selIxs = _;
    selIxs.sort(d3.ascending);
  };
  var tmpIxs = [];
  this.tmpIxs = function(_) {
    if(!arguments.length) return tmpIxs;
    tmpIxs = _;
    tmpIxs.sort(d3.ascending);
  };
  var color = State.COLOR;
  this.color = function(_) {
    if(!arguments.length) return color;
    color = _;
  };
  var selColor = State.COLOR_SEL;
  this.selColor = function(_) {
    if(!arguments.length) return selColor;
    selColor = _;
  };
  var tmpColor = State.COLOR_TMP;
  this.tmpColor = function(_) {
    if(!arguments.length) return tmpColor;
    tmpColor = _;
  };
  var updateListeners = [];
  this.addListener = function(l) {
    updateListeners.push(l);
    l(that, true, true, true, true);
  };
  this.update = function(fA, fB, ixs, selIxs) {
    updateListeners.forEach(function(l) {
      l(that, fA, fB, ixs, selIxs);
    });
  };
  this.clearListeners = function() {
    updateListeners = [];
  };
} // State
State.COLOR = "cornflowerblue";
State.COLOR_TMP = "orange";
State.COLOR_SEL = "crimson";
