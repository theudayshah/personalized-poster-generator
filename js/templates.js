/*
 * Poster template configuration.
 * Add a category here and create its field definitions to extend the app.
 * Text coordinates use the 1080 x 1350 canvas coordinate system.
 */
window.POSTER_TEMPLATES = {
  birthday: {
    label: "Birthday",
    fileName: "birthday-poster",
    fields: [
      { name: "name", label: "Person's name", placeholder: "e.g. Harsh Shah", required: true, maxLength: 42 }
    ],
    defaults: { name: "Harsh Shah" },
    render: { kind: "birthday", background: ["#fffaf8", "#f8e7e8"], accent: "#17365d", nameColor: "#17365d" }
  },
  anniversary: {
    label: "Anniversary",
    fileName: "anniversary-poster",
    fields: [
      { name: "husbandName", label: "Husband's name", placeholder: "e.g. Rahul Patel", required: true, maxLength: 34 },
      { name: "wifeName", label: "Wife's name", placeholder: "e.g. Priya Patel", required: true, maxLength: 34 }
    ],
    defaults: { husbandName: "Rahul Patel", wifeName: "Priya Patel" },
    render: { kind: "anniversary", background: ["#fff8f1", "#f3e4e9"], accent: "#803b60", nameColor: "#703452" }
  },
  vehicle: {
    label: "New Vehicle",
    fileName: "new-vehicle-poster",
    fields: [
      { name: "name", label: "Owner's name", placeholder: "e.g. Harsh Shah", required: true, maxLength: 38 },
      { name: "vehicleName", label: "Vehicle name (optional)", placeholder: "e.g. Hyundai Creta", required: false, maxLength: 38 }
    ],
    defaults: { name: "Harsh Shah", vehicleName: "Hyundai Creta" },
    render: { kind: "vehicle", background: ["#f4f8ff", "#dbe8f7"], accent: "#183e70", nameColor: "#17365d" }
  },
  newHome: {
    label: "New Home",
    fileName: "new-home-poster",
    fields: [
      { name: "name", label: "Person or family name", placeholder: "e.g. The Shah Family", required: true, maxLength: 42 }
    ],
    defaults: { name: "The Shah Family" },
    render: { kind: "newHome", background: ["#fffaf0", "#e8f0e2"], accent: "#43694b", nameColor: "#31523a" }
  },
  graduation: {
    label: "Graduation",
    fileName: "graduation-poster",
    fields: [
      { name: "name", label: "Graduate's name", placeholder: "e.g. Harsh Shah", required: true, maxLength: 42 }
    ],
    defaults: { name: "Harsh Shah" },
    render: { kind: "graduation", background: ["#f7f6ff", "#e5e7fa"], accent: "#413b7a", nameColor: "#302b69" }
  }
};
