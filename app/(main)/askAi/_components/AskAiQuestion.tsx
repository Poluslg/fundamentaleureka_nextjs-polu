"use client";

import { askAiQuestion } from "@/actions/askAi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SendIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MarkdownTypewriter from "./MarkdownTypewriter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const chatSchema = z.object({
  message: z
    .string()
    .min(1, "Message must be between 1 and 1000 characters")
    .max(1000, "Message must be between 1 and 1000 characters"),
});

function AskAiQuestion() {
  const { data: session } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: "",
    },
  });

  const {
    loading: askAiLoading,
    fn: askAiFn,
    data: askAiResult,
  } = useFetch(askAiQuestion);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const sendMessage = async (value: z.infer<typeof chatSchema>) => {
    setUserInput((prev) => [...prev, value.message]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await askAiFn(value);
    } catch {
      toast.error("Something went wrong while sending your message.");
    } finally {
      form.reset();
    }
  };

  useEffect(() => {
    if (askAiResult) {
      setResults((prev) => [...prev, askAiResult]);
    }
  }, [askAiResult]);

  return (
    <div>
      <div className="flex flex-col gap-2 p-4">
        {userInput.map((input, index) => (
          <div
            key={`input-${index}`}
            className="flex flex-col gap-2 items-start space-x-2"
          >
            <div className="ml-auto max-w-xs text-white">
              <div className="flex items-start md:flex-row flex-col-reverse gap-2">
                <p className="bg-blue-500 h-full p-3 rounded-lg shadow">
                  {input}
                </p>
                <Avatar>
                  <AvatarImage
                    src={
                      session?.user?.image || "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback>
                    {session?.user?.name || "User"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* AI Response */}
            {results[index] && (
              <div className="md:max-w-4xl max-w-xs text-gray-800 p-3 rounded-lg shadow">
                <div className="flex items-start gap-2">
                  <Avatar>
                    <AvatarImage src="/Logo.png" />
                    <AvatarFallback>FME</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col w-full markdown-wrap dark:text-white text-black">
                    <MarkdownTypewriter content={results[index]} speed={1} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-muted/35 dark:text-gray-400 rounded-lg text-md flex items-center justify-between px-5 w-full h-fit">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(sendMessage)}
            className="w-full h-fit flex flex-col"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your message here..."
                      className="border-0 focus:border-0 focus:ring-0 focus:outline-none bg-transparent disabled:cursor-not-allowed disabled:text-gray-300 resize-none w-full p-2 max-h-96 min-h-16 mt-5"
                      ref={textareaRef}
                      rows={1}
                      onInput={handleInput}
                      disabled={askAiLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(sendMessage)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end my-2">
              <Button
                variant={"secondary"}
                type="submit"
                className="min-w-24"
                disabled={askAiLoading}
              >
                {askAiLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </div>
                ) : (
                  <SendIcon className="h-7 w-7" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AskAiQuestion;
