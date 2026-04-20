export function LandingHeader() {
  return (
    <header className="border-b border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--ink)] text-sm font-semibold text-[var(--page-bg)]">
            VC
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[-0.01em]">Video Compiler</p>
            <p className="truncate text-sm text-[var(--muted)]">
              Remote clips in. One final hosted video out.
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] sm:flex">
          <a href="#how" className="transition-colors hover:text-[var(--ink)]">
            How it works
          </a>
          <a href="#tester" className="transition-colors hover:text-[var(--ink)]">
            Try it
          </a>
        </nav>
      </div>
    </header>
  );
}
