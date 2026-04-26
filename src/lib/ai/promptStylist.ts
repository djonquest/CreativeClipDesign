export function buildStylistPrompt(input: {
  description: string;
  measurements?: any;
  style?: string;
  clientName?: string;
}) {
  return `
Você é um estilista profissional.

Cliente: ${input.clientName || "não informado"}

Descrição:
${input.description}

${input.style ? `Estilo: ${input.style}` : ""}

${
  input.measurements
    ? `Medidas:
${JSON.stringify(input.measurements, null, 2)}`
    : ""
}

Crie uma descrição detalhada da peça incluindo:
- tipo
- tecido
- caimento
- acabamento
- cores
`;
}