import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Sparkles, X, Volume2 } from 'lucide-react';

interface AudioTranscriberProps {
  onTranscribeComplete: (text: string) => void;
  buttonLabel?: string;
  compact?: boolean;
  className?: string;
}

export const AudioTranscriber: React.FC<AudioTranscriberProps> = ({
  onTranscribeComplete,
  buttonLabel = 'Voice Note',
  compact = false,
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/wav';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size === 0) return;

        await processAudioForTranscription(audioBlob, mimeType);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setErrorMsg('Microphone access blocked or unavailable.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const processAudioForTranscription = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBase64: base64Data,
          mimeType,
        }),
      });

      const data = await response.json();
      if (data.text) {
        onTranscribeComplete(data.text);
      } else {
        setErrorMsg('Could not transcribe audio.');
      }
    } catch (err: any) {
      console.error('Transcription request error:', err);
      setErrorMsg('Transcription failed. Please check network.');
    } finally {
      setIsTranscribing(false);
      setRecordSeconds(0);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isTranscribing) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold animate-pulse ${className}`}>
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
        <span>Transcribing via gemini-3.5-transcribe...</span>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs shadow-xs ${className}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
        <span className="font-mono font-bold text-rose-700">{formatTime(recordSeconds)}</span>
        <div className="flex items-center gap-0.5 px-1">
          <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1 h-4 bg-rose-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce" />
        </div>
        <button
          type="button"
          onClick={stopRecording}
          className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
          title="Stop and transcribe"
        >
          <Square className="w-3 h-3 fill-current" />
          <span>Done</span>
        </button>
        <button
          type="button"
          onClick={cancelRecording}
          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          title="Cancel recording"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={startRecording}
        className={`inline-flex items-center gap-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
          compact
            ? 'p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs min-h-[38px]'
            : 'px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs shadow-xs min-h-[38px]'
        }`}
        title="Dictate with microphone (transcribed by gemini-3.5-transcribe)"
      >
        <Mic className="w-3.5 h-3.5 text-indigo-600" />
        <span>{buttonLabel}</span>
      </button>

      {errorMsg && (
        <span className="text-[10px] text-rose-600 font-medium">
          {errorMsg}
        </span>
      )}
    </div>
  );
};
