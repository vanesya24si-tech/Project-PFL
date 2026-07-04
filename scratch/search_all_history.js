import fs from 'fs';
import readline from 'readline';

async function run() {
  const fileStream = fs.createReadStream('C:/Users/Asus/.gemini/antigravity/brain/f17200ce-67cd-4ebd-acb3-fd8e00bf96d9/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  
  let count = 0;
  for await (const line of rl) {
    count++;
    // Search for tool_calls in any tool
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.name === 'write_to_file' && tc.args.TargetFile && tc.args.TargetFile.includes('LandingPage.jsx')) {
            console.log(`Line ${count} (Step ${obj.step_index}): write_to_file target=${tc.args.TargetFile} length=${tc.args.CodeContent.length}`);
          }
          if (tc.name === 'replace_file_content' && tc.args.TargetFile && tc.args.TargetFile.includes('LandingPage.jsx')) {
            console.log(`Line ${count} (Step ${obj.step_index}): replace_file_content target=${tc.args.TargetFile} length=${tc.args.ReplacementContent.length}`);
          }
          if (tc.name === 'multi_replace_file_content' && tc.args.TargetFile && tc.args.TargetFile.includes('LandingPage.jsx')) {
            console.log(`Line ${count} (Step ${obj.step_index}): multi_replace_file_content target=${tc.args.TargetFile} chunks=${tc.args.ReplacementChunks.length}`);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }
}
run();
