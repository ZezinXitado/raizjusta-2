// Camadas de mapa (raster) compatíveis com Leaflet.
//
// 1) Com a variável VITE_MAPTILER_KEY definida no .env → MapTiler.
//    Plano gratuito, uso permitido em aplicações públicas, chave pública
//    (vai no bundle do frontend, nunca use chave secreta aqui).
// 2) Sem chave → Esri World Street Map, que não exige cadastro e é servida
//    com a atribuição obrigatória abaixo.
//
// Nenhuma das duas exige chave secreta nem backend.
const chaveMaptiler = import.meta.env.VITE_MAPTILER_KEY;

export const CAMADA_MAPA = chaveMaptiler
  ? {
      id: "maptiler",
      url: `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${chaveMaptiler}`,
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    }
  : {
      id: "esri",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      maxZoom: 19,
      attribution:
        'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a> — Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
    };