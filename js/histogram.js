/**
 * Created by krause on 2015-04-03 09:16pm.
 */

function Histogram(sel, width, height, duration, ease, colors, onSelect) {
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
  var ixs = [];
  this.ixs = function(_) {
    if(!arguments.length) return ixs;
    ixs = _;
  };
  var selIxs = [];
  this.selIxs = function(_) {
    if(!arguments.length) return selIxs;
    selIxs = _.slice();
    selIxs.sort(d3.ascending);
  };
  var selColor = colors[2];
  this.setSelColor = function(temp) {
    selColor = colors[temp ? 1 : 2];
  };

  this.update = function(smooth) {

    function smoothify(sel) {
      return smooth ? sel.transition().duration(duration).ease(ease) : sel;
    }

    if(!feature || !ixs.length) {
      smoothify(svg.selectAll("rect")).attr({
        "y": height,
        "height": 0
      }).remove();
      return;
    }
    var k = Math.ceil(Math.log2(ixs.length) + 1); // Sturge's rule
    var extent = feature.getExtent(ixs);
    var binW = (extent[1] - extent[0]) / k;

    function binForValue(v) {
      return Math.min(Math.floor((v - extent[0]) / binW), k - 1);
    }

    function doSelect(_, sb) {
      var newSel = [];
      ixs.forEach(function(ix) {
        var v = feature.getValue(ix);
        var b = binForValue(v);
        if(sb === b) {
          newSel.push(ix);
        }
      });
      onSelect(newSel);
    }

    var binsNorm = new Uint32Array(k);
    removeIxs(ixs, selIxs).forEach(function(ix) {
      var v = feature.getValue(ix);
      var b = binForValue(v);
      binsNorm[b] += 1;
    });
    var binsSel = new Uint32Array(k);
    intersectIxs(ixs, selIxs).forEach(function(ix) {
      var v = feature.getValue(ix);
      var b = binForValue(v);
      binsSel[b] += 1;
    });

    var maxBin = 0;
    for(var b = 0;b < binsNorm.length;b += 1) {
      if(binsNorm[b] + binsSel[b] > maxBin) {
        maxBin = binsNorm[b] + binsSel[b];
      }
    };

    var rectW = width / k;

    function getX(bin, ix) {
      return ix * rectW;
    }
    function getYNorm(bin, ix) {
      return height - (bin + binsSel[ix]) / maxBin * height;
    }
    function getYSel(bin, ix) {
      return height - bin / maxBin * height;
    }
    function getWidth(bin, ix) {
      return rectW;
    }
    function getHeight(bin, ix) {
      return bin / maxBin * height;
    }

    var rects = svg.selectAll("rect.norm").data(binsNorm, function(bin, ix) {
      return ix;
    });
    smoothify(rects.exit()).attr({
      "x": getX,
      "y": height,
      "width": getWidth,
      "height": 0
    }).remove();
    rects.enter().append("rect").classed("norm", true).attr({
      "x": getX,
      "y": height,
      "width": getWidth,
      "height": 0,
      "fill": colors[0],
      "stroke": "black",
      "stroke-width": 0.2
    });
    rects.on("click", doSelect);
    smoothify(rects).attr({
      "x": getX,
      "y": getYNorm,
      "width": getWidth,
      "height": getHeight
    });

    var rectsSel = svg.selectAll("rect.sel").data(binsSel, function(bin, ix) {
      return ix;
    });
    smoothify(rectsSel.exit()).attr({
      "x": getX,
      "y": height,
      "width": getWidth,
      "height": 0
    }).remove();
    rectsSel.enter().append("rect").classed("sel", true).attr({
      "x": getX,
      "y": height,
      "width": getWidth,
      "height": 0,
      "stroke": "black",
      "stroke-width": 0.2
    });
    rectsSel.attr({
      "fill": selColor
    }).on("click", doSelect);
    smoothify(rectsSel).attr({
      "x": getX,
      "y": getYSel,
      "width": getWidth,
      "height": getHeight
    });
  };
} // Histogram
