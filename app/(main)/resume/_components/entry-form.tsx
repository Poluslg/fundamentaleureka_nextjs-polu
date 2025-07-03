"use client";
import { toast } from "sonner";
import { inproveWithAi } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { entrySchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Loader2Icon, PlusCircle, Sparkles, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Item = {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  techstack?: string;
  current: boolean;
};

interface Entry {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Props {
  type: string;
  entries: Entry[];
  onChange: (entries: Entry[]) => void;
  techStack?: boolean;
}

const formateDisplayData = (dataString: string) => {
  if (!dataString) return "";
  const data = parse(dataString, "yyyy-MM", new Date());
  return format(data, "MMM yyyy");
};

function Entryform({ type, entries, onChange, techStack }: Props) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      techstack: "",
      current: false,
      academicqualification: "",
      institutes: "",
      courses: "",
      semester: "",
    },
  });

  const current = watch("current");

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(inproveWithAi);

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formateDisplayData(data.startDate),
      endDate: data.current ? "" : formateDisplayData(data.endDate),
    };
    onChange([...entries, formattedEntry]);
    reset();
    setIsAdding(false);
  });
  const handleDelete = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  useEffect(() => {
    if (improvedContent && !improveError) {
      setValue("description", improvedContent);
      toast.success("Description improved with AI successfully");
    }
  }, [improvedContent, improveError, isImproving]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description to improve");
      return;
    }

    await improveWithAIFn({ current: description, type: type.toLowerCase() });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item: Item, index: number) => {
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <span className="text-muted-foreground">Title- </span>
                  {item.title} <br />
                  {type !== "Projects" && (
                    <>
                      <span className="text-muted-foreground">
                        Organization-
                      </span>
                      {item.organization} <br />
                    </>
                  )}
                </CardTitle>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  type="button"
                  onClick={() => handleDelete(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm ">
                  <span className="text-muted-foreground">Date- </span>
                  {item.current
                    ? `${item.startDate} - Present`
                    : `${item.startDate} - ${item.endDate}`}
                </p>
                <p>
                  {techStack && (
                    <span className="text-sm whitespace-pre-wrap">
                      <span className="text-muted-foreground">Tech Stack-</span>
                      <br />
                      {item?.techstack}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  <span className="text-muted-foreground">Description-</span>
                  <br />
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type === "Projects" ? "Project" : type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder={` ${
                    type === "Projects" ? "Title" : "Title/Position"
                  } `}
                  {...register("title")}
                  //   error={errors.title}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
              {type !== "Projects" && (
                <div className="space-y-2">
                  <Input
                    placeholder="Organization/Company"
                    {...register("organization")}
                    //   error={errors.organization}
                  />
                  {errors.organization && (
                    <p className="text-red-500 text-sm">
                      {errors.organization.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("startDate")}
                  //   error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                  //   error={errors.startDate}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current">Current {type}</label>
            </div>
            {techStack && (
              <div className="space-y-2">
                <Input
                  placeholder={`Describe of what type of Tech you use in this project like: React, Next.js, TailwindCSS...`}
                  className="h-10"
                  {...register("techstack")}
                  //   error={errors.organization}
                />
                {errors.techstack && (
                  <p className="text-red-500 text-sm">
                    {errors.techstack.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder={`Describe of your ${type.toLowerCase()}`}
                className="h-32"
                {...register("description")}
                //   error={errors.organization}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size={"sm"}
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancle
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}
      {!isAdding && (
        <Button
          className="w-full"
          variant={"outline"}
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}

export default Entryform;
