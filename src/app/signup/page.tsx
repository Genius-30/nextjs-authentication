"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";
import Link from "next/link";

function SignupPage() {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [isSignupDisabled, setIsSignupDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const onSignup = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/users/signup", userData)
      .then(() => {
        setIsLoading(false);
        toast.success("Signup Successful");

        route.push("/login");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(
          error.response.data.message || "An error occurred. Please try again."
        );
      });
  }, [userData, route]);

  useEffect(() => {
    if (
      userData.userName.length > 0 &&
      userData.email.length > 0 &&
      userData.password.length > 0
    ) {
      setIsSignupDisabled(false);
    } else {
      setIsSignupDisabled(true);
    }
  }, [userData]);

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center">
        <div
          className="w-[30%] flex flex-col items-start justify-center gap-4
        bg-white p-8 rounded-md shadow-md text-slate-900"
        >
          <h1 className="text-2xl font-bold self-center">
            {isLoading ? "Signup..." : "Signup"}
          </h1>
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Username"
            onChange={(e) =>
              setUserData({ ...userData, userName: e.target.value })
            }
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Email"
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="********"
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
          />
          <button
            className="w-full p-2 bg-blue-500 text-white rounded-md flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            onClick={onSignup}
            disabled={isSignupDisabled}
            aria-live="polite"
          >
            <TailSpin
              visible={isLoading}
              height="20"
              width="20"
              color="#A9A9A9"
              ariaLabel="tail-spin-loading"
              radius="1"
            />
            Signup
          </button>
          <p className="self-center">
            Already have an account?{" "}
            <Link href={"/login"} className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </>
  );
}

export default SignupPage;
