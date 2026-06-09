"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FileText, Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import {
  buildVoiceCaptureStatusPanel,
  type VoiceCaptureStatus,
} from "@/app/voice/ui/voice-capture-status";

type TranscribeResult = {
  ok: boolean;
  status: "success" | "manual_required";
  provider: "openai" | "manual";
  transcript: string;
  audioName: string | null;
  reason: string | null;
  model: string | null;
};

function formatVoiceTranscriptionResultStatusLabel(status: TranscribeResult["status"]) {
  if (status === "success") return "转写成功";
  return "需手动整理";
}

function formatVoiceTranscriptionProviderLabel(provider: TranscribeResult["provider"]) {
  if (provider === "openai") return "自动转写";
  return "手动整理";
}

function formatVoiceTranscriptionResultNote(result: TranscribeResult) {
  if (result.ok) return "已填入转写文本，请检查术语和代码变量名。";
  if (!result.reason) return "当前需要手动粘贴转写文本。";
  if (result.reason.includes("missing audio file")) {
    return "请先选择音频文件，或者直接把理解写进转写文本。";
  }
  if (result.reason.includes("too large")) {
    return "音频文件过大，请换一个 20MB 以内的文件。";
  }
  if (result.reason.includes("unsupported audio type")) {
    return "这个音频格式暂不支持，请换一个常见音频格式。";
  }
  return "当前需要手动粘贴转写文本。";
}

export function VoiceCapture(props: {
  onTranscript: (value: string) => void;
  getMode: () => string;
}) {
  const { onTranscript, getMode } = props;
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isUnmountingRef = useRef(false);

  const [status, setStatus] = useState<VoiceCaptureStatus>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("");
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [lastResult, setLastResult] = useState<TranscribeResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const canTranscribe = status === "recorded" || status === "file-selected";

  useEffect(() => {
    return () => {
      isUnmountingRef.current = true;
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (status !== "recording") return;
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      setRecordedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 500);
    return () => window.clearInterval(id);
  }, [status]);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    chunksRef.current = [];
    setRecordedSeconds(0);
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      if (isUnmountingRef.current) return;

      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      setAudioUrl(URL.createObjectURL(blob));
      const name = `browser-recording-${new Date().toISOString()}.webm`;
      setAudioName(name);
      let recordedFile: File | null = null;
      try {
        const file = new File([blob], name, { type: blob.type || "audio/webm" });
        recordedFile = file;
        const dt = new DataTransfer();
        dt.items.add(file);
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }
      } catch {
        // If the browser blocks setting file inputs programmatically, users can still upload manually.
      }
      setStatus("recorded");
      if (recordedFile) {
        transcribeAudioFile(recordedFile);
      }
    };
    recorder.start();
    setStatus("recording");
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  function selectedFile() {
    return fileInputRef.current?.files?.[0] ?? null;
  }

  function transcribeAudioFile(file: File | null) {
    if (!file) {
      setLastResult({
        ok: false,
        status: "manual_required",
        provider: "manual",
        transcript: "",
        audioName: audioName || null,
        reason: "missing audio file",
        model: null,
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setStatus("file-too-large");
      return;
    }

    setStatus("transcribing");
    setLastResult(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("audioFile", file);
        formData.set("audioName", file.name);
        formData.set("mode", getMode());
        const { transcribeAudioAction } = await import("@/app/voice/actions");
        const res = (await transcribeAudioAction(formData)) as TranscribeResult;
        setLastResult(res);
        if (res.ok && res.transcript) onTranscript(res.transcript);
      } catch (err) {
        setLastResult({
          ok: false,
          status: "manual_required",
          provider: "manual",
          transcript: "",
          audioName: file.name || audioName || null,
          reason: err instanceof Error ? err.message : "transcription failed",
          model: null,
        });
      } finally {
        setStatus("file-selected");
      }
    });
  }

  function triggerTranscribe() {
    transcribeAudioFile(selectedFile());
  }

  const statusPanel = useMemo(() => {
    return buildVoiceCaptureStatusPanel({
      status: status === "transcribing" || isPending ? "transcribing" : status,
      seconds: recordedSeconds,
      hasTranscript: Boolean(lastResult?.transcript?.trim()),
      lastResultStatus: lastResult?.status ?? null,
    });
  }, [status, isPending, recordedSeconds, lastResult]);

  return (
    <div className="grid gap-3">
      <input type="hidden" name="audioName" value={audioName} />

      <div className="rounded-lg border bg-muted/20 p-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-medium">{statusPanel.title}</div>
              <LearningStatusBadge tone={statusPanel.tone}>{statusPanel.badgeLabel}</LearningStatusBadge>
            </div>
            <div className="mt-1 text-xs leading-5 text-muted-foreground">{statusPanel.description}</div>
          </div>
          <div className="rounded-md border bg-background px-3 py-2 text-right">
            <div className="text-[0.68rem] font-medium tracking-wide text-muted-foreground">录音计时</div>
            <div className="font-mono text-lg tabular-nums">{statusPanel.timerLabel}</div>
          </div>
        </div>
      </div>

      <div
        aria-label="语音录音移动操作"
        className="sticky bottom-16 z-20 grid gap-2 rounded-lg border bg-background/95 p-2 shadow-sm backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none sm:flex sm:items-center sm:justify-between"
      >
        <div className="grid gap-2 sm:flex sm:items-center">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={startRecording}
            disabled={status === "recording" || isPending}
            className="min-h-12 w-full sm:w-auto"
          >
            <Mic className="size-4" />
            一键录音
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={stopRecording}
            disabled={status !== "recording" || isPending}
            className="min-h-12 w-full sm:w-auto"
          >
            <Square className="size-4" />
            停止并转写
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          停止后自动转写并填入转写文本；上传音频仍可手动触发转写。
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="voice-audio-file" className="text-sm font-medium">
          上传音频（临时发送到服务端转写）
        </label>
        <Input
          id="voice-audio-file"
          ref={(node) => {
            fileInputRef.current = node;
          }}
          className="min-h-11"
          name="audioFile"
          type="file"
          accept="audio/*"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            if (!file) return;
            if (file.size > 20 * 1024 * 1024) {
              setStatus("file-too-large");
              return;
            }
            setAudioUrl(URL.createObjectURL(file));
            setAudioName(file.name);
            setStatus("file-selected");
            setLastResult(null);
          }}
        />
      </div>

      {audioUrl ? (
        <audio controls src={audioUrl} className="w-full">
          <track kind="captions" />
        </audio>
      ) : null}

      <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
        <Button
          type="button"
          size="sm"
          onClick={triggerTranscribe}
          disabled={!canTranscribe || isPending}
          className="min-h-11 w-full sm:w-auto"
        >
          <FileText className="size-4" />
          自动转写到转写文本
        </Button>
        <div className="text-xs text-muted-foreground">
          需要服务端配置转写 Provider；未配置时会提示手动粘贴。
        </div>
      </div>

      {lastResult ? (
        <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>转写方式：{formatVoiceTranscriptionProviderLabel(lastResult.provider)}</div>
            <LearningStatusBadge tone={lastResult.ok ? "success" : "warning"}>
              {formatVoiceTranscriptionResultStatusLabel(lastResult.status)}
            </LearningStatusBadge>
          </div>
          <div className="mt-2">提示：{formatVoiceTranscriptionResultNote(lastResult)}</div>
        </div>
      ) : null}
    </div>
  );
}
