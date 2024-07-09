"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

function ProfilePage() {
  const [userData, setUserData] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setUserData(response.data.user);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(
          error.response.data.message || "Error getting user details!"
        );
      }
    };
    fetchData();
  }, []);

  const logoutUser = async () => {
    try {
      setLoading(true);
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully!");
      router.push("/login");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message || "Error logout user!");
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-md p-4 bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8 text-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 ">
              Profile
            </h5>
            <button
              className="text-sm font-medium text-gray-500 hover:underline"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
          {loading ? (
            <TailSpin
              visible={loading}
              height="50"
              width="50"
              color="#A9A9A9"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperClass="self-center"
            />
          ) : (
            <div className="space-y-4">
              <div>
                <strong>Username:</strong> {userData.userName}
              </div>
              <div>
                <strong>Email:</strong> {userData.email}
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {new Date(userData.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Verified:</strong> {userData.isVerified ? "Yes" : "No"}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
