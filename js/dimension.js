/**
 * Created by krause on 2015-04-02 11:30pm.
 */

function Dimension(name, rowCount) {
  var that = this;
  var values = new Float64Array(rowCount);
  var scale = d3.scale.linear();
  var oldScale = scale;

  this.setValue = function(ix, value) {
    var v = +value;
    values[ix] = v;
  };
  this.getValue = function(ix) {
    return values[ix];
  };
  this.getExtent = function(ixs) {
    var minValue = Number.POSITIVE_INFINITY;
    var maxValue = Number.NEGATIVE_INFINITY;
    ixs.forEach(function(ix) {
      var v = values[ix];
      if(v < minValue) {
        minValue = v;
      }
      if(v > maxValue) {
        maxValue = v;
      }
    });
    if(minValue == maxValue) { // fix for bug when we have only one value
      maxValue += 0.1;
    } else if(minValue > maxValue) { // fix for bug when we don't have any value
      minValue = 0
      maxValue = 1
    }
    return [ minValue, maxValue ];
  };
  this.getName = function() {
    return name;
  };
  this.scale = function(_) {
    if(!arguments.length) return scale;
    that.oldScale(scale.copy());
    scale = _;
  };
  this.oldScale = function(_) {
    if(!arguments.length) return oldScale;
    oldScale = _;
  };
} // Category
Dimension.loadAll = function(data, columns, features) {
  var ixs = [];
  var rows = data.length;
  data.forEach(function(row, ix) {
    columns.forEach(function(col) {
      if(!(col in features)) {
        features[col] = new Dimension(col, rows);
      }
      features[col].setValue(ix, row[col]);
    });
    ixs.push(ix);
  });
  return ixs;
};
