# 🌍 SEISMIC MONITOR — Monitor de terremotos

Aplicación web desarrollada con **JavaScript, HTML5 y CSS3** que permite consultar y visualizar la actividad sísmica mundial mediante mapas interactivos y datos proporcionados por el servicio USGS (United States Geological Survey).

El proyecto permite consultar los terremotos registrados durante las últimas 24 horas y realizar búsquedas personalizadas aplicando filtros de fecha y magnitud.

## 📌 Características principales

- **Mapa de actividad sísmica actual:** visualización de los terremotos registrados en las últimas 24 horas.
- **Mapa de búsqueda personalizada:** consulta de terremotos mediante filtros.
- **Filtros por magnitud:** selección de magnitud mínima y máxima.
- **Filtros por fechas:** selección del periodo de consulta.
- **Mapas interactivos:** visualización mediante la biblioteca Leaflet.
- **Leyendas de magnitud:** identificación visual de la intensidad de los terremotos mediante círculos de diferentes colores.
- **Carga asíncrona de datos:** obtención de información mediante Fetch API y funciones `async/await`.
- **Indicador de carga:** spinner durante las búsquedas.
- **Diseño responsive:** adaptación de la interfaz a diferentes tamaños de pantalla.

## 🛠️ Tecnologías utilizadas

| Tecnología | Aplicación |
|---|---|
| HTML5 | Estructura y contenido de la aplicación |
| CSS3 | Diseño, estilos y adaptación responsive |
| JavaScript ES6+ | Lógica, funciones y manipulación del DOM |
| Leaflet 1.9.4 | Creación de mapas interactivos |
| Fetch API | Consulta de datos externos |
| USGS | Fuente de información sísmica |
| Git y GitHub | Control de versiones y alojamiento del proyecto |
| VS Code | Entorno de desarrollo |

## 🗺️ Fuente de datos

La aplicación utiliza información pública del servicio **USGS Earthquake Hazards Program**.

- [USGS Earthquake Data Feeds](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php): datos de terremotos de las últimas 24 horas.
- [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/): servicio de consulta de eventos sísmicos mediante parámetros.

Los datos se reciben en formato GeoJSON y se utilizan para representar los terremotos sobre los mapas.

## 📁 Estructura del proyecto

```text
Web_Terremotos/
│
├── index.html       # Estructura principal de la aplicación
├── style.css        # Estilos y diseño responsive
├── script.js        # Lógica y gestión de los datos
├── mapas.js         # Clases y configuración de los mapas
└── README.md        # Documentación del proyecto
```

## ⚙️ Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone https://github.com/Erikbmhub/Proyecto_terremotos.git
```

**2. Acceder al directorio**

```bash
cd Proyecto_terremotos
```

**3. Abrir el proyecto**

Abrir la carpeta del proyecto con Visual Studio Code.

**4. Ejecutar la aplicación**

Iniciar el proyecto mediante la extensión Live Server de Visual Studio Code y abrir la dirección local que proporciona.

> Es necesario ejecutar la aplicación mediante un servidor local para que funcionen correctamente los módulos JavaScript.

## 🧭 Funcionamiento de la aplicación

### 1. Mapa de terremotos actual

Al iniciar la aplicación se consulta la actividad sísmica mundial de las últimas 24 horas.

Los terremotos se representan mediante círculos sobre el mapa. El color de cada círculo depende de la magnitud registrada.

### 2. Búsqueda personalizada

El segundo mapa permite realizar consultas aplicando los siguientes filtros:

- Magnitud mínima.
- Magnitud máxima.
- Fecha inicial.
- Fecha final.

Al pulsar el botón **Buscar terremotos**, la aplicación realiza una petición a la API del USGS y representa los resultados obtenidos en el segundo mapa.

Durante la consulta se muestra un indicador de carga.

## 🎨 Clasificación visual de magnitudes

Los terremotos se representan mediante los siguientes intervalos de magnitud:

| Magnitud | Color |
|---|---|
| Menor que 1 | Verde |
| De 1 a menos de 2 | Verde oscuro |
| De 2 a menos de 3 | Amarillo |
| De 3 a menos de 4 | Oliva |
| De 4 a menos de 5 | Naranja |
| De 5 a menos de 6 | Rojo |
| De 6 a menos de 7 | Morado |
| 7 o superior | Negro |

## 📱 Diseño responsive

La interfaz está diseñada para adaptarse a diferentes dispositivos:

- En pantallas pequeñas, los mapas y sus leyendas se distribuyen verticalmente.
- En pantallas grandes, los mapas y las leyendas se muestran en una distribución horizontal.

## 👨‍💻 Autor

**Erik Buitrago**

Proyecto desarrollado como parte del **Bootcamp de Desarrollo con IA de The Bridge**.

- GitHub: [Erikbmhub](https://github.com/Erikbmhub)
- Repositorio: [Proyecto_terremotos](https://github.com/Erikbmhub/Proyecto_terremotos)

---

*Proyecto académico de desarrollo web centrado en el consumo de APIs externas, la visualización de datos geográficos y la programación asíncrona con JavaScript.*