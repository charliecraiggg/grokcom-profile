# 云电脑 Codex 接手说明

## 获取当前网站

```sh
git clone https://github.com/charliecraiggg/grokcom-profile.git
cd grokcom-profile
corepack pnpm install --frozen-lockfile
corepack pnpm test:content
corepack pnpm dev --host 0.0.0.0
```

建议 Node.js 22 LTS。预览端口默认 5173，云电脑需使用其端口转发或浏览器访问机制。

## 当前版本与工作边界

本仓库来自本机置顶「个人网站简介」对应的 `/Users/chenjwww/Documents/profile work` 根目录，不是其中的旧子项目 `charlie-portfolio-site`。

保留当前布局、素材映射和“一竖两横”作品组合（空篷船、千钧智勇、非遗里的年味儿），直接在现有成果上继续。

本机内容检查 `node tests/profileData.test.mjs` 已通过。本次构建尝试受本机 Codex 内置 Node 加载 Rollup 原生模块的签名限制影响，尚未通过；云电脑应正常安装依赖后独立运行构建。未部署网站。

## 音视频尚未同步

用户选择本次只同步代码、封面与人物图片，约 4.2GB 原始音视频仍在本机。媒体清单见 `media-manifest.json`。目前没有可用的云端媒体地址，不要把无法播放说成已完整同步。

媒体现用 `/audio/`、`/videos/` 路径；后续将素材上传云存储后，再配置地址或保留目录结构。AI 视频区目前为空，仅保留目录占位。

## 后续协作

J.W.C.O.D.E. 负责统筹 Codex 方面的任务；本仓库是两端共享代码的交接点。同一 Codex 账号不会自动复制本地文件或聊天历史，需要显式 clone/pull。

每次开始前 `git pull --ff-only`，结束后检查差异并提交推送，避免两端同时修改相同文件；不要强推。
