/**
 * Análisis fundamentado de resultados: fundamentos, lectura de la trayectoria
 * y recomendaciones, con referencia a fuentes verificables.
 *
 * El análisis es determinista y se arma con reglas:
 *   1. Nivel del índice en la última etapa (bajo < 40, medio 40–64, alto ≥ 65).
 *   2. Caídas entre etapas consecutivas (≥ 10 puntos) → explicación de la transición.
 *   3. Ítems débiles de la última etapa (≤ 50 % del puntaje posible) → recomendaciones.
 *   4. Contraste entre capital de origen (infancia) y capital propio → movilidad.
 *
 * Cada párrafo cita fuentes por id; la lista completa está en FUENTES.
 */
window.ANALYSIS = (function () {
  "use strict";

  /* ───────────── Fuentes ───────────── */
  const FUENTES = {
    bourdieu: { cita: "Bourdieu, P. (1986). The forms of capital. En J. Richardson (ed.), Handbook of Theory and Research for the Sociology of Education. Greenwood.", url: "" },
    evans: { cita: "Evans, M. D. R., Kelley, J., Sikora, J. y Treiman, D. J. (2010). Family scholarly culture and educational success: Books and schooling in 27 nations. Research in Social Stratification and Mobility, 28(2), 171–197.", url: "https://www.sciencedirect.com/science/article/abs/pii/S0276562410000090" },
    ocde2018: { cita: "OCDE (2018). A Broken Social Elevator? How to Promote Social Mobility. OECD Publishing.", url: "https://www.oecd.org/en/publications/broken-elevator-how-to-promote-social-mobility_9789264301085-en.html" },
    enpccl: { cita: "INE y Ministerio de las Culturas, las Artes y el Patrimonio (2025). Encuesta Nacional de Participación Cultural y Comportamiento Lector 2024 (ENPCCL).", url: "https://www.cultura.gob.cl/participacioncultural/resultados-enpccl-2024/" },
    cima: { cita: "Cubillos, M. (2026). Más lectura, misma cantidad de libros: el desafío lector de Chile entre 2017 y 2024 / Sin paciencia no hay lectura. Policy Briefs N°32, CIMA, Universidad del Desarrollo.", url: "https://educacion.udd.cl/files/2026/06/policy-brief_comportamiento-lector-en-chile-2017_2024_cimaudd.pdf" },
    piaac: { cita: "OCDE (2024). Evaluación de Competencias de la Población Adulta 2023 (PIAAC): nota de país Chile.", url: "https://www.oecd.org/es/publications/evaluacion-de-competencias-de-la-poblacion-adulta-2023_f79f56e3-es/chile_dbf64059-es.html" },
    eag: { cita: "OCDE (2024). Education at a Glance 2024, citado en IPP-UNAB (2024), Informe sobre el retorno de la educación superior en Chile.", url: "https://ipp.unab.cl/wp-content/uploads/2024/10/20241011-IPP-UNAB_Informe-Retorno-educacion-superior.pdf" },
    fne: { cita: "Fiscalía Nacional Económica (2025). Estudio de mercado sobre educación superior (informe preliminar).", url: "https://www.fne.gob.cl/" },
    efh: { cita: "Banco Central de Chile (2025). Encuesta Financiera de Hogares 2024: documento de resultados.", url: "https://www.bcentral.cl/web/banco-central/areas/encuestas-economicas/encuesta-financiera-de-hogares" },
    efh2021: { cita: "Banco Central de Chile (2022). Presentación Encuesta Financiera de Hogares 2021.", url: "https://www.bcentral.cl/web/banco-central/w/presentacion-encuesta-financiera-de-hogares-2021" },
    fondo: { cita: "Comisión para el Mercado Financiero (CMF) y programas de educación financiera: referencia general de fondo de emergencia equivalente a 3–6 meses de gastos esenciales.", url: "https://www.cmfchile.cl/educa/" },
    bpdigital: { cita: "ChileAtiende / Servicio Nacional del Patrimonio Cultural. Biblioteca Pública Digital (BPDigital): préstamo gratuito de libros.", url: "https://www.chileatiende.gob.cl/fichas/57391-biblioteca-publica-digital" }
  };

  const nivel = (v) => (v < 40 ? "bajo" : v < 65 ? "medio" : "alto");
  const ref = (...ids) => ` <span class="ref">[${ids.join(", ")}]</span>`;

  /* ───────────── Fundamentos por dimensión y nivel ───────────── */
  const FUNDAMENTOS = {
    cultural: {
      marco:
        "Para Bourdieu, el capital cultural existe en tres estados: incorporado (disposiciones duraderas como el hábito lector o el dominio de códigos legítimos), objetivado (libros, instrumentos, obras) e institucionalizado (títulos). Se acumula lentamente, sobre todo en la familia de origen, y se convierte en ventajas escolares y laborales." + ref("bourdieu"),
      bajo:
        "Un índice bajo suele reflejar un hogar de origen con pocas credenciales y bienes culturales, más que falta de capacidad. La evidencia muestra que estos puntos de partida pesan: en Chile, 53,4 % de los adultos se ubica en el nivel 1 o inferior en comprensión lectora (OCDE: 18,9 %), y la participación cultural es de 65,2 % en el nivel socioeconómico bajo frente a 95,7 % en el alto." + ref("piaac", "enpccl"),
      medio:
        "Un índice medio indica una combinación de credenciales o prácticas presentes pero no sistemáticas. Es la zona donde pequeños hábitos sostenidos (lectura regular, participación cultural, formación continua) producen los mayores cambios, porque el estudio de Evans y colaboradores muestra que el efecto del entorno cultural crece de forma continua: incluso unos 20 libros ya marcan diferencia." + ref("evans"),
      alto:
        "Un índice alto describe credenciales, bienes y prácticas culturales consolidadas. El desafío en este nivel es la transmisión y la actualización: Bourdieu subraya que el capital cultural debe reinvertirse continuamente, y PIAAC muestra que en Chile los adultos de 55 a 65 años obtienen 57 puntos menos en lectura que los de 25 a 34, casi el doble de la brecha promedio OCDE." + ref("bourdieu", "piaac")
    },
    economico: {
      marco:
        "El capital económico (ingresos, patrimonio y liquidez) es, según Bourdieu, el más directamente convertible en otros capitales: financia educación, bienes culturales y tiempo libre. En Chile su transmisión entre generaciones es fuerte: la OCDE estima que a una familia del 10 % más pobre le tomaría seis generaciones alcanzar el ingreso medio." + ref("bourdieu", "ocde2018"),
      bajo:
        "Un índice bajo combina típicamente ingreso ajustado, vivienda no propia y escasa capacidad de absorber imprevistos. No es un rasgo individual sino estructural: la Encuesta Financiera de Hogares 2024 muestra que 51 % de los hogares mantiene deudas y que la riqueza neta mediana es de unos $30,9 millones, concentrada en la vivienda." + ref("efh"),
      medio:
        "Un índice medio suele corresponder a ingreso estable con patrimonio incipiente. La prioridad en esta zona es la holgura: los hogares chilenos declaran ahorrar principalmente para enfrentar gastos inesperados, y la proporción con cuenta de ahorro subió de 18 % a 25 % entre 2017 y 2021, señal de que el colchón financiero es el primer paso que la mayoría da." + ref("efh2021"),
      alto:
        "Un índice alto indica ingreso, patrimonio y liquidez consolidados. En este nivel la evidencia sugiere cuidar la diversificación (la riqueza de los hogares chilenos está muy concentrada en la vivienda) y la planificación del retiro, además de usar el capital económico para sostener el cultural, que es la conversión que Bourdieu describe como más rentable a largo plazo." + ref("efh", "bourdieu")
    }
  };

  /* ───────────── Explicaciones de caídas entre etapas ───────────── */
  const TRANSICIONES = {
    cultural: {
      "infancia→adolescencia": "La caída entre infancia y adolescencia suele reflejar el paso desde el capital cultural del hogar (libros, educación de los padres, actividades) hacia prácticas propias que aún no se consolidan. CIMA-UDD muestra que haber sido incentivado a leer en la infancia se asocia con terminar 20 % más libros en la adultez, pero el hábito requiere continuidad en la adolescencia." + ref("cima"),
      "adolescencia→juventud": "Entre adolescencia y juventud la caída se asocia a la presión de estudios y trabajo que desplaza la lectura y la participación cultural, o a no haber continuado estudios formales. Es la etapa decisiva para el estado institucionalizado del capital cultural." + ref("bourdieu"),
      "juventud→adultez": "Una caída entre juventud y adultez es frecuente cuando terminan los estudios y la vida laboral y familiar reduce el tiempo para lectura, cultura y formación continua. La ENPCCL 2024 confirma que la participación cultural disminuye con la edad." + ref("enpccl"),
      "adultez→adultez_mayor": "La caída hacia la adultez mayor refleja menor participación cultural con la edad (92,6 % de los jóvenes asistió a espectáculos frente a 40,6 % de las personas mayores) y, según PIAAC, un deterioro de competencias lectoras en el grupo de 55 a 65 años mayor que el promedio OCDE. Es reversible con práctica regular." + ref("enpccl", "piaac")
    },
    economico: {
      "infancia→adolescencia": "La caída entre infancia y adolescencia indica un deterioro de la situación del hogar de origen (ingresos, vivienda o necesidad de que el adolescente trabajara). Estos choques en edades formativas limitan la inversión educativa, según la OCDE." + ref("ocde2018"),
      "adolescencia→juventud": "La caída entre adolescencia y juventud es la más común y en gran parte esperable: se pasa del hogar de los padres a ingresos propios iniciales, arriendo y financiamiento de estudios. La FNE advierte, además, que 35 % de las carreras ofrecidas tiene retorno económico negativo, lo que puede prolongar esta etapa." + ref("fne"),
      "juventud→adultez": "Una caída entre juventud y adultez suele vincularse a cargas de deuda, a hijos o a inestabilidad laboral. La EFH 2024 muestra que la carga financiera de los hogares se mantuvo estable respecto a 2017, pero con deuda de consumo todavía presente en la mitad de ellos." + ref("efh"),
      "adultez→adultez_mayor": "La caída hacia la adultez mayor refleja normalmente la transición al retiro, con pensiones inferiores al último sueldo. Anticiparla con ahorro previsional voluntario y reducción de deudas es la recomendación más consistente en educación financiera." + ref("fondo")
    }
  };

  /* ───────────── Recomendaciones por tema ───────────── */
  const RECOMENDACIONES = {
    lectura: {
      titulo: "Construir un hábito lector regular",
      texto: "Fija una meta mínima de 15 minutos diarios de lectura por gusto. En Chile la proporción de no lectores cayó de 51,8 % a 34,9 % entre 2017 y 2024, pero el promedio sigue en 5,5 libros al año; el beneficio viene de la regularidad, no de leer un libro ocasional. Inscríbete gratis con tu RUT en la Biblioteca Pública Digital (más de 80.000 títulos, préstamos de 14 días) y usa la biblioteca pública de tu comuna. Las competencias lectoras se asocian además a mejores salarios según PIAAC." + ref("cima", "enpccl", "bpdigital", "piaac")
    },
    participacion: {
      titulo: "Participar en actividades culturales de forma planificada",
      texto: "Agenda al menos una actividad cultural al mes: los museos del Servicio Nacional del Patrimonio Cultural tienen entrada liberada, los centros culturales municipales ofrecen programación gratuita y el Día del Patrimonio (mayo) abre cientos de espacios. La ENPCCL 2024 muestra que 28,7 % de las personas quiso asistir a alguna actividad y no pudo; planificarla y hacerlo acompañado reduce esa brecha." + ref("enpccl")
    },
    libros_hogar: {
      titulo: "Aumentar los libros y bienes culturales en casa",
      texto: "El estudio de Evans y colaboradores en 27 países encontró que crecer en un hogar con muchos libros equivale a unos 3 años más de escolaridad, independiente de la educación y ocupación de los padres, y que incluso 20 libros ya tienen efecto. Ferias del libro, librerías de usados y donaciones permiten armar una biblioteca familiar a bajo costo; si tienes hijos, este es uno de los predictores más fuertes de su trayectoria educativa." + ref("evans")
    },
    educacion: {
      titulo: "Continuar o completar estudios formales",
      texto: "El título es la forma institucionalizada del capital cultural y la que más directamente se convierte en ingreso: en Chile, quienes tienen título de pregrado ganan 180 % más que quienes solo tienen enseñanza media, la brecha más alta de la OCDE. Sin embargo, 35 % de las carreras tiene retorno negativo, así que elige con datos de empleabilidad e ingresos (mifuturo.cl) y evalúa gratuidad, becas y la vía técnico-profesional, que tiene retornos positivos en muchas especialidades." + ref("eag", "fne", "bourdieu")
    },
    idiomas: {
      titulo: "Desarrollar y certificar un segundo idioma",
      texto: "Un segundo idioma es capital cultural incorporado y certificable. Combina práctica diaria breve (aplicaciones, lectura y audio en el idioma) con un curso estructurado y una certificación reconocida, que convierte la competencia en credencial. Las bibliotecas públicas y la Biblioteca Pública Digital ofrecen libros y audiolibros en otros idiomas sin costo." + ref("bourdieu", "bpdigital")
    },
    formacion_continua: {
      titulo: "Mantener formación continua y práctica creativa",
      texto: "PIAAC muestra que las competencias se deterioran sin uso: los adultos de 55 a 65 años en Chile obtienen 57 puntos menos en lectura que los de 25 a 34. Cursos, diplomados, talleres municipales y práctica artística regular mantienen activo el capital cultural y generan nuevas credenciales. Revisa la oferta gratuita de SENCE, universidades estatales y centros culturales." + ref("piaac", "bourdieu")
    },
    actividades_infancia: {
      titulo: "Compensar la falta de actividades formativas tempranas",
      texto: "Las actividades fuera del colegio en la infancia forman disposiciones que después se dan por naturales. Si no las tuviste, puedes adquirirlas ahora de forma consciente: talleres municipales, escuelas de música o deporte para adultos y clubes de lectura. Si tienes hijos, prioriza una actividad sostenida más que varias esporádicas: CIMA-UDD muestra que el incentivo lector temprano tiene efectos medibles en la adultez." + ref("cima", "bourdieu")
    },
    fondo_emergencia: {
      titulo: "Construir un fondo de emergencia",
      texto: "La referencia en educación financiera es acumular entre 3 y 6 meses de gastos esenciales en un instrumento líquido (cuenta de ahorro o depósito a plazo corto). Empieza por un mes y automatiza un abono mensual. Los hogares chilenos declaran que su principal motivo de ahorro es enfrentar gastos inesperados, y solo una fracción tiene cuenta de ahorro; tener este colchón evita recurrir a crédito de consumo, que es la deuda más común en el país." + ref("fondo", "efh2021", "efh")
    },
    deudas: {
      titulo: "Reducir la carga de deuda de consumo",
      texto: "Ordena las deudas por tasa y paga primero las más caras (tarjetas y casas comerciales); evalúa consolidarlas en un crédito con menor tasa y evita cuotas nuevas mientras tanto. La EFH 2024 muestra que la deuda en casas comerciales cayó con fuerza y que los hogares que redujeron deuda de consumo mejoraron su posición. Si hay morosidad, revisa las instancias de renegociación y la Ley de Insolvencia y Reemprendimiento (SUPERIR)." + ref("efh")
    },
    vivienda: {
      titulo: "Avanzar hacia la vivienda propia",
      texto: "La vivienda concentra la mayor parte de la riqueza de los hogares chilenos y es la base del patrimonio. Abre una cuenta de ahorro para la vivienda y revisa los subsidios del MINVU según tu tramo (DS1 para sectores medios, DS49 para sectores vulnerables); el ahorro previo es requisito de postulación. La EFH 2024 muestra que el número de hogares con vivienda propia crece menos que el total de hogares, por lo que anticipar el ahorro es clave." + ref("efh")
    },
    patrimonio: {
      titulo: "Diversificar el patrimonio y usar el ahorro previsional voluntario",
      texto: "Una vez cubierto el fondo de emergencia, destina un porcentaje fijo del ingreso a instrumentos de largo plazo: Ahorro Previsional Voluntario (APV) con beneficio tributario, fondos mutuos o depósitos a plazo, siempre en entidades fiscalizadas por la CMF. La riqueza de los hogares en Chile está muy concentrada en la vivienda; diversificar reduce el riesgo y mejora la seguridad en el retiro." + ref("efh", "fondo")
    },
    ingreso: {
      titulo: "Aumentar el ingreso mediante competencias certificables",
      texto: "El ingreso responde principalmente a credenciales y competencias: PIAAC asocia las competencias lectoras y numéricas a mejores salarios, y el título de pregrado en Chile tiene el mayor premio salarial de la OCDE. Certificaciones técnicas, idiomas y formación continua son las vías con retorno más rápido; revisa la empleabilidad e ingresos por carrera en mifuturo.cl antes de invertir." + ref("piaac", "eag")
    },
    empleo: {
      titulo: "Buscar estabilidad contractual",
      texto: "El contrato indefinido y la cotización previsional son la base de la seguridad económica: dan acceso a crédito hipotecario, seguro de cesantía y pensión. Si trabajas de manera informal o a honorarios, formaliza las cotizaciones y evalúa opciones de empleo con contrato aunque el ingreso inicial sea similar." + ref("ocde2018")
    },
    financiamiento_estudios: {
      titulo: "Financiar los estudios sin endeudamiento excesivo",
      texto: "Postula cada año a gratuidad y becas del Estado (FUAS); compara el costo total de la carrera con los ingresos esperados en mifuturo.cl, porque la FNE detectó que 35 % de las carreras tiene retorno negativo. Si debes usar crédito, prefiere el de menor tasa y evita combinarlo con deuda de consumo." + ref("fne", "eag")
    },
    retiro: {
      titulo: "Planificar la seguridad económica en el retiro",
      texto: "Revisa tu proyección de pensión en el sitio de tu AFP y de la Superintendencia de Pensiones, verifica si calificas para la Pensión Garantizada Universal (PGU) y complementa con APV mientras tengas ingresos laborales. Reducir deudas antes del retiro tiene el mismo efecto que aumentar la pensión." + ref("fondo")
    },
    colegio: {
      titulo: "Aprovechar los recursos educativos disponibles",
      texto: "El tipo de colegio de origen no se puede cambiar, pero sí su efecto: preuniversitarios gratuitos, bibliotecas públicas, becas y la vía de admisión por ranking y PACE compensan parte de la brecha. La OCDE identifica la educación como el principal mecanismo para romper la transmisión de la posición social entre generaciones." + ref("ocde2018")
    }
  };

  /** Mapa pregunta → tema de recomendación. */
  const TEMA_POR_PREGUNTA = {
    i_c1: "educacion", i_c2: "libros_hogar", i_c3: "actividades_infancia", i_c4: "participacion",
    i_e1: "fondo_emergencia", i_e2: "vivienda", i_e3: "colegio", i_e4: "participacion",
    a_c1: "lectura", a_c2: "formacion_continua", a_c3: "participacion", a_c4: "educacion",
    a_e1: "fondo_emergencia", a_e2: "empleo", a_e3: "colegio", a_e4: "colegio",
    j_c1: "educacion", j_c2: "idiomas", j_c3: "participacion", j_c4: "lectura",
    j_e1: "financiamiento_estudios", j_e2: "ingreso", j_e3: "fondo_emergencia", j_e4: "vivienda",
    d_c1: "educacion", d_c2: "libros_hogar", d_c3: "participacion", d_c4: "formacion_continua",
    d_e1: "ingreso", d_e2: "vivienda", d_e3: "patrimonio", d_e4: "deudas",
    m_c1: "educacion", m_c2: "libros_hogar", m_c3: "participacion", m_c4: "formacion_continua",
    m_e1: "ingreso", m_e2: "vivienda", m_e3: "patrimonio", m_e4: "retiro"
  };

  /* ───────────── Generación ───────────── */
  /**
   * @param res   resultados por etapa (de app.calcular)
   * @param Q     cuestionario
   * @param R     respuestas del perfil
   * @returns {html, fuentesUsadas}
   */
  function generar(res, Q, R) {
    const usadas = new Set();
    const marcar = (html) => { (html.match(/\[([a-z0-9, ]+)\]/g) || []).forEach((m) => m.slice(1, -1).split(",").forEach((s) => usadas.add(s.trim()))); return html; };

    const ultima = res[res.length - 1];
    const primera = res[0];
    const etapaUltima = Q.etapas.find((e) => e.id === ultima.etapa);
    const partes = [];

    /* 1. Síntesis */
    const sintesis = Q.dimensiones.map((d) => {
      const v = ultima.indices[d.id];
      const n = nivel(v);
      let t = `<strong>${d.nombre}: ${v}/100 (nivel ${n})</strong> en ${ultima.nombre.toLowerCase()}.`;
      if (res.length > 1) {
        const delta = v - primera.indices[d.id];
        t += ` Respecto a la ${primera.nombre.toLowerCase()} el índice ${delta > 0 ? "subió" : delta < 0 ? "bajó" : "se mantuvo"}${delta ? ` ${Math.abs(delta)} puntos` : ""}.`;
      }
      return `<li>${t}</li>`;
    }).join("");
    partes.push(`<h4>Síntesis</h4><ul class="lista">${sintesis}</ul>`);

    /* 2. Movilidad respecto al origen */
    if (res.length > 1) {
      const dc = ultima.indices.cultural - primera.indices.cultural;
      const de = ultima.indices.economico - primera.indices.economico;
      let mov;
      if (dc >= 15 && de >= 15) mov = "Tu trayectoria muestra <strong>movilidad ascendente en ambos capitales</strong> respecto al hogar de origen. Es un resultado poco frecuente en Chile, donde la OCDE estima una de las transmisiones intergeneracionales más fuertes de la organización; Bourdieu lo describiría como una conversión exitosa de capital cultural adquirido en posición económica." + ref("ocde2018", "bourdieu");
      else if (dc >= 15 && de < 15) mov = "Tu trayectoria muestra <strong>ascenso cultural sin un ascenso económico equivalente</strong>. Bourdieu identifica este desfase en quienes acumulan credenciales antes de que se conviertan en ingreso o patrimonio; suele cerrarse con el tiempo si las credenciales son valoradas en el mercado laboral, lo que en Chile depende fuertemente de la carrera y la institución." + ref("bourdieu", "fne");
      else if (dc < 15 && de >= 15) mov = "Tu trayectoria muestra <strong>ascenso económico sin un ascenso cultural equivalente</strong>. Es una posición sólida pero con un riesgo señalado por la literatura: sin reinversión en capital cultural (formación, lectura, participación), la transmisión a la siguiente generación depende solo del dinero, que es el capital más fácil de perder." + ref("bourdieu", "evans");
      else if (dc <= -15 || de <= -15) mov = "Tu trayectoria muestra una <strong>pérdida de posición respecto al hogar de origen</strong> en al menos una dimensión. Antes de interpretarlo como retroceso, revisa la etapa en que ocurre: en la juventud es habitual y transitorio (independencia, estudios); en la adultez conviene atender las causas que se detallan más abajo." + ref("ocde2018");
      else mov = "Tu trayectoria es <strong>estable respecto al hogar de origen</strong>: la posición se reproduce. Es el patrón más común según la OCDE y la teoría de la reproducción social de Bourdieu; romperlo requiere inversión deliberada en la dimensión más débil." + ref("ocde2018", "bourdieu");
      partes.push(`<h4>Lectura de la trayectoria</h4><p>${mov}</p>`);
    }

    /* 3. Fundamentos y caídas por dimensión */
    Q.dimensiones.forEach((d) => {
      const v = ultima.indices[d.id];
      const F = FUNDAMENTOS[d.id];
      let html = `<h4 style="color:${d.color}">${d.nombre}: fundamentos</h4><p>${F.marco}</p><p>${F[nivel(v)]}</p>`;
      const caidas = [];
      for (let i = 1; i < res.length; i++) {
        const delta = res[i].indices[d.id] - res[i - 1].indices[d.id];
        if (delta <= -10) {
          const clave = `${res[i - 1].etapa}→${res[i].etapa}`;
          caidas.push(`<li><strong>${res[i - 1].nombre} → ${res[i].nombre} (${delta} puntos).</strong> ${TRANSICIONES[d.id][clave] || ""}</li>`);
        }
      }
      if (caidas.length) html += `<p><strong>Etapas en que este capital disminuyó:</strong></p><ul class="lista">${caidas.join("")}</ul>`;
      partes.push(html);
    });

    /* 4. Recomendaciones: ítems débiles de la última etapa, priorizando la dimensión con caída */
    const debiles = [];
    etapaUltima.preguntas.forEach((p) => {
      const r = R[p.id];
      let pts, max;
      if (p.multiple) { pts = (r || []).reduce((a, j) => a + p.opciones[j].puntos, 0); max = p.opciones.reduce((a, o) => a + o.puntos, 0); }
      else { pts = Number.isInteger(r) ? p.opciones[r].puntos : 0; max = Math.max(...p.opciones.map((o) => o.puntos)); }
      const razon = max ? pts / max : 1;
      if (razon <= 0.5) debiles.push({ p, razon, tema: TEMA_POR_PREGUNTA[p.id] });
    });
    // Dimensión que más cayó en la última transición → prioridad
    let dimPrioritaria = null;
    if (res.length > 1) {
      const prev = res[res.length - 2];
      const deltas = Q.dimensiones.map((d) => ({ id: d.id, delta: ultima.indices[d.id] - prev.indices[d.id] }));
      const peor = deltas.sort((a, b) => a.delta - b.delta)[0];
      if (peor.delta <= -10) dimPrioritaria = peor.id;
    }
    debiles.sort((a, b) => {
      const pa = a.p.dimension === dimPrioritaria ? -1 : 0, pb = b.p.dimension === dimPrioritaria ? -1 : 0;
      return pa - pb || a.razon - b.razon;
    });
    const temasVistos = new Set();
    const recs = [];
    debiles.forEach(({ p, tema }) => {
      if (!tema || temasVistos.has(tema)) return;
      temasVistos.add(tema);
      const Rc = RECOMENDACIONES[tema];
      const prioridad = p.dimension === dimPrioritaria;
      recs.push(`<li class="rec ${prioridad ? "prioridad" : ""}"><strong>${Rc.titulo}${prioridad ? " <span class='tag'>prioridad: capital que disminuyó</span>" : ""}</strong><br>${Rc.texto}</li>`);
    });
    if (recs.length) {
      partes.push(`<h4>Recomendaciones</h4><p class="ayuda">Derivadas de los ítems con menor puntaje en ${ultima.nombre.toLowerCase()}${dimPrioritaria ? `, priorizando el ${Q.dimensiones.find((d) => d.id === dimPrioritaria).nombre.toLowerCase()}, que disminuyó en la última transición` : ""}. Se muestran en orden de prioridad.</p><ol class="lista recs">${recs.join("")}</ol>`);
    } else {
      partes.push(`<h4>Recomendaciones</h4><p>No hay ítems con puntaje bajo en ${ultima.nombre.toLowerCase()}. La recomendación general de la literatura en este caso es sostener las prácticas (lectura, participación cultural, ahorro) y orientar el capital hacia su transmisión: libros y actividades formativas para la siguiente generación, y diversificación patrimonial.${ref("evans", "efh")}</p>`);
    }

    const html = marcar(partes.join(""));

    /* 5. Fuentes usadas */
    const lista = Array.from(usadas).filter((id) => FUENTES[id]).map((id) => {
      const f = FUENTES[id];
      return `<li id="fuente-${id}"><strong>[${id}]</strong> ${f.cita}${f.url ? ` <a href="${f.url}" target="_blank" rel="noopener">${f.url}</a>` : ""}</li>`;
    }).join("");

    return {
      html: html + `<h4>Fuentes</h4><ol class="fuentes">${lista}</ol><p class="ayuda">Las cifras citadas corresponden a estudios poblacionales; describen tendencias generales, no determinan tu caso. Este análisis es orientativo y no reemplaza asesoría educacional o financiera profesional.</p>`
    };
  }

  return { generar, FUENTES };
})();
