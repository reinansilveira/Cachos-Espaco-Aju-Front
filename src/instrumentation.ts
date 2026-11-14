// A Vercel roda em UTC e o navegador da dona em Aracaju: sem isso, horários e
// a saudação renderizados no servidor não batem com os do navegador (erro de
// hidratação #418). Roda uma vez ao subir o servidor.
export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    process.env.TZ = "America/Maceio";
  }
}
