import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY

    const genAI = new GoogleGenerativeAI(apiKey);

    // 1. Fetch available artworks from ArtHall catalog
    const backendUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
    let catalog = [];
    try {
      const res = await fetch(`${backendUrl}/api/arts`, {
        cache: "no-store",
      });
      if (res.ok) {
        catalog = await res.json();
      }
    } catch (err) {
      console.error("Error fetching art catalog for AI curator:", err);
    }

    // Prepare catalog summary for Gemini
    const catalogSummary = (Array.isArray(catalog) ? catalog : []).map((art) => ({
      id: art._id ? art._id.toString() : (art.id || ""),
      title: art.title || "Untitled",
      category: art.category || "General",
      price: art.price || 0,
      artist: art.artistName || art.artist || "ArtHall Artist",
      rating: art.rating || 5.0,
      reviewsCount: art.reviewsCount || 0,
      dimensions: art.dimensions || "N/A",
      description: art.description || "",
      image: art.image || art.imageUrl || "",
    }));

    // Construct system instructions
    const systemPrompt = `You are the expert, sophisticated, and friendly AI Art Curator at "ArtHall" (A luxury Art Gallery & Marketplace).
Your role: Provide tailored art recommendations and advice to art enthusiasts, collectors, interior designers, and buyers.

Here is ArtHall's current live art catalog:
${JSON.stringify(catalogSummary, null, 2)}

Guidelines:
1. Understand the user's intent: room type (living room, bedroom, office), color scheme, budget, art category (sculpture, painting, photography, digital art), or artist.
2. Select and recommend 1 to 4 best-matched artworks from the catalog above. Provide a compelling explanation for why each artwork fits their criteria.
3. Respond warmly in the language used by the user (Bengali if they write in Bengali/Banglish, or English if they write in English).
4. At the very end of your response, ALWAYS include a JSON block with recommended artwork IDs like this:
\`\`\`recommendations
["<artwork_id_1>", "<artwork_id_2>"]
\`\`\`
If no specific art from the catalog is directly suitable, return \`\`\`recommendations [] \`\`\`.
`;

    // Try models in order of availability
    const modelCandidates = [
      "gemini-3.6-flash",
      "gemini-3.7-flash",
      "gemini-flash-latest",
      "gemini-2.5-flash-lite",
      "gemini-pro-latest",
    ];

    let aiText = "";
    let lastError = null;

    // Build chat context
    const conversationPrompt = [
      systemPrompt,
      ...history.map((h) => `${h.role === "user" ? "User" : "Curator"}: ${h.content}`),
      `User: ${message}`,
      `Curator:`,
    ].join("\n\n");

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(conversationPrompt);
        aiText = result.response.text();
        if (aiText) break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate:`, err.message);
      }
    }

    if (!aiText) {
      throw lastError || new Error("Failed to generate AI response");
    }

    // Extract recommendations JSON block if present
    let recommendedIds = [];
    const recRegex = /```recommendations\s*([\s\S]*?)\s*```/i;
    const match = aiText.match(recRegex);

    if (match && match[1]) {
      try {
        recommendedIds = JSON.parse(match[1].trim());
      } catch (e) {
        console.warn("Failed to parse recommendations JSON block:", e);
      }
    }

    // Clean text by stripping out the recommendations block for user UI display
    const cleanedText = aiText.replace(recRegex, "").trim();

    // Find recommended artwork objects from catalog
    const recommendedArts = (Array.isArray(catalog) ? catalog : [])
      .filter((art) => {
        const id = art._id ? art._id.toString() : art.id;
        return recommendedIds.includes(id);
      })
      .slice(0, 4);

    return Response.json({
      reply: cleanedText,
      recommendedArts,
      success: true,
    });
  } catch (error) {
    console.error("AI Curator API Error:", error);
    return Response.json(
      {
        error: "AI Curator is temporarily busy. Please try again shortly.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
