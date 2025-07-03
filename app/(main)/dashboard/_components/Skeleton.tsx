import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonDeshboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Skeleton className="w-full h-full " />
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="w-[100px] h-[20px] rounded-full" />
            </CardTitle>
            <Skeleton className="h-4 w-4 " />
          </CardHeader>
          <CardContent>
            <Skeleton className="w-10 h-[20px] rounded-full my-2" />
            <Skeleton className="w-full h-5 " />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-5 w-16 mt-2" />
            </CardTitle>
            <Skeleton className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-2 w-full rounded-full mt-2" />
          </CardContent>
        </Card>

        <Card>
          <Skeleton className="w-full h-full" />
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>
              <Skeleton className="h-4 w-72 text-muted-foreground my-2" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full text-muted-foreground" />
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-1 sm:p-6">
          <div className="h-[500px]">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {" "}
              <Skeleton className="h-4 w-72 text-muted-foreground my-2" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-52 text-muted-foreground my-2" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <Skeleton className="h-4 w-72 text-muted-foreground my-2" />
              <Skeleton className="h-4 w-4 text-muted-foreground my-2" />
              <Skeleton className="h-4 w-4 text-muted-foreground my-2" />
              <Skeleton className="h-4 w-4 text-muted-foreground my-2" />
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-40 text-muted-foreground my-2" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-72 text-muted-foreground my-2" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                <Skeleton className="h-4 w-10 text-muted-foreground my-2" />
              </Badge>
              <Badge variant="outline">
                <Skeleton className="h-4 w-10 text-muted-foreground my-2" />
              </Badge>
              <Badge variant="outline">
                <Skeleton className="h-4 w-10 text-muted-foreground my-2" />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SkeletonDeshboard;
