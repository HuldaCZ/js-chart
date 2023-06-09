class Chart {
  constructor(container, samples, options, onClick) {
    this.samples = samples;

    this.axesLabels = options.axesLabels;
    this.styles = options.styles;
    this.icon = options.icon;
    this.onClick = onClick;

    this.canvas = document.createElement("canvas");
    this.canvas.width = options.size;
    this.canvas.height = options.size;

    this.canvas.style = "background-color: #fff";
    this.canvas.style = "border: 1px solid #000000";
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.margin = options.size * 0.1;
    this.transparency = options.transparency || 1

    this.dataTrans = {
      offset: [0, 0],
      scale: 1,
    };
    this.dragInfo = {
      start: [0, 0],
      end: [0, 0],
      offset: [0, 0],
      dragging: false,
    };

    this.pixelBounds = this.#getPixelBounds();
    this.dataBounds = this.#getDataBounds();
    this.defaultDataBounds = this.#getDataBounds();
    this.hoveredSample = null;
    this.selectedSample = null;

    this.#draw();

    this.#addEventListeners();
  }

  #addEventListeners() {
    const { canvas, dataTrans, dragInfo } = this;
    canvas.onmousedown = (e) => {
      const dataLoc = this.#getMouse(e, true);
      dragInfo.start = dataLoc;
      dragInfo.dragging = true;
      dragInfo.offset = [0, 0];
      dragInfo.end = [0, 0];
    };

    canvas.onmousemove = (e) => {
      if (dragInfo.dragging) {
        const dataLoc = this.#getMouse(e, true);
        dragInfo.end = dataLoc;
        dragInfo.offset = math.scale(math.subtract(dragInfo.start, dragInfo.end), dataTrans.scale);
        const newOffset = math.add(dataTrans.offset, dragInfo.offset);
        this.#updateDataBounds(newOffset, dataTrans.scale ** 2);
        this.#draw();
      }
      const pLoc = this.#getMouse(e);
      const pPoints = this.samples.map((s) =>
        math.remapPoint(this.dataBounds, this.pixelBounds, s.point)
      );

      const index = math.getNearest(pLoc, pPoints);
      const nearest = this.samples[index];
      const dist = math.distance(pPoints[index], pLoc);
      if (dist < this.margin / 2) {
        this.hoveredSample = nearest;
      } else {
        this.hoveredSample = null;
      }
      this.#draw();
    };

    canvas.onmouseup = (e) => {
      dataTrans.offset = math.add(dataTrans.offset, dragInfo.offset);
      dragInfo.dragging = false;
      dragInfo.offset = [0, 0];
      dragInfo.end = [0, 0];
    };

    canvas.onwheel = (e) => {
      const dir = Math.sign(e.deltaY);
      const scale = 1 + dir * 0.1;
      dataTrans.scale *= scale;
      this.#updateDataBounds(dataTrans.offset, dataTrans.scale);
      this.#draw();
      e.preventDefault();
    };

    canvas.onclick = (e) => {
      if (!math.equals(dragInfo.offset, [0, 0])) return;
      if (this.hoveredSample) {
        if (this.selectedSample === this.hoveredSample) {
          this.selectedSample = null;
        } else {
          this.selectedSample = this.hoveredSample;
        }
        this.#draw()
      } else {
        this.selectedSample = null;
      }
      if (this.onClick) this.onClick(this.selectedSample);
      this.#draw();
    };
  }

  #updateDataBounds(offset, scale = 1) {
    const { dataBounds, defaultDataBounds: def } = this;
    dataBounds.left = def.left + offset[0];
    dataBounds.right = def.right + offset[0];
    dataBounds.top = def.top + offset[1];
    dataBounds.bottom = def.bottom + offset[1];

    const center = [
      (dataBounds.left + dataBounds.right) / 2,
      (dataBounds.top + dataBounds.bottom) / 2,
    ];

    dataBounds.left = math.lerp(center[0], dataBounds.left, scale ** 2);
    dataBounds.right = math.lerp(center[0], dataBounds.right, scale ** 2);
    dataBounds.top = math.lerp(center[1], dataBounds.top, scale ** 2);
    dataBounds.bottom = math.lerp(center[1], dataBounds.bottom, scale ** 2);
  }

  #getMouse(e, dataSpace = false) {
    const rect = this.canvas.getBoundingClientRect();
    const pixelLoc = [e.clientX - rect.left, e.clientY - rect.top];
    if (dataSpace) {
      const dataLoc = math.remapPoint(this.pixelBounds, this.defaultDataBounds, pixelLoc);
      return dataLoc;
    }
    return pixelLoc;
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
    this.#drawSamples(this.samples);
    ctx.globalAlpha = 1;

    if (this.hoveredSample) {
      this.#emphasizeSample(this.hoveredSample);
    }

    if (this.selectedSample) {
      this.#emphasizeSample(this.selectedSample, "yellow");
    }
    this.#drawAxes();
  }

  selectSample(sample) {
    this.selectedSample = sample;
    this.#draw();
  }

  #emphasizeSample(sample, color = "white") {
    const pLoc = math.remapPoint(this.dataBounds, this.pixelBounds, sample.point);
    const grd = this.ctx.createRadialGradient(...pLoc, 0, ...pLoc, this.margin);
    grd.addColorStop(0, color);
    grd.addColorStop(1, "transparent");
    graphics.drawPiont(this.ctx, pLoc, grd, this.margin);
    this.#drawSamples([sample]);
  }

  #drawAxes() {
    const { ctx, canvas, axesLabels, margin } = this;
    const { left, right, top, bottom } = this.pixelBounds;

    ctx.clearRect(0, 0, canvas.width, margin);
    ctx.clearRect(0, 0, margin, canvas.height);
    ctx.clearRect(0, canvas.height - margin, canvas.width, margin);
    ctx.clearRect(canvas.width - margin, 0, margin, canvas.height);

    graphics.drawText(ctx, {
      text: axesLabels[0],
      loc: [canvas.width / 2, bottom + margin / 2],
      size: margin * 0.6,
    });

    ctx.save();
    ctx.translate(left - margin / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    graphics.drawText(ctx, {
      text: axesLabels[1],
      loc: [0, 0],
      size: margin * 0.6,
    });
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.setLineDash([]);

    const dataMin = math.remapPoint(this.pixelBounds, this.dataBounds, [left, bottom]);

    graphics.drawText(ctx, {
      text: math.formatNumber(dataMin[0], 2),
      loc: [left, bottom + margin / 3],
      size: margin * 0.3,
      align: "left",
      vlAlign: "top",
    });

    ctx.save();
    ctx.translate(left, bottom);
    ctx.rotate(-Math.PI / 2);
    graphics.drawText(ctx, {
      text: math.formatNumber(dataMin[1], 2),
      loc: [0, 0 - margin / 5],
      size: margin * 0.3,
      align: "left",
      vlAlign: "bottom",
    });
    ctx.restore();

    const dataMax = math.remapPoint(this.pixelBounds, this.dataBounds, [right, top]);

    graphics.drawText(ctx, {
      text: math.formatNumber(dataMax[0], 2),
      loc: [right, bottom + margin / 3],
      size: margin * 0.3,
      align: "right",
      vlAlign: "top",
    });

    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(-Math.PI / 2);
    graphics.drawText(ctx, {
      text: math.formatNumber(dataMax[1], 2),
      loc: [0, 0 - margin / 5],
      size: margin * 0.3,
      align: "right",
      vlAlign: "bottom",
    });
    ctx.restore();
  }

  #drawSamples(samples) {
    const { ctx, pixelBounds, dataBounds } = this;
    for (const sample of samples) {
      const { point, label } = sample;
      const pixelLoc = math.remapPoint(dataBounds, pixelBounds, point);
      switch (this.icon) {
        case "text":
          graphics.drawText(ctx, {
            text: this.styles[label].text,
            loc: pixelLoc,
            size: 16,
          });
          break;
        case "image":
          graphics.drawImage(ctx, this.styles[label].image, pixelLoc);
          break;
        default:
          graphics.drawPiont(ctx, pixelLoc, this.styles[sample.label].color);
          break;
      }
    }
  }
}
