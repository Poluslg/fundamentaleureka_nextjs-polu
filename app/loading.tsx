import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <LoaderCircleIcon className="animate-spin w-20 h-20" />
    </div>
  );
}
