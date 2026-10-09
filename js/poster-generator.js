/* Canvas-based poster rendering and PNG export. No server required. */
(() => {
  const W = 1080;
  const H = 1350;

  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  }

  function drawBackground(ctx, colors) {
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // Soft decorative corner shapes.
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = "#ffffff";
    [[-50, 60, 240], [950, 110, 210], [30, 1160, 260], [1000, 1200, 240]].forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    ctx.strokeStyle = "rgba(255,255,255,.85)";
    ctx.lineWidth = 4;
    ctx.strokeRect(34, 34, W - 68, H - 68);
    ctx.strokeStyle = "rgba(30,45,70,.12)";
    ctx.lineWidth = 2;
    ctx.strokeRect(49, 49, W - 98, H - 98);
  }

  function drawSparkle(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size * .16, -size * .16, size, 0);
    ctx.quadraticCurveTo(size * .16, size * .16, 0, size);
    ctx.quadraticCurveTo(-size * .16, size * .16, -size, 0);
    ctx.quadraticCurveTo(-size * .16, -size * .16, 0, -size);
    ctx.fill();
    ctx.restore();
  }

  function drawOrnament(ctx, accent) {
    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(330, 190); ctx.bezierCurveTo(420, 125, 430, 235, 360, 230);
    ctx.bezierCurveTo(300, 220, 340, 155, 380, 185);
    ctx.moveTo(750, 190); ctx.bezierCurveTo(660, 125, 650, 235, 720, 230);
    ctx.bezierCurveTo(780, 220, 740, 155, 700, 185);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function fitText(ctx, text, maxWidth, startSize, family, weight = "600") {
    let size = startSize;
    do {
      ctx.font = `${weight} ${size}px ${family}`;
      if (ctx.measureText(text).width <= maxWidth || size <= 32) break;
      size -= 4;
    } while (size > 28);
    return size;
  }

  function drawCommon(ctx, title, subtitle, values, config) {
    const accent = config.accent;
    drawBackground(ctx, config.background);
    drawOrnament(ctx, accent);
    drawSparkle(ctx, 150, 160, 17, accent);
    drawSparkle(ctx, 925, 270, 13, accent);
    drawSparkle(ctx, 170, 990, 11, accent);
    drawSparkle(ctx, 900, 1050, 17, accent);

    ctx.textAlign = "center";
    ctx.fillStyle = accent;
    ctx.font = "700 24px 'DM Sans', Arial, sans-serif";
    ctx.letterSpacing = "7px";
    ctx.fillText("A SPECIAL CELEBRATION", W / 2, 305);
    ctx.letterSpacing = "0px";

    ctx.font = "600 90px 'Playfair Display', Georgia, serif";
    ctx.fillText(title, W / 2, 415);

    ctx.strokeStyle = accent;
    ctx.globalAlpha = .6;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(210, 465); ctx.lineTo(870, 465);
    ctx.stroke();
    ctx.globalAlpha = 1;
    drawSparkle(ctx, W / 2, 465, 12, accent);

    ctx.fillStyle = "#47566d";
    ctx.font = "400 31px 'DM Sans', Arial, sans-serif";
    ctx.fillText(subtitle, W / 2, 535);

    values(ctx, config);

    ctx.fillStyle = accent;
    ctx.globalAlpha = .9;
    ctx.font = "500 23px 'DM Sans', Arial, sans-serif";
    ctx.fillText("WISHING YOU JOY, LOVE & SUCCESS", W / 2, 1130);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = accent;
    ctx.globalAlpha = .4;
    ctx.beginPath();
    ctx.moveTo(300, 1170); ctx.lineTo(780, 1170);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#69758a";
    ctx.font = "400 20px 'DM Sans', Arial, sans-serif";
    ctx.fillText("Made with warm wishes", W / 2, 1215);
  }

  function render(canvas, template, data) {
    const ctx = canvas.getContext("2d");
    const config = template.render;
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    const drawName = (name, y, maxWidth = 820, size = 72) => {
      const safeName = (name || "").trim() || "Your Name";
      const fitted = fitText(ctx, safeName, maxWidth, size, "'Playfair Display', Georgia, serif", "600");
      ctx.font = `600 ${fitted}px 'Playfair Display', Georgia, serif`;
      ctx.fillStyle = config.nameColor;
      ctx.fillText(safeName, W / 2, y, maxWidth);
    };

    switch (config.kind) {
      case "birthday":
        drawCommon(ctx, "Happy Birthday", "Today is all about celebrating you", (c) => {
          drawName(data.name, 720, 850, 88);
          c.fillStyle = config.accent;
          c.font = "400 31px 'DM Sans', Arial, sans-serif";
          c.fillText("May your year be filled with happiness", W / 2, 815);
          c.fillText("and wonderful new memories.", W / 2, 860);
        }, config);
        break;
      case "anniversary":
        drawCommon(ctx, "Happy Anniversary", "Celebrating a beautiful journey together", (c) => {
          drawName(data.husbandName, 690, 820, 74);
          c.fillStyle = config.accent;
          c.font = "500 48px 'Playfair Display', Georgia, serif";
          c.fillText("&", W / 2, 760);
          drawName(data.wifeName, 835, 820, 74);
          c.font = "400 27px 'DM Sans', Arial, sans-serif";
          c.fillText("May your love grow stronger every day", W / 2, 900);
        }, config);
        break;
      case "vehicle":
        drawCommon(ctx, "Congratulations!", "A new ride, a new adventure", (c) => {
          // Simple illustrated car icon, drawn in Canvas.
          c.save();
          c.translate(W / 2, 675);
          c.fillStyle = config.accent;
          roundedRect(c, -145, -15, 290, 75, 22); c.fill();
          c.beginPath(); c.moveTo(-90, -15); c.lineTo(-45, -75); c.lineTo(55, -75); c.lineTo(105, -15); c.closePath(); c.fill();
          c.fillStyle = "#dbe8f7";
          c.beginPath(); c.moveTo(-38, -63); c.lineTo(48, -63); c.lineTo(85, -20); c.lineTo(-68, -20); c.closePath(); c.fill();
          c.fillStyle = "#273449";
          [[-90, 53], [90, 53]].forEach(([x,y]) => { c.beginPath(); c.arc(x,y,27,0,Math.PI*2); c.fill(); });
          c.fillStyle = "#ffffff";
          [[-90,53],[90,53]].forEach(([x,y]) => { c.beginPath(); c.arc(x,y,12,0,Math.PI*2); c.fill(); });
          c.restore();
          drawName(data.name, 835, 820, 75);
          if (data.vehicleName) {
            c.fillStyle = config.accent;
            c.font = "600 31px 'DM Sans', Arial, sans-serif";
            c.fillText(data.vehicleName, W / 2, 900, 820);
          }
          c.fillStyle = "#47566d";
          c.font = "400 27px 'DM Sans', Arial, sans-serif";
          c.fillText("Wishing you safe and happy journeys!", W / 2, 960);
        }, config);
        break;
      case "newHome":
        drawCommon(ctx, "New Home, New Joy", "Here's to wonderful memories in your new place", (c) => {
          c.save();
          c.translate(W / 2, 680);
          c.fillStyle = config.accent;
          c.beginPath(); c.moveTo(-150,-30); c.lineTo(0,-155); c.lineTo(150,-30); c.closePath(); c.fill();
          c.fillRect(-118,-30,236,150);
          c.fillStyle = "#fffaf0"; c.fillRect(-28,45,56,75);
          c.fillRect(-88,0,45,43); c.fillRect(43,0,45,43);
          c.restore();
          drawName(data.name, 900, 830, 76);
        }, config);
        break;
      case "graduation":
        drawCommon(ctx, "Congratulations!", "Your hard work has opened a new chapter", (c) => {
          c.save();
          c.translate(W / 2, 675);
          c.fillStyle = config.accent;
          c.beginPath(); c.moveTo(-135,-45); c.lineTo(0,-105); c.lineTo(135,-45); c.lineTo(0,15); c.closePath(); c.fill();
          c.fillRect(-82,-40,164,18);
          c.strokeStyle = config.accent; c.lineWidth = 8;
          c.beginPath(); c.moveTo(90,-40); c.lineTo(105,40); c.stroke();
          c.beginPath(); c.arc(105,48,14,0,Math.PI*2); c.fill();
          c.restore();
          drawName(data.name, 850, 830, 80);
          c.fillStyle = config.accent;
          c.font = "500 29px 'DM Sans', Arial, sans-serif";
          c.fillText("Dream big. The future is yours.", W / 2, 915);
        }, config);
        break;
      default:
        drawCommon(ctx, "Congratulations!", "A special moment worth celebrating", (c) => drawName(data.name, 760), config);
    }
  }

  function download(canvas, filename) {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("The poster could not be exported. Please try again.");
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${filename}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  window.PosterGenerator = { render, download };
})();
