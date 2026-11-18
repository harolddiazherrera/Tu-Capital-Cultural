/**
 * Persistencia de perfiles en el navegador (localStorage).
 *
 * Estructura guardada bajo la clave STORAGE_KEY:
 * {
 *   "<id>": {
 *     id, nombre, edad (índice de opción), respuestas {idPregunta: valor},
 *     creado (ISO), actualizado (ISO)
 *   }
 * }
 *
 * Si localStorage no está disponible (modo privado, sandbox, etc.) se usa un
 * respaldo en memoria que dura mientras la página esté abierta.
 */
window.Storage_ = (function () {
  "use strict";
  const STORAGE_KEY = "tcc_perfiles_v1";
  let memoria = null;
  let disponible = true;

  function leerTodo() {
    if (memoria) return memoria;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      memoria = raw ? JSON.parse(raw) : {};
    } catch (e) {
      disponible = false;
      memoria = {};
    }
    return memoria;
  }

  function escribirTodo(datos) {
    memoria = datos;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    } catch (e) {
      disponible = false;
    }
  }

  function normalizar(nombre) {
    return nombre
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  return {
    get disponible() { leerTodo(); return disponible; },

    listar() {
      return Object.values(leerTodo()).sort((a, b) => (b.actualizado || "").localeCompare(a.actualizado || ""));
    },

    obtener(nombre) {
      return leerTodo()[normalizar(nombre)] || null;
    },

    guardar(perfil) {
      const todo = leerTodo();
      const id = perfil.id || normalizar(perfil.nombre);
      const ahora = new Date().toISOString();
      const previo = todo[id];
      todo[id] = {
        id,
        nombre: perfil.nombre.trim(),
        edad: perfil.edad,
        respuestas: perfil.respuestas || {},
        creado: previo ? previo.creado : ahora,
        actualizado: ahora
      };
      escribirTodo(todo);
      return todo[id];
    },

    eliminar(id) {
      const todo = leerTodo();
      delete todo[id];
      escribirTodo(todo);
    },

    exportar() {
      return JSON.stringify(leerTodo(), null, 2);
    },

    importar(json) {
      const datos = JSON.parse(json);
      if (!datos || typeof datos !== "object") throw new Error("Formato inválido");
      const todo = leerTodo();
      let n = 0;
      Object.values(datos).forEach((p) => {
        if (p && p.nombre) { todo[p.id || normalizar(p.nombre)] = p; n++; }
      });
      escribirTodo(todo);
      return n;
    },

    normalizar
  };
})();
