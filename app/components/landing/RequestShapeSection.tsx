import { requestExample, responseExample } from "./content";

export function RequestShapeSection() {
  return (
    <section data-reveal className="border-b border-[var(--line)] bg-[var(--request-tint)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">Request shape</h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">
            Keep the payload small and predictable. The endpoint expects a list of remote video
            URLs plus optional music tags.
          </p>
        </div>

        <div className="grid gap-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--ink-soft)]">Input</p>
            <pre className="overflow-x-auto rounded-[10px] border border-[var(--line)] bg-[var(--field)] p-4 text-sm leading-7 text-[var(--ink)]">
              <code>{requestExample}</code>
            </pre>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--ink-soft)]">Response</p>
            <pre className="overflow-x-auto rounded-[10px] border border-[var(--line)] bg-[var(--field)] p-4 text-sm leading-7 text-[var(--ink)]">
              <code>{responseExample}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
