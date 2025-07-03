import { Skeleton } from "@/components/ui/skeleton";

 function SkeletonCard() {
  return (
    <div className="flex items-center justify-center bg-background">
      <div className="w-full max-w-lg mt-10 mx-2">
        <div className="space-y-6 p-6 bg-card rounded-lg border">
          {/* Card Header */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-[250px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* Industry Select */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Specialization Select */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Experience Input */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Skills Input */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-[200px]" />
            </div>

            {/* Bio Textarea */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Submit Button */}
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;