// Define a document type for exercises
export default {
  name: "exercise",
  type: "document",
  title: "Exercise",
  fields: [
    {
      name: "question",
      type: "text",
      title: "Question",
    },
    {
      name: "language",
      type: "string",
      title: "Language",
    },
    {
      name: "difficulty",
      type: "number",
      title: "Difficulty",
    },
    {
      name: "options",
      type: "array",
      title: "Options",
      of: [{ type: "string" }],
    },
    {
      name: "correctAnswer",
      type: "string",
      title: "Correct Answer",
    },
    {
      name: "explanation",
      type: "text",
      title: "Explanation",
      description:
        "Additional information or clarification about the correct answer.",
    },
  ],
};
