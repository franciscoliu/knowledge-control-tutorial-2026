# ACL 2026 Tutorial — Poster

Print-ready poster for **Knowledge Control for Responsible Generative AI**.
Design: **navy + warm amber** theme (deep navy frame, cream content panel, navy section
bands with an amber accent), *DM Serif Display* title + *IBM Plex Sans* body. Big type,
QR at the top, headshot-forward — inspired by the MeLLM @ ACL 2026 layout.

## Files

- `poster.html` — editable source (A0 portrait, 841 × 1189 mm). Edit text/people here.
- `ACL2026_poster_A0.pdf` — print-ready PDF (send to a printer).
- `ACL2026_poster_preview.png` — full-size PNG preview.
- `img/` — speaker/panelist headshots + generated QR code (`qr.png`).
- `img/logos/acl.png` — **optional**: drop the official ACL 2026 logo here and it appears
  top-left automatically. If absent, a styled "ACL 2026" wordmark is shown instead.

People are split into **Speakers** (academic presenters) and **Industry Panelists**
(Nouha Dziri · Cohere Labs, Yuning Mao · Meta Superintelligence Labs, Jindong Gu · Google),
matching the Part IV panel.

## Re-export after editing `poster.html`

Requires Google Chrome (uses headless print). An internet connection loads the Google Fonts.

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Print-ready PDF (A0 page size comes from the @page rule in the HTML)
"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="ACL2026_poster_A0.pdf" "file://$PWD/poster.html"

# Full-size PNG preview (A0 @ 96 dpi)
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=3179,4494 --screenshot="ACL2026_poster_preview.png" "file://$PWD/poster.html"
```

For a higher-DPI raster (e.g. 2×), set `--force-device-scale-factor=2` and double the window size.

## Regenerate the QR code

```bash
python3 -c "import qrcode; qr=qrcode.QRCode(border=2,box_size=24,error_correction=qrcode.constants.ERROR_CORRECT_Q); qr.add_data('https://franciscoliu.github.io/knowledge-control-tutorial-2026/'); qr.make(fit=True); qr.make_image(fill_color='#0d1c45',back_color='white').save('img/qr.png')"
```

To point the QR at a different URL, swap the `add_data(...)` string. To use your own QR
image instead, just overwrite `img/qr.png`.
