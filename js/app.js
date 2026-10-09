(() => {
  const templates = window.POSTER_TEMPLATES;
  const grid = document.getElementById("occasionGrid");
  const form = document.getElementById("posterForm");
  const fieldsContainer = document.getElementById("dynamicFields");
  const canvas = document.getElementById("posterCanvas");
  const status = document.getElementById("statusMessage");
  const resetButton = document.getElementById("resetButton");
  let currentCategory = "birthday";

  function getTemplate() { return templates[currentCategory]; }

  function readValues() {
    const values = {};
    getTemplate().fields.forEach((field) => {
      const input = form.elements.namedItem(field.name);
      values[field.name] = input ? input.value.trim() : "";
    });
    return values;
  }

  function renderPreview() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => PosterGenerator.render(canvas, getTemplate(), readValues()));
    } else {
      PosterGenerator.render(canvas, getTemplate(), readValues());
    }
  }

  function buildFields() {
    fieldsContainer.innerHTML = "";
    const template = getTemplate();
    template.fields.forEach((field) => {
      const row = document.createElement("div");
      row.className = "field-row";
      const label = document.createElement("label");
      label.htmlFor = `field-${field.name}`;
      label.textContent = field.label + (field.required ? " *" : "");
      const input = document.createElement("input");
      input.id = `field-${field.name}`;
      input.name = field.name;
      input.type = "text";
      input.placeholder = field.placeholder || "";
      input.maxLength = field.maxLength || 60;
      input.required = Boolean(field.required);
      input.autocomplete = "off";
      input.value = template.defaults[field.name] || "";
      input.addEventListener("input", () => {
        status.textContent = "";
        renderPreview();
      });
      row.append(label, input);
      if (!field.required) {
        const hint = document.createElement("span");
        hint.className = "field-hint";
        hint.textContent = "You can leave this blank.";
        row.appendChild(hint);
      }
      fieldsContainer.appendChild(row);
    });
    renderPreview();
  }

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    currentCategory = button.dataset.category;
    grid.querySelectorAll(".occasion-card").forEach((card) => {
      const active = card === button;
      card.classList.toggle("active", active);
      card.setAttribute("aria-pressed", String(active));
    });
    status.textContent = "";
    buildFields();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = readValues();
    const missing = getTemplate().fields.find((field) => field.required && !values[field.name]);
    if (missing) {
      status.textContent = `Please enter ${missing.label.toLowerCase()}.`;
      return;
    }
    PosterGenerator.render(canvas, getTemplate(), values);
    const safeName = (values.name || [values.husbandName, values.wifeName].filter(Boolean).join("-") || "personalized")
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
    try {
      PosterGenerator.download(canvas, `${getTemplate().fileName}-${safeName || "poster"}`);
      status.style.color = "#39714b";
      status.textContent = "Your poster download has started.";
    } catch (error) {
      status.style.color = "#a63c3c";
      status.textContent = error.message || "Unable to download the poster.";
    }
  });

  resetButton.addEventListener("click", () => {
    buildFields();
    status.style.color = "";
    status.textContent = "";
  });

  buildFields();
})();
