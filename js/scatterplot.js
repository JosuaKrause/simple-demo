/**
 * Created by krause on 2015-04-03 12:02am.
 */

function Scatterplot(sel, size, radius, duration, ease) {
  var that = this;
  var paddingLeft = 45;
  var paddingRight = 25;
  var paddingTop = 10 + (paddingLeft + paddingRight) * 0.5;
  var paddingBottom = 20 + (paddingLeft + paddingRight) * 0.5;
  var ixs = [];
  var featureA = null;
  var featureB = null;
  var axisX = d3.svg.axis();
  var axisY = d3.svg.axis();

  sel.style({
    "display": "inline-block"
  });
  var svg = sel.append("svg").style({
    "width": size + "px",
    "height": size + "px"
  }).attr({
    "width": size,
    "height": size
  });
  svg.append("rect").attr({
    "width": size - paddingLeft - paddingRight,
    "height": size - paddingTop - paddingBottom,
    "fill": "none",
    "stroke": "lightgray",
    "transform": "translate(" + paddingLeft + " " + paddingTop + ")"
  });
  var axisSelX = svg.append("g").classed("axis", true);
  var axisSelY = svg.append("g").classed("axis", true);

  var nameX = svg.append("text").attr({
    "transform": "translate(" + (paddingLeft + (size - paddingLeft - paddingRight) * 0.5) + " " + (size - 15) + ")",
    "text-anchor": "middle"
  });
  var nameY = svg.append("text").attr({
    "transform": "translate(" + (size - 15) + " " + (paddingTop + (size - paddingTop - paddingBottom) * 0.5) + ") rotate(90)",
    "text-anchor": "middle"
  });

  this.setIxs = function(_) {
    ixs = _;
  };
  this.setFeature = function(f, isA) {
    if(isA) {
      featureA = f;
    } else {
      featureB = f;
    }
  };
  this.getFeature = function(isA) {
    return isA ? featureA : featureB;
  };
  this.update = function() {
    if(!featureA || !featureB) return;
    var sx = featureA.scale().domain(featureA.getExtent()).range([ paddingLeft, size - paddingRight ]).nice();
    var sy = featureB.scale().domain(featureB.getExtent()).range([ paddingTop, size - paddingBottom ]).nice();

    axisX.scale(sx).orient("bottom").tickSize(size - paddingTop - paddingBottom);
    axisY.scale(sy).orient("left").tickSize(size - paddingLeft - paddingRight);
    axisSelX.attr({
      "transform": "translate(0 " + paddingTop + ")"
    }).transition().duration(duration).ease(ease).call(axisX);
    axisSelY.attr({
      "transform": "translate(" + (size - paddingRight) + " 0)"
    }).transition().duration(duration).ease(ease).call(axisY);

    nameX.text(featureA.getName());
    nameY.text(featureB.getName());

    function getX(ix) {
      return sx(featureA.getValue(ix));
    }

    function getY(ix) {
      return sy(featureB.getValue(ix));
    }

    var circles = svg.selectAll("circle").data(ixs, function(ix) {
      return ix;
    });
    circles.exit().transition().duration(duration).ease(ease).attr({
      "r": 0
    }).remove();
    circles.enter().append("circle").attr({
      "r": 0,
      "cx": getX,
      "cy": getY,
      "fill": "cornflowerblue",
      "stroke": "black"
    });
    circles.transition().duration(duration).ease(ease).attr({
      "r": radius,
      "cx": getX,
      "cy": getY
    });
  }

} // Scatterplot
