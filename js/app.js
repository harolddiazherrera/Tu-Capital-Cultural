/* Lógica del cuestionario por etapas: perfiles, formulario, cálculo y gráficos. */
(function () {
  "use strict";

  const Q = window.QUESTIONNAIRE;
  const S = window.Storage_;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const DIM = Object.fromEntries(Q.dimensiones.map((d) => [d.id, d]));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ───────────── Estado ───────────── */
  const state = {
    pantalla: "inicio",   // inicio | etapa | resultados | perfiles
    etapaIdx: 0,          // índice dentro de etapasActivas()
    perfil: null          // { id, nombre, edad, respuestas, creado, actualizado }
  };

  /* ───────────── Utilidades de etapas ───────────── */
  function etapasActivas(perfil = state.perfil) {
    if (!perfil || perfil.edad === null || perfil.edad === undefined) return [];
    const hasta = Q.edad.opciones[perfil.edad].etapaHasta;
    return Q.etapas.slice(0, Q.etapas.findIndex((e) => e.id === hasta) + 1);
  }
  function respondida(p, respuestas) {
    const r = respuestas[p.id];
    return p.multiple ? Array.isArray(r) : Number.isInteger(r);
  }
  function etapaCompleta(etapa, respuestas) {
    return etapa.preguntas.every((p) => respondida(p, respuestas));
  }
  function etapasCompletas(perfil = state.perfil) {
    return etapasActivas(perfil).filter((e) => etapaCompleta(e, perfil.respuestas));
  }
  function primeraIncompleta(perfil = state.perfil) {
    return etapasActivas(perfil).findIndex((e) => !etapaCompleta(e, perfil.respuestas));
  }
  function guardar() {
    if (state.perfil && state.perfil.nombre) state.perfil = S.guardar(state.perfil);
  }
  function fmtFecha(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
  }

  /* ───────────── Render ───────────── */
  const app = $("#app");

  function render() {
    ({ inicio: renderInicio, etapa: renderEtapa, resultados: renderResultados, perfiles: renderPerfiles })[state.pantalla]();
    actualizarProgreso();
    window.scrollTo({ top: 0 });
  }

  function renderInicio() {
    const p = state.perfil;
    const nombre = p ? p.nombre : "";
    const edad = p ? p.edad : null;
    const guardados = S.listar();
    const existente = nombre && S.obtener(nombre);

    const opcionesEdad = Q.edad.opciones
      .map((o, j) => `
        <label class="opcion">
          <input type="radio" name="edad" value="${j}" ${edad === j ? "checked" : ""}>
          <span>${o.texto}</span>
        </label>`)
      .join("");

    let avisoPerfil = "";
    if (existente) {
      const completas = etapasCompletas(existente).length;
      const total = etapasActivas(existente).length;
      const pendiente = primeraIncompleta(existente);
      avisoPerfil = `
        <div class="perfil-existente">
          <p><strong>Perfil encontrado:</strong> ${esc(existente.nombre)} · ${completas} de ${total} etapas completas · última actualización ${fmtFecha(existente.actualizado)}.</p>
          <p class="ayuda">${
            pendiente === -1
              ? "Todas las etapas de tu rango de edad están respondidas. Si cambiaste de rango de edad, selecciónalo para evaluar las etapas nuevas; también puedes revisar tus respuestas anteriores."
              : "Puedes continuar donde quedaste. Si cambias el rango de edad se agregarán o quitarán etapas sin perder lo ya respondido."
          }</p>
        </div>`;
    }

    app.innerHTML = `
      <section class="card intro">
        <h2>Antes de comenzar</h2>
        <p>Este cuestionario reconstruye tu trayectoria en dos dimensiones del espacio social descritas por Pierre Bourdieu:</p>
        <ul class="dims">
          ${Q.dimensiones.map((d) => `<li><span class="dot" style="background:${d.color}"></span><strong>${d.nombre}:</strong> ${d.descripcion}</li>`).join("")}
        </ul>
        <p>Se evalúa cada etapa de vida que ya has vivido, con 8 preguntas por etapa:</p>
        <ol class="etapas-lista">${Q.etapas.map((e) => `<li><strong>${e.nombre}</strong> <span class="rango">(${e.rango})</span></li>`).join("")}</ol>
        <p>Tu avance se guarda automáticamente en este navegador. Puedes cerrar la página y retomar después escribiendo el mismo nombre.</p>
        <p class="aviso">${Q.meta.nota}</p>

        <fieldset class="pregunta" id="fs-nombre">
          <legend>¿Cómo te llamas?</legend>
          <p class="ayuda">Nombre o alias con el que se guardará tu perfil. Si ya respondiste antes, escribe el mismo nombre para retomar.</p>
          <input type="text" id="input-nombre" class="texto" list="lista-perfiles" placeholder="Ej.: Harold" value="${esc(nombre)}" autocomplete="off" maxlength="60">
          <datalist id="lista-perfiles">${guardados.map((g) => `<option value="${esc(g.nombre)}">`).join("")}</datalist>
          <p class="error" hidden>Escribe un nombre para continuar.</p>
        </fieldset>
        ${avisoPerfil}

        <fieldset class="pregunta" id="fs-edad">
          <legend>${Q.edad.texto}</legend>
          <p class="ayuda">Define hasta qué etapa se evalúa.</p>
          <div class="opciones">${opcionesEdad}</div>
          <p class="error" hidden>Selecciona tu rango de edad para continuar.</p>
        </fieldset>

        <div class="acciones">
          ${guardados.length ? `<button class="btn" data-accion="perfiles">Ver perfiles guardados (${guardados.length})</button>` : ""}
          ${existente && etapasCompletas(existente).length ? `<button class="btn" data-accion="resultados-inicio">Ver resultados</button>` : ""}
          <button class="btn primario" data-accion="comenzar">${existente ? "Continuar evaluación" : "Comenzar"}</button>
        </div>
      </section>`;

    $("#input-nombre").addEventListener("input", (ev) => {
      // Al escribir el nombre de un perfil existente, precargar su edad y actualizar avisos.
      const ex = S.obtener(ev.target.value);
      const idActual = state.perfil && state.perfil.id;
      if (ex && ex.id !== idActual) {
        state.perfil = ex;
        render();
        $("#input-nombre").focus();
        const inp = $("#input-nombre"); inp.setSelectionRange(inp.value.length, inp.value.length);
      } else if (!ex && state.perfil && state.perfil.id && S.normalizar(ev.target.value) !== state.perfil.id) {
        state.perfil = { nombre: ev.target.value, edad: null, respuestas: {} };
        render();
        $("#input-nombre").focus();
        const inp = $("#input-nombre"); inp.setSelectionRange(inp.value.length, inp.value.length);
      }
    });
  }

  function renderEtapa() {
    const etapas = etapasActivas();
    const etapa = etapas[state.etapaIdx];
    const n = state.etapaIdx + 1, total = etapas.length;
    const R = state.perfil.respuestas;

    let contador = 0;
    const bloques = Q.dimensiones
      .map((dim) => {
        const html = etapa.preguntas
          .filter((p) => p.dimension === dim.id)
          .map((p) => {
            contador++;
            const tipo = p.multiple ? "checkbox" : "radio";
            const resp = R[p.id];
            const opciones = p.opciones
              .map((o, j) => {
                const checked = p.multiple ? Array.isArray(resp) && resp.includes(j) : resp === j;
                return `<label class="opcion"><input type="${tipo}" name="${p.id}" value="${j}" ${checked ? "checked" : ""}><span>${o.texto}</span></label>`;
              })
              .join("");
            return `
              <fieldset class="pregunta" id="fs-${p.id}">
                <legend><span class="num">${contador}</span> ${p.texto}</legend>
                ${p.ayuda ? `<p class="ayuda">${p.ayuda}</p>` : ""}
                ${p.multiple ? `<p class="ayuda">Puedes marcar varias opciones o ninguna.</p>` : ""}
                <div class="opciones">${opciones}</div>
                <p class="error" hidden>Selecciona una opción para continuar.</p>
              </fieldset>`;
          })
          .join("");
        return `<div class="bloque-dim" style="--color:${dim.color}">
          <h3 class="bloque-titulo"><span class="dot" style="background:${dim.color}"></span>${dim.nombre}</h3>${html}</div>`;
      })
      .join("");

    app.innerHTML = `
      <section class="card">
        <header class="seccion-head">
          <p class="eyebrow">${esc(state.perfil.nombre)} · Etapa ${n} de ${total}</p>
          <h2>${etapa.nombre} <span class="rango">· ${etapa.rango}</span></h2>
          <p>${etapa.descripcion}</p>
        </header>
        <form id="form-seccion" novalidate>${bloques}</form>
        <p class="ayuda guardado" id="estado-guardado">Avance guardado automáticamente.</p>
        <div class="acciones">
          <button class="btn" data-accion="inicio">Inicio</button>
          <button class="btn" data-accion="anterior" ${n === 1 ? "disabled" : ""}>Anterior</button>
          <button class="btn primario" data-accion="siguiente">${n === total ? "Ver resultados" : "Siguiente etapa"}</button>
        </div>
      </section>`;
  }

  function renderPerfiles() {
    const lista = S.listar();
    const filas = lista
      .map((p) => {
        const total = etapasActivas(p).length;
        const completas = etapasCompletas(p).length;
        const estado = completas === total ? "Completo" : `${completas} / ${total} etapas`;
        const ultimo = completas ? calcular(p)[completas - 1] : null;
        return `
          <tr>
            <td><strong>${esc(p.nombre)}</strong><br><span class="muted">${Q.edad.opciones[p.edad] ? Q.edad.opciones[p.edad].texto : "sin edad"}</span></td>
            <td>${estado}<br><span class="muted">${fmtFecha(p.actualizado)}</span></td>
            <td>${ultimo ? `<span class="chip" style="--c:${DIM.cultural.color}">C ${ultimo.indices.cultural}</span> <span class="chip" style="--c:${DIM.economico.color}">E ${ultimo.indices.economico}</span><br><span class="muted">${ultimo.nombre}</span>` : "<span class='muted'>—</span>"}</td>
            <td class="acciones-fila">
              <button class="btn chico" data-accion="abrir" data-id="${p.id}">${completas === total ? "Revisar" : "Continuar"}</button>
              ${completas ? `<button class="btn chico" data-accion="resultados-de" data-id="${p.id}">Resultados</button>` : ""}
              <button class="btn chico peligro" data-accion="eliminar" data-id="${p.id}">Eliminar</button>
            </td>
          </tr>`;
      })
      .join("");

    app.innerHTML = `
      <section class="card">
        <h2>Perfiles guardados</h2>
        <p class="ayuda">Guardados en este navegador${S.disponible ? "" : " (solo durante esta sesión: el almacenamiento local no está disponible)"}. Para llevarlos a otro equipo usa exportar e importar.</p>
        ${lista.length ? `
          <div class="tabla-scroll">
            <table class="tabla">
              <thead><tr><th>Perfil</th><th>Avance</th><th>Última etapa</th><th></th></tr></thead>
              <tbody>${filas}</tbody>
            </table>
          </div>` : `<p>No hay perfiles guardados todavía.</p>`}
        <div class="acciones">
          <button class="btn" data-accion="importar">Importar JSON</button>
          <button class="btn" data-accion="exportar" ${lista.length ? "" : "disabled"}>Exportar todos (JSON)</button>
          <button class="btn primario" data-accion="inicio">Nuevo perfil / Inicio</button>
        </div>
        <div id="zona-io" hidden>
          <textarea id="io-json" rows="6" placeholder="Pega aquí el JSON exportado"></textarea>
          <div class="acciones">
            <button class="btn" data-accion="copiar-io">Copiar</button>
            <button class="btn" data-accion="confirmar-importar">Importar lo pegado</button>
          </div>
          <p id="io-msg" class="ayuda" hidden></p>
        </div>
      </section>`;
  }

  function actualizarProgreso() {
    const preguntas = etapasActivas().flatMap((e) => e.preguntas);
    const total = preguntas.length;
    const resp = state.perfil ? preguntas.filter((p) => respondida(p, state.perfil.respuestas)).length : 0;
    const visible = state.pantalla === "etapa" || state.pantalla === "resultados";
    $("#progreso").hidden = !visible;
    if (!visible) return;
    $("#progreso-barra").style.width = (total ? Math.round((resp / total) * 100) : 0) + "%";
    $("#progreso-texto").textContent = `${esc(state.perfil.nombre)} · ${resp} / ${total} respondidas`;
  }

  /* ───────────── Captura ───────────── */
  function leerFormulario(preguntas, marcarErrores) {
    const form = $("#form-seccion");
    if (!form) return true;
    let valido = true;
    preguntas.forEach((p) => {
      const inputs = $$(`input[name="${p.id}"]`, form);
      const fs = $(`#fs-${p.id}`);
      if (p.multiple) {
        state.perfil.respuestas[p.id] = inputs.map((inp, j) => (inp.checked ? j : null)).filter((j) => j !== null);
        return;
      }
      const sel = inputs.find((inp) => inp.checked);
      if (sel) {
        state.perfil.respuestas[p.id] = Number(sel.value);
        fs.classList.remove("invalida"); $(".error", fs).hidden = true;
      } else if (marcarErrores) {
        valido = false;
        fs.classList.add("invalida"); $(".error", fs).hidden = false;
      }
    });
    guardar();
    if (!valido) { const f = $(".pregunta.invalida"); if (f) f.scrollIntoView({ behavior: "smooth", block: "center" }); }
    return valido;
  }

  function leerInicio(marcarErrores) {
    const nombre = $("#input-nombre").value.trim();
    const sel = $$('input[name="edad"]').find((i) => i.checked);
    let ok = true;
    const fsN = $("#fs-nombre"), fsE = $("#fs-edad");
    if (!nombre) { ok = false; if (marcarErrores) { fsN.classList.add("invalida"); $(".error", fsN).hidden = false; } }
    else { fsN.classList.remove("invalida"); $(".error", fsN).hidden = true; }
    if (!sel) { ok = false; if (marcarErrores) { fsE.classList.add("invalida"); $(".error", fsE).hidden = false; } }
    else { fsE.classList.remove("invalida"); $(".error", fsE).hidden = true; }
    if (!ok) return false;

    const existente = S.obtener(nombre);
    state.perfil = existente
      ? { ...existente, edad: Number(sel.value) }
      : { nombre, edad: Number(sel.value), respuestas: {} };
    guardar();
    return true;
  }

  /* ───────────── Cálculo ───────────── */
  function puntosPregunta(p, R) {
    const r = R[p.id];
    if (p.multiple) return (r || []).reduce((acc, j) => acc + p.opciones[j].puntos, 0);
    return Number.isInteger(r) ? p.opciones[r].puntos : 0;
  }
  function maxPregunta(p) {
    if (p.multiple) return p.opciones.reduce((a, o) => a + o.puntos, 0);
    return Math.max(...p.opciones.map((o) => o.puntos));
  }

  /** Índices por etapa, solo para las etapas completas del perfil. */
  function calcular(perfil = state.perfil) {
    return etapasCompletas(perfil).map((etapa) => {
      const indices = {}, detalle = {};
      Q.dimensiones.forEach((d) => {
        const pr = etapa.preguntas.filter((p) => p.dimension === d.id);
        const puntos = pr.reduce((a, p) => a + puntosPregunta(p, perfil.respuestas), 0);
        const max = pr.reduce((a, p) => a + maxPregunta(p), 0);
        indices[d.id] = Math.round((puntos / max) * 100);
        detalle[d.id] = { puntos, max };
      });
      return { etapa: etapa.id, nombre: etapa.nombre, etiqueta: etapa.etiqueta, indices, detalle };
    });
  }

  function cuadrante(ind) {
    const c = ind.cultural >= 50, e = ind.economico >= 50;
    if (c && e) return Q.cuadrantes.altoAlto;
    if (c) return Q.cuadrantes.altoCulturalBajoEconomico;
    if (e) return Q.cuadrantes.bajoCulturalAltoEconomico;
    return Q.cuadrantes.bajoBajo;
  }

  function trayectoria(serie) {
    if (serie.length < 2) return null;
    const delta = serie[serie.length - 1] - serie[0];
    const T = Q.trayectorias;
    const t = delta >= T.ascendente.umbral ? T.ascendente : delta <= T.descendente.umbral ? T.descendente : T.estable;
    return { ...t, delta };
  }

  /* ───────────── Resultados ───────────── */
  function renderResultados() {
    const res = calcular();
    if (!res.length) { state.pantalla = "inicio"; return renderInicio(); }
    const actual = res[res.length - 1];
    const cuad = cuadrante(actual.indices);
    const pendientes = etapasActivas().filter((e) => !etapaCompleta(e, state.perfil.respuestas));

    const tarjetas = Q.dimensiones
      .map((d) => {
        const tr = trayectoria(res.map((r) => r.indices[d.id]));
        const filas = res
          .map((r) => `<li><div class="sub-head"><span>${r.nombre}</span><span class="valor">${r.indices[d.id]}</span></div>
            <div class="barra"><div class="barra-fill" style="width:${r.indices[d.id]}%;background:${d.color}"></div></div></li>`)
          .join("");
        return `
          <article class="card dimension" style="--color:${d.color}">
            <p class="eyebrow">${d.nombre}</p>
            <p class="hero"><span class="hero-num">${actual.indices[d.id]}</span><span class="hero-unit">/ 100 · ${actual.nombre}</span></p>
            ${tr
              ? `<p class="detalle"><strong>${tr.titulo}</strong> (${tr.delta >= 0 ? "+" : ""}${tr.delta} puntos desde ${res[0].nombre.toLowerCase()}). ${tr.texto}</p>`
              : `<p class="detalle">Solo hay una etapa evaluada; la trayectoria se mostrará cuando haya más de una.</p>`}
            <ul class="subs">${filas}</ul>
          </article>`;
      })
      .join("");

    app.innerHTML = `
      <section class="card interpretacion" style="--color:${DIM.cultural.color}">
        <p class="eyebrow">${esc(state.perfil.nombre)} · Posición en ${actual.nombre}</p>
        <h2>${cuad.titulo}</h2>
        <p>${cuad.texto}</p>
        ${pendientes.length
          ? `<p class="pendiente">Etapas pendientes de responder: ${pendientes.map((e) => e.nombre).join(", ")}. <button class="btn chico" data-accion="continuar-pendiente">Continuar evaluación</button></p>`
          : `<p class="detalle">Última actualización: ${fmtFecha(state.perfil.actualizado)}. Cuando cambies de rango de edad, vuelve al inicio con tu nombre para evaluar la siguiente etapa.</p>`}
      </section>

      <section class="card">
        <h3>Evolución del capital por etapa de vida</h3>
        <p class="ayuda">Índice 0–100 de cada capital en cada etapa completada. Pasa el cursor sobre los puntos para ver el detalle.</p>
        <div id="grafico-evolucion" class="grafico ancho"></div>
        <div class="leyenda">${Q.dimensiones.map((d) => `<span><i style="background:${d.color}"></i>${d.nombre}</span>`).join("")}</div>
        <details class="tabla-wrap">
          <summary>Ver como tabla</summary>
          <table class="tabla">
            <thead><tr><th>Etapa</th>${Q.dimensiones.map((d) => `<th>${d.nombre}</th>`).join("")}</tr></thead>
            <tbody>${res.map((r) => `<tr><td>${r.nombre}</td>${Q.dimensiones.map((d) => `<td>${r.indices[d.id]} <span class="muted">(${r.detalle[d.id].puntos}/${r.detalle[d.id].max} pts)</span></td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </details>
      </section>

      <div class="grid-2">${tarjetas}</div>

      <section class="card">
        <h3>Recorrido en el espacio social</h3>
        <p class="ayuda">Eje horizontal: capital cultural. Eje vertical: capital económico. Cada punto es una etapa; la flecha sigue el orden cronológico y el punto relleno es la última etapa evaluada.</p>
        <div id="grafico-cuadrante" class="grafico"></div>
      </section>

      <section class="card">
        <h3>Exportar este perfil</h3>
        <p class="ayuda">Copia el resultado en formato JSON para guardarlo o procesarlo.</p>
        <textarea id="json-salida" readonly rows="6"></textarea>
        <div class="acciones">
          <button class="btn" data-accion="copiar">Copiar JSON</button>
          <button class="btn" data-accion="revisar">Revisar respuestas</button>
          <button class="btn" data-accion="perfiles">Perfiles guardados</button>
          <button class="btn primario" data-accion="inicio">Inicio</button>
        </div>
        <p id="copiado" class="ayuda" hidden>Copiado al portapapeles.</p>
      </section>`;

    dibujarEvolucion(res);
    dibujarCuadrante(res);
    $("#json-salida").value = JSON.stringify({
      version: Q.meta.version,
      fecha: new Date().toISOString(),
      nombre: state.perfil.nombre,
      edad: Q.edad.opciones[state.perfil.edad].texto,
      etapas: res.map((r) => ({ etapa: r.etapa, ...r.indices })),
      cuadranteActual: cuad.titulo,
      respuestas: state.perfil.respuestas
    }, null, 2);
  }

  /* ───────────── Gráfico de líneas: evolución ───────────── */
  function dibujarEvolucion(res) {
    const W = 640, H = 340, m = { t: 24, r: 150, b: 56, l: 44 };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const n = res.length;
    const sx = (i) => (n === 1 ? m.l + pw / 2 : m.l + (i / (n - 1)) * pw);
    const sy = (v) => m.t + ph - (v / 100) * ph;
    const grid = [0, 25, 50, 75, 100]
      .map((t) => `<line x1="${m.l}" y1="${sy(t)}" x2="${m.l + pw}" y2="${sy(t)}" class="grid"/><text x="${m.l - 8}" y="${sy(t) + 4}" text-anchor="end" class="tick">${t}</text>`)
      .join("");
    const xLabels = res
      .map((r, i) => `<text x="${sx(i)}" y="${m.t + ph + 18}" text-anchor="middle" class="tick">${r.etiqueta.split("\n").map((l, k) => `<tspan x="${sx(i)}" dy="${k === 0 ? 0 : 13}">${l}</tspan>`).join("")}</text>`)
      .join("");
    const finales = Q.dimensiones.map((d) => ({ d, y: sy(res[n - 1].indices[d.id]) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < finales.length; i++) if (finales[i].y - finales[i - 1].y < 16) finales[i].y = finales[i - 1].y + 16;

    const series = Q.dimensiones
      .map((d) => {
        const pts = res.map((r, i) => [sx(i), sy(r.indices[d.id]), r.indices[d.id], r.nombre]);
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
        const marcas = pts.map(([x, y, v, nombre]) => `<g class="marca" data-tip="${nombre}: ${d.nombre} ${v}"><circle cx="${x}" cy="${y}" r="14" class="hit"/><circle cx="${x}" cy="${y}" r="6" fill="${d.color}" class="ring"/></g>`).join("");
        const fin = finales.find((f) => f.d.id === d.id);
        return `<path d="${path}" fill="none" stroke="${d.color}" stroke-width="2" stroke-linejoin="round"/>${marcas}
          <text x="${m.l + pw + 12}" y="${fin.y + 4}" class="serie-label">${d.nombre} · ${res[n - 1].indices[d.id]}</text>`;
      })
      .join("");

    $("#grafico-evolucion").innerHTML = `<div class="tooltip" hidden></div>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución del capital cultural y económico por etapa de vida">
        ${grid}<line x1="${m.l}" y1="${m.t + ph}" x2="${m.l + pw}" y2="${m.t + ph}" class="eje"/>${xLabels}${series}
      </svg>`;
    activarTooltip($("#grafico-evolucion"));
  }

  /* ───────────── Gráfico de dispersión: recorrido en el cuadrante ───────────── */
  function dibujarCuadrante(res) {
    const W = 420, H = 420, m = { t: 20, r: 20, b: 44, l: 48 };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const sx = (v) => m.l + (v / 100) * pw, sy = (v) => m.t + ph - (v / 100) * ph;
    const cc = DIM.cultural.color, ce = DIM.economico.color;
    const grid = [0, 25, 50, 75, 100]
      .map((t) => `<line x1="${sx(t)}" y1="${m.t}" x2="${sx(t)}" y2="${m.t + ph}" class="grid"/><line x1="${m.l}" y1="${sy(t)}" x2="${m.l + pw}" y2="${sy(t)}" class="grid"/>
        <text x="${sx(t)}" y="${m.t + ph + 18}" text-anchor="middle" class="tick">${t}</text><text x="${m.l - 8}" y="${sy(t) + 4}" text-anchor="end" class="tick">${t}</text>`)
      .join("");
    const etiquetas = [[25, 75, "Económico alto\nCultural bajo"], [75, 75, "Ambos altos"], [25, 25, "Ambos bajos"], [75, 25, "Cultural alto\nEconómico bajo"]]
      .map(([qx, qy, t]) => { const l = t.split("\n"); return `<text x="${sx(qx)}" y="${sy(qy) - (l.length - 1) * 7}" text-anchor="middle" class="cuad">${l.map((s, i) => `<tspan x="${sx(qx)}" dy="${i === 0 ? 0 : 14}">${s}</tspan>`).join("")}</text>`; })
      .join("");
    const pts = res.map((r) => [sx(r.indices.cultural), sy(r.indices.economico), r]);
    const camino = pts.length > 1 ? `<path d="${pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ")}" class="camino" marker-end="url(#flecha)"/>` : "";
    const puntos = pts
      .map(([x, y, r], i) => { const u = i === pts.length - 1; return `<g class="marca" data-tip="${r.nombre}: cultural ${r.indices.cultural}, económico ${r.indices.economico}">
        <circle cx="${x}" cy="${y}" r="14" class="hit"/><circle cx="${x}" cy="${y}" r="${u ? 8 : 6}" class="ring" fill="${u ? cc : "var(--surface)"}" stroke="${cc}" stroke-width="2"/>
        <text x="${x}" y="${y + (u ? 4 : 3.5)}" text-anchor="middle" class="idx" fill="${u ? "#fff" : cc}">${i + 1}</text></g>`; })
      .join("");

    $("#grafico-cuadrante").innerHTML = `<div class="tooltip" hidden></div>
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Recorrido por etapas en el plano capital cultural vs económico">
        <defs><marker id="flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${cc}"/></marker></defs>
        ${grid}
        <line x1="${sx(50)}" y1="${m.t}" x2="${sx(50)}" y2="${m.t + ph}" class="umbral"/><line x1="${m.l}" y1="${sy(50)}" x2="${m.l + pw}" y2="${sy(50)}" class="umbral"/>
        ${etiquetas}
        <line x1="${m.l}" y1="${m.t + ph}" x2="${m.l + pw}" y2="${m.t + ph}" class="eje"/><line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t + ph}" class="eje"/>
        <text x="${m.l + pw / 2}" y="${H - 6}" text-anchor="middle" class="eje-label" fill="${cc}">Capital cultural</text>
        <text transform="translate(12 ${m.t + ph / 2}) rotate(-90)" text-anchor="middle" class="eje-label" fill="${ce}">Capital económico</text>
        ${camino}${puntos}
      </svg>
      <p class="ayuda centrado">${res.map((r, i) => `${i + 1} = ${r.nombre}`).join(" · ")}</p>`;
    activarTooltip($("#grafico-cuadrante"));
  }

  function activarTooltip(cont) {
    const tip = $(".tooltip", cont);
    cont.addEventListener("mousemove", (ev) => {
      const g = ev.target.closest(".marca");
      if (!g) { tip.hidden = true; return; }
      const rect = cont.getBoundingClientRect();
      tip.textContent = g.dataset.tip; tip.hidden = false;
      tip.style.left = ev.clientX - rect.left + 12 + "px";
      tip.style.top = ev.clientY - rect.top - 28 + "px";
    });
    cont.addEventListener("mouseleave", () => { tip.hidden = true; });
  }

  /* ───────────── Navegación ───────────── */
  function irA(pantalla, etapaIdx = 0) { state.pantalla = pantalla; state.etapaIdx = etapaIdx; render(); }

  function continuarEvaluacion() {
    const idx = primeraIncompleta();
    if (idx === -1) irA("resultados"); else irA("etapa", idx);
  }

  function copiar(texto, msgEl) {
    const ok = () => { if (msgEl) msgEl.hidden = false; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(ok).catch(() => {});
  }

  /* ───────────── Eventos ───────────── */
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-accion]");
    if (!btn) return;
    const a = btn.dataset.accion;
    const etapas = etapasActivas();

    switch (a) {
      case "comenzar":
        if (!leerInicio(true)) return;
        continuarEvaluacion(); break;
      case "resultados-inicio":
        if (!leerInicio(true)) return;
        irA("resultados"); break;
      case "siguiente":
        if (!leerFormulario(etapas[state.etapaIdx].preguntas, true)) return;
        if (state.etapaIdx + 1 < etapas.length) irA("etapa", state.etapaIdx + 1); else irA("resultados");
        break;
      case "anterior":
        leerFormulario(etapas[state.etapaIdx].preguntas, false);
        irA("etapa", Math.max(0, state.etapaIdx - 1)); break;
      case "inicio":
        if (state.pantalla === "etapa") leerFormulario(etapas[state.etapaIdx].preguntas, false);
        irA("inicio"); break;
      case "perfiles":
        if (state.pantalla === "etapa") leerFormulario(etapas[state.etapaIdx].preguntas, false);
        irA("perfiles"); break;
      case "continuar-pendiente":
        continuarEvaluacion(); break;
      case "revisar":
        irA("etapa", 0); break;
      case "abrir": {
        const p = S.listar().find((x) => x.id === btn.dataset.id);
        if (p) { state.perfil = p; continuarEvaluacion(); }
        break;
      }
      case "resultados-de": {
        const p = S.listar().find((x) => x.id === btn.dataset.id);
        if (p) { state.perfil = p; irA("resultados"); }
        break;
      }
      case "eliminar":
        if (btn.dataset.confirmar === "1") {
          S.eliminar(btn.dataset.id);
          if (state.perfil && state.perfil.id === btn.dataset.id) state.perfil = null;
          render();
        } else {
          btn.dataset.confirmar = "1"; btn.textContent = "¿Confirmar eliminación?";
          setTimeout(() => { if (btn.isConnected) { btn.dataset.confirmar = ""; btn.textContent = "Eliminar"; } }, 4000);
        }
        break;
      case "exportar": {
        const z = $("#zona-io"); z.hidden = false;
        $("#io-json").value = S.exportar(); $("#io-msg").hidden = true;
        break;
      }
      case "importar": {
        const z = $("#zona-io"); z.hidden = false;
        $("#io-json").value = ""; $("#io-json").focus(); $("#io-msg").hidden = true;
        break;
      }
      case "copiar-io":
        copiar($("#io-json").value, null); $("#io-msg").textContent = "Copiado al portapapeles."; $("#io-msg").hidden = false; break;
      case "confirmar-importar":
        try {
          const n = S.importar($("#io-json").value);
          renderPerfiles();
          $("#zona-io").hidden = false; $("#io-msg").textContent = `${n} perfil(es) importado(s).`; $("#io-msg").hidden = false;
        } catch (e) {
          $("#io-msg").textContent = "No se pudo importar: el texto no es un JSON válido de perfiles."; $("#io-msg").hidden = false;
        }
        break;
      case "copiar":
        copiar($("#json-salida").value, $("#copiado")); break;
    }
  });

  // Guardado automático al cambiar cualquier respuesta.
  app.addEventListener("change", (ev) => {
    if (state.pantalla === "etapa") {
      leerFormulario(etapasActivas()[state.etapaIdx].preguntas, false);
      const e = $("#estado-guardado");
      if (e) { e.textContent = `Avance guardado · ${fmtFecha(state.perfil.actualizado)}`; }
      actualizarProgreso();
    } else if (state.pantalla === "inicio" && ev.target.name === "edad") {
      const fs = $("#fs-edad"); fs.classList.remove("invalida"); $(".error", fs).hidden = true;
    }
  });

  /* ───────────── Inicio ───────────── */
  $("#titulo").textContent = Q.meta.titulo;
  $("#version").textContent = "v" + Q.meta.version;
  render();
})();
