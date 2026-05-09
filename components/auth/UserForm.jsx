"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuEye, LuEyeClosed, LuKey, LuMail, LuUser } from "react-icons/lu";

const UserForm = ({ isLogin }) => {
  const [isHidden, setIsHidden] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form
      className="fieldset w-full lg:max-w-sm max-lg:order-1"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Image
        className="mx-auto"
        src="/assets/oiki-logo-tag.svg"
        alt="Oiki Logo"
        width={80}
        height={20}
      />

      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="label">
          {isLogin
            ? "Please login to your account"
            : "Please register to create your account"}
        </p>
      </div>

      {!isLogin && (
        <>
          <label htmlFor="name" className="label">
            Full Name
          </label>
          <label className="input w-full">
            <LuUser className="h-[1em] opacity-50" />
            <input
              type="text"
              {...register("name", {
                required: "Name Field is Empty",
                minLength: {
                  value: 3,
                  message: "Client Name must be at least 3 characters long",
                },
              })}
              placeholder="Enter your Full Name"
            />
          </label>
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </>
      )}

      <label htmlFor="email" className="label">
        Email
      </label>
      <label className="input w-full">
        <LuMail className="h-[1em] opacity-50" />
        <input
          name="email"
          type="email"
          placeholder="mail@site.com"
          {...register("email", {
            required: "Email Field is Empty",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
        />
      </label>

      {errors.email && <p className="text-red-600">{errors.email.message}</p>}

      <label className="label">Password</label>
      <label className="input w-full">
        <LuKey className="h-[1em] opacity-50" />
        <input
          type={isHidden ? "text" : "password"}
          {...register("password", { required: "Password Field is Empty" })}
          placeholder="Password"
        />
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => setIsHidden(!isHidden)}
        >
          {isHidden ? (
            <LuEyeClosed className="h-[1em] opacity-50" />
          ) : (
            <LuEye className="h-[1em] opacity-50" />
          )}
        </button>
      </label>

      {errors.password && (
        <p className="text-red-600">{errors.password.message}</p>
      )}

      {isLogin && (
        <Link href="#" className="text-sm text-main">
          Forgot Password?
        </Link>
      )}

      <button className="btn btn-main mt-4">
        {isLogin ? "Login" : "Registation"}
      </button>

      <div className="divider my-2">or</div>

      <button className="btn bg-white text-black border-[#e5e5e5]">
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Continue with Google
      </button>

      <p className="text-sm text-center text-balance">
        {isLogin ? "Don't Have an Account?" : "Already Have an Account?"}{" "}
        <Link
          href={isLogin ? "/registration" : "/login"}
          className="link link-hover font-bold text-main"
        >
          {isLogin ? "Register Now" : "Login Now"}
        </Link>
      </p>
    </form>
  );
};

export default UserForm;
