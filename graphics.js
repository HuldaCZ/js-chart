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

graphics.generateImages = (styles, size = 20) => {
  for (let label in styles) {
    const style = styles[label];
    const canvas = document.createElement("canvas");
    canvas.width = size + 10;
    canvas.height = size + 10;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = size + "px Courier";
    ctx.fillText(style.text, size / 2, size / 2);

    style["image"] = new Image();
    style["image"].src = canvas.toDataURL();
  }
};

graphics.drawImage = (ctx, image, loc) => {
  ctx.beginPath();
  ctx.drawImage(
    image,
    loc[0] - image.width / 2,
    loc[1] - image.height / 2,
    image.width,
    image.height
  );
  ctx.fill();
};
