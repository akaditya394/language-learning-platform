// Define a document type for user profiles
export default {
  name: "userProfile",
  type: "document",
  title: "User Profile",
  fields: [
    {
      name: "username",
      type: "string",
      title: "Username",
    },
    {
      name: "languagePreference",
      type: "string",
      title: "Language Preference",
    },
    {
      name: "progress",
      type: "number",
      title: "Progress",
    },
    {
      name: "points",
      type: "number",
      title: "Points",
      description: "Total points accumulated by the user.",
    },
  ],
};
