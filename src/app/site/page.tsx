import Link from "next/link";

export default function SitePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 py-20 text-center bg-gradient-to-br from-purple-50 to-pink-50">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          CreativeClip
        </h1>

        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-700">
          O SaaS premium para estilistas, costureiras e ateliês criarem peças com IA,
          controlarem clientes, medidas, pedidos e entregas em um só lugar.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/cadastro"
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Começar agora
          </Link>

          <Link
            href="/login"
            className="border px-6 py-3 rounded-lg font-semibold"
          >
            Entrar
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Tudo que seu ateliê precisa
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Clientes organizados</h3>
            <p className="text-gray-600">
              Cadastre clientes, acompanhe histórico, pedidos, medidas e preferências.
            </p>
          </div>

          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Medidas sempre salvas</h3>
            <p className="text-gray-600">
              Guarde medidas por cliente e use automaticamente na geração com IA.
            </p>
          </div>

          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Designs com IA</h3>
            <p className="text-gray-600">
              Gere ideias de peças, salve versões e reutilize designs no futuro.
            </p>
          </div>

          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Controle de pedidos</h3>
            <p className="text-gray-600">
              Substitua o caderninho com prazo de entrega, status e valor do pedido.
            </p>
          </div>

          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Histórico visual</h3>
            <p className="text-gray-600">
              Tenha uma galeria com todos os designs criados para cada cliente.
            </p>
          </div>

          <div className="border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">Créditos flexíveis</h3>
            <p className="text-gray-600">
              Use créditos por geração e compre pacotes avulsos quando precisar.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-black text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Menos papel. Mais criação. Mais vendas.
        </h2>

        <p className="max-w-2xl mx-auto mb-8 text-gray-300">
          O CreativeClip ajuda costureiras e estilistas a profissionalizarem o atendimento,
          impressionarem clientes e organizarem o processo de produção.
        </p>

        <Link
          href="/cadastro"
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
        >
          Criar minha conta
        </Link>
      </section>
    </main>
  );
}