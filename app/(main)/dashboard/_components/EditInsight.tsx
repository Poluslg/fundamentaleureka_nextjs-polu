"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { onboardingSchema } from "@/lib/schema";
import { industries } from "@/data/data";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/actions/user";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  industry: string;
  subIndustry?: string;
  bio?: string;
  experience?: number;
  skills?: Array<string>;
};

function EditProfile({ user }: { user: User }) {
  const [selectedIndustry, setSelectedIndustry] = useState<{
    id: string;
    name: string;
    subIndustries: string[];
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),

    // Replace defaultValues with this
    defaultValues: (() => {
      const [industryId, ...subParts] = user.industry.split("-");
      const subIndustry = subParts.join("-").replace(/-/g, " ");

      return {
        industry: industryId,
        subIndustry: subIndustry
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        experience: user.experience,
        skills: user.skills,
        bio: user.bio,
      };
    })(),
  });

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    const formattedIndustry = `${values.industry}-${values.subIndustry
      .toLowerCase()
      .replace(/ /g, "-")}`;

    await updateUserFn({
      ...values,
      industry: formattedIndustry,
    });
  };

  useEffect(() => {
    if (updateResult && !updateLoading) {
      toast.success("Profile updated!");
    }
  }, [updateResult, updateLoading]);

  const watchIndustry = watch("industry");

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your career preferences and insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Industry Selection */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={watch("industry")}
              onValueChange={(value) => {
                setValue("industry", value);
                const ind = industries.find((i) => i.id === value);
                setSelectedIndustry(ind || null);
                setValue("subIndustry", "");
              }}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Industries</SelectLabel>
                  {industries.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-sm text-red-500">{errors.industry.message}</p>
            )}
          </div>

          {/* Sub-Industry */}
          {watchIndustry && (
            <div className="space-y-2">
              <Label htmlFor="subIndustry">Specialization</Label>
              <Select
                value={watch("subIndustry")}
                onValueChange={(value) => setValue("subIndustry", value)}
              >
                <SelectTrigger id="subIndustry">
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Specializations</SelectLabel>
                    {selectedIndustry?.subIndustries.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.subIndustry && (
                <p className="text-sm text-red-500">
                  {errors.subIndustry.message}
                </p>
              )}
            </div>
          )}

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              placeholder="Enter years of experience"
              {...register("experience")}
            />
            {errors.experience && (
              <p className="text-sm text-red-500">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              placeholder="e.g., Python, JavaScript"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-sm text-red-500">{errors.skills.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Write a short bio"
              className="h-32"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={updateLoading}>
            {updateLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default EditProfile;
