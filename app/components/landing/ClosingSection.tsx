export function ClosingSection() {
  return (
    <section data-reveal className="bg-[var(--footer-tint)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8">
        <div className="flex flex-col gap-5 pt-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              Built for one clear job: return a finished video URL.
            </h2>
            <p className="mt-3 text-base leading-7 text-[var(--muted)]">
              Keep the editing logic in code, keep the workflow simple, and hand off one final
              asset instead of several raw clips.
            </p>
          </div>
          <a
            href="#tester"
            className="inline-flex min-h-11 items-center justify-center rounded-[9px] border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-5 text-sm font-semibold text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent)]"
          >
            Try the form
          </a>
        </div>
      </div>
    </section>
  );
}
