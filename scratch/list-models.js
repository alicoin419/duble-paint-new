
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API Key");
  process.exit(1);
}

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const resp = await fetch(url);
  const data = await resp.json();
  console.log(JSON.stringify(data, null, 2));
}

listModels();
