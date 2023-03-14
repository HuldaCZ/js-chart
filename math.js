const math = {}

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