"""market-briefing 페이지 만들기: src/ + weeks/ → index.html

weeks/weeks.json 의 순서(최신이 위)대로 주차 탭을 만들고, 맨 위 주차를 먼저 보여준다.
대명체는 페이지에 쓰인 글자만 잘라 woff(base64)로 넣는다 (글꼴 파일은 저장소에 두지 않음).
실행: python build.py
"""
import base64, html, io, json, re
from pathlib import Path

HERE = Path(__file__).resolve().parent
FONT_DIR = Path.home() / "Desktop" / "동시점 판매비교" / "_program" / "fonts"
EXTRA = "0123456789.,%+-~()/:·—$₩ ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz▼"


def font_css(text):
    try:
        from fontTools import subset
        from fontTools.ttLib import TTFont
    except ImportError:
        return ""
    css = ""
    for fn, w in [("DAEMYUNGREGULAR.TTF", 400), ("DAEMYUNGBOLD.TTF", 700)]:
        if not (FONT_DIR / fn).exists():
            continue
        f = TTFont(FONT_DIR / fn)
        o = subset.Options(); o.flavor = "woff"; o.layout_features = ["*"]
        s = subset.Subsetter(o); s.populate(text="".join(sorted(set(text) | set(EXTRA)))); s.subset(f)
        f.flavor = "woff"; b = io.BytesIO(); f.save(b)
        css += '@font-face{font-family:"Daemyung";font-weight:%d;src:url(data:font/woff;base64,%s) format("woff")}\n' % (
            w, base64.b64encode(b.getvalue()).decode())
    return css


def build():
    weeks = json.loads((HERE / "weeks" / "weeks.json").read_text(encoding="utf-8"))
    pills, mains = [], []
    for i, wk in enumerate(weeks):
        wid = "w" + re.sub(r"\W", "", wk["key"])
        body = (HERE / "weeks" / f'{wk["key"]}.html').read_text(encoding="utf-8").replace("{W}", wid)
        body = body.replace("<main>", f'<main data-week="{wid}"{" hidden" if i else ""}>', 1)
        label = re.sub(r"\((.*?)\)", r'<span class="num">(\1)</span>', wk["label"])
        pills.append(f'<button class="weekpill{" active" if i == 0 else ""}" data-week="{wid}">{label}</button>')
        mains.append(f"<!-- ===== {wk['label']} ===== -->\n{body}")
    page_body = (HERE / "src" / "header.html").read_text(encoding="utf-8") + \
        '\n<nav class="weeknav">\n  ' + "\n  ".join(pills) + "\n</nav>\n\n" + "\n".join(mains)
    text = html.unescape(re.sub(r"<[^>]+>", " ", page_body))
    style = (HERE / "src" / "style.css").read_text(encoding="utf-8") + font_css(text)
    out = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>항공시장 브리핑</title>
<meta name="robots" content="noindex,nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
{style}</style>
</head>
<body>
<div class="topbar"></div>
<div class="app">
{page_body}
<footer>Trinity Airways · 주간 항공시장·노선 동향 브리핑 · 노선분석 작성</footer>
</div>
<script>
{(HERE / "src" / "app.js").read_text(encoding="utf-8")}</script>
</body>
</html>
"""
    (HERE / "index.html").write_text(out, encoding="utf-8")
    (HERE / ".nojekyll").touch()
    (HERE / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")  # 검색 노출 차단
    print(f"[저장] index.html ({len(out.encode()) // 1024}KB, 주차 {len(weeks)}개)")


if __name__ == "__main__":
    build()
