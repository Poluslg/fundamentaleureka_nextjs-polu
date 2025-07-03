"use client";
import { Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

function GoogleSignInButton({}) {
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", {
      redirect: true,
      redirectTo: "/",
    });
  };
  return (
    <div className="border h-12 hover:bg-muted-foreground rounded-md transition ease-in-out duration-300 place-items-center place-content-center">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-2 w-48 h-10 justify-center"
      >
        {!loading ? (
          <>
            <FcGoogle size={25} />
            <span>Sign in using Google</span>
          </>
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
        <span className="sr-only">google signin</span>
      </button>
    </div>
  );
}

export default GoogleSignInButton;
