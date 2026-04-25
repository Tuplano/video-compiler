import { exec as execCallback } from "child_process";
import { randomInt } from "crypto";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import os from "os";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";

const exec = promisify(execCallback);
const FREETOUSE_API_BASE = process.env.FREETOUSE_API_BASE || "https://api.freetouse.com/v3";
const FREETOUSE_TRACK_SEARCH_PATH =
  process.env.FREETOUSE_TRACK_SEARCH_PATH || "/music/tracks/search";
const FFMPEG_BIN = process.env.FFMPEG_BIN || "/usr/bin/ffmpeg";
const FFPROBE_BIN = process.env.FFPROBE_BIN || "/usr/bin/ffprobe";
const RECENT_TRACK_HISTORY_LIMIT = 8;
const recentSelectedTrackIds: string[] = [];

export const runtime = "nodejs";

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function shellEscape(str: string): string {
  return str.replace(/(["$`\\])/g, "\\$1");
}

async function getMediaDuration(input: string) {
  const command = `"${shellEscape(
    FFPROBE_BIN
  )}" -v error -show_entries format=duration -of csv=p=0 "${shellEscape(
    input
  )}"`;

  let stdout: string;

  try {
    ({ stdout } = await exec(command));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("not found")) {
      throw new Error(
        `ffprobe was not found. Set FFPROBE_BIN in your environment or install ffprobe. Current value: ${FFPROBE_BIN}`
      );
    }

    throw error;
  }

  const duration = Number.parseFloat(stdout.trim());

  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Could not determine media duration for ${input}`);
  }

  return duration;
}

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary configuration. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

type FreeToUseTrack = {
  id: string | number;
  name?: string;
  title?: string;
  audio?: string;
  audio_url?: string;
  preview_url?: string;
  stream_url?: string;
  download_url?: string;
  files?: { mp3?: string };
  artists?: Array<{ name?: string } | [number, { name?: string }]>;
  artist?: { name?: string };
  artist_name?: string;
};

function getFreeToUseAudioUrl(track: FreeToUseTrack) {
  const candidates = [
    track.audio,
    track.audio_url,
    track.preview_url,
    track.stream_url,
    track.download_url,
    track.files?.mp3,
  ];

  return candidates.find((value) => typeof value === "string" && value.length > 0);
}

function getFreeToUseArtistName(track: FreeToUseTrack) {
  if (track.artist_name) {
    return track.artist_name;
  }

  if (track.artist?.name) {
    return track.artist.name;
  }

  if (Array.isArray(track.artists)) {
    const names = track.artists
      .map((artistEntry) => {
        if (Array.isArray(artistEntry)) {
          return artistEntry[1]?.name;
        }

        return artistEntry?.name;
      })
      .filter((name): name is string => typeof name === "string" && name.length > 0);

    if (names.length > 0) {
      return names.join(", ");
    }
  }

  return "Unknown artist";
}

function pickRandomTrack(tracks: FreeToUseTrack[]) {
  const randomIndex = randomInt(tracks.length);

  return tracks[randomIndex];
}

function getTrackSearchQueries(tags?: string[]) {
  const normalizedTags =
    Array.isArray(tags) && tags.length > 0
      ? tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      : [];
  const joinedTags = normalizedTags.join(" ");
  const defaults = ["chill cinematic soundtrack", "cinematic instrumental", "ambient background"];

  const queries = normalizedTags.length > 0
    ? [
        joinedTags,
        `${joinedTags} soundtrack`,
        `${joinedTags} instrumental`,
        `${joinedTags} background`,
      ]
    : defaults;

  return Array.from(new Set(queries.map((query) => query.trim()).filter((query) => query.length > 0)));
}

function rememberSelectedTrack(trackId: string) {
  recentSelectedTrackIds.push(trackId);

  if (recentSelectedTrackIds.length > RECENT_TRACK_HISTORY_LIMIT) {
    recentSelectedTrackIds.splice(0, recentSelectedTrackIds.length - RECENT_TRACK_HISTORY_LIMIT);
  }
}

async function searchFreeToUseTracks(query: string) {
  const requestNonce = `${Date.now()}-${randomInt(1_000_000_000)}`;

  const params = new URLSearchParams({
    query,
    limit: "20",
    order: "random",
    nonce: requestNonce,
    _: requestNonce,
  });

  const baseUrl = FREETOUSE_API_BASE.replace(/\/$/, "");
  const searchPath = FREETOUSE_TRACK_SEARCH_PATH.startsWith("/")
    ? FREETOUSE_TRACK_SEARCH_PATH
    : `/${FREETOUSE_TRACK_SEARCH_PATH}`;
  const requestUrl = `${baseUrl}${searchPath}?${params.toString()}`;

  const response = await fetch(requestUrl, {
    cache: "no-store",
    headers: {
      "cache-control": "no-cache, no-store, max-age=0",
      pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`Free To Use request failed with status ${response.status} at ${requestUrl}`);
  }

  const data = (await response.json()) as {
    ok?: boolean;
    data?: FreeToUseTrack[];
    results?: FreeToUseTrack[];
    message?: string;
  };

  return {
    tracks: (data.data || data.results || []).filter((track) => Boolean(getFreeToUseAudioUrl(track))),
    message: data.message,
  };
}

async function getRandomFreeToUseTrack(tags?: string[]) {
  const queries = getTrackSearchQueries(tags);
  const searchResults = await Promise.all(queries.map((query) => searchFreeToUseTracks(query)));
  const rawTracks = searchResults.flatMap((result) => result.tracks);
  const dedupedTracks = new Map<string, FreeToUseTrack>();

  rawTracks.forEach((track) => {
    dedupedTracks.set(String(track.id), track);
  });

  const tracks = Array.from(dedupedTracks.values());

  if (tracks.length === 0) {
    const sampleTrack = rawTracks[0] ? JSON.stringify(rawTracks[0]).slice(0, 500) : "none";
    const firstMessage = searchResults.find((result) => result.message)?.message;
    throw new Error(
      firstMessage ||
        `No playable Free To Use tracks found. Sample track: ${sampleTrack}`
    );
  }

  const nonRepeatingTracks = tracks.filter(
    (track) => !recentSelectedTrackIds.includes(String(track.id))
  );
  const selectionPool = nonRepeatingTracks.length > 0 ? nonRepeatingTracks : tracks;
  const selectedTrack = pickRandomTrack(selectionPool);
  const audioUrl = getFreeToUseAudioUrl(selectedTrack);

  if (!audioUrl) {
    throw new Error("Selected Free To Use track did not include an audio URL");
  }

  rememberSelectedTrack(String(selectedTrack.id));

  return {
    id: String(selectedTrack.id),
    name: selectedTrack.title || selectedTrack.name || "Unknown track",
    artist: getFreeToUseArtistName(selectedTrack),
    audioUrl,
  };
}

export async function POST(req: NextRequest) {
  let outputPath: string | null = null;

  try {
    const body = await req.json();
    const videos = body?.videos;
    const musicTags = Array.isArray(body?.musicTags)
      ? body.musicTags.filter((tag: unknown): tag is string => typeof tag === "string" && tag.length > 0)
      : undefined;

    if (!Array.isArray(videos) || videos.length < 1) {
      return NextResponse.json(
        { success: false, message: "videos must be a non-empty array" },
        { status: 400 }
      );
    }

    for (let i = 0; i < videos.length; i += 1) {
      if (typeof videos[i] !== "string" || !videos[i].startsWith("http")) {
        return NextResponse.json(
          { success: false, message: `Invalid URL at index ${i}` },
          { status: 400 }
        );
      }
    }

    const outputFileName = `final_${Date.now()}.mp4`;
    const tempDir = path.join(os.tmpdir(), "video-compiler");

    ensureDir(tempDir);

    outputPath = path.join(tempDir, outputFileName);

    const selectedTrack = await getRandomFreeToUseTrack(musicTags);
    const clipDurations = await Promise.all(videos.map((url) => getMediaDuration(url)));
    const totalDuration = clipDurations.reduce((sum, duration) => sum + duration, 0);

    const inputArgs = videos
      .map((url) => `-i "${shellEscape(url)}"`)
      .join(" ");

    const videoFilters = videos
      .map(
        (_, i) =>
          `[${i}:v]scale=720:1280:force_original_aspect_ratio=decrease,` +
          `pad=720:1280:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p[v${i}]`
      )
      .join(";");

    const concatInputs = videos.map((_, i) => `[v${i}]`).join("");
    const concatFilter = `${videoFilters};${concatInputs}concat=n=${videos.length}:v=1:a=0[vout]`;

    const command = `
      "${shellEscape(FFMPEG_BIN)}" -y \
      ${inputArgs} \
      -stream_loop -1 -i "${shellEscape(selectedTrack.audioUrl)}" \
      -filter_complex "${concatFilter};[${videos.length}:a]volume=0.15,atrim=duration=${totalDuration.toFixed(
        3
      )},asetpts=N/SR/TB[aout]" \
      -map "[vout]" \
      -map "[aout]" \
      -c:v libx264 \
      -preset veryfast \
      -crf 23 \
      -c:a aac \
      -t ${totalDuration.toFixed(3)} \
      "${shellEscape(outputPath)}"
    `;

    try {
      await exec(command);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes("not found")) {
        throw new Error(
          `ffmpeg was not found. Set FFMPEG_BIN in your environment or install ffmpeg. Current value: ${FFMPEG_BIN}`
        );
      }

      throw error;
    }

    configureCloudinary();

    const uploadResult = await cloudinary.uploader.upload(outputPath, {
      folder: "video-compiler",
      public_id: outputFileName.replace(/\.mp4$/i, ""),
      resource_type: "video",
      overwrite: true,
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Compile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (outputPath && fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
}
