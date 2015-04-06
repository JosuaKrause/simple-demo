/**
 * Created by krause on 2015-04-03 09:16pm.
 */

function Histogram(sel, width, height, duration, ease, onSelect) {
  var that = this;

  var svg = sel.append("svg").style({
    "width": width + "px",
    "height": height + "px",
    "display": "inline-block"
  }).attr({
    "width": width,
    "height": height
  });

  this.update = function(state, smooth) {

    function smoothify(sel) {
      return smooth ? sel.transition().duration(duration).ease(ease) : sel;
    }

    var feature = state.featureA();
    var ixs = state.ixs();
    if(!feature || !ixs.length) {
      smoothify(svg.selectAll("rect")).attr({
        "y": height,
        "height": 0
      }).remove();
      return;
    }
    var selIxs = state.selIxs();
    var tmpIxs = state.tmpIxs();
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
      if(d3.event.shiftKey) {
        newSel = unionIxs(newSel, selIxs);
      }
      onSelect(newSel);
    }

    var binsNorm = new Uint32Array(k);
    var restIxs = unionIxs(selIxs, tmpIxs);
    removeIxs(ixs, restIxs).forEach(function(ix) {
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
    var binsTmp = new Uint32Array(k);
    intersectIxs(ixs, tmpIxs).forEach(function(ix) {
      var v = feature.getValue(ix);
      var b = binForValue(v);
      binsTmp[b] += 1;
    });

    var maxBin = 0;
    for(var b = 0;b < binsNorm.length;b += 1) {
      if(binsNorm[b] + binsSel[b] + binsTmp[b] > maxBin) {
        maxBin = binsNorm[b] + binsSel[b] + binsTmp[b];
      }
    };

    var rectW = width / k;

    function getX(bin, ix) {
      return ix * rectW;
    }
    function getYNorm(bin, ix) {
      return height - (bin + binsSel[ix] + binsTmp[ix]) / maxBin * height;
    }
    function getYSel(bin, ix) {
      return height - (bin + binsTmp[ix]) / maxBin * height;
    }
    function getYTmp(bin, ix) {
      return height - bin / maxBin * height;
    }
    function getWidth(bin, ix) {
      return rectW;
    }
    function getHeight(bin, ix) {
      return bin / maxBin * height;
    }

    function doRects(bins, clazz, yFun, color) {
      var rects = svg.selectAll("rect."+clazz).data(bins, function(bin, ix) {
        return ix;
      });
      smoothify(rects.exit()).attr({
        "x": getX,
        "y": height,
        "width": getWidth,
        "height": 0
      }).remove();
      rects.enter().append("rect").classed(clazz, true).attr({
        "x": getX,
        "y": height,
        "width": getWidth,
        "height": 0,
        "fill": color,
        "stroke": "black",
        "stroke-width": 0.2
      });
      rects.on("click", doSelect);
      smoothify(rects).attr({
        "x": getX,
        "y": yFun,
        "width": getWidth,
        "height": getHeight
      });
    }

    doRects(binsNorm, "norm", getYNorm, state.color());
    doRects(binsSel, "sel", getYSel, state.selColor());
    doRects(binsTmp, "tmp", getYTmp, state.tmpColor());
  };
} // Histogram
