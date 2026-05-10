import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
if (match) {
  const key = match[1].trim().replace(/^"|"$/g, '');
  fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
    .then(res => res.json())
    .then(data => {
      console.log(data.models.filter(m => m.name.includes('gemini')).map(m => m.name));
    })
    .catch(err => console.error(err));
} else {
  console.log("No key found");
}
