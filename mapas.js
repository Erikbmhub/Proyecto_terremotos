// 1. CLASE PADRE: MAPA
// Contiene las propiedades y los métodos comunes a todos
// los mapas, como la creación del mapa, la capa base
// OpenStreetMap y el cambio de capa según el nivel de zoom.
class Mapa {
  constructor(id) {
    this.mapa = L.map(id).setView(
      [40.450635, -3.692415],
      13
    );

    // Primera capa: OpenStreetMap
    this.capaBase = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    ).addTo(this.mapa);

    // La segunda capa se definirá en cada clase hija
    this.capaSecundaria = null;
  }

  cambiarCapa() {
    const zoom = this.mapa.getZoom();

    if (zoom <= 10) {
      // Al alejarse, mostramos la segunda capa
      if (this.mapa.hasLayer(this.capaBase)) {
        this.mapa.removeLayer(this.capaBase);
      }

      if (!this.mapa.hasLayer(this.capaSecundaria)) {
        this.capaSecundaria.addTo(this.mapa);
      }
    } else {
      // Al acercarse, mostramos la primera capa
      if (this.mapa.hasLayer(this.capaSecundaria)) {
        this.mapa.removeLayer(this.capaSecundaria);
      }

      if (!this.mapa.hasLayer(this.capaBase)) {
        this.capaBase.addTo(this.mapa);
      }
    }
  }
}
// 2. CLASE HIJA: MAPA NATGEO
// Hereda de la clase Mapa y configura Esri NatGeo World Map
// como segunda capa, que se muestra al alejar el zoom.
class MapaNatGeo extends Mapa {
  constructor(id) {
    super(id);

    // Segunda capa: Esri NatGeo World Map
    this.capaSecundaria = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles © Esri — National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
        maxZoom: 16
      }
    );

    // Escuchamos los cambios de zoom
    this.mapa.on("zoomend", () => this.cambiarCapa());
  }
}
// 3. CLASE HIJA: MAPA TOPOGRÁFICO
// Hereda de la clase Mapa y configura OpenTopoMap
// como segunda capa, que se muestra al alejar el zoom.
class MapaTopografico extends Mapa {
  constructor(id) {
    super(id);

    // Segunda capa: OpenTopoMap
    this.capaSecundaria = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 17,
        attribution:
          "Map data: © OpenStreetMap contributors | Map style: © OpenTopoMap"
      }
    );

    // Escuchamos los cambios de zoom
    this.mapa.on("zoomend", () => this.cambiarCapa());
  }
}
export { Mapa, MapaNatGeo, MapaTopografico };