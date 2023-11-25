import { useState, useEffect } from "react";
import { createClient } from "next-sanity"; // Import your Sanity client
import groq from "groq";

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

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

  useEffect(() => {
    // Fetch the leaderboard when the component mounts
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async (): Promise<void> => {
    try {
      // Fetch users from Sanity sorted by total score in descending order
      const query = groq`*[_type == 'user'] | order(scores desc)`;
      const result = await client.fetch(query);

      if (result) {
        // Update the state with the fetched leaderboard
        setLeaderboard(result);
      } else {
        console.error("No users found for leaderboard");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 bg-white border rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
      <ul className="space-y-2">
        {leaderboard.map((user, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 border bg-gray-200"
          >
            <span className="font-semibold">{user.username}</span>
            <span className="font-semibold">
              Score: {calculateTotalScore(user)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const calculateTotalScore = (user: User): number => {
  // Calculate the total score by summing up scores for all difficulties
  return Object.values(user.scores).reduce((total, score) => total + score, 0);
};

export default Leaderboard;
