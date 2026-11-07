export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-100">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
          MVP • Fase 1 Inicializada
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
          Gestor de Estaciones para Torneos (Start.gg Bridge)
        </h1>
        <p className="text-slate-400 mb-6">
          Plataforma de logística física en tiempo real: Editor de Layouts en Konva.js, asignación multi-juego,
          Check-in por código QR + PIN de 6 dígitos y sincronización mediante Leaky Bucket con Start.gg.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h2 className="font-semibold text-slate-200 mb-1">1. Editor de Layouts (Konva.js)</h2>
            <p className="text-slate-400">Diseño espacial en Canvas, colores hexadecimales e íconos sanitizados.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h2 className="font-semibold text-slate-200 mb-1">2. Check-in Desk & PINs</h2>
            <p className="text-slate-400">Switch global para PIN único por jugador o PIN individual por torneo.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h2 className="font-semibold text-slate-200 mb-1">3. Monitor en Vivo & Jueces</h2>
            <p className="text-slate-400">Control de estados, On Hold, Skip Cooldown y lectura de cierres en Start.gg.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h2 className="font-semibold text-slate-200 mb-1">4. Vista Pública & QRs PDF</h2>
            <p className="text-slate-400">Pantalla dividida para audiencia e impresión multi-QR para ahorro de hojas.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
