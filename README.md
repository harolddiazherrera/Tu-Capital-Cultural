# Tu Capital Cultural

Cuestionario web que reconstruye la **trayectoria de capital cultural y económico** de una persona a lo largo de sus etapas de vida, basado en el marco conceptual de Pierre Bourdieu.

Es una aplicación estática (HTML + CSS + JavaScript, sin backend): se puede abrir directamente desde el archivo `index.html` o publicar en GitHub Pages. Los perfiles y el avance se guardan únicamente en el navegador de quien responde (`localStorage`); no se envía información a ningún servidor.

## Funcionalidades

- **Perfiles por nombre:** al iniciar se pide un nombre o alias. Si ya existe, se precarga la edad y se retoma donde se dejó.
- **Guardado automático:** cada respuesta se guarda al instante; se puede cerrar la página y continuar después.
- **Evaluación por etapas de vida:** infancia (0–12), adolescencia (13–18), juventud (19–29), adultez (30–49) y adultez mayor (50+). Se evalúan solo las etapas ya vividas según la edad declarada; al cambiar de rango de edad se habilitan las etapas nuevas sin perder lo respondido.
- **8 preguntas por etapa:** 4 de capital cultural y 4 de capital económico. En infancia y adolescencia apuntan al hogar de origen; en las etapas adultas, al hogar propio.
- **Resultados:** índice 0–100 por capital y etapa, gráfico de evolución, clasificación de la trayectoria (ascendente / estable / descendente), posición y recorrido en el plano cultural × económico, y exportación en JSON.
- **Análisis detallado:** fundamentos de los valores obtenidos, explicación de las etapas en que cada capital disminuyó y recomendaciones priorizadas, con referencias a estudios y fuentes verificables (Bourdieu; Evans et al. 2010; OCDE 2018 y PIAAC 2023; ENPCCL 2024; EFH 2024 del Banco Central; CIMA-UDD; FNE). Las reglas y textos están en `js/analysis.js`.
- **Exportar PDF:** botón que imprime solo los resultados y el análisis (usa el diálogo de impresión del navegador → "Guardar como PDF").
- **Perfiles guardados:** listado de todas las personas evaluadas en el navegador, con avance, último índice, acceso a resultados, continuación, eliminación, exportación e importación en JSON.

## Estructura

```
index.html        Página principal
css/style.css     Estilos (incluye modo oscuro automático)
js/questions.js   Banco de preguntas, puntajes, etapas e interpretaciones
js/storage.js     Persistencia de perfiles en localStorage
js/analysis.js    Reglas del análisis fundamentado, recomendaciones y fuentes
js/app.js         Lógica de navegación, cálculo y gráficos (SVG)
```

## Modelo de medición

Cada opción de respuesta tiene un puntaje. Para cada etapa y dimensión:

```
índice = puntos obtenidos / puntos máximos posibles × 100
```

- **Capital cultural** (Bourdieu): credenciales (institucionalizado), bienes culturales (objetivado) y prácticas o disposiciones (incorporado).
- **Capital económico:** ingreso, patrimonio y holgura financiera del hogar.
- **Cuadrante:** umbral de 50 puntos en cada eje.
- **Trayectoria:** diferencia entre la última y la primera etapa evaluada; ±15 puntos define ascendente / estable / descendente.

Para modificar preguntas, puntajes, tramos de ingreso (en pesos chilenos), umbrales o textos basta editar `js/questions.js`; la interfaz se genera a partir de esa estructura.

## Publicar en GitHub Pages

1. En el repositorio, ve a **Settings → Pages**.
2. En *Build and deployment* selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guarda; en unos minutos el sitio queda disponible en `https://<usuario>.github.io/Tu-Capital-Cultural/`.

## Advertencia

Instrumento indicativo con fines exploratorios y educativos. No ha sido validado psicométricamente y mide formas específicas y "legitimadas" de capital; no captura saberes populares, redes de apoyo ni capital social. Las preguntas sobre etapas pasadas son retrospectivas y están sujetas a sesgo de memoria.

## Referencias

- Bourdieu, P. (1979). *La distinción. Criterio y bases sociales del gusto.*
- Bourdieu, P. (1986). "The forms of capital". En J. Richardson (ed.), *Handbook of Theory and Research for the Sociology of Education*.

## Licencia

MIT.
