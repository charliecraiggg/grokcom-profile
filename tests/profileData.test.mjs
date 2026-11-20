import assert from "node:assert/strict";
import { profileData } from "../src/profileData.js";
import { classifyMedia } from "../src/mediaLibrary.js";
import { portfolioGroups, portfolioWorks } from "../src/portfolioWorks.js";
import { aiVideoWorks } from "../src/aiVideoWorks.js";
import { audioPrograms } from "../src/audioPrograms.js";

assert.equal(profileData.name, "陈嘉玮");
assert.equal(profileData.alias, "Charlie");
assert.equal(profileData.birthYear, "2000");
assert.match(profileData.education, /浙江工业大学/);
assert.match(profileData.education, /播音与主持艺术/);
assert.ok(profileData.programs.includes("宁广早新闻"));
assert.ok(profileData.programs.includes("92晚新闻"));
assert.ok(profileData.programs.includes("等风来"));
assert.ok(profileData.programs.includes("娱乐先锋"));
assert.ok(profileData.programs.includes("乡村不一young"));
assert.ok(profileData.awards.some((award) => award.includes("中央网信办")));
assert.ok(profileData.awards.some((award) => award.includes("浙江省新闻奖")));
assert.ok(profileData.awards.some((award) => award.includes("宁波新闻奖")));
assert.ok(profileData.awards.some((award) => award.includes("二级播音员")));

assert.equal(classifyMedia({ name: "sample.MOV", type: "" }), "video");
assert.equal(classifyMedia({ name: "radio.wav", type: "audio/wav" }), "audio");
assert.equal(classifyMedia({ name: "portrait.webp", type: "image/webp" }), "image");
assert.equal(classifyMedia({ name: "notes.docx", type: "application/octet-stream" }), "file");

assert.equal(portfolioWorks.length, 13);
assert.ok(portfolioWorks.some((work) => work.title === "千钧智勇"));
assert.ok(portfolioWorks.every((work) => work.videoPath && work.video && work.poster));
assert.equal(new Set(portfolioWorks.map((work) => work.videoPath)).size, portfolioWorks.length);
assert.ok(portfolioWorks.every((work) => work.poster.startsWith("/media-posters/") && work.video.startsWith("/videos/")));
assert.ok(portfolioWorks.every((work) => Object.values(work).every((value) => typeof value !== "string" || !value.startsWith("/Volumes/"))));
const featureCluster = ["boat-documentary", "shi-zhiyong", "intangible-new-year"]
  .map((id) => portfolioWorks.find((work) => work.id === id));
assert.ok(featureCluster.every(Boolean));
assert.equal(featureCluster[0].posterOrientation, "portrait");
assert.deepEqual(featureCluster.map((work) => work.title), ["空篷船", "千钧智勇", "非遗里的年味儿"]);
assert.equal(portfolioGroups.at(-1)?.id, "ai");
assert.equal(portfolioGroups.at(-1)?.title, "AI视频作品");
assert.deepEqual(aiVideoWorks, []);

const userPosterMappings = portfolioWorks
  .filter((work) => work.posterSource === "用户提供封面")
  .map(({ id, poster, video }) => ({ id, poster, video }));
assert.deepEqual(userPosterMappings, [
  { id: "recitation", poster: "/media-posters/recitation.jpg?v=20260714", video: "/videos/recitation.m4v" },
  { id: "waiting-for-wind-teaser", poster: "/media-posters/waiting-for-wind-teaser.jpg?v=20260714", video: "/videos/waiting-for-wind-teaser.m4v" },
  { id: "waiting-for-wind-ep1", poster: "/media-posters/waiting-for-wind-ep1.jpg?v=20260714", video: "/videos/waiting-for-wind-ep1.m4v" },
  { id: "on-the-road", poster: "/media-posters/on-the-road.jpg?v=20260714", video: "/videos/on-the-road.m4v" }
]);

assert.equal(audioPrograms.length, 5);
assert.ok(audioPrograms.every((program) => program.src.startsWith("/audio/") && program.durationSeconds > 0));
assert.ok(audioPrograms.every((program) => !program.src.startsWith("/Volumes/") && !program.src.includes("网站用这个")));
assert.equal(audioPrograms.find((program) => program.id === "entertainment-stephen-chow")?.src, "/audio/fm-entertainment-stephen-chow.mp3");
assert.equal(audioPrograms.find((program) => program.id === "entertainment-stephen-chow")?.cover, "/audio-posters/fish-first-podcast.jpg?v=20260721");
assert.equal(audioPrograms.find((program) => program.id === "evening-news-20260717")?.src, "/audio/fm92-evening-news-20260717.mp3");
assert.equal(portfolioWorks.find((work) => work.id === "industrial-checkin")?.poster, "/media-posters/industrial-checkin.jpg?v=20260721");

console.log("profileData content checks passed");
