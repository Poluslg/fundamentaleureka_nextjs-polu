"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

function HeroSection() {
  const imgref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const imageElement = imgref.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (imageElement) {
        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("srolled");
        } else {
          imageElement.classList.remove("srolled");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto ">
          <h1 className="gradient-title text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl">
            Your AI Career Coach for <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance from our AI
            career,interview, resume and AI-powered tools for job success
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size={"lg"} className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0 overflow-hidden">
          <div ref={imgref} className="hero-image">
            <Image
              src="/banner.webp"
              width={1280}
              height={720}
              alt="hero image"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
