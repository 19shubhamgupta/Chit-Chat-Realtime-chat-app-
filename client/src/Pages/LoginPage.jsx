import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useStoreAuth } from "../store/useAuthStore";

function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login, isLoggingIn, toggleNav } = useStoreAuth();
  const navigate = useNavigate();
  useEffect(() => {
    toggleNav(false);
  }, []);

  const loginForm = (data) => {
    login(data).then(() => {
      toggleNav(true);
      navigate("/");
    })
  }; 

  return (
    <div className="min-h-screen flex bg-gray-900 dark:bg-gray-900 ">
      {/* Left Section - Form (now on left) */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg border border-yellow-500">
          <h3 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            Welcome Back
          </h3>

          <form onSubmit={handleSubmit(loginForm)} className="space-y-5">
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
                placeholder="Enter your password"
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
              disabled= {isLoggingIn}
            >
              Log In
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
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-400 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      {/* Right Section - Branding (now on right) */}
      <div className="hidden md:flex md:w-[45%] items-center justify-center bg-black rounded-l-[5rem] border-4 border-yellow-500 text-yellow-200 h-screen flex-col">
        <img src="/logo.png" alt="chit-chat-logo" className="h-30 w-55 mb-4 "/>
        <div className="space-y-4 text-center px-8">
          <h1 className="text-5xl font-extrabold text-yellow-400">
            Your Voice
            <br />
            Amplified
          </h1>
          <p className="mt-4 text-lg font-medium text-yellow-300">
            Log in to connect and chat instantly!
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
