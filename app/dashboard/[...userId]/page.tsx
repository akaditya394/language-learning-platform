"use client";
import Leaderboard from "@/components/leaderboard";
import QuizQuestion from "@/components/question";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  DollarSign,
  LanguagesIcon,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Borel } from "next/font/google";

const borel = Borel({ weight: "400", subsets: ["latin"] });
import { createClient } from "next-sanity";

const client = createClient({
  projectId: "ankhtq2e",
  dataset: "production",
  useCdn: false, // Enable the Content Delivery Network for faster responses
});

const UserProfile = () => {
  const { user } = useUser();

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const playerName = "John Doe";

  const handleTakePremium = () => {
    // Implement take premium logic
    console.log("Taking premium...");
  };

  const handleReset = () => {
    // Implement reset logic
    console.log("Resetting scores and preferences...");
  };

  const [selectedLanguage, setSelectedLanguage] = useState("english");

  return (
    <main className="flex h-[100%] mx-auto">
      <section className="my-auto w-[20%] h-[80%] flex flex-col items-start justify-between px-10">
        <div className={`${borel.className} font-bold flex gap-x-2 p-2`}>
          <Link href="/">linguist</Link>
        </div>
        <button className="flex gap-x-2 p-2 hover:bg-slate-300 rounded-md">
          <User /> {user?.fullName}
        </button>
        <div className="flex gap-x-2 p-2 rounded-md">
          <div className="flex space-x-2 items-center">
            <LanguagesIcon />
            <button
              className={`p-1 rounded-md border px-2 ${
                selectedLanguage === "english" ? "bg-black text-white" : ""
              }`}
              onClick={() => handleLanguageChange("english")}
            >
              English
            </button>
            <button
              className={`p-1 rounded-md border px-2 ${
                selectedLanguage === "spanish" ? "bg-black text-white" : ""
              }`}
              onClick={() => handleLanguageChange("spanish")}
            >
              Spanish
            </button>
          </div>
        </div>
        <button className="flex gap-x-2 p-2 hover:bg-slate-300 rounded-md">
          <DollarSign />
          Premium
        </button>
        <button className="flex gap-x-2 p-2 hover:bg-slate-300 rounded-md">
          <RefreshCw /> Reset
        </button>
        <button className="flex gap-x-2 p-2 hover:bg-slate-300 rounded-md">
          <Search /> Learn More
        </button>
        <div className="">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-[32px] w-[32px] ",
              },
            }}
          />
        </div>
      </section>
      <section className="my-auto w-[50%] h-[80%] flex flex-col justify-center">
        <QuizQuestion />
      </section>
      <section className="my-auto w-[30%] h-[80%] flex flex-col items-start justify-start">
        <Leaderboard />
      </section>
    </main>
  );
};

export default UserProfile;
