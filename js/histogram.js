/**
 * Created by krause on 2015-04-03 09:16pm.
 */

function Histogram(sel, width, height, duration, ease) {
  var that = this;

  var svg = sel.append("svg").style({
    "width": width + "px",
    "height": height + "px",
    "display": "inline-block"
  }).attr({
    "width": width,
    "height": height
  });

  var feature = null;
  this.feature = function(_) {
    if(!arguments.length) return feature;
    feature = _;
  };
  var ixs = null;
  this.ixs = function(_) {
    if(!arguments.length) return ixs;
    ixs = _;
  };

  this.update = function() {
    if(!feature) return;
    var k = Math.ceil(Math.log2(ixs.length) + 1); // Sturge's rule
    var extent = feature.getExtent(ixs);
    var binW = (extent[1] - extent[0]) / k;

    function binForValue(v) {
      return Math.floor((v - extent[0]) / binW);
    }

    var maxBin = 0;
    var bins = new Uint32Array(k);
    ixs.forEach(function(ix) {
      var v = feature.getValue(ix);
      var b = binForValue(v);
      bins[b] += 1;
      if(bins[b] > maxBin) {
        maxBin = bins[b];
      }
    });

    var rectW = width / k;

    function getX(bin, ix) {
      return ix * rectW;
    }
    function getY(bin, ix) {
      return height - bin / maxBin * height;
    }
    function getWidth(bin, ix) {
      return rectW;
    }
    function getHeight(bin, ix) {
      return bin / maxBin * height;
    }

    var rects = svg.selectAll("rect").data(bins, function(bin, ix) {
      return ix;
    });
    rects.exit().transition().duration(duration).ease(ease).attr({
      "x": getX,
      "y": height,
      "width": getWidth,
      "height": 0
    }).remove();
    rects.enter().append("rect").attr({
      "x": getX,
      "y": height,
      "width": getWidth,
      "height": 0,
      "fill": "cornflowerblue",
      "stroke": "black",
      "stroke-width": 0.2
    });
    rects.transition().duration(duration).ease(ease).attr({
      "x": getX,
      "y": getY,
      "width": getWidth,
      "height": getHeight
    });
  };

} // Histogram
