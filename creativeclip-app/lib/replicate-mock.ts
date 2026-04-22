import { createId } from "@/lib/utils";
import type { GenerationInput, GenerationResult } from "@/types";

const showcaseImages = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
];

function pickShowcaseImage(prompt: string): string {
  const index = Math.abs(prompt.length) % showcaseImages.length;
  return showcaseImages[index];
}

export async function generateMockFashionImage(
  input: GenerationInput,
): Promise<GenerationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return {
    id: createId("gen"),
    imageUrl: pickShowcaseImage(input.prompt),
    prompt: input.prompt,
    model: "replicate-mock/sdxl-fashion-preview",
    createdAt: new Date().toISOString(),
  };
}
