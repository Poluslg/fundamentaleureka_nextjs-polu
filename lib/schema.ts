import { z } from "zod";

export const onboardingSchema = z.object({
  // institutes: z.string({
  //   required_error: "Please select an institute",
  // }),
  // courses: z.string({
  //   required_error: "Please select a course",
  // }),
  // semester: z.string({
  //   required_error: "Please select a semester",
  // }),
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a sub-industry",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().optional(),
    organization: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
    current: z.boolean().default(false),
    techstack: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

export const educationSchema = z
  .object({
    academicqualification: z
      .string()
      .min(1, "Academic qualification is required"),
    institutes: z.string().min(1, "Institute name is required"),
    courses: z.string().min(1, "Institute name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required { unless this is your current position }",
      path: ["endDate"],
    }
  );

export const resumeSchema = z.object({
  ContactInfo: contactSchema,
  Summary: z.string().min(1, "Professional summary is required"),
  Skills: z.string().min(1, "Skills are required"),
  Experience: z.array(entrySchema),
  Education: z.array(entrySchema),
  Projects: z.array(entrySchema),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});
