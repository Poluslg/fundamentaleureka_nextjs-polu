"use client";
import { inproveWithAi, saveResume } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { resumeSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  DownloadIcon,
  Edit,
  Loader2,
  Loader2Icon,
  Monitor,
  SaveIcon,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Entryform from "./entry-form";
import { entriesToMarkdown } from "@/lib/helper";
import MDEditor from "@uiw/react-md-editor";
import { useSession } from "next-auth/react";
import EducationForm from "./EducationForm";
// import html2pdf from "html2pdf.js/dist/html2pdf.min";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

type Props = { initialContent: unknown };

function ResumeBuilder({ initialContent }: Props) {
  const [activeTab, setActiveTab] = useState("edit");
  const [resumeMode, setResumeMode] = useState("preview");
  const [previewContent, setPreviewContent] = useState(
    initialContent as string
  );
  const [pdfIsGenerating, setPdfIsGenerating] = useState(false);
  const { data: session } = useSession();
  // const [name, setName] = useState(String);

  const user = session?.user;
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      ContactInfo: {
        email: "",
        mobile: "",
        linkedin: "",
        twitter: "",
      },
      Summary: "",
      Skills: "",
      Experience: [],
      Education: [],
      Projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(inproveWithAi);

  const formValue = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : (initialContent as string));
    }
  }, [formValue, activeTab]);

  const getContactMarkDown = () => {
    const { ContactInfo } = formValue;
    const parts = [];
    if (ContactInfo.email) parts.push(`📧 ${ContactInfo.email}`);
    if (ContactInfo.mobile) parts.push(`📱 ${ContactInfo.mobile}`);
    if (ContactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${ContactInfo.linkedin})`);
    if (ContactInfo.twitter) parts.push(`🐦 [Twitter](${ContactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.name}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    // const { ContactInfo, Education, Experience, Projects, Skills, Summary } =
    //   formValue;
    const { Education, Experience, Projects, Skills, Summary } = formValue;
    console.log(Education);
    return [
      getContactMarkDown(),
      Summary && `## Professional Summary\n\n${Summary}`,
      Skills && `## Skills\n\n${Skills}`,
      entriesToMarkdown(Experience, "Experience"),
      entriesToMarkdown(Projects, "Projects"),
      entriesToMarkdown(Education, "Education"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume Saved Successfully");
    }
    if (saveError) {
      toast.error("Failed to save resume");
    }
  }, []);

  const onSubmit = async () => {
    const stringPreviewContent = previewContent as string;
    try {
      const formattedContent = stringPreviewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();
      console.log("Formatted Content:", formattedContent);
      // await saveResumeFn(formattedContent);
    } catch (error) {
      console.error(error);
    }
  };

  const doc = new jsPDF();

  const generatePDF = async () => {
    const pdfName = session?.user?.name;
    const element = document.getElementById("resume-pdf");
    if (element) {
      setPdfIsGenerating(true);
      doc.text(element.innerText, 10, 10);
      doc.save(pdfName + "-resume.pdf");
    } else {
      console.error("Something went wrong while generating PDF");
    }
    // try {
    // const opstion = {
    //   margin: [15, 15],
    //   filename: `${user?.name}-resume.pdf`,
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    // };
    // html2pdf().set(opstion).from(element).save();
    // html2pdf().from(element).set(opstion).save();
    // await html2pdf(element, opstion);
    // } catch (error) {
    //   console.error(error);
    // } finally {
    //   setPdfIsGenerating(false);
    // }
  };
  useEffect(() => {
    // console.log(improvedContent);
    if (improvedContent && !improveError) {
      // {
      //   if (name === "Summary") {
      setValue("Summary", improvedContent);
      //   } else if (name === "Skills") {
      //     setValue("Skills", improvedContent);
      //   }
      // }
      toast.success(`Summary improved with AI successfully`);
    }
  }, [improvedContent, improveError, isImproving]);

  const handleImproveProfessionalSummary = async () => {
    // setName("Summary");
    // if (name === "Summary") {
    const description = watch("Summary");
    if (!description) {
      toast.error("Please enter a description to improve");
      return;
    }
    await improveWithAIFn({ current: description, type: "summary" });
    // }
    return;
  };

  // const handleImproveSkill = async () => {
  //   setName("Skills");
  //   if (name === "Skills") {
  //     const skills = watch(name);
  //     if (!skills) {
  //       toast.error("Please enter a skill to improve");
  //       return;
  //     }
  //     await improveWithAIFn({ current: skills, type: "skills" });
  //   }
  //   return;
  // };

  // console.log(name)

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-2 pb-4">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button
            variant={"destructive"}
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button
            onClick={generatePDF}
            disabled={pdfIsGenerating}
            className={`${activeTab === "edit" ? "hidden" : ""}`}
          >
            {typeof window !== "undefined" && (
              <>
                {pdfIsGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating PDF....
                  </>
                ) : (
                  <>
                    <DownloadIcon className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...register("ContactInfo.email")}
                      type="email"
                      placeholder="Email"
                      //   error={errors.contactInfo?.email}
                    />
                    {errors.ContactInfo?.email && (
                      <p className="text-red-500 text-sm">
                        {errors?.ContactInfo?.email?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">Mobile Number</label>
                    <Input
                      {...register("ContactInfo.mobile")}
                      type="tel"
                      placeholder="+91 123 456 7890"
                    />
                    {errors.ContactInfo?.mobile && (
                      <p className="text-red-500 text-sm">
                        {errors?.ContactInfo?.mobile?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">LinkedIn URL</label>
                    <Input
                      {...register("ContactInfo.linkedin")}
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                    />
                    {errors.ContactInfo?.linkedin && (
                      <p className="text-red-500 text-sm">
                        {errors?.ContactInfo?.linkedin?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">
                      Twitter/X Profile
                    </label>
                    <Input
                      {...register("ContactInfo.twitter")}
                      type="url"
                      placeholder="https://x.com/username"
                    />
                    {errors.ContactInfo?.twitter && (
                      <p className="text-red-500 text-sm">
                        {errors?.ContactInfo?.twitter?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="Summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a Professional Summary"
                    // error={errors.summary}
                  />
                )}
              />
              {errors.Summary && (
                <p className="text-red-500 text-sm">{errors.Summary.message}</p>
              )}
              <Button
                type="button"
                variant="ghost"
                size={"sm"}
                onClick={handleImproveProfessionalSummary}
                disabled={isImproving || !watch("Summary")}
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
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="Skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your skills"
                    // error={errors.summary}
                  />
                )}
              />
              {errors.Skills && (
                <p className="text-red-500 text-sm">{errors.Skills.message}</p>
              )}
              {/* <Button
                type="button"
                variant="ghost"
                size={"sm"}
                onClick={handleImproveSkill}
                disabled={isImproving || !watch("Skills")}
              >
                {name === "Skills" || isImproving ? (
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
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="Experience"
                control={control}
                render={({ field }) => (
                  <Entryform
                    type={"Experience"}
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.Experience && (
                <p className="text-red-500 text-sm">
                  {errors.Experience.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="Projects"
                control={control}
                render={({ field }) => (
                  <Entryform
                    type={"Projects"}
                    entries={field.value}
                    onChange={field.onChange}
                    techStack={true}
                  />
                )}
              />
              {errors.Projects && (
                <p className="text-red-500 text-sm">
                  {errors.Projects.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="Education"
                control={control}
                render={({ field }) => (
                  <EducationForm
                    type={"Education"}
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.Education && (
                <p className="text-red-500 text-sm">
                  {errors.Education.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <Button
            variant={"link"}
            type="button"
            className="mb-2"
            onClick={() =>
              setResumeMode(resumeMode === "preview" ? "edit" : "preview")
            }
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Resume
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>
          {resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You Will lose editied markdown if you update the form data.
              </span>
            </div>
          )}

          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={(value) => setPreviewContent(value || "")}
              height={800}
              preview={resumeMode as "edit" | "preview"}
            />
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ResumeBuilder;
