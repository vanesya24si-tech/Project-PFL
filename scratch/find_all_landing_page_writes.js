import fs from 'fs';
import readline from 'readline';

async function run() {
  const fileStream = fs.createReadStream('C:/Users/Asus/.gemini/antigravity/brain/f17200ce-67cd-4ebd-acb3-fd8e00bf96d9/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  
  let count = 0;
  for await (const line of rl) {
    count++;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        obj.tool_calls.forEach((tc, idx) => {
          const target = tc.args && tc.args.TargetFile;
          if (target && target.includes('LandingPage.jsx')) {
            console.log(`Line: ${count}, Step: ${obj.step_index}, Tool: ${tc.name}, Overwrite: ${tc.args.Overwrite || 'false'}, CodeContent: ${tc.args.CodeContent ? tc.args.CodeContent.length : 'none'}, Chunks: ${tc.args.ReplacementChunks ? tc.args.ReplacementChunks.length : 'none'}`);
          }
        });
      }
    } catch (e) {
      // ignore
    }
  }
}
run();
