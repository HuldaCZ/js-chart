const graphics = {};

graphics.drawPiont = (ctx, loc, color = "#000", size = 8) => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(...loc, size / 2, 0, 2 * Math.PI);
  ctx.fill();
};
