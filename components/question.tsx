import { useState, useEffect } from "react";
import { createClient } from "next-sanity"; // Import your Sanity client
import groq from "groq";
import { useUser } from "@clerk/nextjs";

interface QuizQuestion {
  _id: string;
  text: string;
  difficulty: number;
  options: { text: string; isCorrect: boolean }[];
  correctOption: number;
  explanation: string;
}

interface User {
  _id: string;
  username: string;
  scores: Record<string, number>;
}

const client = createClient({
  projectId: "ankhtq2e",
  dataset: "production",
  useCdn: false, // Enable the Content Delivery Network for faster responses
});

const QuizQuestion: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [difficulty, setDifficulty] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { user } = useUser();

  useEffect(() => {
    // Fetch the first question when the component mounts
    fetchQuestion();
    // Fetch the user details or create a new user
    fetchUser();
  }, [difficulty]); // Re-fetch question when difficulty changes

  const fetchQuestion = async (): Promise<void> => {
    try {
      // Fetch a question from Sanity based on the current difficulty
      const query = groq`*[_type == 'quizQuestion' && difficulty == ${difficulty}][0]`;
      const result = await client.fetch(query);

      if (result) {
        // Update the state with the fetched question
        setCurrentQuestion(result);
      } else {
        console.error("No question found for difficulty:", difficulty);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const fetchUser = async (): Promise<void> => {
    try {
      // Replace 'user123' with the actual username or user identifier
      const query = groq`*[_type == 'user' && username == ${user?.fullName}][0]`;
      const result = await client.fetch(query);

      if (result) {
        // Update the state with the fetched user details
        setCurrentUser(result);
      } else {
        // Log a warning if the user is not found and create a new user
        console.warn("User not found. Creating a new user...");
        createUser();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const createUser = async (): Promise<void> => {
    try {
      // Replace 'user123' with the actual desired username
      const newUser = {
        _type: "user",
        username: "user123",
        scores: {},
      };

      // Create a new user document in Sanity
      const createdUser = await client.create(newUser);
      // Update the state with the created user
      setCurrentUser(createdUser);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleOptionSelect = (index: number): void => {
    // Allow option selection only if the question is not submitted
    if (!submitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    // Update the submission status to prevent further submissions
    setSubmitted(true);

    // Check if the selected option is correct
    const isCorrect: boolean =
      currentQuestion?.options[selectedOption || 0]?.isCorrect || false;

    // Calculate earned points based on difficulty
    const earnedPoints: number = isCorrect ? difficulty : 0;

    // Update the local score state
    setScore(isCorrect ? score + earnedPoints : score);

    // Update the user's score in the database
    if (currentUser) {
      updateUserScore(earnedPoints);
    }

    // Calculate the next difficulty based on correctness
    const newDifficulty: number = isCorrect ? difficulty + 1 : difficulty - 1;
    // Ensure the next difficulty is within the range [1, 5]
    const nextDifficulty: number = Math.max(1, Math.min(newDifficulty, 5));

    // Update the difficulty state for the next question
    setDifficulty(nextDifficulty);

    // Fetch the next question
    fetchQuestion();
  };

  const updateUserScore = async (earnedPoints: number): Promise<void> => {
    try {
      // Prepare the updated user object with the new score
      const updatedUser = {
        _id: currentUser?._id,
        scores: {
          ...currentUser?.scores,
          [difficulty.toString()]:
            (currentUser?.scores[difficulty.toString()] || 0) + earnedPoints,
        },
      };

      // Update the user's score in the database
      await client.patch(updatedUser._id).set(updatedUser).commit();
      // Update the local user state with the new user details
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Error updating user score:", error);
    }
  };

  const resetQuiz = (): void => {
    // Implement logic to reset the quiz if needed
    setDifficulty(1);
    setScore(0);
    setSubmitted(false);
    fetchQuestion();
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 bg-white border rounded shadow-md">
      {currentQuestion ? (
        <>
          {/* Display the question text */}
          <p className="text-lg font-semibold mb-4">{currentQuestion.text}</p>

          {/* Display the options for the question */}
          <ul className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <li
                key={index}
                className={`cursor-pointer p-2 border ${
                  selectedOption === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } ${
                  submitted && index === currentQuestion.correctOption
                    ? "border-green-500"
                    : submitted && selectedOption === index
                    ? "border-red-500"
                    : ""
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                {option.text}
              </li>
            ))}
          </ul>

          {/* Display the submit button */}
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={submitted ? resetQuiz : handleSubmit}
          >
            {submitted ? "Next Question" : "Submit"}
          </button>

          {/* Display the explanation if the question is submitted */}
          {submitted && (
            <div className="mt-4">
              <p className="font-semibold">
                {selectedOption === currentQuestion.correctOption
                  ? "Correct!"
                  : "Incorrect!"}
              </p>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Display the user's progress, score, and difficulty */}
          <p className="mt-4">
            Score: {score} | Difficulty: {difficulty} | Progress: {difficulty}/5
          </p>
        </>
      ) : (
        // Display loading message while fetching the question
        <p>Loading...</p>
      )}
    </div>
  );
};

export default QuizQuestion;
