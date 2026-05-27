"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VoiceCapture() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [status, setStatus] = useState("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("");

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
      setAudioUrl(URL.createObjectURL(blob));
      setAudioName(`browser-recording-${new Date().toISOString()}.webm`);
      stream.getTracks().forEach((track) => track.stop());
      setStatus("recorded");
    };
    recorder.start();
    setStatus("recording");
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name="audioName" value={audioName} />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={startRecording}
          disabled={status === "recording"}
        >
          开始录音
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={stopRecording}
          disabled={status !== "recording"}
        >
          停止录音
        </Button>
        <div className="text-xs text-muted-foreground">状态：{status}</div>
      </div>
      <div className="grid gap-2">
        <div className="text-sm font-medium">上传音频（临时发送到服务端转写）</div>
        <Input
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
          }}
        />
      </div>
      {audioUrl ? (
        <audio controls src={audioUrl} className="w-full">
          <track kind="captions" />
        </audio>
      ) : null}
      <div className="text-xs text-muted-foreground">
        MVP 暂不长期保存音频；如果服务端没有转写密钥，请在 transcript 区粘贴或编辑转写文本。
      </div>
    </div>
  );
}
