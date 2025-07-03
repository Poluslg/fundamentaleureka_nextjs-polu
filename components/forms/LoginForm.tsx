"use client";
import React, { useState } from "react";

import { FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import GoogleSignInButton from "../GoogleSignInButton";
// import { AuthError, CredentialsSignin } from "next-auth";
// import { useRouter } from "next/navigation";

// const FormSchema = z.object({
//   email: z.string().email(),
//   password: z.string(),
// });

function LoginForm() {

  const [isEmail, setIsEmail] = useState(false);
  const [email, setEmail] = useState(String);
  const [passwordField, setPasswordField] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(String);
  // const router = useRouter();
  // const [emailLoading,setEmailLoading] = useState(false);
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });

  const handleEmailVarification = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (email) {
      setIsEmail(true);
      const response = await fetch("/api/checkEmail", {
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await response.json();
      if (data.message === "Email Found") {
        setPasswordField(true);
      } else if (data.message === "Email not Found") {
        toast.error("Email not found");
        setIsEmail(false);
      } else if (data.message === "Please try to login using google") {
        toast.error("Please try to login using google");
        setIsEmail(false);
      } else {
        toast.error("Please try again latter");
        setIsEmail(false);
      }
    }
  };

  const handleEditButton = () => {
    if (isEmail) {
      setPasswordField(false);
      setIsEmail(false);
    }
  };

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        email,
        password: password,
        redirect: true,
        redirectTo: "/",
      });
      console.log(res);
    } catch (error) {
      const err = error as Error;
      alert(err.message); // toast required
    }
  };

  return (
    <>
      
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 bg-muted rounded-xl shadow-lg z-10  relative">
          <Image
            src="/FundaMentalEureka.svg"
            alt="FundaMentalEureka"
            width={200}
            height={200}
            className="absolute -top-24 left-1/2 transform -translate-x-1/2"
          />
          {!passwordField ? (
            <form
              onSubmit={handleEmailVarification}
              className="mt-8 space-y-6 w-full"
            >
              <div>
                {/* {emailErrors?.email && (
                  <p className="text-red-300 font-semibold text-sm">
                    {emailErrors?.email.message}
                  </p>
                )} */}
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  // {...register("email", { required: true })}
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-muted placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>

              <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                {!isEmail ? (
                  " Verify Email"
                ) : (
                  <Loader2Icon className="animate-spin" />
                )}
              </button>
            </form>
          ) : (
            <form className="mt-8 space-y-6 w-full" onSubmit={handleSignin}>
              <div className="rounded-md shadow-sm -space-y-px">
                {/* <h1>{email}</h1> */}
                <div className="flex pr-3 py-5">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-foreground text-muted-foreground font-semibold bg-transparent"
                  />
                  <button
                    className="text-cyan-500 underline"
                    onClick={handleEditButton}
                  >
                    Edit
                  </button>
                </div>

                {passwordField && (
                  <>
                    <div className="relative">
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-muted placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-500 z-20"
                        >
                          {!showPassword ? (
                            <FiEyeOff className="h-5 w-5" />
                          ) : (
                            <FiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-foreground/50"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/auth/forgotpassword"
                    className="font-medium text-cyan-600 hover:text-cyan-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Sign in
              </button>
            </form>
          )}
          <div className="w-full place-items-center">
            <GoogleSignInButton />
          </div>
          <Link
            href="/auth/signup"
            className="text-cyan-500 hover:text-cyan-700 flex items-center w-full justify-center"
          >
            Don&prime;t have Account ? Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
