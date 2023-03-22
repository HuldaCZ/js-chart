const math = {}

math.equals = (a, b) => {
  return a[0] === b[0] && a[1] === b[1]
}

math.lerp = (a, b, t) => {
  return a + (b - a) * t
}

math.invLerp = (a, b, v) => {
  return (v - a) / (b - a)
}

math.remap = (oldA, oldB, newA, newB, v) => {
  return math.lerp(newA, newB, math.invLerp(oldA, oldB, v))
}

math.formatNumber = (n, dec=0) => {
  return n.toFixed(dec)
}

math.remapPoint = (oldBounds, newBounds, point) => {
  const pixelLoc = [
    math.remap(oldBounds.left, oldBounds.right, newBounds.left, newBounds.right, point[0]),
    math.remap(oldBounds.top, oldBounds.bottom, newBounds.top, newBounds.bottom, point[1]),
  ]
  return pixelLoc
}

math.add = (a, b) => {
  return [a[0] + b[0], a[1] + b[1]]
}

math.subtract = (a, b) => {
  return [a[0] - b[0], a[1] - b[1]]
}

math.scale = (a, s) => {
  return [a[0] * s, a[1] * s]
}

math.distance = (a, b) => {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
}

math.getNearest = (loc, points) => {
  let minDist = Number.MAX_VALUE;
  let nearestIndex = 0;
  for(let i = 0; i < points.length; i++) {
    const point = points[i]
    const dist = math.distance(loc, point)
    if(dist < minDist) {
      minDist = dist
      nearestIndex = i
    }
  }
  return nearestIndex
}