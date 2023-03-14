class Chart {
  constructor(container, samples, options) {
    this.samples = samples;

    this.axesLabels = options.axesLabels;
    this.styles = options.styles;

    this.canvas = document.createElement("canvas");
    this.canvas.width = options.size;
    this.canvas.height = options.size;

    this.canvas.style = "background-color: #fff";
    this.canvas.style = "border: 1px solid #000000";
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.margin = options.size * 0.1;
    this.transparency = 0.5;

    this.pixelBounds = this.#getPixelBounds();
    this.dataBounds = this.#getDataBounds();

    this.#draw();
  }

  #getPixelBounds() {
    const { canvas, margin } = this;
    const bounds = {
      left: margin,
      right: canvas.width - margin,
      top: margin,
      bottom: canvas.height - margin,
    };
    return bounds;
  }

  #getDataBounds() {
    const { samples } = this;
    const x = samples.map((s) => s.point[0]);
    const y = samples.map((s) => s.point[1]);
    const bounds = {
      left: Math.min(...x),
      right: Math.max(...x),
      top: Math.min(...y),
      bottom: Math.max(...y),
    };
    return bounds;
  }

  #draw() {
    const { ctx, canvas, transparency } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = transparency;
    this.#drawSamples();
    ctx.globalAlpha = 1;
  }

  #drawSamples() {
    const { ctx, samples, pixelBounds, dataBounds } = this;
    for (const sample of samples) {
      const { point } = sample;
      const pixelLoc = [
        math.remap(dataBounds.left, dataBounds.right, pixelBounds.left, pixelBounds.right, point[0]),
        math.remap(dataBounds.top, dataBounds.bottom, pixelBounds.top, pixelBounds.bottom, point[1]),
      ]
      graphics.drawPiont(ctx, pixelLoc)
    }
  }
}
