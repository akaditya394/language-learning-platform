"use client";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { Borel } from "next/font/google";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

const borel = Borel({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const { isSignedIn, user } = useUser();
  const { isLoaded } = useAuth();
  return (
    <main className="flex flex-col items-center justify-around h-[80%] my-auto">
      <Image src="/learn.png" alt="learn" width={300} height={300} />
      <p className={`${borel.className} text-6xl font-extrabold`}>linguist</p>
      {!isLoaded && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isLoaded && !isSignedIn && (
        <SignInButton mode="modal">
          <button
            className="bg-black p-2 text-white 
            rounded-md hover:bg-white hover:text-black transition-all 
            hover:border-2 hover:border-black border-2 border-white"
          >
            Sign In
          </button>
        </SignInButton>
      )}
      {isSignedIn && isLoaded && (
        <div className="flex flex-col gap-y-5">
          <div className="flex items-center justify-around gap-x-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-[48px] w-[48px] ",
                },
              }}
            />
            <p>{user.fullName}</p>
          </div>
          <div className="flex items-center justify-around gap-x-2">
            <Link href={`dashboard/${user?.id}`}>
              <button
                className="bg-black p-2 text-white 
            rounded-md hover:bg-white hover:text-black transition-all 
            hover:border-2 hover:border-black border-2 border-white"
              >
                Enter
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
