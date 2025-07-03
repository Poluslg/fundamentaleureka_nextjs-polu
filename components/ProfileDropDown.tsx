import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUserGraduate } from "react-icons/fa";

function ProfileDropDown() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <FaUserGraduate size={20} />
        <span className="sr-only">Open Profile</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          Profile
        </DropdownMenuItem> */}

        {/* <DropdownMenuItem>Billing</DropdownMenuItem> */}
        {/* <DropdownMenuItem>Team</DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer"
        >
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/askAi")}
          className="cursor-pointer"
        >
          AI Helper
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/resume")}
          className="cursor-pointer"
        >
          Ai-Resume Builder
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/interview")}
          className="cursor-pointer"
        >
          Ai-Interview
        </DropdownMenuItem>

        {/* <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="cursor-pointer"
        >
          Settings
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={() =>
            signOut({
              redirect: true,
              redirectTo: "/",
            })
          }
          className="cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropDown;
