import React from "react";

export function HeroCover({ semantic = true, motion = {} }) {
  const TitleTag = semantic ? "h1" : "div";

  return (
    <div className="portfolio-cover" style={motion.cover}>
      <div className="cover-topline" style={motion.topline}>
        <span>Charlie Chen</span>
        <span>Selected Works</span>
        <span>Direction / On-Camera / Edit</span>
      </div>

      <div className="cover-stage">
        <span className="cover-monogram" aria-hidden="true" style={motion.monogram}>C</span>
        <TitleTag id={semantic ? "hero-title" : undefined} className="cover-title" style={motion.title}>
          Portfolio
        </TitleTag>
        <span className="cover-script" aria-hidden="true" style={motion.script}>Charlie</span>
        <p className="cover-statement" style={motion.statement}>把复杂信息讲清楚，也把内容从选题推进到成片。</p>
      </div>

      <div className="cover-footer" style={motion.footer}>
        <div className="cover-identity">
          <strong>陈嘉玮</strong>
          <div className="cover-roles">
            <span>视频内容导演</span>
            <span>出镜型编导</span>
            <span>采访 / 脚本 / 拍摄 / 剪辑</span>
            <span>AI 辅助内容生产</span>
          </div>
        </div>
        <div className="cover-profile" aria-label="个人信息摘要">
          <div><span>经验</span><p>3 年广电全流程<br />2023 至今</p></div>
          <div><span>专业证据</span><p>浙江省新闻奖二等奖<br />二级播音员</p></div>
        </div>
      </div>
    </div>
  );
}
