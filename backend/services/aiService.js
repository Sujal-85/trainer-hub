import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-3-pro-preview",
    temperature: 0,
});

const systemPrompt = `
  You are an expert recruitment assistant. Extract trainer details from the provided resume (PDF).
  Return ONLY a valid JSON object. If a field is missing, use an empty string or empty array.
  
  JSON Structure:
  {{
    "fullName": "",
    "whatsappNumber": "",
    "email": "",
    "city": "",
    "state": "",
    "trainingAreas": [],
    "experienceLevel": "",
    "travelWillingness": "",
    "languages": [],
    "availability": "",
    "trainingMode": "",
    "dailyFee": "",
    "shortBio": "",
    "technicalSkills": [],
    "domainExpertise": [],
    "trainingExperience": "",
    "hasIndustryExperience": false,
    "industryDetails": ""
  }}
  
  Mapping rules:
  - trainingAreas: map to IDs like 'communication', 'soft-skills', 'soft-skills', 'aptitude', 'logical-reasoning', 'personality', 'career', 'corporate'.
  - experienceLevel: map to 'beginner', 'intermediate', 'advanced', 'expert'.
  - travelWillingness: map to 'within-city', 'up-to-50km', 'up-to-100km', 'online-only'.
  - availability: map to 'weekdays', 'weekends', 'both'.
  - trainingMode: map to 'online', 'offline', 'hybrid'.
  - domainExpertise: map to 'computer-science', 'electronics', 'civil', 'automobile', 'biomedical', 'metallurgy'.
`;

export const parseResumeText = async (buffer) => {
    try {
        console.log('Converting buffer to base64...');
        const base64Data = buffer.toString('base64');
        console.log('Buffer converted, message size (base64):', base64Data.length);

        const message = new HumanMessage({
            content: [
                {
                    type: "text",
                    text: systemPrompt,
                },
                {
                    type: "media",
                    mimeType: "application/pdf",
                    data: base64Data,
                },
            ],
        });

        console.log('Sending request to Gemini 1.5 Flash...');
        const response = await model.invoke([message]);
        console.log('Gemini response received.');

        const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
        console.log('Response content length:', content.length);
        console.log('First 100 chars of response:', content.substring(0, 100));

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            console.log('Extracted JSON matches pattern.');
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (pErr) {
                console.error('JSON Parse Error:', pErr.message);
                console.log('Failing JSON content:', jsonMatch[0]);
                throw pErr;
            }
        }

        console.error('AI Error: No JSON found in content:', content);
        throw new Error("No JSON found in AI response");
    } catch (error) {
        console.error("AI Parsing Service Error Trace:", error.message);
        if (error.stack) console.error(error.stack);
        throw error;
    }
};
