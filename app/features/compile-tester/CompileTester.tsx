import type { CompileTesterProps } from "./types";

export function CompileTester({
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
}: CompileTesterProps) {
  return (
    <div
      id="tester"
      data-hero-panel
      className="rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_6px_18px_rgba(42,33,20,0.04)] lg:sticky lg:top-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">Try the endpoint</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          Paste remote clip URLs and send the request directly from the page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4 lg:max-h-[24rem] lg:overflow-y-auto lg:pr-1">
          {videoUrls.map((videoUrl, index) => (
            <div key={`video-url-${index}`} className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-[var(--ink-soft)]">
                  Clip URL {index + 1}
                </span>
                {videoUrls.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeVideoUrl(index)}
                    className="text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <input
                type="url"
                value={videoUrl}
                onChange={(event) => updateVideoUrl(index, event.target.value)}
                placeholder="https://example.com/clip.mp4"
                className="min-h-11 rounded-[9px] border border-[var(--line)] bg-[var(--field)] px-3.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent-strong)] focus:bg-[var(--surface)]"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addVideoUrl}
            className="inline-flex min-h-10 items-center justify-center rounded-[9px] border border-[var(--line-strong)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent-strong)] hover:bg-[var(--surface-strong)]"
          >
            Add another clip URL
          </button>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--ink-soft)]">Music tags</span>
            <input
              type="text"
              value={musicTags}
              onChange={(event) => setMusicTags(event.target.value)}
              placeholder="cinematic, chill"
              className="min-h-11 rounded-[9px] border border-[var(--line)] bg-[var(--field)] px-3.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent-strong)] focus:bg-[var(--surface)]"
            />
          </label>

          {resultUrl ? (
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-strong)] p-4">
              <p className="mb-1.5 text-sm font-semibold">Result URL</p>
              <a
                href={resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-sm leading-7 text-[var(--accent-strong)] underline underline-offset-4"
              >
                {resultUrl}
              </a>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-[10px] border border-[var(--error-line)] bg-[var(--error-bg)] p-4 text-sm leading-7 text-[var(--error-ink)]">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[9px] bg-[var(--accent-strong)] px-4 text-sm font-semibold text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Compiling video..." : "Run compile request"}
        </button>
      </form>
    </div>
  );
}
