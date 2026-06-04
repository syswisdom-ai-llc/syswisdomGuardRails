# GuardRails: Current State and Feature Roadmap
*Last updated: April 24, 2026*

---

## Project Overview

**SysWisdom GuardRails** is a CO-INTELLIGENCE data quality platform for quality professionals. It combines human expertise with AI to build institutional knowledge through the Wisdom Formula:

> **(Experience / Wisdom) ^ Time**

The platform analyzes uploaded CSV/JSON files, scores them on completeness, consistency, and validity, surfaces issues for human review, and captures approvals to build a continuously improving fix library.

---

## Current Implementation Status

### Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 22.13.1 |
| Backend | Express | 4.18.3 |
| File Upload | multer | 2.1.1 |
| HTTP Client | axios + form-data | 1.6.7 / 4.0.0 |
| Dataset Hub | HuggingFace Hub API | REST |
| ID Generation | uuid | 9.0.1 |
| Config | dotenv | 16.4.5 |
| Dev Server | nodemon | 3.1.0 |
| Test Runner | node:test (built-in) | Node 22 |
| Frontend | Vanilla JS SPA | N/A |
| Storage | JSON files on disk | N/A |
| DQ API | SysWisdom Cloud | N/A |
| **AI Integration** | **Google Gemini** | **Planned** |

---

## Completed Phases

### Phase 1: Foundation
- Integrated Systemic Wisdom framework into `dataQuality.md`
- Documented SysWisdom 4-Step System, Wisdom Formula, phase-by-phase mappings

### Phase 2: Live API Integration
- Connected to SysWisdom Data Quality API
- `.env` stores `dq_api_key` and `dq_api_url`
- Verified: `test.csv` → score 84.0, `ecomTest.csv` → score 88.84, `surfspot.csv` → score 69.07

### Phase 3: Backend (server.js)
- `POST /analyze`: file upload, SysWisdom API proxy, normalize, persist
- `POST /approval`: human review with confidence scoring
- `GET /fix-library`, `POST /fix-library`, `POST /fix-library/vote`
- `GET /report/:id`: plain-text quality report generation
- `GET /history`: paginated analysis history
- `GET /drift-analysis`: monthly accuracy trend and drift detection
- `GET /training-export`: labeled dataset export for ML engineers

### Phase 4: Frontend (public/index.html)
- Single-file Vanilla JS SPA
- Tabs: Upload & Score, Issue Approval, Fix Library, Report, History, Drift Monitor
- Upload tab: dual sub-tabs — `📤 Upload File` (original) + `🤗 Hugging Face Dataset` (new)
- SVG score rings (Overall, Completeness, Consistency, Validity)
- **Model Health** dashboard (renamed from Drift Monitor): 3-sub-tab panel
  - `🗑️ Slop`: quality score degradation trend bars, avg score card, degradation rate card
  - `📉 Drift`: monthly accuracy bars, dataset statistics, export buttons (JSON + CSV)
  - `🤖 Hallucination`: false-positive rate gauge ring, monthly rejection rate bars, status badges
- Each panel has: definition card, signal cards, colour-coded alerts (🟢 Healthy / 🟡 Warning / 🔴 Critical)

### Phase 7: HuggingFace Dataset Integration ✅ COMPLETED
- Backend: `GET /hf/search`, `GET /hf/inspect`, `POST /hf/load`
- Compliance: license gating (open/restricted/gated badge), in-memory only processing, audit log
- Optional `HUGGINGFACE_API_KEY` in `.env` (public datasets work without it)
- UI: source-selector sub-tabs in Upload, inspect card, search results grid, load button
- Docs: full HuggingFace section in `help.html`

### Phase 8: Model Health Dashboard ✅ COMPLETED
- `GET /model-health`: single aggregated endpoint for all three AI monitoring signals
- **Slop** signal: linear score degradation across last 20 uploads; alert threshold −3 pts/upload
- **Drift** signal: monthly approval accuracy trend; alert threshold >10% month-over-month drop
- **Hallucination** signal: false-positive rate + monthly rejection trend; alert threshold >40% FP rate
- Nav tab renamed `⚠️ Drift Monitor` → `🏥 Model Health`
- `loadModelHealth()`, `switchMH()`, `renderSlopPanel()`, `renderDriftPanel()`, `renderHalluPanel()`
- Fix library seeded with 7 domain-specific fixes (surf, ecom, spot data)
- **11/11 unit tests passing** in 437ms (Node built-in `node:test`)
- 4 ML model implementations: Weather-Stock, E-Commerce Pricing, Fraud Detection, Healthcare Readmission
- Training datasets generated for all 4 models

---

## Open Items from todo.md (Pre-existing)

### High Priority (Incomplete)
- `POST /custom-rules` endpoint + `GET /custom-rules` + unit tests (Test 12)
- `POST /apply-fixes` + `POST /reanalyze-with-fixes` feedback loop + unit tests (Tests 13–14)

### Medium Priority
- Postman collection (`postman-collection.json`, `postman-environment.json`, `POSTMAN_GUIDE.md`)
- `GET /analysis-history` with full pagination + filtering
- `README.md` with quickstart, API reference, environment variables

### Low Priority / Future
- GitHub Actions CI (`npm test` on every push)
- Vercel deploy config
- Email report export, team dashboard, fix library CSV export

---

## 3 New Features to Implement

All three features use **Google Gemini** for AI capabilities.

---

### Feature 1: Chaos Data Mode

**What it does**:
The user uploads a clean file, clicks "Run Chaos Test," and the tool deliberately injects three types of data corruption, then scores the corrupted file and shows a side-by-side comparison.

**Corruption injected**:
1. Randomly nulls 10% of fields across all columns
2. Introduces format errors in key columns (e.g., scrambled dates, invalid emails, mixed types)
3. Duplicates 5% of records

**Output**:
- Side-by-side **Before Score vs After Score** (score rings for both)
- List of the most fragile fields (highest impact from corruption)
- Baseline established automatically with no configuration needed

**Backend endpoint**: `POST /chaos-test`
- Accepts: uploaded file
- Injects 3 corruption types programmatically (no AI needed for injection)
- Re-scores corrupted file via SysWisdom API
- Returns: `{ original_score, chaos_score, fragile_fields[], corruption_summary }`

**Frontend**:
- New "Chaos Mode" tab or button on the upload screen
- Before/After score ring pair
- Fragile fields highlighted in red
- "Show me what broke" expandable detail per field

**AI (Gemini) role**:
- After scoring, Gemini interprets *why* specific fields are fragile
- Generates a plain-English "Fragility Report": which columns are most at risk and why

---

### Feature 2: AI-Generated Fix Suggestions

**What it does**:
After scoring completes, Gemini analyzes the specific errors found in the user's actual file and generates ready-to-run fix code in three languages, using the exact column names from the uploaded file.

**Output (three language tabs):**

**Python**
```python
# Generated by SysWisdom.ai Data Quality Score
# File: their_filename.csv
# Score: 87/100
# syswisdom.ai/guardrails

import pandas as pd
df = pd.read_csv('their_filename.csv')

# Fix missing email values
df['email'].fillna('unknown@placeholder.com', inplace=True)
df = df[df['email'].str.contains('@', na=False)]

print(f"Fixed: {df.shape[0]} clean records remaining")
```

**JavaScript**
```javascript
// Generated by SysWisdom.ai Data Quality Score
// File: their_filename.csv
// Score: 87/100
// syswisdom.ai/guardrails

const cleanData = data.filter(row =>
  /^\(\d{3}\)\s\d{3}-\d{4}$/.test(row.phone)
);
console.log(`Valid records: ${cleanData.length}`);
```

**SQL**
```sql
-- Generated by SysWisdom.ai Data Quality Score
-- File: their_filename.csv
-- Score: 87/100
-- syswisdom.ai/guardrails

DELETE FROM your_table
WHERE id NOT IN (
  SELECT MIN(id) FROM your_table
  GROUP BY customer_email
);
```

**Rules**:
- Code uses the exact errors and column names from the user's file, not generic templates
- Exact column names from the uploaded file are used in all snippets
- Example: if missing emails found → generate email validation/fill code only
- If duplicates found → generate dedup code only

**Backend endpoint**: `POST /ai-fix-suggestions`
- Accepts: `{ analysis_id, filename, errors[] }`
- Calls Gemini with a structured prompt containing the exact errors and column names
- Returns: `{ python_snippet, javascript_snippet, sql_snippet, plain_english_summary }`

**Frontend**:
- "Get Fix Code" button appears after every analysis completes
- Three tabs: Python | JavaScript | SQL
- "Copy Snippet" button per tab (shows "Copied! ✓" for 2 seconds)
- Footer on every snippet: `Generated by SysWisdom.ai | syswisdom.ai/guardrails`
- Mobile-responsive tab layout

**AI (Gemini) role**:
- Receives: list of detected issues, column names, filename, score
- Returns: language-specific, column-specific, error-specific fix code in all three languages

---

### Feature 3: AI Readiness Score

**What it does**:
After the three standard quality scores run (Completeness, Consistency, Validity), a fourth bonus score is computed: the **AI Readiness Score**. This measures whether the data is clean enough to safely feed into an AI model or agentic system.

**Checks performed**:
| Check | Pass Condition |
|-------|---------------|
| Null rate | Below 5% overall |
| Consistent field formats | No mixed types per column |
| No duplicate keys | Zero duplicate primary identifiers |
| Numeric fields are truly numeric | No string contamination in numeric columns |
| Date fields are parseable | All dates parse to a standard format |

**Verdicts returned**:

🟢 **AI Ready**: data meets minimum quality threshold for AI pipeline use

🟡 **Needs Work**: X issues would cause AI model drift or hallucination errors

🔴 **Not AI Ready**: this data would actively harm an AI model's accuracy

**Backend endpoint**: `POST /ai-readiness`
- Accepts: `{ analysis_id }` (uses already-scored data)
- Runs 5 deterministic checks against the parsed file
- Calls Gemini to generate a narrative explanation of failures
- Returns: `{ ai_readiness_score, verdict, checks[], gemini_narrative }`

**Frontend**:
- Added as a 4th score panel after Completeness/Consistency/Validity
- Color-coded verdict badge (green / yellow / red)
- Expandable checklist showing which of the 5 checks passed/failed
- Gemini-generated narrative: plain English explanation of what would go wrong if this data were fed to an AI

**AI (Gemini) role**:
- Receives: check results, score, detected issues
- Returns: plain-English explanation of AI readiness failures and what kind of model behavior they would cause (drift, hallucination, bias, etc.)

---

## Implementation Plan

### Gemini Setup
- Add `GEMINI_API_KEY` to `.env`
- Install `@google/generative-ai` npm package
- Create `lib/gemini.js` (thin wrapper): `callGemini(prompt)` returns response text

### Backend Work (`server.js`)
1. `POST /chaos-test`: inject corruption, re-score, return before/after + fragile fields
2. `POST /ai-fix-suggestions`: call Gemini with errors + columns, return 3 language snippets
3. `POST /ai-readiness`: run 5 checks + call Gemini for narrative, return verdict

### Frontend Work (`public/index.html`)
1. Chaos Mode tab: upload, run chaos, before/after score rings + fragile field list
2. "Get Fix Code" button + 3-tab snippet panel with copy buttons
3. AI Readiness Score as 4th panel on the main score screen

### New Unit Tests
- Test 12: `POST /chaos-test` returns chaos_score < original_score, fragile_fields array non-empty
- Test 13: `POST /ai-fix-suggestions` returns python/js/sql snippets containing column names
- Test 14: `POST /ai-readiness` returns verdict (AI_READY / NEEDS_WORK / NOT_AI_READY) and 5 checks

### Files to Create/Modify
| File | Action | Purpose |
|------|--------|---------|
| `.env` | Modify | Add `GEMINI_API_KEY` |
| `package.json` | Modify | Add `@google/generative-ai` |
| `lib/gemini.js` | Create | Gemini API wrapper |
| `server.js` | Modify | Add 3 new endpoints |
| `public/index.html` | Modify | Add Chaos, Fix Code, AI Readiness UI |
| `tests/guardrails.test.js` | Modify | Add Tests 12–14 |

---

## Dependency Notes

- Chaos corruption is pure JavaScript with no AI needed for injection
- AI Readiness checks (null rate, format consistency, duplicates, numeric purity, date parseability) are deterministic, computed from parsed CSV before calling Gemini
- Gemini is called AFTER deterministic scoring to add narrative intelligence, not to replace logic
- All three features build on the existing `POST /analyze` result with no re-upload needed
