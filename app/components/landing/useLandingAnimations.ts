"use client";

import { RefObject } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useLandingAnimations(pageRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const heroTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: "[data-hero-section]",
          start: "top 72%",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      });

      heroTimeline
        .from("[data-hero-copy]", {
          y: 46,
          opacity: 0,
          filter: "blur(12px)",
          duration: 1.05,
        })
        .from(
          "[data-hero-panel]",
          {
            y: 34,
            opacity: 0,
            filter: "blur(10px)",
            scale: 0.985,
            duration: 1,
          },
          "-=0.78"
        )
        .from(
          "[data-note-item]",
          {
            y: 18,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
          },
          "-=0.6"
        );

      gsap.to("[data-hero-copy]", {
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-copy]",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to("[data-hero-panel]", {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero-panel]",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element, index) => {
        const staggerItems = element.querySelectorAll<HTMLElement>("[data-stagger-item]");
        const direction = index % 2 === 0 ? 1 : -1;

        gsap.from(element, {
          y: 34,
          opacity: 0,
          filter: "blur(8px)",
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 83%",
            toggleActions: "play reverse play reverse",
          },
        });

        if (staggerItems.length === 0) {
          return;
        }

        gsap.from(staggerItems, {
          x: 28 * direction,
          y: 22,
          opacity: 0,
          filter: "blur(8px)",
          duration: 1,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        });
      });
    },
    { scope: pageRef }
  );
}
