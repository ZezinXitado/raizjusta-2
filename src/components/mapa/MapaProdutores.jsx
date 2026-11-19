import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import { coordenadaDoProdutor } from "@/data/coordenadasProdutores";
import { CAMADA_MAPA } from "@/lib/mapConfig";

const CENTRO_BRASIL = [-14.5, -51.5];

// Pixel transparente: se um tile falhar, nenhuma imagem de erro aparece no mapa.
const TILE_VAZIO = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// O mapa é montado antes de o contêiner ter tamanho final (grid, fontes, abas).
// Sem recalcular, o Leaflet desenha tiles fora de lugar ou um mapa branco.
function AjustarTamanho() {
  const mapa = useMap();

  useEffect(() => {
    const recalcular = () => mapa.invalidateSize();
    const inicial = setTimeout(recalcular, 120);
    window.addEventListener("resize", recalcular);
    let observador;
    if (typeof ResizeObserver !== "undefined") {
      observador = new ResizeObserver(recalcular);
      observador.observe(mapa.getContainer());
    }
    return () => {
      clearTimeout(inicial);
      window.removeEventListener("resize", recalcular);
      if (observador) observador.disconnect();
    };
  }, [mapa]);

  return null;
}

// Enquadra os marcadores visíveis quando o filtro muda (sem brigar com o zoom do usuário).
function AjustarVisao({ pontos }) {
  const mapa = useMap();
  const chave = pontos.map((p) => p.id).sort().join(",");

  useEffect(() => {
    if (!pontos.length) return;
    const limite = pontos.map((p) => p.coord);
    const t = setTimeout(() => {
      mapa.fitBounds(limite, { padding: [40, 40], maxZoom: 6 });
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, mapa]);

  return null;
}

export default function MapaProdutores({ produtores, produtosDoProdutor, selecionado, onSelecionar }) {
  const [tentativa, setTentativa] = useState(0);
  const [falha, setFalha] = useState(false);
  const erros = useRef(0);

  const pontos = produtores
    .map((produtor) => ({ ...produtor, coord: coordenadaDoProdutor(produtor) }))
    .filter((produtor) => produtor.coord);

  const aoFalharTile = () => {
    erros.current += 1;
    if (erros.current >= 6) setFalha(true);
  };

  const tentarNovamente = () => {
    erros.current = 0;
    setFalha(false);
    setTentativa((valor) => valor + 1);
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={CENTRO_BRASIL}
        zoom={4}
        minZoom={3}
        maxZoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ height: "100%", width: "100%", background: "#eef4ec" }}
      >
        <AjustarTamanho />
        <AjustarVisao pontos={pontos} />
        <TileLayer
          key={`${CAMADA_MAPA.id}-${tentativa}`}
          url={CAMADA_MAPA.url}
          attribution={CAMADA_MAPA.attribution}
          maxZoom={CAMADA_MAPA.maxZoom}
          errorTileUrl={TILE_VAZIO}
          eventHandlers={{ tileerror: aoFalharTile }}
        />

        {pontos.map((produtor) => {
          const ativo = selecionado === produtor.id;
          const produtos = produtosDoProdutor(produtor.id);
          return (
            <CircleMarker
              key={produtor.id}
              center={produtor.coord}
              radius={ativo ? 13 : 9}
              pathOptions={{
                color: "#14532d",
                weight: 2,
                fillColor: ativo ? "#f59e0b" : "#2f9e63",
                fillOpacity: 0.92,
              }}
              eventHandlers={{ click: () => onSelecionar(produtor.id) }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                {produtor.name}
              </Tooltip>
              <Popup minWidth={210}>
                <div className="text-sm">
                  <p className="font-bold text-emerald-900">{produtor.name}</p>
                  <p className="text-xs text-emerald-800/70">{produtor.role}</p>
                  <p className="mt-1 text-xs text-emerald-900/80">
                    {produtor.city}–{produtor.state} · local aproximado (exemplo)
                  </p>
                  {produtos.length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-xs text-emerald-900/80">
                      {produtos.slice(0, 3).map((produto) => (
                        <li key={produto.id}>• {produto.name}</li>
                      ))}
                      {produtos.length > 3 && <li>• +{produtos.length - 3} produtos</li>}
                    </ul>
                  )}
                  <Link
                    to={`/produtores/${produtor.id}`}
                    className="mt-2 inline-block text-xs font-semibold text-emerald-700 underline"
                  >
                    Abrir perfil do produtor →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {falha && (
        <div className="absolute inset-0 z-[900] flex flex-col items-center justify-center gap-2 bg-emerald-50/95 px-6 text-center">
          <p className="text-2xl">🗺️</p>
          <p className="font-semibold text-emerald-950">Não foi possível carregar o mapa agora</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            O serviço de mapas não respondeu. A lista de produtores ao lado continua funcionando e você
            pode abrir qualquer perfil.
          </p>
          <button
            type="button"
            onClick={tentarNovamente}
            className="mt-1 px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
}