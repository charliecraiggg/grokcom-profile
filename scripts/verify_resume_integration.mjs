import { chromium } from '/Users/chenjwww/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../tmp/pdfs/resume-20261018/', import.meta.url));
console.log('Screenshot directory:', output);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1700, height: 1050 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
await page.goto('http://127.0.0.1:4174/', { waitUntil: 'networkidle' });
await page.getByRole('link', { name: '经历', exact: true }).click();
await page.locator('a[aria-label="陈嘉玮 Charlie，返回顶部"]').focus();
await page.locator('#broadcast').screenshot({ path: output + 'hosting-desktop.png' });
const desktop = await page.locator('#broadcast').evaluate(section => ({
  photos: [...section.querySelectorAll('img')].map(img => ({ alt: img.alt, loaded: img.complete && img.naturalWidth > 0 })),
  experiences: section.querySelectorAll('.experience-list article').length,
  overflow: document.documentElement.scrollWidth > innerWidth,
}));
await page.setViewportSize({ width: 390, height: 844 });
await page.locator('#broadcast-title').scrollIntoViewIfNeeded();
await page.screenshot({ path: output + 'hosting-mobile-viewport.png' });
await page.locator('#broadcast').screenshot({ path: output + 'hosting-mobile.png' });
const mobile = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, width: innerWidth }));
await page.getByRole('button', { name: 'AI视频作品', exact: true }).click();
await page.getByRole('heading', { name: '作品整理中', exact: true }).waitFor();
await page.getByRole('button', { name: '全部', exact: true }).click();
await page.getByRole('button', { name: '播放《空篷船》', exact: true }).waitFor();
const videoCount = await page.locator('#works .work-card-action').count();
await page.getByRole('button', { name: '播放《空篷船》', exact: true }).click();
await page.getByRole('dialog', { name: '空篷船', exact: true }).waitFor();
await page.getByRole('button', { name: '关闭', exact: true }).click();
await page.getByRole('button', { name: '查看《92新闻搜索》节目卡片', exact: true }).click();
await page.getByRole('button', { name: '播放《92新闻搜索》', exact: true }).waitFor();
await page.getByRole('button', { name: '切换为深色模式' }).click();
await page.locator('#broadcast').screenshot({ path: output + 'hosting-mobile-dark.png' });
console.log(JSON.stringify({ desktop, mobile, videoCount, errors }, null, 2));
await browser.close();
