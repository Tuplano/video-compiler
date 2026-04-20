import { processSteps } from "./content";

export function HowItWorksSection() {
  return (
    <section
      id="how"
      data-reveal
      className="border-b border-[var(--line)] bg-[var(--pipeline-tint)]"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">How the pipeline works</h2>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">
            The service stays intentionally narrow so it fits cleanly inside a backend job, an n8n
            flow, or a lightweight API-first product.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              data-stagger-item
              className="border-l border-[var(--line-strong)] pl-5"
            >
              <p className="mb-4 text-sm font-semibold text-[var(--accent-strong)]">0{index + 1}</p>
              <h3 className="mb-2 text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
              <p className="text-sm leading-7 text-[var(--muted)]">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
