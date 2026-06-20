// ---- Configuración inicial ----
const TUCUMAN_COORDS = [-26.8083, -65.2176];
const ZOOM_INICIAL = 14;

const map = L.map('map').setView(TUCUMAN_COORDS, ZOOM_INICIAL);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// ---- Estilos de marcadores por tipo de reporte ----
const ESTILOS = {
  basurero: { color: '#2d6a35', fill: '#4caf50', label: 'Basurero / contenedor', emoji: '🗑️' },
  bajo:     { color: '#9e9d24', fill: '#cddc39', label: 'Nivel bajo',  emoji: '🟡' },
  medio:    { color: '#f57f17', fill: '#f9a825', label: 'Nivel medio', emoji: '🟠' },
  alto:     { color: '#b71c1c', fill: '#d32f2f', label: 'Nivel alto',  emoji: '🔴' },
};

function crearIcono(nivel) {
  const estilo = ESTILOS[nivel];
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
              background:${estilo.fill};
              border:2px solid ${estilo.color};
              width:24px; height:24px;
              border-radius:50%;
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 1px 4px rgba(0,0,0,0.35);
              font-size:12px;
            ">${estilo.emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10]
  });
}

// ---- Estado de la app ----
let modoAgregar = false;
let marcadores = [];

const btnAgregar       = document.getElementById('btn-agregar');
const btnCancelar      = document.getElementById('btn-cancelar');
const hintText         = document.getElementById('hint-text');
const statusMsg        = document.getElementById('status-msg');
const descripcionInput = document.getElementById('descripcion');

// ---- Activar / desactivar modo de selección ----
btnAgregar.addEventListener('click', () => {
  modoAgregar = true;
  btnAgregar.disabled = true;
  btnCancelar.style.display = 'block';
  hintText.textContent = '👉 Tocá el mapa en el lugar exacto donde querés agregar el punto.';
  statusMsg.textContent = '';
  map.getContainer().style.cursor = 'crosshair';
});

btnCancelar.addEventListener('click', () => {
  salirModoAgregar();
  statusMsg.textContent = '';
});

function salirModoAgregar() {
  modoAgregar = false;
  btnAgregar.disabled = false;
  btnCancelar.style.display = 'none';
  hintText.textContent = 'Elegí el tipo de reporte, completá una descripción si querés y presioná "Agregar punto". Luego tocá el lugar en el mapa.';
  map.getContainer().style.cursor = '';
}

// ---- Click en el mapa ----
map.on('click', (e) => {
  if (!modoAgregar) return;

  const nivelSeleccionado = document.querySelector('input[name="nivel"]:checked').value;
  const descripcion = descripcionInput.value.trim();
  const estilo = ESTILOS[nivelSeleccionado];

  const marker = L.marker(e.latlng, { icon: crearIcono(nivelSeleccionado) }).addTo(map);

  const fecha = new Date().toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const popupHtml = `
    <div style="min-width:170px;">
      <b>${estilo.emoji} ${estilo.label}</b>
      <div class="popup-nivel ${nivelSeleccionado}">${estilo.label}</div>
      ${descripcion ? `<p style="margin:0.5rem 0 0;">${escapeHtml(descripcion)}</p>` : ''}
      <p style="margin:0.4rem 0 0; font-size:0.72rem; color:#777;">Reportado: ${fecha}</p>
      <button class="btn-eliminar">🗑 Eliminar</button>
    </div>
  `;

  marker.bindPopup(popupHtml).openPopup();

  marker.on('popupopen', () => {
    const popupEl = marker.getPopup().getElement();
    const delBtn = popupEl.querySelector('.btn-eliminar');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        map.removeLayer(marker);
        marcadores = marcadores.filter(m => m !== marker);
        statusMsg.textContent = 'Punto eliminado.';
      });
    }
  });

  marcadores.push(marker);

  statusMsg.textContent = `✅ Punto agregado: ${estilo.label}`;
  descripcionInput.value = '';
  salirModoAgregar();
});

// ---- Utilidad ----
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
