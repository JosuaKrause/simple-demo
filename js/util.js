/**
 * Created by krause on 2015-04-04 01:05am.
 */

function removeIxs(ixs, rem) {
  // ixs.sort(d3.ascending); // we can assume that it is already sorted
  // rem.sort(d3.ascending); // we can assume that it is already sorted
  var newIxs = [];
  var p = 0;
  var q = 0;
  while(p < ixs.length && q < rem.length) {
    var a = ixs[p];
    var b = rem[q];
    if(a < b) {
      newIxs.push(a);
      p += 1;
    } else if(a > b) {
      q += 1;
    } else { // a === b
      p += 1;
    }
  }
  for(;p < ixs.length;p += 1) {
    newIxs.push(ixs[p]);
  }
  return newIxs;
}

function unionIxs(axs, bxs) {
  // axs.sort(d3.ascending); // we can assume that it is already sorted
  // bxs.sort(d3.ascending); // we can assume that it is already sorted
  var newIxs = [];
  var lastIx = Number.NaN;
  var p = 0;
  var q = 0;
  while(p < axs.length && q < bxs.length) {
    var a = axs[p];
    var b = bxs[q];
    if(a > b) {
      if(b !== lastIx) {
        newIxs.push(b);
        lastIx = b;
      }
      q += 1;
    } else { // a <= b
      if(a !== lastIx) {
        newIxs.push(a);
        lastIx = a;
      }
      p += 1;
    }
  }
  // only one of the for loops will be executed
  for(;p < axs.length;p += 1) {
    var a = axs[p];
    if(a !== lastIx) {
      newIxs.push(a);
      lastIx = a;
    }
  }
  for(;q < bxs.length;q += 1) {
    var b = bxs[q];
    if(b !== lastIx) {
      newIxs.push(b);
      lastIx = b;
    }
  }
  return newIxs;
}

function intersectIxs(ixs, rem) {
  // ixs.sort(d3.ascending); // we can assume that it is already sorted
  // rem.sort(d3.ascending); // we can assume that it is already sorted
  var newIxs = [];
  var p = 0;
  var q = 0;
  while(p < ixs.length && q < rem.length) {
    var a = ixs[p];
    var b = rem[q];
    if(a < b) {
      p += 1;
    } else if(a > b) {
      q += 1;
    } else { // a === b
      newIxs.push(a);
      p += 1;
    }
  }
  return newIxs;
}

function toPoly(arr) {
  return arr.reduce(function(str, cur) {
    if(str.length) {
      str += " L ";
    } else {
      str += "M ";
    }
    str += cur;
    return str;
  }, "");
}

function crossings(px, py, posA, posB) {
  var x0 = posA[0];
  var y0 = posA[1];
  var x1 = posB[0];
  var y1 = posB[1];
  if(py <  y0 && py <  y1) return 0;
  if(py >= y0 && py >= y1) return 0;
  // (y0 != y1) || console.warn("y0 == y1", posA, posB);
  if(px >= x0 && px >= x1) return 0;
  if(px <  x0 && px <  x1) return (y0 < y1) ? 1 : -1;
  var xintercept = x0 + (py - y0) * (x1 - x0) / (y1 - y0);
  if (px >= xintercept) return 0;
  return (y0 < y1) ? 1 : -1;
}

function pointInPolygon(px, py, list) {
  if(list.length < 3) return false;
  var posA = list[list.length - 1];
  var numCrossings = 0;
  list.forEach(function(posB) {
    numCrossings += crossings(px, py, posA, posB);
    posA = posB;
  });
  return numCrossings & 1 != 0;
}
