# Screenshots for the project README

Drop PNG screenshots in this folder to make the project page on GitHub
look like a real product launch. The top-of-`README.md` showcase block
references these filenames:

| Filename          | Recommended size | What to capture                                                            |
| ----------------- | ---------------- | -------------------------------------------------------------------------- |
| `overview.png`    | ~1600 × 900 px   | `/en` — Daily-brief hero + KPI row + Trade Flow editorial chart            |
| `map.png`         | ~1400 × 900 px   | `/en/map` — choropleth on `Students` mode with mission pins visible        |
| `trade.png`       | ~1400 × 900 px   | `/en/trade` — Annual summary + Dual-methodology + Trade Flow chart         |
| `assistant.png`   | ~1400 × 900 px   | `/en/assistant` — chat with one user prompt + Claude reply                 |
| `admin.png`       | ~1400 × 900 px   | `/en/admin` — Settings + Production Readiness + Demo Registry preview     |

## How to capture (Windows)

1. Open the live deployment: <https://project-ukzu1.vercel.app/en>
2. Maximise your browser window (≥ 1400 px wide) and zoom to 100 %.
3. **Win + Shift + S** → drag a rectangle around the area you want.
4. The clip is in your clipboard — paste into Paint / Photos / Snipping Tool
   and save as PNG with the filename from the table above.
5. Drop the PNG into `docs/screenshots/` and commit:
   ```bash
   git add docs/screenshots/*.png
   git commit -m "docs(readme): add showcase screenshots"
   git push
   ```

The README will then render with rich previews on the GitHub project page
and on your profile when the repo is pinned.
