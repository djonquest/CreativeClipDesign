import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { canUseCredits, shouldConsumeCredits } from "@/lib/credits";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, userId, clientId } = body;

    // 🔍 1. Buscar usuário
    let { data: user, error: userError } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .maybeSingle();

if (!user) {
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);

  const { data: newUser, error: createProfileError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email: authUser?.user?.email || null,
      role: "user",
      plan: "starter",
      credits: 10,
    })
    .select("*")
    .single();

  if (createProfileError || !newUser) {
    console.error("Erro ao criar profile:", createProfileError);

    return NextResponse.json(
      { error: "Não foi possível criar perfil do usuário" },
      { status: 500 }
    );
  }

  user = newUser;
}

    // 💰 2. Validar créditos
    if (!canUseCredits(user)) {
      return NextResponse.json({ error: "Sem créditos" }, { status: 403 });
    }

    // 👤 3. Buscar cliente
let client = null;

if (clientId) {
  const { data } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();

  client = data;
}

    // 📏 4. Buscar medidas
    const { data: measurements } = await supabase
      .from("measurements")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // 🧠 5. Melhorar prompt com contexto real
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Você é um estilista profissional que cria descrições detalhadas de roupas para IA de imagem.",
          },
          {
            role: "user",
            content: `
Cliente: ${client?.name || "não informado"}

Medidas:
${measurements ? JSON.stringify(measurements, null, 2) : "não informadas"}

Pedido:
${prompt}

Crie uma descrição de roupa extremamente detalhada, profissional e realista considerando o caimento baseado nas medidas.
`,
          },
        ],
      }),
    });

    const aiData = await aiRes.json();
    const finalPrompt = aiData?.choices?.[0]?.message?.content;

    if (!finalPrompt) {
      return NextResponse.json({ error: "Erro ao gerar prompt" }, { status: 500 });
    }

    // 🎨 6. Gerar imagem com Replicate
    const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "stability-ai/sdxl",
        input: {
          prompt: finalPrompt,
        },
      }),
    });

    let prediction = await replicateRes.json();

    // ⏳ aguarda finalizar
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise((r) => setTimeout(r, 2000));

      const check = await fetch(prediction.urls.get, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      prediction = await check.json();
    }

    const imageUrl = prediction.output?.[0] || null;

    // 🚨 valida imagem
    if (!imageUrl) {
      console.error("Erro Replicate:", prediction);

      return NextResponse.json(
        { error: "Falha ao gerar imagem" },
        { status: 500 }
      );
    }

    // 💾 7. Salvar design
    await supabase.from("designs").insert({
      user_id: userId,
      client_id: clientId,
      prompt: finalPrompt,
      image_url: imageUrl,
    });

    // 💳 8. Consumir crédito (se não admin)
    if (shouldConsumeCredits(user)) {
      await supabase
        .from("profiles")
        .update({ credits: user.credits - 1 })
        .eq("id", userId);
    }

    // ✅ 9. Retorno
    return NextResponse.json({
      success: true,
      prompt: finalPrompt,
      image: imageUrl,
    });

  } catch (err) {
    console.error("Erro geral:", err);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}