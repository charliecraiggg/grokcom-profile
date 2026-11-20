# 嘉玮的个人简历网站

置顶「个人网站简介」对应的网站项目，基于 React、Vite 和 Remotion。

## 本地运行

使用 Node.js 22 或更新版本与 pnpm。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm build
pnpm preview
pnpm test:content
```

## 本次同步范围

包含当前网站源码、配置、锁文件、测试、脚本、人物图片和作品封面。排除依赖、构建产物、临时文件、设计审计归档和旧子项目 `charlie-portfolio-site/`。

约 4.2GB 的原始音视频按用户选择保留在本机，不上传 GitHub。换电脑时需另行复制 `public/audio/` 和 `public/videos/` 并保留文件名；只克隆仓库时，作品音视频无法播放。上传仓库不代表网站已经部署上线。

## 同步

```sh
git pull --ff-only
git add .
git commit -m "Update portfolio"
git push
```

推送前检查 `git status`，不要将密钥、私人资料或原始音视频加入提交。
