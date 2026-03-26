const Groq = require('groq-sdk');

let _groq = null;
function getGroqClient() {
    if (!_groq && process.env.GROQ_API_KEY) {
        _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return _groq;
}

const CEO_ROLE_PROMPT = `
You are a strategic school administrator AI assistant specializing in:
- Enrollment and retention analysis
- School-wide attendance trends
- Academic performance benchmarking
- Resource allocation recommendations
- Growth and sustainability planning

Your insights should be data-driven, actionable, and focused on institutional improvement.
`;

const STAFF_ROLE_PROMPT = `
You are a classroom management AI assistant specializing in:
- Student engagement strategies
- Performance gap identification
- Differentiated instruction recommendations
- Intervention planning for struggling students
- Classroom attendance optimization

Your insights should be practical, classroom-focused, and immediately implementable.
`;

const PARENT_ROLE_PROMPT = `
You are a student success AI assistant specializing in:
- Individual academic performance analysis
- Subject-specific strengths and weaknesses
- Study habit recommendations
- Learning style optimization
- Parent-student communication strategies

Your insights should be supportive, specific, and focused on student growth.
`;

const getRoleContext = (role) => {
    const prompts = {
        ceo: CEO_ROLE_PROMPT,
        staff: STAFF_ROLE_PROMPT,
        parent: PARENT_ROLE_PROMPT
    };
    return prompts[role] || '';
};

const buildPrompt = (role, stats) => {
    const statsStr = JSON.stringify(stats, null, 2);
    
    return `Role: ${role.toUpperCase()} Analytics
Data:
${statsStr}

Task: Provide EXACTLY 3 strategic insights in a valid JSON object matching this exact schema:
{
  "insights": [
    {
      "type": "Risk" | "Growth" | "Operational",
      "message": "A concise, actionable 1-2 sentence description",
      "priority": "High" | "Medium" | "Low"
    }
  ]
}

Make the insights highly relevant to the provided data. Give practical advice.`;
};

async function generateAIInsights(role, stats) {
    const groq = getGroqClient();
    if (!groq) {
        throw new Error('GROQ_API_KEY is not configured in the backend environment.');
    }

    const systemPrompt = getRoleContext(role);
    const userPrompt = buildPrompt(role, stats);

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.2,
            max_tokens: 500,
            top_p: 0.9,
            response_format: { type: "json_object" }
        });
        
        const content = response.choices[0].message.content.trim();
        const data = JSON.parse(content);
        
        return data; // Expected shape: { insights: [...] }
    } catch (error) {
        console.error('Groq AI generation error:', error);
        throw error;
    }
}

module.exports = {
    generateAIInsights
};
