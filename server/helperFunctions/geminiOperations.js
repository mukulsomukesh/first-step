const { GoogleGenerativeAI } = require("@google/generative-ai");


const generateNoteSummary = async (content) => {

    const prompt = `You are an AI that specializes in understanding and generating structured HTML content. Your task is to process the given HTML page, extract the key content, summarize it, and recreate the HTML structure with the summarized version while maintaining the original format, including headings, lists, and sections.

Instructions:

1. Extract and Summarize Content
* Read and analyze the text inside the HTML tags.
* Summarize the key points concisely while preserving the main ideas.
* Avoid unnecessary details but retain the essence of the original content.

2. Maintain HTML Structure
* Keep the same layout, including <h1>, <h2>, <p>, <ul>, <div>, etc.
* Ensure proper HTML formatting and indentation.
* Do not change the document’s structure—only modify the text content to reflect the summary.

Input HTML:
${content}
`;

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        
        const result = await model.generateContent(prompt);
        let rawHtml =  result.response.text();
        
        // Removing unwanted prefix, postfix, and markdown-style backticks
        let cleanedHtml = rawHtml.replace(/```html|```/g, "").trim();
        
        console.log("Gemini AI Generated HTML:", cleanedHtml);
        
        return cleanedHtml;


    } catch (error) {
        console.error("Error generating summery:", error);
        return {
          success: false,
          message: "Error generating summery",
        };
    }
    }
    module.exports = { generateNoteSummary };
