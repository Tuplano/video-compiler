"use client";

import { useState } from "react";

import { initialVideoUrls } from "@/app/components/landing/content";

import type { CompileResponse } from "./types";

export function useCompileTester() {
  const [videoUrls, setVideoUrls] = useState(initialVideoUrls);
  const [musicTags, setMusicTags] = useState("cinematic, chill");
  const [resultUrl, setResultUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateVideoUrl = (index: number, value: string) => {
    setVideoUrls((currentUrls) => {
      const nextUrls = [...currentUrls];
      nextUrls[index] = value;
      return nextUrls;
    });
  };

  const addVideoUrl = () => {
    setVideoUrls((currentUrls) => [...currentUrls, ""]);
  };

  const removeVideoUrl = (index: number) => {
    setVideoUrls((currentUrls) => {
      if (currentUrls.length === 1) {
        return currentUrls;
      }

      return currentUrls.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedVideos = videoUrls.map((url) => url.trim()).filter(Boolean);
    const cleanedTags = musicTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (cleanedVideos.length === 0) {
      setResultUrl("");
      setErrorMessage("Add at least one video URL before testing.");
      return;
    }

    setIsSubmitting(true);
    setResultUrl("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videos: cleanedVideos,
          musicTags: cleanedTags,
        }),
      });

      const data = (await response.json()) as CompileResponse;

      if (!response.ok || !data.url) {
        throw new Error(data.message || "Compile request failed.");
      }

      setResultUrl(data.url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Compile request failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addVideoUrl,
    errorMessage,
    handleSubmit,
    isSubmitting,
    musicTags,
    removeVideoUrl,
    resultUrl,
    setMusicTags,
    updateVideoUrl,
    videoUrls,
  };
}
