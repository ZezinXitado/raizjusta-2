// Coordenadas aproximadas (centro da cidade) para o mapa demonstrativo.
// NÃO são endereços reais de propriedades: servem apenas para ilustrar
// a distribuição regional dos produtores fictícios do RaizJusta.
export const COORDENADAS_CIDADES = {
  "Araguatins|TO": [-5.65, -48.12],
  "Crateús|CE": [-5.18, -40.68],
  "Ilhéus|BA": [-14.79, -39.05],
  "Petrolina|PE": [-9.39, -40.5],
  "São João del-Rei|MG": [-21.14, -44.26],
  "Tomé-Açu|PA": [-2.42, -48.15],
  "Sorriso|MT": [-12.55, -55.71],
  "Itapecuru-Mirim|MA": [-3.39, -44.36],
  "Pirenópolis|GO": [-15.85, -48.96],
};

export function coordenadaDoProdutor(produtor) {
  if (!produtor) return null;
  return COORDENADAS_CIDADES[`${produtor.city}|${produtor.state}`] || null;
}