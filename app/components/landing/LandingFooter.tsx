export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-[var(--muted)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="font-semibold text-[var(--ink-soft)]">Video Compiler</p>
          <p>Remote clips in. One final hosted video out.</p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <a href="#tester" className="transition-colors hover:text-[var(--ink)]">
            Try the form
          </a>
          <a href="#how" className="transition-colors hover:text-[var(--ink)]">
            How it works
          </a>
          <a href="#tester" className="transition-colors hover:text-[var(--ink)]">
            API tester
          </a>
        </div>
      </div>
    </footer>
  );
}
