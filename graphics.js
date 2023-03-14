const graphics = {};

graphics.drawPiont = (ctx, loc, color = "#000", size = 8) => {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(...loc, size / 2, 0, 2 * Math.PI);
  ctx.fill();
};

graphics.drawText = (
  ctx,
  { text, loc, color = "#000", size = 16, align = "center", vlAlign = "middle" }
) => {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = vlAlign;
  ctx.fillText(text, ...loc);
};
