export type CompileResponse = {
  message?: string;
  url?: string;
};

export type CompileTesterProps = {
  addVideoUrl: () => void;
  errorMessage: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  musicTags: string;
  removeVideoUrl: (index: number) => void;
  resultUrl: string;
  setMusicTags: (value: string) => void;
  updateVideoUrl: (index: number, value: string) => void;
  videoUrls: string[];
};
