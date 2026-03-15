const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/data/questions.ts');
const content = fs.readFileSync(filePath, 'utf8');

const subjects = new Set();
// Match both single and double quotes
const subjectMatches = content.matchAll(/subject:\s*['"](.*?)['"]/g);
for (const match of subjectMatches) {
    subjects.add(match[1]);
}

console.log(JSON.stringify(Array.from(subjects).sort(), null, 2));
