import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl h-screen mx-auto flex flex-col items-center justify-center ">
      <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
      <p className="text-lg mb-8">
        Sorry, we couldn&lsquo;t find the page you&lsquo;re looking for.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-white text-red-500 font-semibold rounded-lg shadow-md hover:bg-red-100 transition duration-300"
      >
        Return Home
      </Link>
    </div>
  );
}
