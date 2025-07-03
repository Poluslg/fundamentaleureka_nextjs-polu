"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProfileDropDown from "./ProfileDropDown";
// import { useTheme } from "next-themes";
function Header() {
  // const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  // console.log(session?.user?.name);
  // const [visibale, setVisibale] = useState(false);

  // const handleThemeChangeBtn = () => {
  //   if (theme === "dark") {
  //     setTheme("light");
  //   } else {
  //     setTheme("dark");
  //   }
  // };
  // useEffect(() => {
  //   setVisibale(!visibale);
  // }, []);
  return (
    <header>
      {/* {visibale && ( */}
        <div className="shadow-md  w-full border-b">
          <div className="container mx-auto flex justify-between items-center py-4 px-3">
            <Link href="/" className="flex flex-col cursor-pointer">
              <h1 className="text-xl font-bold text-blue-600">FME</h1>
              <span className="text-xs -mt-2">Funda Mental Eureka</span>
            </Link>
            <div className="flex items-center space-x-5">
              {/* <Button
                variant={"ghost"}
                onClick={handleThemeChangeBtn}
                className="hover:text-white hover:bg-transparent"
              >
                {theme === "dark" ? <MoonIcon /> : <SunIcon />}
                <span className="sr-only">Mode Toggle</span>
              </Button> */}
              {session ? (
                <ProfileDropDown />
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-blue-400 rounded-md font-semibold block px-4 py-2 text-sm text-gray-200 hover:bg-blue-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      {/* )} */}
    </header>
  );
}

export default Header;
