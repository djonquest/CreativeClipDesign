import type { CreationRecord } from "@/types";

export const demoCreations: CreationRecord[] = [
  {
    id: "hist_1",
    prompt: "vestido elegante vermelho 3D em estúdio minimalista",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    sourceImageName: "base-vestido.png",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    userEmail: "demo@creativeclip.ai",
  },
  {
    id: "hist_2",
    prompt: "jaqueta futurista preta com textura holográfica",
    imageUrl:
      "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=900&q=80",
    sourceImageName: "jaqueta-base.jpg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    userEmail: "demo@creativeclip.ai",
  },
];
