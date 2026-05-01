"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/getCurrentUser";

type Client = {
  id: string;
  name?: string;
};

type Profile = {
  credits?: number;
  plan?: string;
};

type StepStatus = "pending" | "active" | "done" | "error";

type GenerationStep = {
  label: string;
  status: StepStatus;
};

function toArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? data.filter(Boolean) : [];
}

const GENERATION_COST = 1;

const initialSteps: GenerationStep[] = [
  { label: "Analisando pedido", status: "pending" },
  { label: "Lendo medidas do cliente", status: "pending" },
  { label: "Preparando referência enviada", status: "pending" },
  { label: "Criando prompt profissional", status: "pending" },
  { label: "Gerando imagem", status: "pending" },
  { label: "Salvando histórico", status: "pending" },
];

export default function GerarPage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);

  const [userId, setUserId] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  const [steps, setSteps] = useState<GenerationStep[]>(initialSteps);
  const [sessionSpent, setSessionSpent] = useState(0);

  useEffect(() => {
    async function init() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          window.location.href = "/site";
          return;
        }

        setUserId(user.id);

        const [clientsRes, profileRes] = await Promise.all([
          fetch(`/api/clientes?userId=${user.id}`),
          fetch(`/api/profile?userId=${user.id}`),
        ]);

        const clientsData = await clientsRes.json();
        const profileData = await profileRes.json();

        setClients(toArray<Client>(clientsData));
        setProfile(profileData || null);
      } catch (err) {
        console.error("Erro ao carregar gerador:", err);
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    }

    init();
  }, []);

  function updateStep(index: number, status: StepStatus) {
    setSteps((current) =>
      current.map((step, i) => (i === index ? { ...step, status } : step))
    );
  }

  function resetSteps() {
    setSteps(initialSteps);
  }

  function handleReferenceUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Envie uma imagem PNG ou JPG.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setReferencePreview(typeof reader.result === "string" ? reader.result : null);
    };

    reader.readAsDataURL(file);
  }

  async function refreshProfile(currentUserId = userId) {
    if (!currentUserId) return;

    try {
      const res = await fetch(`/api/profile?userId=${currentUserId}`);
      const data = await res.json();
      setProfile(data || null);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
    }
  }

  async function handleGenerate() {
    if (!prompt.trim()) {
      alert("Digite uma descrição.");
      return;
    }

    if (!userId) return;

    setLoading(true);
    setImage(null);
    resetSteps();

    try {
      updateStep(0, "active");
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateStep(0, "done");

      updateStep(1, "active");
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateStep(1, "done");

      updateStep(2, "active");
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateStep(2, referencePreview ? "done" : "done");

      updateStep(3, "active");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          userId,
          clientId: clientId || null,
          referenceImage: referencePreview,
        }),
      });

      updateStep(3, "done");
      updateStep(4, "active");

      const data = await res.json();

      if (data?.error) {
        updateStep(4, "error");
        alert(data.error);
        return;
      }

      const generatedImage = typeof data?.image === "string" ? data.image : null;

      if (!generatedImage) {
        updateStep(4, "error");
        alert("A imagem não foi retornada pela IA.");
        return;
      }

      setImage(generatedImage);
      updateStep(4, "done");

      updateStep(5, "active");
      await refreshProfile(userId);
      setSessionSpent((value) => value + GENERATION_COST);
      updateStep(5, "done");
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      setSteps((current) =>
        current.map((step) =>
          step.status === "active" ? { ...step, status: "error" } : step
        )
      );
      alert("Erro ao gerar imagem");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setClientId("");
    setPrompt("");
    setImage(null);
    setReferencePreview(null);
    resetSteps();
    window.history.back();
  }

  function handleDownload() {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = "creativeclip-design.png";
    link.target = "_blank";
    link.click();
  }

  return (
    <AppShell title="Gerar roupa com IA">
      <div className="grid gap-6 xl:grid-cols-[420px_1fr_320px]">
        <section className="cc-card rounded-3xl p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-300">
              CreativeClip Studio
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">Novo conceito</h2>
            <p className="mt-2 text-sm text-slate-400">
              Descreva a peça, escolha uma cliente e envie um desenho próprio se tiver.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Saldo</p>
              <p className="mt-1 text-xl font-black text-green-400">
                {profile?.credits ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Custo</p>
              <p className="mt-1 text-xl font-black text-white">
                {GENERATION_COST}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs text-slate-400">Sessão</p>
              <p className="mt-1 text-xl font-black text-pink-300">
                {sessionSpent}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <select
              className="cc-input px-4 py-3"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">
                {loadingClients ? "Carregando clientes..." : "Sem cliente (geral)"}
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name || "Cliente sem nome"}
                </option>
              ))}
            </select>

            <textarea
              className="cc-input min-h-40 px-4 py-3"
              placeholder="Ex: vestido de festa tam G, elegante, tecido leve, caimento fluido..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-4">
              <p className="text-sm font-bold text-white">
                Desenho próprio / mão livre
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Envie um rascunho ou referência visual para orientar a criação.
              </p>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleReferenceUpload}
                className="mt-4 block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:font-bold file:text-slate-950"
              />

              {referencePreview && (
                <img
                  src={referencePreview}
                  alt="Referência enviada"
                  className="mt-4 h-40 w-full rounded-2xl object-cover"
                />
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCancel}
                className="cc-button-secondary w-full px-4 py-3"
              >
                Cancelar
              </button>

              <button
                onClick={handleGenerate}
                disabled={loading || !userId}
                className="cc-button-primary w-full px-4 py-3"
              >
                {loading ? "Gerando..." : "Gerar com IA"}
              </button>
            </div>
          </div>
        </section>

        <section className="cc-card flex min-h-[620px] items-center justify-center rounded-3xl p-5">
          {image ? (
            <div className="w-full">
              <img
                src={image}
                alt="Resultado gerado"
                className="max-h-[720px] w-full rounded-3xl object-cover shadow-2xl shadow-black/40"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleDownload}
                  className="cc-button-primary w-full px-4 py-3"
                >
                  Baixar imagem
                </button>

                <button
                  onClick={() => window.print()}
                  className="cc-button-secondary w-full px-4 py-3"
                >
                  Imprimir ficha
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-purple-500/30 to-pink-500/20 text-5xl">
                👗
              </div>

              <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-pink-300">
                Preview
              </p>

              <p className="mt-3 text-slate-400">
                A imagem gerada pela IA aparecerá aqui em tempo real.
              </p>
            </div>
          )}
        </section>

        <aside className="cc-card rounded-3xl p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-300">
            Processo
          </p>

          <h3 className="mt-2 text-2xl font-black text-white">
            Leitura da criação
          </h3>

          <div className="mt-6 space-y-3">
            {steps.map((step) => (
              <div
                key={step.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-4"
              >
                <span className="text-sm text-slate-300">{step.label}</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    step.status === "done"
                      ? "bg-green-500/20 text-green-300"
                      : step.status === "active"
                      ? "bg-purple-500/20 text-purple-300"
                      : step.status === "error"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {step.status === "done"
                    ? "ok"
                    : step.status === "active"
                    ? "lendo"
                    : step.status === "error"
                    ? "erro"
                    : "aguarda"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-sm font-bold text-white">Observação</p>
            <p className="mt-2 text-sm text-slate-400">
              A análise real do desenho enviado será conectada ao módulo de visão da IA em uma próxima etapa. Por enquanto, ele fica como referência visual.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}