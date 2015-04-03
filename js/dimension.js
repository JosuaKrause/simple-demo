/**
 * Created by krause on 2015-04-02 11:30pm.
 */

function Dimension(name, rowCount) {
  var that = this;
  var values = new Float64Array(rowCount);
  var minValue = Number.POSITIVE_INFINITY;
  var maxValue = Number.NEGATIVE_INFINITY;
  var scale = d3.scale.linear();

  this.setValue = function(ix, value) {
    var v = +value;
    values[ix] = v;
    if(Number.isFinite(v)) {
      minValue = Math.min(minValue, v);
      maxValue = Math.max(maxValue, v);
    }
  };
  this.getValue = function(ix) {
    return values[ix];
  };
  this.getExtent = function() {
    return [ minValue, maxValue ];
  };
  this.getName = function() {
    return name;
  };
  this.scale = function(_) {
    if(!arguments.length) return scale;
    scale = _;
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
