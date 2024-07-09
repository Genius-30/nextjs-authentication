"use client";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";
import Link from "next/link";

function LoginPage() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [isLoginDisabled, setIsLoginDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const onLogin = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/users/login", userData)
      .then(() => {
        setIsLoading(false);
        toast.success("Login Successful");

        route.push("/");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(
          error.response.data.message || "An error occurred. Please try again."
        );
      });
  }, [userData, route]);

  useEffect(() => {
    if (userData.email.length > 0 && userData.password.length > 0) {
      setIsLoginDisabled(false);
    } else {
      setIsLoginDisabled(true);
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
            {isLoading ? "Login..." : "Login"}
          </h1>
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
            onClick={onLogin}
            disabled={isLoginDisabled}
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
            Login
          </button>
          <p className="self-center">
            Don&rsquo;t have an account?{" "}
            <Link href={"/signup"} className="text-blue-500">
              Signup
            </Link>
          </p>
        </div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </>
  );
}

export default LoginPage;
