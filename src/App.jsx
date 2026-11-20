import React, { useEffect, useRef, useState } from "react";
import { HeroCover } from "./components/HeroCover.jsx";
import { HeroIntro } from "./components/HeroIntro.jsx";
import { PortfolioWorksSection } from "./components/PortfolioWorks.jsx";
import { AudioArchive } from "./components/AudioArchive.jsx";
import { SectionHeading } from "./components/SectionHeading.jsx";
import { profileData } from "./profileData.js";

export function App() {
  const [showIntro, setShowIntro] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [activeSection, setActiveSection] = useState("top");
  const heroRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("charlie-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("charlie-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const applyTheme = () => {
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("charlie-theme", nextTheme);
      setTheme(nextTheme);
    };

    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyTheme();
      return;
    }

    document.startViewTransition(applyTheme);
  };

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;

    const updatePointer = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      hero.style.setProperty("--pointer-shift-x", `${(x * 10).toFixed(2)}px`);
      hero.style.setProperty("--pointer-shift-y", `${(y * 8).toFixed(2)}px`);
      hero.style.setProperty("--pointer-tilt-x", `${(-y * 1.2).toFixed(2)}deg`);
      hero.style.setProperty("--pointer-tilt-y", `${(x * 1.4).toFixed(2)}deg`);
      hero.style.setProperty("--bg-shift-x", `${(x * 16).toFixed(2)}px`);
      hero.style.setProperty("--bg-shift-y", `${(y * 12).toFixed(2)}px`);
    };

    const resetPointer = () => {
      ["--pointer-shift-x", "--pointer-shift-y", "--pointer-tilt-x", "--pointer-tilt-y", "--bg-shift-x", "--bg-shift-y"].forEach((property) => hero.style.removeProperty(property));
    };

    hero.addEventListener("pointermove", updatePointer);
    hero.addEventListener("pointerleave", resetPointer);
    return () => {
      hero.removeEventListener("pointermove", updatePointer);
      hero.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  useEffect(() => {
    const sections = ["top", "works", "audio", "broadcast", "awards"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-18% 0px -62% 0px", threshold: [0, .1, .25] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">跳到主要内容</a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="陈嘉玮 Charlie，返回顶部">
            <span className="brand-cn">陈嘉玮</span>
            <span className="brand-en">C</span>
          </a>
          <div className="header-actions">
            <nav aria-label="页面导航">
              <a href="#archive-title" aria-current={activeSection === "works" ? "location" : undefined}>作品</a>
              <a href="#audio-title" aria-current={activeSection === "audio" ? "location" : undefined}>声音</a>
              <a href="#broadcast-title" aria-current={activeSection === "broadcast" ? "location" : undefined}>经历</a>
              <a href="#awards-title" aria-current={activeSection === "awards" ? "location" : undefined}>荣誉</a>
            </nav>
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={`切换为${theme === "dark" ? "浅色" : "深色"}模式`}
              aria-pressed={theme === "dark"}
            >
              <svg className="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M12 4.5a7.5 7.5 0 0 0 0 15Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className={`hero${showIntro ? " hero-intro-active" : ""}`} id="top" aria-labelledby="hero-title" ref={heroRef}>
          {showIntro && <HeroIntro theme={theme} onComplete={() => setShowIntro(false)} />}
          <div className="hero-inner hero-main">
            <HeroCover />
          </div>
        </section>

        <PortfolioWorksSection />

        <AudioArchive />

        <section className="section editorial-section" id="broadcast" aria-labelledby="broadcast-title">
          <div className="section-inner split-layout">
            <div className="hosting-profile">
              <SectionHeading id="broadcast-title" title="全流程与现场" intro="三年广电训练沉淀为一套可交付能力：事实核验、真人表达、内容组织与现场推进。" />
              <div className="hosting-identity">
                <img src={profileData.hostingProfile.portrait} alt="陈嘉玮个人肖像" width="1942" height="1942" loading="lazy" />
                <div>
                  <p>{profileData.hostingProfile.organization}</p>
                  <p>{profileData.hostingProfile.currentPrograms}</p>
                  <p>{profileData.hostingProfile.education}</p>
                </div>
              </div>
              <ul className="hosting-credentials" aria-label="主持专业资质">
                {profileData.hostingProfile.credentials.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="experience-list">
              {profileData.hostingExperience.map((item) => (
                <article key={item.title}>
                  <p className="experience-type">{item.type}</p>
                  <div><h3>{item.title}</h3><p className="experience-detail">{item.detail}</p></div>
                </article>
              ))}
            </div>
            <div className="hosting-photo-strip" aria-label="主持、采访与声音工作剪影">
              {profileData.hostingPhotos.map((photo) => (
                <figure key={photo.src}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" style={{ objectPosition: photo.position }} />
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section awards-section" id="awards" aria-labelledby="awards-title">
          <div className="section-inner split-layout">
            <SectionHeading id="awards-title" title="可信度证据" intro="奖项与职业资质是案例之外的验证，不替代作品本身。" />
            <div className="award-list">
              {profileData.awards.map((award) => <p key={award}>{award}</p>)}
            </div>
          </div>
        </section>

      </main>

      <footer className="site-footer" id="contact">
        <div className="section-inner footer-inner">
          <div className="footer-signature">
            <span>陈嘉玮 / Charlie</span>
            <p>视频内容导演 / 出镜型编导 / AI 辅助内容生产</p>
          </div>
          <div className="footer-contacts" aria-label="联系方式">
            <a href="tel:19157688969"><span>联系电话</span><strong>191 5768 8969</strong><small>微信同号</small></a>
            <div><span>微信</span><strong>Charliew_</strong></div>
            <a href="mailto:charlie_1205@163.com"><span>邮箱</span><strong>charlie_1205@163.com</strong></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
