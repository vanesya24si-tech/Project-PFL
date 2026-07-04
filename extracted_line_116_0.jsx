import fs from 'fs';
import readline from 'readline';

async function run() {
  const fileStream = fs.createReadStream('C:/Users/Asus/.gemini/antigravity/brain/f17200ce-67cd-4ebd-acb3-fd8e00bf96d9/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  
  let count = 0;
  for await (const line of rl) {
    count++;
    if (line.includes('LandingPage.jsx') && line.includes('replace_file_content')) {
      console.log(`Line: ${count}, replace_file_content`);
    }
    if (line.includes('LandingPage.jsx') && line.includes('multi_replace_file_content')) {
      console.log(`Line: ${count}, multi_replace_file_content`);
    }
    if (line.includes('LandingPage.jsx') && line.includes('write_to_file')) {
      console.log(`Line: ${count}, write_to_file`);
    }
  }
}
run();
