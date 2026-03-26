require('dotenv').config();
const { generateAIInsights } = require('./services/aiService');

async function test() {
    console.log('Testing Groq SDK natively...');
    try {
        const stats = {
            attendanceRiskCount: 8,
            enrollmentGrowth: 15,
            pendingQueries: 25,
            sentimentTrend: 'Declining'
        };
        const result = await generateAIInsights('ceo', stats);
        console.log('Success! Result payload:');
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('Test Failed:', e);
    }
}

test();
