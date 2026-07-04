import fs from 'fs';

const lines = fs.readFileSync('C:/Users/Asus/.gemini/antigravity/brain/f17200ce-67cd-4ebd-acb3-fd8e00bf96d9/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');

const lineNum = 116;
const line = lines[lineNum - 1];
if (line) {
  try {
    const obj = JSON.parse(line);
    console.log(`Line ${lineNum}: type=${obj.type}, status=${obj.status}`);
    if (obj.tool_calls) {
      obj.tool_calls.forEach((tc, idx) => {
        console.log(`  Tool ${idx}: ${tc.name}`);
        if (tc.args && tc.args.TargetFile) {
          console.log(`    TargetFile: ${tc.args.TargetFile}`);
          if (tc.args.CodeContent) {
            console.log(`    CodeContent length: ${tc.args.CodeContent.length}`);
            fs.writeFileSync(`extracted_line_${lineNum}_${idx}.jsx`, tc.args.CodeContent);
            console.log(`    Saved to extracted_line_${lineNum}_${idx}.jsx`);
          }
        }
      });
    }
  } catch (err) {
    console.error(`Error parsing line ${lineNum}:`, err.message);
  }
}
