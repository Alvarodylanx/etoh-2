import { useState, useRef, useEffect } from 'react';

const MAX_SECONDS = 60;

export default function VoiceRecorder({ onRecorded }) {
  const [status, setStatus] = useState('idle'); // idle | recording | done
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setBlob(audioBlob);
        setStatus('done');
        if (onRecorded) onRecorded(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setStatus('recording');
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stopRecording();
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      alert('Microphone access denied. Please allow microphone permissions.');
    }
  }

  function stopRecording() {
    clearInterval(timerRef.current);
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      mediaRef.current.stop();
    }
  }

  function reset() {
    setStatus('idle');
    setSeconds(0);
    setAudioUrl(null);
    setBlob(null);
    if (onRecorded) onRecorded(null);
  }

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="voice-recorder">
      <div className="voice-recorder-controls">
        {status === 'idle' && (
          <button className="record-btn idle" onClick={startRecording} title="Start recording">
            🎙️
          </button>
        )}
        {status === 'recording' && (
          <button className="record-btn recording" onClick={stopRecording} title="Stop recording">
            ⏹️
          </button>
        )}
        {status !== 'idle' && (
          <span className="record-timer">{fmtTime(seconds)}</span>
        )}
        <span className="record-status">
          {status === 'idle' && 'Tap the mic to record a voice description (max 60s)'}
          {status === 'recording' && 'Recording... tap stop when done'}
          {status === 'done' && 'Voice note saved!'}
        </span>
        {status === 'done' && (
          <button className="btn btn-outline btn-sm" onClick={reset}>
            Re-record
          </button>
        )}
      </div>

      {audioUrl && (
        <audio className="audio-player" controls src={audioUrl} />
      )}
    </div>
  );
}
