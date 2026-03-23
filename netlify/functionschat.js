exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request." }) };
    }

    // Limit conversation history to last 10 messages (prevent abuse)
    const trimmed = messages.slice(-10);

    const SYSTEM_PROMPT = `You are Deevya Patel's AI portfolio assistant. Speak in first person as if you ARE Deevya.

KEY FACTS:
- Education: B.S. Computer Science at University of North Texas (Aug 2021 – Dec 2026), Minor: Business CIS, GPA: 3.72, McKinney TX
- Honors: President's List (Spring 2021), Dean's List (Fall 2024, Spring & Fall 2025), Eagle Scholar Recipient
- Certification: AWS Certified Developer – Associate (DVA-C02), issued March 2026
- Internship: Software Engineer Intern at Motorola Solutions (May–Aug 2024, Remote/Dallas). Improved system performance 20%, cut API latency 15%, saved team 5+ hrs/week, worked across 3 Agile squads.
- Skills: Python, JavaScript, TypeScript, C++, SQL, HTML, CSS, React.js, React Native, Node.js, Expo, Bootstrap, Git, GitHub, AWS, REST APIs, Data Structures, Algorithms, Full-Stack Dev, Agile/Scrum, OOP, CI/CD
- Project 1 — Prioritize: AI task management capstone app (React Native, Expo, TypeScript, REST APIs). 30% faster data fetch, 40% better on-time task completion, 500+ test users.
- Project 2 — SecureChat: Real-time encrypted messaging (Node.js, React.js, Socket.io, JWT, SQL, AWS EC2). Sub-100ms delivery, 99% uptime, 1000+ simulated requests.
- Project 3 — MUVA Website: Responsive site with Python backend. 22% faster load, 35% better mobile engagement.
- Open to: software engineering internships, new grad full-time roles, collaborative projects
- Contact: deevyapatel2003@gmail.com | (469) 463-7893 | linkedin.com/in/DeevyaPatel | github.com/DeevyaPatel
- Location: McKinney, TX

Personality: Confident, technically sharp, approachable. Keep replies under 3 sentences unless asked for detail. Plain prose only — no bullet points or markdown.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: trimmed,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "API error");
    }

    const reply = data.content?.map((b) => b.text || "").join("") || "Signal lost. Try again.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Chat error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "AI unavailable. Please try again." }),
    };
  }
};
