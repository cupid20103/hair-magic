import { REPLICATE_API_TOKEN } from "@/config/env";

export async function POST(req: Request) {
  try {
    const { input_image, prompt } = await req.json();

    const payload = {
      version:
        "ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
      input: {
        prompt: `A photo of a current person img with ${prompt} hair style`,
        input_image: input_image,
      },
    };

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        Prefer: "wait",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const prediction = await response.json();
    const predictionID = prediction.id;

    const MAX_ATTEMPTS = 10;
    let attempts = 0;
    let result;

    while (attempts < MAX_ATTEMPTS) {
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionID}`,
        {
          headers: {
            Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
          },
        }
      );

      result = await statusResponse.json();

      if (result.status === "succeeded" || result.status === "failed") {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      attempts++;
    }

    if (result?.output?.[0]) {
      return new Response(JSON.stringify({ result: result.output[0] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to process image" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch {
    return new Response(JSON.stringify({ error: "Failed to process image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
