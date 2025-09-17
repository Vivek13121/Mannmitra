import { HfInference } from "npm:@huggingface/inference@2.6.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const hf = new HfInference(Deno.env.get("HUGGINGFACE_API_KEY"));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.formData();
    const audioBlob = data.get("audio") as Blob;

    if (!audioBlob) {
      return new Response(
        JSON.stringify({ error: "No audio file provided" }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const result = await hf.audioClassification({
      model: "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition",
      data: await audioBlob.arrayBuffer(),
    });

    // Get the emotion with highest confidence
    const topEmotion = result.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );

    return new Response(
      JSON.stringify({
        emotion: topEmotion.label,
        confidence: topEmotion.score,
        allEmotions: result
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});