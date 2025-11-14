const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlContent = fs.readFileSync('current-plan.html', 'utf8');

// Extract content between script tags that might contain the plan
const scriptMatches = htmlContent.match(/<script[^>]*>(.*?)<\/script>/gs);
const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);

console.log('Title:', titleMatch ? titleMatch[1] : 'Not found');

// Look for JSON-like content that might contain the plan
const jsonMatches = htmlContent.match(/\{[^{}]*".*implementation.*"[^{}]*\}/gi);
if (jsonMatches) {
    console.log('\nFound potential plan content:');
    jsonMatches.forEach((match, i) => {
        console.log(`\nMatch ${i + 1}:`);
        console.log(match.substring(0, 200) + '...');
    });
}

// Extract meta description which might have summary
const metaDesc = htmlContent.match(/<meta name="description" content="([^"]*)">/);
if (metaDesc) {
    console.log('\nDescription:', metaDesc[1]);
}

// Look for any readable text content (removing HTML tags)
const textContent = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const planKeywords = ['Week 1', 'Week 2', 'implementation', 'Firestore', 'Node.js', 'Cloud Run'];
const relevantSections = [];

planKeywords.forEach(keyword => {
    const index = textContent.toLowerCase().indexOf(keyword.toLowerCase());
    if (index !== -1) {
        const start = Math.max(0, index - 100);
        const end = Math.min(textContent.length, index + 300);
        relevantSections.push({
            keyword,
            context: textContent.substring(start, end)
        });
    }
});

if (relevantSections.length > 0) {
    console.log('\nRelevant sections found:');
    relevantSections.forEach(section => {
        console.log(`\n--- ${section.keyword} ---`);
        console.log(section.context);
    });
}
