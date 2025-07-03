"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { educationSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { PlusCircle, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { institutes, schools } from "@/data/data";
type Item = {
  institutes: string;
  courses: string;
  academicqualification: string;
  startDate: string;
  endDate: string;
  current: boolean;
};

interface Entry {
  institutes: string;
  courses: string;
  academicqualification: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Props {
  type: string;
  entries: Entry[];
  onChange: (entries: Entry[]) => void;
}
const academicQualifications = ["10", "12", "Graduation"];
const formateDisplayData = (dataString: string) => {
  if (!dataString) return "";
  const data = parse(dataString, "yyyy-MM", new Date());
  return format(data, "MMM yyyy");
};

function EducationForm({ type, entries, onChange }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAcaQualification, setSelectedAcaQualification] =
    useState(String);
  const [selectedinstitute, setSelectedinstitute] = useState<{
    id: string;
    name: string;
    courses: string[];
  } | null>(null);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      current: false,
      academicqualification: selectedAcaQualification,
      institutes: "",
      courses: "",
      semester: "",
    },
  });

  const current = watch("current");
  const watchInstitute = watch("institutes");

  const handleAdd = handleValidation((data) => {
    setIsAdding(true);
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

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item: Item, index: number) => {
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <span className="text-muted-foreground">
                    Academic Qualification-
                  </span>
                  {item.academicqualification}
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
                <span className="text-muted-foreground">Name- </span>
                {item.institutes} <br />
                <span className="text-muted-foreground">Course- </span>
                {item.courses} <br />
                <p className="text-sm ">
                  <span className="text-muted-foreground">Date- </span>
                  {item.current
                    ? `${item.startDate} - Present`
                    : `${item.startDate} - ${item.endDate}`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Select
                  onValueChange={(value) => {
                    setValue("academicqualification", value);
                    setSelectedAcaQualification(value);
                  }}
                  {...register("academicqualification")}
                  name="academicqualification"
                >
                  <SelectTrigger
                    // id="academicqualification"
                    name="academicqualification"
                  >
                    <SelectValue placeholder="Select an Academic Qualification" />
                  </SelectTrigger>
                  <SelectContent id="academicqualification">
                    <SelectGroup>
                      <SelectLabel>Academic Qualification</SelectLabel>
                      {academicQualifications.map((qualification) => (
                        <SelectItem
                          key={qualification}
                          value={qualification}
                          disabled={entries.some(
                            (entry) =>
                              entry.academicqualification === qualification
                          )}
                        >
                          {qualification}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.academicqualification && (
                  <p className="text-sm text-red-500">
                    {errors.academicqualification.message}
                  </p>
                )}
                {(selectedAcaQualification === "10" ||
                  selectedAcaQualification === "12") && (
                  <>
                    <Select
                      onValueChange={(value) => {
                        setValue("institutes", value);
                        setSelectedinstitute(
                          schools.find((ind) => ind.name === value) || null
                        );
                        setValue("courses", "");
                      }}
                    >
                      <SelectTrigger id="institutes">
                        <SelectValue placeholder="Select an School" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>School</SelectLabel>
                          {schools.map((ind) => (
                            <SelectItem key={ind.id} value={ind.name}>
                              {ind.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.institutes && (
                      <p className="text-sm text-red-500">
                        {errors.institutes.message}
                      </p>
                    )}
                  </>
                )}
                {selectedAcaQualification === "Graduation" && (
                  <>
                    <Select
                      onValueChange={(value) => {
                        setValue("institutes", value);
                        setSelectedinstitute(
                          institutes.find((ind) => ind.id === value) || null
                        );
                        setValue("courses", "");
                      }}
                    >
                      <SelectTrigger id="Institute">
                        <SelectValue placeholder="Select an Institute" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Institute</SelectLabel>
                          {institutes.map((ind) => (
                            <SelectItem key={ind.id} value={ind.id}>
                              {ind.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.institutes && (
                      <p className="text-sm text-red-500">
                        {errors.institutes.message}
                      </p>
                    )}
                  </>
                )}
                {watchInstitute && (
                  <div className="space-y-2 w-full">
                    <Select
                      onValueChange={(value) => setValue("courses", value)}
                    >
                      <SelectTrigger id="courses">
                        <SelectValue placeholder="Select your Course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Specializations</SelectLabel>
                          {selectedinstitute?.courses.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.courses && (
                      <p className="text-sm text-red-500">
                        {errors.courses.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {selectedinstitute?.name === "Not in The List" && (
                <div className="space-y-2">
                  <Input
                    placeholder={"Enter Your Institute Name"}
                    {...register("institutes")}
                    //   error={errors.organization}
                  />
                  {errors.institutes && (
                    <p className="text-red-500 text-sm">
                      {errors.institutes.message}
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
                className=" h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current">Not Completed</label>
            </div>

            {/* <div className="space-y-2">
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
            </div> */}
            {/* <Button
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
            </Button> */}
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

export default EducationForm;
