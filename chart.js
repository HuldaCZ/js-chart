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

    this.margin = size * 0.1;
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
    }
  }
}
