"""Extract resume source photographs; retain the original PDF unchanged."""
import logging
from pathlib import Path
from io import BytesIO
from pypdf import PdfReader
from PIL import Image, ImageOps, ImageDraw

logging.disable(logging.CRITICAL)
root = Path(__file__).resolve().parents[1]
out = root / "tmp/pdfs/resume-20261018/images"
out.mkdir(parents=True, exist_ok=True)
source_pdf = Path("/Users/chenjwww/Desktop/陈嘉玮个人简历.pdf")
reader = PdfReader(source_pdf) if source_pdf.exists() else None
if reader is None and not (out / "p2-1.jpg").exists():
    raise FileNotFoundError("Resume PDF and previously extracted photographs are unavailable")
tiles = []
for page_index, page in enumerate(reader.pages if reader is not None else []):
    for image_index, source in enumerate(page.images):
        name = f"p{page_index + 1}-{image_index}"
        photo = Image.open(BytesIO(source.data)).convert("RGB")
        photo.save(out / f"{name}.jpg", quality=95)
        tile = Image.new("RGB", (300, 230), "#eeeeee")
        thumb = ImageOps.contain(photo, (290, 200))
        tile.paste(thumb, ((300-thumb.width)//2, 0))
        ImageDraw.Draw(tile).text((8, 207), f"{name} / {photo.width}x{photo.height}", fill="black")
        tiles.append(tile)
if tiles:
    sheet = Image.new("RGB", (1500, ((len(tiles)+4)//5)*230), "white")
    for index, tile in enumerate(tiles):
        sheet.paste(tile, ((index%5)*300, (index//5)*230))
    sheet.save(out.parent / "contact-sheet.jpg", quality=90)
print(f"Extracted {len(tiles)} images to {out}")

web = root / "public/profile"
web.mkdir(parents=True, exist_ok=True)
selected = {
    "p2-1": "charlie-portrait",
    "p5-5": "tianlai-host",
    "p5-1": "theatre-conversation",
    "p4-6": "news-reporting",
    "p7-1": "studio-voice",
}
for source, name in selected.items():
    photo = Image.open(out / f"{source}.jpg")
    photo.thumbnail((1600, 1600))
    photo.save(web / f"{name}.webp", quality=88, method=6)
print(f"Exported {len(selected)} website photographs to {web}")
