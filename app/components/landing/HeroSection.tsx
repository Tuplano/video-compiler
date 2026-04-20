import { CompileTester } from "@/app/features/compile-tester/CompileTester";
import type { CompileTesterProps } from "@/app/features/compile-tester/types";

import { productNotes } from "./content";

export function HeroSection(props: CompileTesterProps) {
  return (
    <section data-hero-section className="border-b border-[var(--line)] bg-[var(--hero-tint)]">
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-18 sm:px-8 lg:grid-cols-[1fr_420px] lg:gap-16 lg:py-28">
        <div data-hero-copy className="space-y-12">
          <div className="space-y-7">
            <p className="text-sm font-semibold text-[var(--accent-strong)]">
              API for automated video assembly
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-5xl lg:max-w-3xl lg:text-[4rem]">
              Compile multiple remote clips into one finished vertical video.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] lg:max-w-2xl">
              Submit URLs, let FFmpeg handle the assembly, score the output with Free To Use
              music, upload to Cloudinary, and return one URL that can move straight into your
              next automation step.
            </p>
          </div>

          <ul className="grid gap-x-10 gap-y-4 sm:max-w-2xl sm:grid-cols-2">
            {productNotes.map((note) => (
              <li
                key={note}
                data-note-item
                className="border-t border-[var(--line)] pt-4 text-sm leading-7 text-[var(--muted)]"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>

        <CompileTester {...props} />
      </div>
    </section>
  );
}
