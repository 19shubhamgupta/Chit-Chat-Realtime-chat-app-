import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useStoreAuth } from "../store/useAuthStore";

function SignupPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { signup, isSigningUp, toggleNav } = useStoreAuth();

  useEffect(() => {
    toggleNav(false);
  }, []);

  const signupForm = (data) => {
    signup(data).then(() => {
      toggleNav(true);
      navigate("/");
    });
  };

  return (
    <div className=" flex bg-gray-900 dark:bg-gray-900 ">
      {/* Left Section - Branding */}
      <div className="hidden md:flex md:w-[45%] items-center justify-center bg-black rounded-r-[5rem] border-4 border-yellow-500 text-yellow-200 h-screen flex-col">
        <img src="/logo.png" alt="chit-chat-logo" className="h-30 w-55 mb-4" />
        <div className="space-y-4 text-center px-8">
          <h1 className="text-5xl font-extrabold text-yellow-400">
            Your Voice
            <br />
            Amplified
          </h1>
          <p className="mt-4 text-lg font-medium text-yellow-300">
            Sign up for messaging that truly resonates!
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg border border-yellow-500">
          <h3 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            Create Your Account
          </h3>

          <form onSubmit={handleSubmit(signupForm)} className="space-y-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-yellow-300"
              >
                Name
              </label>
              <input
                id="fullname"
                type="text"
                {...register("fullname", { required: true })}
                className="mt-1 block w-full h-12 border-yellow-400 bg-gray-900 text-yellow-200 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400 placeholder-yellow-500 placeholder:truncate placeholder:px-2"
                placeholder="Your full name"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-yellow-300"
              >
                E‑mail
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: true })}
                className="mt-1 block w-full h-12 border-yellow-400 bg-gray-900 text-yellow-200 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400 placeholder-yellow-500 placeholder:truncate placeholder:px-2"
                placeholder="you@example.com"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-yellow-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", { required: true })}
                className="mt-1 block w-full h-12 border-yellow-400 bg-gray-900 text-yellow-200 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400 placeholder-yellow-500 placeholder:truncate placeholder:px-2"
                placeholder="Enter a secure password"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full  bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition border-2 border-yellow-400 h-12"
              disabled={isSigningUp}
            >
              Sign Up
            </button>
          </form>

          <div className="my-6 flex items-center">
            <hr className="flex-grow border-yellow-700" />
            <span className="mx-2 text-yellow-500">OR</span>
            <hr className="flex-grow border-yellow-700" />
          </div>

          <button className="w-full py-3 flex items-center justify-center border border-yellow-400 rounded-lg hover:bg-yellow-500 hover:text-gray-900 transition bg-gray-900 text-yellow-200">
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google"
              className="mr-2"
            />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-yellow-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-400 font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
