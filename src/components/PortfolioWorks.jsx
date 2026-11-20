import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { portfolioGroups, portfolioWorks } from "../portfolioWorks.js";
import { aiVideoWorks } from "../aiVideoWorks.js";

function WorkCard({ work, onPlay, sequence: sequenceNumber, total = portfolioWorks.length }) {
  const sequence = String(sequenceNumber ?? portfolioWorks.findIndex((item) => item.id === work.id) + 1).padStart(2, "0");
  const cardClassName = [
    "work-card",
    work.posterOrientation === "portrait" && "work-card-portrait"
  ].filter(Boolean).join(" ");

  const updatePointer = (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--card-pointer-x", `${(x * 100).toFixed(1)}%`);
    event.currentTarget.style.setProperty("--card-pointer-y", `${(y * 100).toFixed(1)}%`);
    event.currentTarget.style.setProperty("--card-shift-x", `${((x - .5) * 9).toFixed(2)}px`);
    event.currentTarget.style.setProperty("--card-shift-y", `${((y - .5) * 7).toFixed(2)}px`);
  };

  const resetPointer = (event) => {
    event.currentTarget.style.removeProperty("--card-pointer-x");
    event.currentTarget.style.removeProperty("--card-pointer-y");
    event.currentTarget.style.removeProperty("--card-shift-x");
    event.currentTarget.style.removeProperty("--card-shift-y");
  };

  return (
    <article className={cardClassName} style={{ viewTransitionName: `work-${work.id}` }}>
      <button
        className="work-card-action"
        type="button"
        onClick={(event) => onPlay(work, event.currentTarget)}
        onPointerMove={updatePointer}
        onPointerLeave={resetPointer}
        aria-label={`播放《${work.title}》`}
      >
        <span className="work-card-media">
          <img src={work.poster} alt={`${work.title}作品封面`} loading="lazy" decoding="async" />
          <span className="play-orb" aria-hidden="true">播放</span>
        </span>
        <span className="work-card-copy">
          <span className="work-card-meta"><span>{work.format}</span><span>{sequence} / {total}</span></span>
          <strong>{work.title}</strong>
          <span>{work.subtitle}</span>
        </span>
      </button>
    </article>
  );
}

function PlayerDialog({ work, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!work) return undefined;
    setStatus("loading");
    const appShell = document.querySelector(".app-shell");
    const hadInert = appShell?.hasAttribute("inert");
    const previousAriaHidden = appShell?.getAttribute("aria-hidden");
    if (appShell) {
      appShell.setAttribute("inert", "");
      appShell.setAttribute("aria-hidden", "true");
    }
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll("button, video, [href], [tabindex]:not([tabindex='-1'])");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (!appShell) return;
      if (!hadInert) appShell.removeAttribute("inert");
      if (previousAriaHidden === null) appShell.removeAttribute("aria-hidden");
      else appShell.setAttribute("aria-hidden", previousAriaHidden);
    };
  }, [work, onClose]);

  if (!work) return null;

  return createPortal(
    <div className="player-backdrop" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="player-dialog" role="dialog" aria-modal="true" aria-labelledby="player-title" aria-describedby="player-status">
        <div className="player-heading">
          <div><span>{work.format}</span><h2 id="player-title">{work.title}</h2></div>
          <button ref={closeRef} type="button" className="player-close" onClick={onClose}>关闭</button>
        </div>
        <div className="player-video-wrap">
          <div id="player-status" className={`player-status player-status-${status}`} role="status" aria-live="polite">
            {status !== "ready" && <span>{status === "error" ? "视频暂时无法加载，请关闭后重试。" : "正在准备视频"}</span>}
          </div>
          <video
            key={work.id}
            src={work.video}
            poster={work.poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
            tabIndex="0"
            aria-label={`《${work.title}》视频播放器`}
            onLoadStart={() => setStatus("loading")}
            onWaiting={() => setStatus("loading")}
            onCanPlay={() => setStatus("ready")}
            onPlaying={() => setStatus("ready")}
            onError={() => setStatus("error")}
          />
        </div>
      </section>
    </div>,
    document.body
  );
}

export function PortfolioWorksSection() {
  const [activeWork, setActiveWork] = useState(null);
  const [activeGroup, setActiveGroup] = useState("all");
  const triggerRef = useRef(null);
  const filteredWorks = useMemo(() => {
    if (activeGroup === "ai") return aiVideoWorks;
    return activeGroup === "all" ? portfolioWorks : portfolioWorks.filter((work) => work.group === activeGroup);
  }, [activeGroup]);
  const activeGroupInfo = portfolioGroups.find((group) => group.id === activeGroup);
  const activeGroupTitle = activeGroup === "all" ? "全部" : activeGroupInfo?.title;
  const activeGroupIntro = activeGroup === "all"
    ? "城市、人物、栏目与现场，构成持续生长的创作脉络。"
    : activeGroupInfo?.intro;
  const featureCluster = useMemo(() => {
    const clusterIds = ["boat-documentary", "shi-zhiyong", "intangible-new-year"];
    const works = clusterIds.map((id) => filteredWorks.find((work) => work.id === id));
    return works.every(Boolean) ? works : null;
  }, [filteredWorks]);

  const selectGroup = useCallback((groupId) => {
    if (groupId === activeGroup) return;
    if (!document.startViewTransition) {
      setActiveGroup(groupId);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => setActiveGroup(groupId));
    });
  }, [activeGroup]);

  const openWork = useCallback((work, trigger) => {
    triggerRef.current = trigger;
    setActiveWork(work);
  }, []);

  const closeWork = useCallback(() => {
    setActiveWork(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <>
      <section className="section work-archive" id="works" aria-labelledby="archive-title">
        <div className="section-inner">
          <div className="archive-head">
            <div><h2 id="archive-title">作品档案</h2><p>{activeGroupIntro}</p></div>
            <div className="filter-pills" role="group" aria-label="作品分类">
              <button type="button" aria-controls="works-grid" aria-pressed={activeGroup === "all"} onClick={() => selectGroup("all")}>全部</button>
              {portfolioGroups.map((group) => <button key={group.id} type="button" aria-controls="works-grid" aria-pressed={activeGroup === group.id} onClick={() => selectGroup(group.id)}>{group.title}</button>)}
            </div>
          </div>
          <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">当前显示{activeGroupTitle}，共 {filteredWorks.length} 部作品。</p>
          <div className={`archive-grid archive-grid-${activeGroup}`} id="works-grid">
            {activeGroup === "ai" && filteredWorks.length === 0 && (
              <div className="archive-empty-state" role="status">
                <span>AI VIDEO PORTFOLIO</span>
                <h3>作品整理中</h3>
              </div>
            )}
            {filteredWorks.map((work) => {
              if (activeGroup === "ai") {
                const index = aiVideoWorks.findIndex((item) => item.id === work.id);
                return <WorkCard key={work.id} work={work} onPlay={openWork} sequence={index + 1} total={aiVideoWorks.length} />;
              }
              if (featureCluster && work.id === "boat-documentary") {
                return (
                  <div className="archive-feature-cluster" key="portrait-feature-cluster">
                    <WorkCard work={featureCluster[0]} onPlay={openWork} />
                    <div className="archive-feature-stack">
                      <WorkCard work={featureCluster[1]} onPlay={openWork} />
                      <WorkCard work={featureCluster[2]} onPlay={openWork} />
                    </div>
                  </div>
                );
              }
              if (featureCluster && featureCluster.some((clusterWork) => clusterWork.id === work.id)) return null;
              return <WorkCard key={work.id} work={work} onPlay={openWork} />;
            })}
          </div>
        </div>
      </section>

      <PlayerDialog work={activeWork} onClose={closeWork} />
    </>
  );
}
