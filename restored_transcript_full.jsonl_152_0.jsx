import fs from 'fs';
import path from 'path';
import readline from 'readline';

async function scanFile(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  
  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (line.includes('LandingPage.jsx') && line.includes('CodeContent') && line.includes('Overwrite') && line.includes('activityData')) {
      console.log(`FOUND CodeContent in file: ${filePath} at line: ${lineNum}`);
      // parse it
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          obj.tool_calls.forEach((tc, idx) => {
            if (tc.name === 'write_to_file' && tc.args.CodeContent && tc.args.CodeContent.includes('activityData')) {
              console.log(`  Writing output to restored_${path.basename(filePath)}_${lineNum}_${idx}.jsx`);
              fs.writeFileSync(`restored_${path.basename(filePath)}_${lineNum}_${idx}.jsx`, tc.args.CodeContent);
            }
          });
        }
      } catch (err) {
        console.error('Error parsing:', err);
      }
    }
  }
}

async function run() {
  const brainDir = 'C:/Users/Asus/.gemini/antigravity/brain';
  const folders = fs.readdirSync(brainDir);
  for (const folder of folders) {
    const logsDir = path.join(brainDir, folder, '.system_generated', 'logs');
    if (fs.existsSync(logsDir)) {
      const files = fs.readdirSync(logsDir);
      for (const file of files) {
        if (file.endsWith('.jsonl')) {
          await scanFile(path.join(logsDir, file));
        }
      }
    }
  }
  console.log('Scan completed!');
}

run();
