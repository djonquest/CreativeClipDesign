"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { appendCreation } from "@/lib/storage";
import { createId } from "@/lib/utils";
import { generateMockFashionImage } from "@/lib/replicate-mock";
import { useAppContext } from "@/components/providers/app-provider";
import type { CreationRecord, GenerationResult } from "@/types";

const promptExample = "vestido elegante vermelho 3D com iluminação cinematográfica";

export function GenerationForm() {
  const { user, setHistory } = useAppContext();
  const [prompt, setPrompt] = useState(promptExample);
  const [fileName, setFileName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (prompt.trim().length < 12) {
      setError("Descreva melhor o visual desejado (mínimo 12 caracteres).");
      return;
    }

    setIsGenerating(true);
    try {
      const generation = await generateMockFashionImage({
        prompt: prompt.trim(),
        sourceImageName: fileName || undefined,
      });
      setResult(generation);

      const createdRecord: CreationRecord = {
        id: createId("history"),
        prompt: generation.prompt,
        imageUrl: generation.imageUrl,
        sourceImageName: fileName || "sem-upload",
        createdAt: generation.createdAt,
        userEmail: user?.email ?? "demo@creativeclip.ai",
      };

      const updated = appendCreation(createdRecord);
      setHistory(updated);
    } catch {
      setError("Falha na geração mock. Tente novamente em instantes.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">Gerar imagem com IA</h2>
          <p className="text-sm text-slate-400">
            Faça upload da base e escreva um prompt para gerar o resultado.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleGenerate}>
          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="upload-base">
              Upload da imagem base
            </label>
            <Input
              id="upload-base"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                setFileName(selected?.name ?? "");
              }}
            />
            <p className="text-xs text-slate-500">
              {fileName ? `Arquivo selecionado: ${fileName}` : "Nenhum arquivo selecionado"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300" htmlFor="prompt-field">
              Prompt criativo
            </label>
            <Textarea
              id="prompt-field"
              rows={5}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder='Ex: "vestido elegante vermelho 3D com luz de passarela"'
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <Button type="submit" isLoading={isGenerating} className="w-full">
            Gerar imagem IA
          </Button>
        </form>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Resultado</h3>
          <p className="text-sm text-slate-400">
            Prévia da geração mock do Replicate para evoluir depois para API real.
          </p>
        </div>

        {result ? (
          <div className="space-y-3">
            <Image
              src={result.imageUrl}
              alt="Resultado gerado por IA"
              width={900}
              height={900}
              className="h-72 w-full rounded-xl object-cover"
            />
            <p className="text-xs text-slate-300">{result.prompt}</p>
            <a
              href={result.imageUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-100 transition hover:bg-white/10"
            >
              Download da imagem
            </a>
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-white/15 bg-slate-900/40 text-sm text-slate-400">
            A imagem gerada aparecerá aqui.
          </div>
        )}
      </Card>
    </section>
  );
}
