export const processSteps = [
  {
    title: "Accept clip URLs",
    body: "Send remote MP4 links in one request and let the compiler prepare them for a single vertical export.",
  },
  {
    title: "Score the timeline",
    body: "A Free To Use track is selected from your tags and trimmed to match the final video duration.",
  },
  {
    title: "Return one asset",
    body: "The finished render is uploaded to Cloudinary and the API gives back one final URL for the next step in your workflow.",
  },
];

export const productNotes = [
  "Built for backend flows and no-code automations, not manual editing sessions.",
  "Normalizes multiple clips into one 720x1280 vertical output.",
  "Reads remote sources directly instead of storing every input file first.",
  "Returns one usable video URL after Cloudinary upload completes.",
];

export const initialVideoUrls = [
  "https://veoaifree.com/video/uploads/video_265168_1776659251.mp4",
  "https://veoaifree.com/video/uploads/video_265168_1776659251.mp4",
  "https://veoaifree.com/video/uploads/video_265168_1776659251.mp4",
];

export const requestExample = `{
  "videos": [
    "https://example.com/clip-1.mp4",
    "https://example.com/clip-2.mp4",
    "https://example.com/clip-3.mp4"
  ],
  "musicTags": ["cinematic", "chill"]
}`;

export const responseExample = `{
  "url": "https://res.cloudinary.com/..."
}`;
