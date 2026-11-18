/**
 * Banco de preguntas del cuestionario de capital cultural y económico
 * POR ETAPAS DE LA VIDA.
 *
 * Marco conceptual: Pierre Bourdieu (1979, 1986). El capital cultural abarca
 * credenciales (institucionalizado), bienes culturales (objetivado) y prácticas
 * o disposiciones (incorporado). El capital económico abarca ingreso,
 * patrimonio y holgura financiera.
 *
 * El cuestionario recorre las etapas de vida que la persona ya ha vivido
 * (según la edad declarada) y calcula, para cada etapa, un índice 0–100 por
 * dimensión. Con ello se dibuja la trayectoria de acumulación de capital.
 *
 * En las etapas tempranas (infancia, adolescencia) las preguntas apuntan al
 * hogar de origen, pues el capital de un menor es el de su familia. En las
 * etapas adultas apuntan al propio hogar.
 *
 * Para modificar el instrumento basta editar este archivo: la app lee esta
 * estructura y construye el formulario y los gráficos automáticamente.
 *
 * Cada opción tiene un puntaje; el índice de una dimensión en una etapa es
 * (puntos obtenidos / puntos máximos) × 100 sobre las preguntas de esa etapa.
 */

window.QUESTIONNAIRE = {
  meta: {
    titulo: "Trayectoria de capital cultural y económico",
    version: "0.4.3",
    nota: "Instrumento indicativo con fines exploratorios y educativos. No ha sido validado psicométricamente. Las respuestas se guardan únicamente en tu navegador y no se envían a ningún servidor."
  },

  dimensiones: [
    {
      id: "cultural",
      nombre: "Capital cultural",
      color: "#3B6FD6",
      descripcion: "Credenciales, bienes y prácticas culturales acumuladas."
    },
    {
      id: "economico",
      nombre: "Capital económico",
      color: "#2A9D8F",
      descripcion: "Ingreso, patrimonio y holgura financiera del hogar."
    }
  ],

  /** Pregunta inicial: determina hasta qué etapa se evalúa. */
  edad: {
    texto: "¿Qué edad tienes actualmente?",
    opciones: [
      { texto: "Menos de 13 años", etapaHasta: "infancia" },
      { texto: "13 a 18 años", etapaHasta: "adolescencia" },
      { texto: "19 a 29 años", etapaHasta: "juventud" },
      { texto: "30 a 49 años", etapaHasta: "adultez" },
      { texto: "50 años o más", etapaHasta: "adultez_mayor" }
    ]
  },

  etapas: [
    /* ═══════════════════════ INFANCIA (0–12) ═══════════════════════ */
    {
      id: "infancia",
      nombre: "Infancia",
      rango: "0 a 12 años",
      etiqueta: "Infancia\n(0–12)",
      descripcion: "Piensa en el hogar donde creciste durante tu niñez. El capital de un niño es el de su familia de origen.",
      preguntas: [
        {
          id: "i_c1", dimension: "cultural",
          texto: "¿Cuál era el nivel educativo más alto de tu padre o madre (el mayor de los dos) cuando eras niño/a?",
          opciones: [
            { texto: "Básica incompleta o sin estudios", puntos: 0 },
            { texto: "Básica completa", puntos: 1 },
            { texto: "Media completa", puntos: 2 },
            { texto: "Técnico superior", puntos: 3 },
            { texto: "Universitario", puntos: 4 },
            { texto: "Postgrado", puntos: 5 }
          ]
        },
        {
          id: "i_c2", dimension: "cultural",
          texto: "Aproximadamente, ¿cuántos libros había en el hogar de tu infancia (sin contar textos escolares)?",
          ayuda: "Indicador clásico de capital cultural objetivado, usado en pruebas como PISA.",
          opciones: [
            { texto: "0 a 10", puntos: 0 },
            { texto: "11 a 25", puntos: 1 },
            { texto: "26 a 100", puntos: 2 },
            { texto: "101 a 200", puntos: 3 },
            { texto: "Más de 200", puntos: 4 }
          ]
        },
        {
          id: "i_c3", dimension: "cultural",
          texto: "¿Participaste en actividades formativas fuera del colegio (clases de música, idiomas, arte, deporte federado, scouts)?",
          opciones: [
            { texto: "No", puntos: 0 },
            { texto: "Sí, de forma esporádica", puntos: 1 },
            { texto: "Sí, una actividad sostenida", puntos: 2 },
            { texto: "Sí, dos o más actividades sostenidas", puntos: 3 }
          ]
        },
        {
          id: "i_c4", dimension: "cultural",
          texto: "¿Con qué frecuencia en tu familia te leían cuentos, te llevaban a bibliotecas, museos, teatro o conciertos?",
          opciones: [
            { texto: "Nunca o casi nunca", puntos: 0 },
            { texto: "Algunas veces al año", puntos: 1 },
            { texto: "Varias veces al año", puntos: 2 },
            { texto: "Con frecuencia (mensual o más)", puntos: 3 }
          ]
        },
        {
          id: "i_e1", dimension: "economico",
          texto: "¿Cómo describirías la situación económica del hogar de tu infancia?",
          opciones: [
            { texto: "Con frecuencia faltaba dinero para lo básico (alimentación, servicios)", puntos: 0 },
            { texto: "Alcanzaba justo para lo básico, sin extras", puntos: 1 },
            { texto: "Vivíamos cómodamente, con algunos gustos", puntos: 2 },
            { texto: "Con holgura: sin preocupaciones económicas", puntos: 3 }
          ]
        },
        {
          id: "i_e2", dimension: "economico",
          texto: "¿Cuál era la situación de la vivienda donde creciste?",
          opciones: [
            { texto: "Cedida, allegados o situación irregular", puntos: 0 },
            { texto: "Arrendada", puntos: 1 },
            { texto: "Propia, pagándose", puntos: 2 },
            { texto: "Propia, totalmente pagada", puntos: 3 }
          ]
        },
        {
          id: "i_e3", dimension: "economico",
          texto: "¿En qué tipo de establecimiento cursaste la mayor parte de tu educación básica?",
          ayuda: "En Chile, el tipo de dependencia del colegio se asocia fuertemente al nivel socioeconómico del hogar.",
          opciones: [
            { texto: "Municipal o público", puntos: 0 },
            { texto: "Particular subvencionado", puntos: 1 },
            { texto: "Particular pagado", puntos: 3 }
          ]
        },
        {
          id: "i_e4", dimension: "economico",
          texto: "¿Tu familia salía de vacaciones fuera de casa durante tu infancia?",
          opciones: [
            { texto: "No", puntos: 0 },
            { texto: "Ocasionalmente, a lugares cercanos", puntos: 1 },
            { texto: "Casi todos los años, dentro del país", puntos: 2 },
            { texto: "Sí, incluyendo viajes al extranjero", puntos: 3 }
          ]
        }
      ]
    },

    /* ═══════════════════════ ADOLESCENCIA (13–18) ═══════════════════════ */
    {
      id: "adolescencia",
      nombre: "Adolescencia",
      rango: "13 a 18 años",
      etiqueta: "Adolescencia\n(13–18)",
      descripcion: "Piensa en tu etapa de educación media y en el hogar donde vivías entonces.",
      preguntas: [
        {
          id: "a_c1", dimension: "cultural",
          texto: "¿Con qué frecuencia leías libros por gusto (no obligatorios) en esta etapa?",
          opciones: [
            { texto: "Nunca o casi nunca", puntos: 0 },
            { texto: "Algunas veces al año", puntos: 1 },
            { texto: "Al menos una vez al mes", puntos: 2 },
            { texto: "Semanalmente o más", puntos: 3 }
          ]
        },
        {
          id: "a_c2", dimension: "cultural",
          texto: "¿Tenías en casa acceso a computador e internet para estudiar?",
          opciones: [
            { texto: "No", puntos: 0 },
            { texto: "Sí, pero compartido y con acceso limitado", puntos: 1 },
            { texto: "Sí, con acceso regular", puntos: 2 },
            { texto: "Sí, equipo propio y conexión permanente", puntos: 3 }
          ]
        },
        {
          id: "a_c3", dimension: "cultural",
          texto: "¿Participabas en actividades artísticas, culturales o académicas extraprogramáticas (banda, teatro, debate, academias, olimpiadas, idiomas)?",
          opciones: [
            { texto: "No", puntos: 0 },
            { texto: "Ocasionalmente", puntos: 1 },
            { texto: "Sí, una de forma regular", puntos: 2 },
            { texto: "Sí, dos o más de forma regular", puntos: 3 }
          ]
        },
        {
          id: "a_c4", dimension: "cultural",
          texto: "¿Qué expectativa había en tu entorno familiar sobre tus estudios al terminar la enseñanza media?",
          ayuda: "Las expectativas educativas del hogar son una forma de capital cultural incorporado.",
          opciones: [
            { texto: "Se esperaba que trabajara de inmediato", puntos: 0 },
            { texto: "No había una expectativa definida", puntos: 1 },
            { texto: "Se esperaba que estudiara una carrera técnica", puntos: 2 },
            { texto: "Se daba por hecho que iría a la universidad", puntos: 3 }
          ]
        },
        {
          id: "a_e1", dimension: "economico",
          texto: "¿Cómo describirías la situación económica de tu hogar en esta etapa?",
          opciones: [
            { texto: "Con frecuencia faltaba dinero para lo básico", puntos: 0 },
            { texto: "Alcanzaba justo para lo básico", puntos: 1 },
            { texto: "Cómoda, con algunos gustos", puntos: 2 },
            { texto: "Holgada, sin preocupaciones económicas", puntos: 3 }
          ]
        },
        {
          id: "a_e2", dimension: "economico",
          texto: "¿Tuviste que trabajar para aportar al ingreso del hogar durante la enseñanza media?",
          opciones: [
            { texto: "Sí, de forma regular y necesaria para el hogar", puntos: 0 },
            { texto: "Sí, ocasionalmente", puntos: 1 },
            { texto: "Trabajé solo para mis propios gastos", puntos: 2 },
            { texto: "No necesité trabajar", puntos: 3 }
          ]
        },
        {
          id: "a_e3", dimension: "economico",
          texto: "¿En qué tipo de establecimiento cursaste la enseñanza media?",
          opciones: [
            { texto: "Municipal o público", puntos: 0 },
            { texto: "Particular subvencionado", puntos: 1 },
            { texto: "Particular pagado", puntos: 3 }
          ]
        },
        {
          id: "a_e4", dimension: "economico",
          texto: "¿Contabas con recursos para preparar el ingreso a la educación superior (preuniversitario pagado, tutorías, materiales)?",
          opciones: [
            { texto: "No", puntos: 0 },
            { texto: "Solo recursos gratuitos", puntos: 1 },
            { texto: "Sí, con algún esfuerzo familiar", puntos: 2 },
            { texto: "Sí, sin dificultad", puntos: 3 }
          ]
        }
      ]
    },

    /* ═══════════════════════ JUVENTUD (19–29) ═══════════════════════ */
    {
      id: "juventud",
      nombre: "Juventud",
      rango: "19 a 29 años",
      etiqueta: "Juventud\n(19–29)",
      descripcion: "Etapa de educación superior e inserción laboral. Si estás en esta etapa, responde según tu situación actual.",
      preguntas: [
        {
          id: "j_c1", dimension: "cultural",
          texto: "¿Cuál es el nivel educativo más alto que alcanzaste o estás cursando en esta etapa?",
          opciones: [
            { texto: "Enseñanza media o menos", puntos: 0 },
            { texto: "Técnico de nivel superior (CFT / IP)", puntos: 2 },
            { texto: "Carrera profesional o universitaria", puntos: 3 },
            { texto: "Postgrado", puntos: 4 }
          ]
        },
        {
          id: "j_c2", dimension: "cultural",
          texto: "¿Cuántos idiomas, además de tu lengua materna, usas con fluidez?",
          opciones: [
            { texto: "Ninguno", puntos: 0 },
            { texto: "Uno", puntos: 2 },
            { texto: "Dos o más", puntos: 3 }
          ]
        },
        {
          id: "j_c3", dimension: "cultural",
          texto: "¿Con qué frecuencia asistes (o asistías en esta etapa) a museos, teatro, conciertos en vivo, cine de autor, charlas o ferias del libro?",
          opciones: [
            { texto: "Nunca", puntos: 0 },
            { texto: "1 a 2 veces al año", puntos: 1 },
            { texto: "Varias veces al año", puntos: 2 },
            { texto: "Mensualmente o más", puntos: 3 }
          ]
        },
        {
          id: "j_c4", dimension: "cultural",
          texto: "¿Lees libros por gusto o te informas con prensa, documentales o podcasts de análisis?",
          opciones: [
            { texto: "Casi nunca", puntos: 0 },
            { texto: "Algunas veces al mes", puntos: 1 },
            { texto: "Varias veces a la semana", puntos: 2 },
            { texto: "Diariamente", puntos: 3 }
          ]
        },
        {
          id: "j_e1", dimension: "economico",
          texto: "¿Cómo financiaste (o financias) tus estudios superiores?",
          opciones: [
            { texto: "No pude acceder a educación superior por motivos económicos", puntos: 0 },
            { texto: "Crédito (CAE u otro) o trabajando para pagarlos", puntos: 1 },
            { texto: "Gratuidad o becas", puntos: 2 },
            { texto: "Financiamiento familiar sin dificultad", puntos: 3 }
          ]
        },
        {
          id: "j_e2", dimension: "economico",
          texto: "¿Cuál es (o era) tu ingreso personal mensual líquido típico en esta etapa?",
          ayuda: "Tramos en pesos chilenos actuales. Si fue hace años, estima el equivalente a hoy.",
          opciones: [
            { texto: "Sin ingresos propios o menos de $300.000", puntos: 0 },
            { texto: "$300.000 a $599.999", puntos: 1 },
            { texto: "$600.000 a $999.999", puntos: 2 },
            { texto: "$1.000.000 a $1.799.999", puntos: 3 },
            { texto: "$1.800.000 o más", puntos: 4 }
          ]
        },
        {
          id: "j_e3", dimension: "economico",
          texto: "Si enfrentaras (o enfrentabas) un gasto imprevisto de unos $300.000, ¿cómo lo cubrirías?",
          opciones: [
            { texto: "No podría cubrirlo", puntos: 0 },
            { texto: "Pidiendo prestado a familia o amigos", puntos: 1 },
            { texto: "Con crédito o tarjeta en cuotas", puntos: 2 },
            { texto: "Con ahorros, sin dificultad", puntos: 3 }
          ]
        },
        {
          id: "j_e4", dimension: "economico",
          texto: "¿Cuál es (o era) tu situación de vivienda en esta etapa?",
          opciones: [
            { texto: "Allegado o situación precaria", puntos: 0 },
            { texto: "Casa de los padres por necesidad económica", puntos: 1 },
            { texto: "Arriendo independiente (solo o compartido)", puntos: 2 },
            { texto: "Vivienda propia o aporte familiar para comprarla", puntos: 3 }
          ]
        }
      ]
    },

    /* ═══════════════════════ ADULTEZ (30–49) ═══════════════════════ */
    {
      id: "adultez",
      nombre: "Adultez",
      rango: "30 a 49 años",
      etiqueta: "Adultez\n(30–49)",
      descripcion: "Etapa de consolidación laboral y familiar. Si estás en esta etapa, responde según tu situación actual.",
      preguntas: [
        {
          id: "d_c1", dimension: "cultural",
          texto: "¿Cuál es el nivel educativo más alto que has completado?",
          opciones: [
            { texto: "Enseñanza media o menos", puntos: 0 },
            { texto: "Técnico de nivel superior", puntos: 2 },
            { texto: "Título profesional o licenciatura", puntos: 3 },
            { texto: "Magíster", puntos: 4 },
            { texto: "Doctorado", puntos: 5 }
          ]
        },
        {
          id: "d_c2", dimension: "cultural",
          texto: "¿Cuántos libros hay en tu hogar actual (sin contar textos escolares)?",
          opciones: [
            { texto: "0 a 25", puntos: 0 },
            { texto: "26 a 100", puntos: 1 },
            { texto: "101 a 200", puntos: 2 },
            { texto: "201 a 500", puntos: 3 },
            { texto: "Más de 500", puntos: 4 }
          ]
        },
        {
          id: "d_c3", dimension: "cultural",
          texto: "En los últimos 12 meses, ¿cuántas veces asististe a museos, exposiciones, teatro, conciertos, danza u ópera?",
          opciones: [
            { texto: "Ninguna", puntos: 0 },
            { texto: "1 a 2 veces", puntos: 1 },
            { texto: "3 a 5 veces", puntos: 2 },
            { texto: "6 o más", puntos: 3 }
          ]
        },
        {
          id: "d_c4", dimension: "cultural",
          texto: "¿Cuáles de estas prácticas mantienes de forma regular? (marca todas las que correspondan)",
          multiple: true,
          opciones: [
            { texto: "Lectura de libros por gusto", puntos: 1 },
            { texto: "Práctica artística (instrumento, escritura, pintura, fotografía, danza)", puntos: 1 },
            { texto: "Uso de un segundo idioma", puntos: 1 },
            { texto: "Formación continua (cursos, diplomados, certificaciones)", puntos: 1 },
            { texto: "Consumo de prensa, documentales o podcasts de análisis", puntos: 1 }
          ]
        },
        {
          id: "d_e1", dimension: "economico",
          texto: "¿Cuál es el ingreso mensual líquido total de tu hogar?",
          opciones: [
            { texto: "Menos de $800.000", puntos: 0 },
            { texto: "$800.000 a $1.499.999", puntos: 1 },
            { texto: "$1.500.000 a $2.499.999", puntos: 2 },
            { texto: "$2.500.000 a $3.999.999", puntos: 3 },
            { texto: "$4.000.000 a $5.999.999", puntos: 4 },
            { texto: "$6.000.000 o más", puntos: 5 }
          ]
        },
        {
          id: "d_e2", dimension: "economico",
          texto: "¿Cuál es la situación de tu vivienda?",
          opciones: [
            { texto: "Cedida, allegado o situación irregular", puntos: 0 },
            { texto: "Arrendada", puntos: 1 },
            { texto: "Propia, pagándose", puntos: 3 },
            { texto: "Propia, totalmente pagada", puntos: 4 }
          ]
        },
        {
          id: "d_e3", dimension: "economico",
          texto: "¿Qué activos posee tu hogar? (marca todos los que correspondan)",
          multiple: true,
          opciones: [
            { texto: "Vehículo", puntos: 1 },
            { texto: "Segunda propiedad (casa, departamento, terreno, local)", puntos: 2 },
            { texto: "Inversiones financieras (fondos, acciones, depósitos, APV)", puntos: 2 },
            { texto: "Negocio o empresa propia", puntos: 2 },
            { texto: "Ahorros equivalentes a 3 o más meses de gastos", puntos: 2 }
          ]
        },
        {
          id: "d_e4", dimension: "economico",
          texto: "¿Cómo describirías la holgura financiera de tu hogar?",
          opciones: [
            { texto: "Deudas atrasadas o ingresos que no alcanzan", puntos: 0 },
            { texto: "Al día, pero sin capacidad de ahorro", puntos: 1 },
            { texto: "Ahorro moderado y deudas manejables", puntos: 2 },
            { texto: "Ahorro sostenido (más del 15% del ingreso) y sin deudas problemáticas", puntos: 3 }
          ]
        }
      ]
    },

    /* ═══════════════════════ ADULTEZ MAYOR (50+) ═══════════════════════ */
    {
      id: "adultez_mayor",
      nombre: "Adultez mayor",
      rango: "50 años o más",
      etiqueta: "Adultez mayor\n(50+)",
      descripcion: "Etapa de madurez, transmisión y preparación o vivencia del retiro. Responde según tu situación actual.",
      preguntas: [
        {
          id: "m_c1", dimension: "cultural",
          texto: "¿Cuál es el nivel educativo más alto que has completado?",
          opciones: [
            { texto: "Enseñanza media o menos", puntos: 0 },
            { texto: "Técnico de nivel superior", puntos: 2 },
            { texto: "Título profesional o licenciatura", puntos: 3 },
            { texto: "Magíster o doctorado", puntos: 5 }
          ]
        },
        {
          id: "m_c2", dimension: "cultural",
          texto: "¿Cuántos libros hay en tu hogar actual?",
          opciones: [
            { texto: "0 a 25", puntos: 0 },
            { texto: "26 a 100", puntos: 1 },
            { texto: "101 a 200", puntos: 2 },
            { texto: "201 a 500", puntos: 3 },
            { texto: "Más de 500", puntos: 4 }
          ]
        },
        {
          id: "m_c3", dimension: "cultural",
          texto: "¿Con qué frecuencia participas en actividades culturales (museos, teatro, conciertos, charlas, talleres, clubes de lectura)?",
          opciones: [
            { texto: "Nunca", puntos: 0 },
            { texto: "1 a 2 veces al año", puntos: 1 },
            { texto: "Varias veces al año", puntos: 2 },
            { texto: "Mensualmente o más", puntos: 3 }
          ]
        },
        {
          id: "m_c4", dimension: "cultural",
          texto: "¿Cuáles de estas prácticas mantienes de forma regular? (marca todas las que correspondan)",
          multiple: true,
          opciones: [
            { texto: "Lectura de libros por gusto", puntos: 1 },
            { texto: "Práctica artística o creativa", puntos: 1 },
            { texto: "Uso de un segundo idioma", puntos: 1 },
            { texto: "Formación continua o docencia", puntos: 1 },
            { texto: "Consumo de prensa, documentales o podcasts de análisis", puntos: 1 }
          ]
        },
        {
          id: "m_e1", dimension: "economico",
          texto: "¿Cuál es el ingreso mensual líquido total de tu hogar (sueldos, pensiones, rentas)?",
          opciones: [
            { texto: "Menos de $800.000", puntos: 0 },
            { texto: "$800.000 a $1.499.999", puntos: 1 },
            { texto: "$1.500.000 a $2.499.999", puntos: 2 },
            { texto: "$2.500.000 a $3.999.999", puntos: 3 },
            { texto: "$4.000.000 a $5.999.999", puntos: 4 },
            { texto: "$6.000.000 o más", puntos: 5 }
          ]
        },
        {
          id: "m_e2", dimension: "economico",
          texto: "¿Cuál es la situación de tu vivienda?",
          opciones: [
            { texto: "Cedida, allegado o situación irregular", puntos: 0 },
            { texto: "Arrendada", puntos: 1 },
            { texto: "Propia, pagándose", puntos: 3 },
            { texto: "Propia, totalmente pagada", puntos: 4 }
          ]
        },
        {
          id: "m_e3", dimension: "economico",
          texto: "¿Qué activos posee tu hogar? (marca todos los que correspondan)",
          multiple: true,
          opciones: [
            { texto: "Vehículo", puntos: 1 },
            { texto: "Segunda propiedad", puntos: 2 },
            { texto: "Inversiones financieras (fondos, acciones, depósitos, APV)", puntos: 2 },
            { texto: "Negocio o empresa propia", puntos: 2 },
            { texto: "Ahorros equivalentes a 6 o más meses de gastos", puntos: 2 }
          ]
        },
        {
          id: "m_e4", dimension: "economico",
          texto: "Pensando en tu retiro (actual o futuro), ¿cómo evalúas tu seguridad económica?",
          opciones: [
            { texto: "Dependeré o dependo de terceros o de ayudas", puntos: 0 },
            { texto: "Pensión básica, con ajustes importantes en el nivel de vida", puntos: 1 },
            { texto: "Pensión y ahorros que mantienen mi nivel de vida con moderación", puntos: 2 },
            { texto: "Pensión, ahorros y rentas que aseguran holgura", puntos: 3 }
          ]
        }
      ]
    }
  ],

  /** Interpretación del cuadrante de la etapa actual (umbral 50 en cada eje). */
  cuadrantes: {
    altoAlto: {
      titulo: "Capital cultural y económico altos",
      texto: "Posición con recursos en ambas dimensiones. En términos de Bourdieu, corresponde a las zonas dominantes del espacio social, donde ambos capitales se refuerzan mutuamente."
    },
    altoCulturalBajoEconomico: {
      titulo: "Capital cultural alto, económico bajo",
      texto: "Credenciales y prácticas culturales por sobre los recursos materiales. Bourdieu lo asocia a fracciones intelectuales o profesionales emergentes; es frecuente en estudiantes y personas al inicio de su carrera."
    },
    bajoCulturalAltoEconomico: {
      titulo: "Capital económico alto, cultural bajo",
      texto: "Recursos materiales que superan la acumulación cultural formal. Puede corresponder a emprendedores u oficios bien remunerados, con menor inversión en credenciales o consumo cultural legitimado."
    },
    bajoBajo: {
      titulo: "Capital cultural y económico bajos",
      texto: "Menores recursos en ambas dimensiones según este instrumento. Recuerda que mide formas específicas y 'legitimadas' de capital; no captura saberes populares, redes de apoyo ni capital social."
    }
  },

  /** Interpretación de la trayectoria (diferencia entre primera y última etapa). */
  trayectorias: {
    ascendente: { umbral: 15, titulo: "Trayectoria ascendente", texto: "El índice subió más de 15 puntos entre la primera y la última etapa evaluada: hay acumulación neta de este capital respecto al hogar de origen." },
    estable: { titulo: "Trayectoria estable", texto: "El índice se mantuvo dentro de un rango de ±15 puntos: la posición de origen tiende a reproducirse, como predice la teoría de la reproducción social." },
    descendente: { umbral: -15, titulo: "Trayectoria descendente", texto: "El índice bajó más de 15 puntos: la etapa actual muestra menos de este capital que el hogar de origen. Es común en la juventud, cuando aún no se ha consolidado el propio hogar." }
  }
};
