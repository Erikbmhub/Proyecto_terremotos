import { MapaNatGeo, MapaTopografico } from "./mapas.js";

//    CREACIÓN DE LOS DOS MAPAS

// Mapa 1: utiliza la capa NatGeo cuando el zoom es lejano.
const mapa1 = new MapaNatGeo("map");

// Mapa 2: utiliza la capa OpenTopoMap cuando el zoom es lejano.
const mapa2 = new MapaTopografico("map2");

// CONTROL DE FECHAS
// Obtenemos la fecha actual en formato YYYY-MM-DD.
const hoy = new Date();
const fechaActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

// Impedimos seleccionar fechas futuras.
document.getElementById("fecha-inicio").max = fechaActual;
document.getElementById("fecha-fin").max = fechaActual;

//    OBTENCIÓN DE DATOS PARA EL MAPA 1

async function getData() {
  try {
    // Consultamos la API de USGS.
    // all_day.geojson contiene los terremotos de las últimas 24 horas.
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
    );

    // Comprobamos si la petición HTTP ha terminado correctamente.
    if (!res.ok) {
      throw new Error("Error al obtener los terremotos del mapa 1");
    }

    // Convertimos la respuesta recibida a un objeto JavaScript.
    const data = await res.json();

    // Devolvemos los datos para que otra función pueda utilizarlos.
    return data;
  } catch (error) {
    // Mostramos el error si falla la petición.
    console.error("Error en getData:", error);
  }
}

//    OBTENCIÓN DE DATOS PARA EL MAPA 2
//    FILTRADO POR FECHA Y MAGNITUD MÍNIMA

async function getData2() {
  // Declaramos la variable fuera del try para poder utilizarla en finally.
  let inicio = null;
  try {
    // Leemos la magnitud introducida en el HTML.
    // El valor de un input se recibe inicialmente como texto.
    const magnitud = document.getElementById("magnitud").value;
    const magnitudMax = document.getElementById("magnitud-max").value;
    // Leemos la fecha inicial.
    const fechaInicio = document.getElementById("fecha-inicio").value;
    // Leemos la fecha final.
    const fechaFin = document.getElementById("fecha-fin").value;
    // Comprobamos que el usuario haya rellenado todos los campos.
    if (
      magnitud === "" ||
      magnitudMax === "" ||
      fechaInicio === "" ||
      fechaFin === ""
    ) {
      alert("Rellena las dos magnitudes y las dos fechas.");
      return;
    }
    // Comprobamos que ambas magnitudes sean números válidos.
    if (
      !Number.isFinite(Number(magnitud)) ||
      !Number.isFinite(Number(magnitudMax)) ||
      Number(magnitud) < -2 ||
      Number(magnitudMax) < -2
    ) {
      alert("Introduce magnitudes válidas.");
      return;
    }
    // Comprobamos que la magnitud maxima no es menor que la minima
    if (Number(magnitudMax) < Number(magnitud)) {
      alert("La magnitud máxima no puede ser inferior a la mínima.");
      return;
    }

    // Comprobamos que la fecha inicial no sea posterior a la final.
    // Las fechas en formato YYYY-MM-DD se pueden comparar como texto.
    if (fechaInicio > fechaFin) {
      alert("La fecha inicial no puede ser posterior a la fecha final.");
      return;
    }
    // Comprobamos que ninguna fecha sea posterior a la actual.
    if (fechaInicio > fechaActual || fechaFin > fechaActual) {
      alert("No puedes seleccionar fechas futuras.");
      return;
    }

    // Construimos la URL de la API utilizando los valores del usuario.
    // starttime establece la fecha inicial.
    // endtime establece la fecha final.
    // minmagnitude establece la magnitud mínima.
    // maxmagnitude establece la magnitud maxima.
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${fechaInicio}&endtime=${fechaFin}&minmagnitude=${magnitud}&maxmagnitude=${magnitudMax}`;
    // Guardamos el momento en el que comienza la petición.
    inicio = Date.now();
    // Mostramos el spinner mientras se buscan los terremotos.
    document.getElementById("spinner").hidden = false;
    // Enviamos la petición a la API y esperamos la respuesta.
    const res = await fetch(url);

    // Si la respuesta HTTP indica un error, lo comunicamos.
    if (!res.ok) {
      throw new Error("Error al obtener los terremotos del mapa 2");
    }

    // Convertimos la respuesta a JSON.
    const data = await res.json();

    // Devolvemos los terremotos que cumplen los filtros.
    return data;
  } catch (error) {
    // Mostramos los errores en la consola del navegador.
    console.error("Error en getData2:", error);

    alert("No se pudieron obtener los terremotos filtrados.");
  } finally {
    // Comprobamos si hemos iniciado la petición y mostrado el spinner.
    if (inicio !== null) {
      // Calculamos cuánto tiempo ha transcurrido desde que mostramos el spinner.
      const tiempoTranscurrido = Date.now() - inicio;

      // Calculamos cuánto tiempo falta para completar los 3 segundos.
      // Math.max evita que el resultado sea negativo.
      const tiempoRestante = Math.max(0, 3000 - tiempoTranscurrido);

      // Esperamos únicamente el tiempo que falta para completar los 3 segundos.
      await new Promise((resolve) => setTimeout(resolve, tiempoRestante));

      // Ocultamos el spinner cuando termina la espera.
      document.getElementById("spinner").hidden = true;
    }
  }
}
//  FUNCIÓN PARA ELEGIR EL COLOR SEGÚN LA MAGNITUD

function getColor(mag) {
  // Si la magnitud no es un número válido, utilizamos gris.
  if (typeof mag !== "number" || !Number.isFinite(mag)) {
    return "gray";
  }

  // Las condiciones se evalúan de arriba abajo.
  // Se devuelve el primer color cuya condición se cumple.
  if (mag < 1) {
    return "green";
  } else if (mag < 2) {
    return "rgb(18, 67, 9)";
  } else if (mag < 3) {
    return "yellow";
  } else if (mag < 4) {
    return "rgb(139, 129, 21)";
  } else if (mag < 5) {
    return "orange";
  } else if (mag < 6) {
    return "red";
  } else if (mag < 7) {
    return "purple";
  } else {
    // Color para magnitudes de 7 o superiores.
    return "black";
  }
}

//  FUNCIÓN PARA PINTAR LOS TERREMOTOS EN UN MAPA

// Recibe dos argumentos:
// data: los datos GeoJSON de la API.
// mapa: el mapa Leaflet donde queremos dibujar los círculos.
// FUNCIÓN PARA PINTAR LOS TERREMOTOS EN UN MAPA

function paintData(data, mapa) {
  // Comprobamos que existan datos y una lista de terremotos.
  if (!data || !Array.isArray(data.features)) {
    console.error("Los datos recibidos no tienen el formato esperado.");
    return;
  }
  // Recorremos cada terremoto que devuelve la API.
  data.features.forEach((pin) => {
    // Obtenemos el título del terremoto.
    const title = pin.properties.title;
    // Obtenemos la magnitud.
    const mag = pin.properties.mag;
    // Obtenemos la ubicación descriptiva.
    const place = pin.properties.place;
    // GeoJSON almacena las coordenadas en orden longitud, latitud.
    // Leaflet necesita el orden latitud, longitud.
    const coordinates = [
      pin.geometry.coordinates[1],
      pin.geometry.coordinates[0],
    ];
    // Elegimos el color correspondiente a la magnitud.
    const color = getColor(mag);
    // Creamos el contenedor principal de la ventana emergente.
    const popupContent = document.createElement("div");
    // Creamos el título del terremoto.
    const titleElement = document.createElement("strong");
    // Introducimos el título como texto, evitando interpretar HTML.
    titleElement.textContent = title ?? "Terremoto sin título";
    // Añadimos el título al contenedor.
    popupContent.append(titleElement);
    // Creamos un salto de línea.
    popupContent.append(document.createElement("br"));

    // Añadimos la magnitud.
    popupContent.append(
      document.createTextNode(`Magnitud: ${mag ?? "No disponible"} Mw`),
    );

    // Añadimos otro salto de línea.
    popupContent.append(document.createElement("br"));

    // Añadimos las coordenadas.
    popupContent.append(
      document.createTextNode(`Coordenadas: ${coordinates.join(", ")}`),
    );

    // Añadimos otro salto de línea.
    popupContent.append(document.createElement("br"));

    // Añadimos el lugar del terremoto.
    popupContent.append(
      document.createTextNode(`Lugar: ${place ?? "No disponible"}`),
    );
    // Creamos un círculo en las coordenadas del terremoto.
    L.circle(coordinates, {
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
      radius: 50000,
    })
      // Añadimos la ventana emergente con el contenido creado.
      .bindPopup(popupContent)
      // Añadimos el círculo al mapa recibido como argumento.
      // Puede ser map o map2.
      .addTo(mapa);
  });
}

//  CARGA INICIAL DEL MAPA 1

// Obtenemos los terremotos de las últimas 24 horas.
// Cuando llegan los datos, los pintamos en el mapa 1.
getData().then((data) => {
  if (data) {
    paintData(data, mapa1.mapa);
  }
});
//  EVENTO DEL BOTÓN PARA FILTRAR EL MAPA 2

// Buscamos el botón con id="submit" en el HTML.
// Cuando el usuario hace clic, ejecutamos esta función.
document.getElementById("submit").addEventListener("click", async () => {
  // Obtenemos los datos utilizando las fechas y la magnitud introducidas.
  const data = await getData2();
  // Si la validación falla o la petición no devuelve datos, paramos.
  if (!data) return;

  // Recorremos las capas que existen en el mapa 2.
  mapa2.mapa.eachLayer((layer) => {
    // Eliminamos únicamente los círculos de terremotos.
    // No eliminamos las capas base de los mapas.
    if (layer instanceof L.Circle) {
      mapa2.mapa.removeLayer(layer);
    }
  });

  // Pintamos los nuevos terremotos en el mapa 2.
  // El mapa 1 no se modifica.
  paintData(data, mapa2.mapa);
});
