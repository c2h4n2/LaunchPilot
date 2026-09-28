import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const { profile, opportunity } = await request.json();

    if (!profile || !opportunity) {
      return NextResponse.json(
        { error: "Founder profile and opportunity are required." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-6-luna",

      instructions: `
You are the Launch Plan Engine inside LaunchPilot, an AI business-building platform.

Create a practical 30-day launch plan for the founder and business opportunity provided.

The plan must:
- Be customized to the founder's skills, interests, budget, available time, experience, preferred business model, income goal, and overall goal.
- Build directly on the selected business opportunity.
- Prioritize getting to a real customer, audience, lead, affiliate click, or sale as early as realistically possible.
- Stay within the founder's stated budget and available time.
- Avoid unnecessary tools, features, branding work, or infrastructure.
- Avoid get-rich-quick claims and revenue guarantees.
- Give the founder concrete actions rather than vague advice.
- Organize the roadmap into exactly 4 weeks.
- Give exactly 3 tasks per week.
- Make each task specific enough that the founder can mark it complete.
- Keep language concise and suitable for a product UI.

The first week should focus on validation and setup.
The second week should focus on building the minimum viable offer or asset.
The third week should focus on launch and customer/audience acquisition.
The fourth week should focus on optimization, follow-up, and deciding what to scale next.
`,

      input: `
Founder profile:
${JSON.stringify(profile, null, 2)}

Selected business opportunity:
${JSON.stringify(opportunity, null, 2)}
`,

      text: {
        format: {
          type: "json_schema",
          name: "launchpilot_launch_plan",
          strict: true,
          schema: {
            type: "object",
            properties: {
              businessName: { type: "string" },
              concept: { type: "string" },
              targetCustomer: { type: "string" },
              firstOffer: { type: "string" },
              revenueModel: { type: "string" },
              thirtyDayGoal: { type: "string" },
              weeks: {
                type: "array",
                minItems: 4,
                maxItems: 4,
                items: {
                  type: "object",
                  properties: {
                    week: { type: "integer", minimum: 1, maximum: 4 },
                    title: { type: "string" },
                    objective: { type: "string" },
                    tasks: {
                      type: "array",
                      minItems: 3,
                      maxItems: 3,
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          title: { type: "string" },
                          description: { type: "string" },
                        },
                        required: ["id", "title", "description"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["week", "title", "objective", "tasks"],
                  additionalProperties: false,
                },
              },
            },
            required: [
              "businessName",
              "concept",
              "targetCustomer",
              "firstOffer",
              "revenueModel",
              "thirtyDayGoal",
              "weeks",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    if (!response.output_text) {
      throw new Error("The model returned no launch plan.");
    }

    const plan = JSON.parse(response.output_text);
    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Launch plan generation failed:", error);

    return NextResponse.json(
      { error: "Unable to generate your launch plan right now." },
      { status: 500 }
    );
  }
}
