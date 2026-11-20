# 纯 AI 视频作品接入规范

网站顶部作品分类中已预留“AI视频作品”标签。当前 `src/aiVideoWorks.js` 为空，因此页面只显示“作品整理中”，不会展示假案例。

## 固定目录

- 视频：`public/ai-video-portfolio/videos/`
- 封面：`public/ai-video-portfolio/posters/`
- 作品清单：`src/aiVideoWorks.js`

## 推荐格式

- 视频优先使用 `.mp4`，编码建议为 H.264 视频加 AAC 音频，兼容桌面端和手机端。
- 也可保存 `.m4v`、`.mov` 或 `.webm`，但上线前应在 Safari 和 Chrome 中实际验证。
- 封面优先使用 `.jpg` 或 `.webp`，也支持 `.png`；建议使用与成片一致的横竖比例。
- 视频和封面使用相同的英文短名，例如 `robot-story.mp4` 与 `robot-story.jpg`。

## 半自动接入方式

纯前端页面无法在发布后安全扫描本地文件夹，因此“把文件放进目录就自动上线”并不存在。稳定做法是：

1. 把真实成片和封面放进上述固定目录。
2. 在 `src/aiVideoWorks.js` 的数组中增加一条数据。
3. 运行内容检查和构建；通过后，作品会自动出现在“AI视频作品”标签下。

数据字段示例仅用于说明结构，不是占位作品，也不要直接保留在数组中：

```js
{
  id: "唯一英文短名",
  title: "真实作品标题",
  subtitle: "真实副标题或用途",
  group: "ai",
  format: "AI 短片",
  poster: "/ai-video-portfolio/posters/文件名.jpg",
  video: "/ai-video-portfolio/videos/文件名.mp4",
  posterOrientation: "portrait" // 仅竖版封面需要，可删除
}
```

只有真实使用过的工具、工作方式和项目结果才应写入后续说明，不把实拍作品或普通剪辑包装成 AI 作品。
