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

    const profile = await request.json();

    const response = await openai.responses.create({
      model: "gpt-6-luna",

      instructions: `
You are the Opportunity Engine inside LaunchPilot, an AI business-building platform.

Analyze the founder profile and generate exactly 6 realistic online business opportunities.

The opportunities must:
- Fit the founder's skills, interests, budget, available time, experience, preferred business model, income goal, and overall goal.
- Be specific enough that someone could actually launch them.
- Favor realistic paths to revenue over trendy but vague ideas.
- Avoid get-rich-quick claims.
- Avoid pretending that market demand or revenue is guaranteed.
- Be meaningfully different from one another.
- Rank the strongest opportunity first.
- Give each opportunity a match score from 50 to 97.
- Use concise language suitable for a product UI.

Startup cost and time-to-launch are rough planning estimates, not guarantees.
`,

      input: `Founder profile:\n${JSON.stringify(profile, null, 2)}`,

      text: {
        format: {
          type: "json_schema",
          name: "launchpilot_opportunities",
          strict: true,
          schema: {
            type: "object",
            properties: {
              opportunities: {
                type: "array",
                minItems: 6,
                maxItems: 6,
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                    },
                    name: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                    score: {
                      type: "integer",
                      minimum: 50,
                      maximum: 97,
                    },
                    cost: {
                      type: "string",
                    },
                    launchTime: {
                      type: "string",
                    },
                    model: {
                      type: "string",
                    },
                    difficulty: {
                      type: "string",
                    },
                    targetCustomer: {
                      type: "string",
                    },
                    firstOffer: {
                      type: "string",
                    },
                    reasons: {
                      type: "array",
                      minItems: 2,
                      maxItems: 3,
                      items: {
                        type: "string",
                      },
                    },
                  },
                  required: [
                    "id",
                    "name",
                    "description",
                    "score",
                    "cost",
                    "launchTime",
                    "model",
                    "difficulty",
                    "targetCustomer",
                    "firstOffer",
                    "reasons"
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["opportunities"],
            additionalProperties: false,
          },
        },
      },
    });

    if (!response.output_text) {
      throw new Error("The model returned no output.");
    }

    const result = JSON.parse(response.output_text);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Opportunity generation failed:", error);

    return NextResponse.json(
      {
        error: "Unable to generate opportunities right now.",
      },
      { status: 500 }
    );
  }
}
