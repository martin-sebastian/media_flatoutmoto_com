---
name: labelary-key-tags
description: Use Labelary viewer and API to test and preview key tag ZPL only (1.625"×2.125") before printing. Use when testing or debugging Zebra key tags, or when the user asks about Labelary or key tag preview.
---

# Labelary for Key Tags

Use Labelary to preview and test key tag ZPL without printing. The app has a **Preview** button that opens the current key tag ZPL in Labelary; this skill guides testing and template changes for key tags only.

## When to Use This Skill

- User wants to test or preview a key tag before printing
- Debugging key tag ZPL layout (text position, size, clipping)
- Adding or changing the key tag ZPL template (font, margins, fields)
- Explaining how Labelary fits into the key tag print flow

## Project Integration

- **ZPL generation**: `key-tags/key-tag.js` — `keyTagToZpl(data)` builds ZPL for the horizontal key tag (1.625" × 2.125", 203 DPI / 8 dpmm).
- **Preview in UI**: Key tag modal → expand "Direct print" → **Preview** opens `https://api.labelary.com/v1/printers/8dpmm/labels/1.625x2.125/0/{zpl}` in a new tab (PNG).
- **Print**: Same ZPL is sent to the Zebra via `/api/zebra-print` or the local relay (`scripts/zebra-relay.js`).

## Labelary Resources

| Resource | URL | Purpose |
|----------|-----|---------|
| **Viewer** | https://labelary.com/viewer.html | Paste ZPL, tweak density/size, export PNG/PDF, linter |
| **Label API** | https://api.labelary.com/v1/printers/8dpmm/labels/1.625x2.125/0/ | GET with URL-encoded ZPL → PNG (key tag size only) |
| **API docs** | https://labelary.com/service.html | Parameters: dpmm (6/8/12/24), width×height in inches, index (0-based label number) |

**API usage**: 8 dpmm = 203 DPI. Our key tag is 1.625" × 2.125". GET example:  
`https://api.labelary.com/v1/printers/8dpmm/labels/1.625x2.125/0/` + `encodeURIComponent(zpl)`.

## Workflow: Test a Key Tag

1. **Quick preview (no code)**  
   Open key tag for a vehicle → Direct print → **Preview**. New tab shows Labelary-rendered PNG.

2. **Edit ZPL in viewer**  
   Open https://labelary.com/viewer.html. Paste key tag ZPL (e.g. from `KeyTagComponent.toZpl(data)` or network/devtools). Set Print Density to 8 dpmm, Label Size to 1.625 × 2.125 in, then Redraw. Use for layout experiments.

3. **Change the template**  
   Edit `keyTagToZpl()` in `key-tags/key-tag.js`: adjust `marginX`/`marginY`, `lineH`, `fontH`/`fontW`, or add/remove lines. Label size is fixed at 1.625"×2.125". Keep ZPL structure: `^XA^PW...^LL...^LH0,0^MNN` + `^FOx,y^A0N,h,w^FD...^FS` per field + `^XZ`. After edits, use Preview or the viewer to confirm.

## ZPL Snippets (Key Tag)

- Start/end: `^XA` … `^XZ`
- Canvas: `^PW330^LL431` (dots at 203 DPI for 1.625"×2.125")
- Origin: `^LH0,0`
- One text line: `^FO10,15^A0N,18,18^FDUsage^FS`
- Escape in `^FD`: `\` for backslash, `\^` for caret. Use `escapeZplField()` in key-tag.js for user data.

## Limits (Labelary)

- Free API: rate and daily request limits; no SLA.
- Long ZPL: use POST to the API instead of GET (URL length limit).
- Our key tag ZPL is short; GET in new tab is fine.

## Reference

- Full ZPL command list and Labelary behavior: https://labelary.com/docs.html  
- Viewer FAQ (encoding, fonts, errors): https://labelary.com/faq.html
