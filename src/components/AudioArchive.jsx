import React, { useEffect, useMemo, useRef, useState } from "react";
import { audioPrograms } from "../audioPrograms.js";

function formatTime(value, roundUp = false) {
  if (!Number.isFinite(value) || value < 0) return "00:00";
  const total = roundUp ? Math.ceil(value) : Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function AudioArchive() {
  const [activeId, setActiveId] = useState(audioPrograms[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(audioPrograms[0].durationSeconds);
  const [error, setError] = useState("");
  const audioRef = useRef(null);
  const activeProgram = useMemo(
    () => audioPrograms.find((program) => program.id === activeId) ?? audioPrograms[0],
    [activeId]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isPlaying) {
      audio.pause();
      return;
    }
    const playPromise = audio.play();
    playPromise?.catch(() => {
      setIsPlaying(false);
      setError("浏览器暂未允许自动播放，请再次点击播放。");
    });
  }, [activeId, isPlaying]);

  const selectProgram = (program) => {
    if (program.id === activeId) return;
    setError("");
    setIsPlaying(false);
    setActiveId(program.id);
    setCurrentTime(0);
    setMediaDuration(program.durationSeconds);
  };

  const toggleProgramPlayback = (program) => {
    setError("");
    if (program.id === activeId) {
      setIsPlaying((playing) => !playing);
      return;
    }
    setActiveId(program.id);
    setCurrentTime(0);
    setMediaDuration(program.durationSeconds);
    setIsPlaying(true);
  };

  const seek = (event) => {
    const nextTime = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <section className="section audio-archive" id="audio" aria-labelledby="audio-title">
      <div className="section-inner">
        <div className="audio-archive-head">
          <div>
            <p className="audio-kicker">ON AIR / SELECTED RADIO</p>
            <h2 id="audio-title">广播声音档案</h2>
          </div>
          <p>新闻直播、特别节目与文娱表达，让声音成为作品集里可被直接听见的一条职业主线。</p>
        </div>

        <div className="audio-archive-layout">
          <div className="audio-console">
            <div className="audio-console-topline">
              <span>{String(audioPrograms.findIndex((item) => item.id === activeId) + 1).padStart(2, "0")} / {String(audioPrograms.length).padStart(2, "0")}</span>
              <span>{activeProgram.category}</span>
            </div>
            <div className={`audio-console-stage${activeProgram.cover ? " has-art" : ""}`}>
              <div className="audio-console-copy" aria-live="polite">
                <h3>{activeProgram.title}</h3>
                <span>{activeProgram.description}</span>
              </div>
              {activeProgram.cover && (
                <img className="audio-console-art" src={activeProgram.cover} alt={activeProgram.coverAlt} loading="lazy" decoding="async" />
              )}
            </div>
            <div className="audio-console-controls">
              <button type="button" onClick={() => toggleProgramPlayback(activeProgram)} aria-label={`${isPlaying ? "暂停" : "播放"}《${activeProgram.title}》`}>
                {isPlaying ? "暂停" : "播放"}
              </button>
              <div className="audio-timeline">
                <input
                  type="range"
                  min="0"
                  max={mediaDuration || activeProgram.durationSeconds}
                  step="0.1"
                  value={Math.min(currentTime, mediaDuration || activeProgram.durationSeconds)}
                  onChange={seek}
                  aria-label={`${activeProgram.title}播放进度`}
                  aria-valuetext={`${formatTime(currentTime)} / ${formatTime(mediaDuration, true)}`}
                />
                <div><span>{formatTime(currentTime)}</span><span>{formatTime(mediaDuration, true)}</span></div>
              </div>
            </div>
            {error && <p className="audio-error" role="alert">{error}</p>}
            <audio
              key={activeProgram.id}
              ref={audioRef}
              src={activeProgram.src}
              preload="metadata"
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onLoadedMetadata={(event) => setMediaDuration(event.currentTarget.duration || activeProgram.durationSeconds)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
              onError={() => { setError("音频暂时无法载入，请稍后重试。"); setIsPlaying(false); }}
            />
          </div>

          <ol className="audio-program-list">
            {audioPrograms.map((program, index) => {
              const active = program.id === activeId;
              return (
                <li key={program.id} className={active ? "is-active" : undefined}>
                  <button
                    className="audio-program-select"
                    type="button"
                    onClick={() => selectProgram(program)}
                    aria-label={`查看《${program.title}》节目卡片`}
                    aria-current={active ? "true" : undefined}
                  />
                  <span className="audio-program-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="audio-program-copy">
                    <span>{program.category}</span>
                    <h3>{program.title}</h3>
                    <p>{program.description}</p>
                  </div>
                  <span className="audio-program-duration">{program.duration}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
