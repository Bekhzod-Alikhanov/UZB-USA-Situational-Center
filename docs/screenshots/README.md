# Screenshots for the project README

Drop WebP screenshots in this folder to make the project page on GitHub
look like a real product launch. The top-of-`README.md` showcase block
references these filenames:

| Filename         | Recommended size | What to capture                                                    |
| ---------------- | ---------------- | ------------------------------------------------------------------ |
| `overview.webp`  | ~1600 x 900 px   | `/en` - Daily-brief hero + KPI row + Trade Flow editorial chart    |
| `map.webp`       | ~1400 x 900 px   | `/en/map` - choropleth with mission pins visible                   |
| `trade.webp`     | ~1400 x 900 px   | `/en/trade` - Annual summary + Dual-methodology + Trade Flow chart |
| `sectors.webp`   | ~1400 x 900 px   | `/en/sectors` - sector-opportunity cards grid                      |
| `benchmark.webp` | ~1400 x 900 px   | `/en/benchmark` - UZ rank, UZ value, peer average + bar chart      |

## How to capture (Windows)

1. Open the live deployment: <https://uz-us-center.vercel.app/en>
2. Maximise your browser window (at least 1400 px wide) and zoom to 100%.
3. **Win + Shift + S** and drag a rectangle around the area you want.
4. The clip is in your clipboard. Paste into Paint / Photos / Snipping Tool
   and export or convert to WebP with the filename from the table above.
5. Drop the WebP into `docs/screenshots/` and commit:
   ```bash
   git add docs/screenshots/*.webp
   git commit -m "docs(readme): add showcase screenshots"
   git push
   ```

The README will then render with rich previews on the GitHub project page
and on your profile when the repo is pinned.
