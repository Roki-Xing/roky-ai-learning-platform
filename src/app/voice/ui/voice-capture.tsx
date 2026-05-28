"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";

type TranscribeResult = {
  ok: boolean;
  status: "success" | "manual_required";
  provider: "openai" | "manual";
  transcript: string;
  audioName: string | null;
  reason: string | null;
  model: string | null;
};

export function VoiceCapture(props: {
  onTranscript: (value: string) => void;
  getMode: () => string;
}) {
  const { onTranscript, getMode } = props;
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [status, setStatus] = useState<
    "idle" | "recording" | "recorded" | "file-selected" | "file-too-large" | "transcribing"
  >("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("");
  const [lastResult, setLastResult] = useState<TranscribeResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const canTranscribe = status === "recorded" || status === "file-selected";

  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      setAudioUrl(URL.createObjectURL(blob));
      const name = `browser-recording-${new Date().toISOString()}.webm`;
      setAudioName(name);
      try {
        const file = new File([blob], name, { type: blob.type || "audio/webm" });
        const dt = new DataTransfer();
        dt.items.add(file);
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }
      } catch {
        // If the browser blocks setting file inputs programmatically, users can still upload manually.
      }
      stream.getTracks().forEach((track) => track.stop());
      setStatus("recorded");
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

  function triggerTranscribe() {
    const file = selectedFile();
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
          audioName: audioName || null,
          reason: err instanceof Error ? err.message : "transcription failed",
          model: null,
        });
      } finally {
        setStatus("file-selected");
      }
    });
  }

  const statusBadge = useMemo(() => {
    if (status === "file-too-large") return <LearningStatusBadge tone="danger">文件过大</LearningStatusBadge>;
    if (status === "transcribing" || isPending) return <LearningStatusBadge tone="info">转写中</LearningStatusBadge>;
    if (status === "recording") return <LearningStatusBadge tone="warning">录音中</LearningStatusBadge>;
    if (status === "recorded") return <LearningStatusBadge tone="info">已录音</LearningStatusBadge>;
    if (status === "file-selected") return <LearningStatusBadge tone="info">已选择音频</LearningStatusBadge>;
    return <LearningStatusBadge tone="neutral">idle</LearningStatusBadge>;
  }, [status, isPending]);

  return (
    <div className="grid gap-3">
      <input type="hidden" name="audioName" value={audioName} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={startRecording}
            disabled={status === "recording" || isPending}
          >
            开始录音
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={stopRecording}
            disabled={status !== "recording" || isPending}
          >
            停止录音
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {statusBadge}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="text-sm font-medium">上传音频（临时发送到服务端转写）</div>
        <Input
          ref={(node) => {
            fileInputRef.current = node;
          }}
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

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={triggerTranscribe}
          disabled={!canTranscribe || isPending}
        >
          自动转写到 Transcript
        </Button>
        <div className="text-xs text-muted-foreground">
          需要服务端配置转写 Provider；未配置时会提示手动粘贴。
        </div>
      </div>

      {lastResult ? (
        <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              provider: {lastResult.provider}
              {lastResult.model ? ` / model: ${lastResult.model}` : ""}
            </div>
            <LearningStatusBadge tone={lastResult.ok ? "success" : "warning"}>
              {lastResult.status}
            </LearningStatusBadge>
          </div>
          {lastResult.reason ? <div className="mt-2">reason: {lastResult.reason}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

