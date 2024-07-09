"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verify-email", { token });
      toast.success("Email verified successfully");
      router.push("/login");
    } catch (error: any) {
      setError(true);
      toast.error(error.response.data.message || "Invalid token!");
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    // const query = router.query;
    // const urlToken = query.token;

    setToken(urlToken);
  }, [router]);

  return (
    <>
      <div className="min-h-screen w-full flex items-start justify-center">
        <div className="flex flex-col items-center justify-center mt-24 space-y-4">
          <h1
            className={`text-2xl font-semibold ${
              error ? "text-red-400" : "text-gray-300"
            }`}
          >
            {error ? "Email Verification Failed!" : "Click to verify!"}
          </h1>
          {error ? (
            <button
              onClick={() => router.push("/signup")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Go to signup
            </button>
          ) : (
            <button
              onClick={verifyUserEmail}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Verify Email
            </button>
          )}
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default VerifyEmailPage;
