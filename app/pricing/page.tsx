export default function PricingPage() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Planos CreativeClip 3D-AI</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Adicione seus cards de preços aqui futuramente */}
          <div className="p-6 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Hub Designer</h2>
            <p className="mt-4 text-3xl font-bold">R$ 99/mês</p>
          </div>
        </div>
      </main>
    );
  }