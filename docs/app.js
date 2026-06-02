const config = window.ZONA_BARBERS_CONFIG || {};
const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey);
const db = hasSupabase ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey) : null;

const demoData = {
  clientes: [
    { socio: 1001, nombre: "Carlos Silva", cedula: "45678912", fecha_registro: "2026-05-20" },
    { socio: 1002, nombre: "Mateo Rodriguez", cedula: "32165498", fecha_registro: "2026-05-22" },
    { socio: 1003, nombre: "Nicolas Pereira", cedula: "51234876", fecha_registro: "2026-05-25" }
  ],
  cortes: [
    { id: 1, socio: 1001, fecha: "2026-05-10", servicio: "Corte clasico", barbero: "Alex", notas: "Laterales prolijos" },
    { id: 2, socio: 1001, fecha: "2026-04-26", servicio: "Fade", barbero: "Alex", notas: "Degradado bajo" },
    { id: 3, socio: 1001, fecha: "2026-04-12", servicio: "Corte + barba", barbero: "Jose", notas: "Barba perfilada" }
  ],
  reservas: [
    { id: 1, socio: 1001, fecha: "2026-06-06", hora: "16:00", servicio: "Corte clasico", estado: "Pendiente" },
    { id: 2, socio: 1001, fecha: "2026-06-14", hora: "17:30", servicio: "Corte + barba", estado: "Pendiente" }
  ]
};

let currentClient = null;
let currentScreen = "loginScreen";

const screens = [...document.querySelectorAll(".screen")];
const alerts = document.querySelector("#alerts");
const pageTitle = document.querySelector("#pageTitle");
const backButton = document.querySelector("#backButton");
const logoutButton = document.querySelector("#logoutButton");
const navButtons = [...document.querySelectorAll(".bottom-nav [data-screen]")];

function showAlert(message, type = "info") {
  alerts.innerHTML = `<div class="alert ${type}">${message}</div>`;
  window.setTimeout(() => {
    alerts.innerHTML = "";
  }, 3600);
}

function setScreen(screenId) {
  if (!currentClient && !["loginScreen", "registerScreen"].includes(screenId)) {
    screenId = "loginScreen";
  }

  currentScreen = screenId;
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === screenId));
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.screen === screenId));

  const titles = {
    loginScreen: "Zona Barbers",
    registerScreen: "Registro",
    homeScreen: "Inicio",
    historyScreen: "Historial",
    reserveScreen: "Reservar",
    serviceScreen: "Servicio"
  };

  pageTitle.textContent = titles[screenId] || "Zona Barbers";
  backButton.style.visibility = ["loginScreen", "homeScreen"].includes(screenId) ? "hidden" : "visible";
  logoutButton.style.visibility = currentClient ? "visible" : "hidden";

  if (currentClient) {
    renderClient();
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function sortByDateDesc(rows) {
  return [...rows].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
}

async function selectRows(table, filters = {}) {
  if (!db) {
    let rows = demoData[table] || [];
    Object.entries(filters).forEach(([key, value]) => {
      rows = rows.filter((row) => String(row[key]) === String(value));
    });
    return rows;
  }

  let query = db.from(table).select("*");
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function insertRow(table, row) {
  if (!db) {
    const rows = demoData[table];
    const nextId = Math.max(0, ...rows.map((item) => Number(item.id || item.socio || 0))) + 1;
    const newRow = { id: nextId, ...row };
    rows.push(newRow);
    return newRow;
  }

  const { data, error } = await db.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
}

async function nextSocio() {
  const clients = await selectRows("clientes");
  return Math.max(1000, ...clients.map((client) => Number(client.socio) || 0)) + 1;
}

async function renderClient() {
  document.querySelector("#helloName").textContent = `Hola, ${currentClient.nombre}`;
  document.querySelector("#memberNumber").textContent = `Socio #${currentClient.socio}`;
  document.querySelector("#memberCedula").textContent = `Cedula ${currentClient.cedula}`;

  const [cortes, reservas] = await Promise.all([
    selectRows("cortes", { socio: currentClient.socio }),
    selectRows("reservas", { socio: currentClient.socio })
  ]);

  renderLastService(cortes);
  renderHistory(cortes);
  renderReservations(reservas);
}

function renderLastService(cortes) {
  const container = document.querySelector("#lastService");
  const latest = sortByDateDesc(cortes)[0];

  if (!latest) {
    container.innerHTML = `<p class="empty">Todavia no hay cortes en el historial.</p>`;
    return;
  }

  container.innerHTML = `
    <article class="service-card">
      <div class="service-row"><span class="mini-icon calendar"></span>${latest.fecha}</div>
      <div class="service-row"><span class="mini-icon scissors"></span>${latest.servicio}</div>
      <div class="service-row"><span class="avatar"></span>Barbero: ${latest.barbero || "Sin asignar"}</div>
      <button class="button" data-screen="historyScreen">Ver detalles</button>
    </article>
  `;
}

function renderHistory(cortes) {
  const container = document.querySelector("#historyList");
  const rows = sortByDateDesc(cortes);

  if (!rows.length) {
    container.innerHTML = `<p class="empty">Todavia no hay cortes en el historial.</p>`;
    return;
  }

  container.innerHTML = rows.map((corte) => `
    <article class="service-card history-card">
      <div>
        <div class="service-row"><span class="mini-icon calendar"></span>${corte.fecha}</div>
        <div class="service-row"><span class="avatar"></span>Barbero: ${corte.barbero || "Sin asignar"}</div>
        <p>${corte.servicio}${corte.notas ? ` - ${corte.notas}` : ""}</p>
      </div>
      <span>›</span>
    </article>
  `).join("");
}

function renderReservations(reservas) {
  const container = document.querySelector("#reservationList");
  const rows = [...reservas].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));

  if (!rows.length) {
    container.innerHTML = `<p class="empty">No hay reservas cargadas.</p>`;
    return;
  }

  container.innerHTML = rows.map((reserva) => `
    <article class="service-card reservation-card">
      <div>
        <div class="service-row"><span class="mini-icon calendar"></span>${reserva.fecha}</div>
        <div class="service-row"><span class="mini-icon clock"></span>${reserva.hora}</div>
        <div class="service-row"><span class="mini-icon scissors"></span>${reserva.servicio}</div>
      </div>
      <span class="status">${reserva.estado || "Pendiente"}</span>
    </article>
  `).join("");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-screen]");
  if (target) {
    setScreen(target.dataset.screen);
  }
});

backButton.addEventListener("click", () => {
  setScreen(currentClient ? "homeScreen" : "loginScreen");
});

logoutButton.addEventListener("click", () => {
  currentClient = null;
  setScreen("loginScreen");
  showAlert("Sesion cerrada.");
});

document.querySelector("#profileButton").addEventListener("click", () => {
  if (currentClient) {
    showAlert(`Socio #${currentClient.socio} - ${currentClient.nombre}`);
  } else {
    setScreen("loginScreen");
  }
});

document.querySelector("#registerCedula").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, "").slice(0, 8);
});

document.querySelector("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const socio = document.querySelector("#loginSocio").value.trim();
  const clients = await selectRows("clientes", { socio });
  const client = clients[0];

  if (!client) {
    showAlert("No se encontro ese numero de socio.", "danger");
    return;
  }

  currentClient = client;
  setScreen("homeScreen");
});

document.querySelector("#registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const nombre = document.querySelector("#registerName").value.trim();
  const cedula = document.querySelector("#registerCedula").value.trim();

  if (!nombre || !/^[0-9]{1,8}$/.test(cedula)) {
    showAlert("Completa nombre y cedula numerica de hasta 8 caracteres.", "danger");
    return;
  }

  const duplicate = await selectRows("clientes", { cedula });
  if (duplicate.length) {
    showAlert("Ya existe un cliente con esa cedula.", "danger");
    return;
  }

  const socio = await nextSocio();
  currentClient = await insertRow("clientes", {
    socio,
    nombre,
    cedula,
    fecha_registro: today()
  });

  showAlert(`Cliente registrado. Socio #${socio}`);
  setScreen("homeScreen");
});

document.querySelector("#reserveForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await insertRow("reservas", {
    socio: currentClient.socio,
    fecha: document.querySelector("#reserveDate").value,
    hora: document.querySelector("#reserveTime").value,
    servicio: document.querySelector("#reserveService").value,
    estado: "Pendiente"
  });
  showAlert("Reserva confirmada.");
  setScreen("homeScreen");
});

document.querySelector("#serviceForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await insertRow("cortes", {
    socio: currentClient.socio,
    fecha: document.querySelector("#serviceDate").value,
    servicio: document.querySelector("#serviceName").value,
    barbero: document.querySelector("#serviceBarber").value.trim(),
    notas: document.querySelector("#serviceNotes").value.trim()
  });
  showAlert("Servicio guardado.");
  setScreen("historyScreen");
});

document.querySelector("#reserveDate").value = today();
document.querySelector("#serviceDate").value = today();
setScreen("loginScreen");

if (!hasSupabase) {
  showAlert("Modo demo: configura Supabase para guardar datos reales.");
}
