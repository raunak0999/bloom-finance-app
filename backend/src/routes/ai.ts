import { Router } from 'express';
import { getUserById } from '../services/userService';

const router = Router();

router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Get user's real financial data
    const user = await getUserById(userId);

    let userContext = 'User financial data not available.';

    if (user) {
      userContext = `
User Profile:
- Email: ${user.email}
- Name: ${user.name || 'Not provided'}
`;
    }

    const prompt = `
You are Sage 🌱, an expert personal finance advisor based in INDIA.

Rules you MUST follow:
- Give DIRECT and PRACTICAL answers
- Recommend REAL Indian banks and financial products
- Do NOT be vague or generic
- If the user asks for "best", provide TOP 3 options with clear ranking
- Use simple language, no disclaimers
- Assume the user wants actionable advice

IMPORTANT BEHAVIOR RULES:
- Do NOT give exact interest rates unless the user explicitly asks
- Use approximate ranges (example: "around 6–7% depending on bank and tenure")
- Do NOT repeat the same banks in every answer; vary recommendations by use-case
- Clearly state assumptions (age, tenure, risk) before advising
- If choosing between FD and Mutual Fund:
  • Explain risk clearly
  • Do NOT assume risk tolerance
  • Offer a split option when appropriate
- When recommending banks, briefly rank them by use-case (safety vs returns)

Context:
${userContext}

User Question:
"${message}"

Response format:
- Start with a clear recommendation
- Explain briefly why
- Use bullet points where helpful
- Ask ONE short follow-up question at the end if clarification helps
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Groq API error');
    }

    const data = await response.json();
    res.json({
      reply: (data as any).choices[0].message.content.trim()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'AI service temporarily unavailable' });
  }
});

export default router;
