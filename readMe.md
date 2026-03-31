# SysWisdom Guardrails
## CO-INTELLIGENCE Data Quality Platform

**Where humans and AI get smarter together**

Transform data quality from reactive testing into proactive institutional knowledge. SysWisdom Guardrails enables quality professionals to build a feedback loop that compounds expertise over time using the **Wisdom Formula: (Experience / Wisdom) ^ Time**.

---

## 🎯 Core Philosophy

Every file analyzed teaches the system about your organization's data quality standards. The more humans validate and approve issues, the smarter the system becomes at detecting what matters *to your team*.

**The platform implements three pillars**:
- **Consistency**: AI detects all quality issues automatically
- **Validity**: Humans validate which issues are real for your domain
- **Completeness**: Team builds a shared fix library of proven solutions

Together: **Consistency + Validity + Completeness = Data Quality Wisdom**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ installed
- npm 10+

### Installation & Launch

```powershell
# Clone or navigate to the project directory
cd C:\Users\macki\Documents\VS Studio Code\GuardRails

# Install dependencies
npm install

# Start the server
npm start
```

The server boots on **http://localhost:3000**. Open your browser and you're ready to upload your first file.

### Development Mode (with auto-reload)
```powershell
npm run dev
```
Uses `nodemon` to auto-restart on file changes—perfect for iterating on the backend.

### Run Tests
```powershell
npm test
```
Executes the test suite (`tests/guardrails.test.js`). All 9 core tests validate API endpoints and data normalization.

---

## 📋 Features

### Phase 1: File Upload & Instant Quality Analysis
- **Drag-and-drop interface** for CSV, JSON, XLSX files
- **Real-time quality scoring** powered by SysWisdom Data Quality API
- **SVG score rings** showing Overall, Completeness, Consistency, and Validity metrics
- Instant issue detection with severity classification (CRITICAL, HIGH, MEDIUM)

### Phase 2: Human Approval Workflow
- **Per-issue approval cards** where quality professionals validate findings
- **Confidence scoring** that improves as team consensus builds (1 approval → 6 approvals)
- **Contextual reasoning** captured per issue (why is this real for your domain?)
- **Quality principle tagging** (compliance, security, data integrity, performance)
- **Plain-text reports** exportable for team sharing and auditing

### Phase 3: Fix Library (Team Knowledge Base)
- **Vote-ranked solutions** showing team consensus on best practices
- **Team confidence scores** built from collective approvals
- **Add new fixes** when AI's recommendation needs refinement
- **Sort/filter by**: issue type, quality principle, effort, votes, effectiveness
- **Institutional wisdom** captured and ranked by community validation

### Phase 4: Reporting & Trends
- **Generate plain-text quality reports** with team context and fix recommendations
- **Download or copy reports** for sharing via email/Slack/Jira
- **Analysis history** showing all past file uploads and results
- **Trends over time** revealing patterns your team has learned

---

## 🏗️ Architecture

### Backend (Express.js)
Built on Express 4.18.3 with modular endpoints for upload, approval, and knowledge management.

**Key Endpoints**:

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/analyze` | Upload file → proxy to SysWisdom API → normalize issues → return results |
| POST | `/approval` | Human review: approve/reject issue + reasoning + confidence score |
| GET | `/fix-library` | List all team fixes, sorted by votes (team consensus ranking) |
| POST | `/fix-library` | Add new fix to team library |
| POST | `/fix-library/vote` | Vote up/down on existing fix (+1 / -1 votes) |
| GET | `/report/:id` | Generate plain-text quality report for analysis |
| GET | `/history` | Paginated analysis history with summary counts |

### Frontend (Vanilla JavaScript SPA)
Single-file, zero-framework design for maximum transparency and minimal dependencies.

**Tabs**:
1. **Phase 1**: Upload → Instant scoring + issues list
2. **Phase 2**: Approval workflow → Confidence building
3. **Phase 3**: Fix Library → Ranked by team votes
4. **Report**: Generate/download/copy reports
5. **History**: View + reload past analyses

### Data Persistence
- **`data/analyses.json`**: Historical analysis records with all detected issues
- **`data/fix-library.json`**: Team's accumulated knowledge base (fixes, votes, confidence)
- **`data/custom-rules.json`**: User-defined validation rules (future phase)

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
dq_api_key=YOUR_SYSWISDOM_API_KEY
dq_api_url=https://data-quality-api-u2mjys756a-uc.a.run.app/analyze
```

**Note**: The API key is securely stored and never exposed to the frontend. File uploads are proxied server-side only.

---

## 📊 The Wisdom Formula Explained

### Systemic Wisdom = (Experience / Wisdom) ^ Time

**Components**:

| Component | What It Measures | How It Grows |
|-----------|------------------|-------------|
| **Experience** | # of files analyzed by your team to date | +1 per upload |
| **Wisdom** | # of human-validated insights (approvals) | +1 per approval + reasoning |
| **Time** | Duration team has been using Guardrails | Passive (measured in days/weeks) |

**Real Example**:
- **Day 1**: Analyze test.csv → AI finds 3 issues (Consistency: 87%) → 0 approvals yet (Validity: 0%) → Score = LOW confidence
- **Day 15**: Same issue type appears in 6 more files → Team approves 5/5 times (Validity: 100%) → Score = HIGH confidence
- **Day 30**: Issue pattern recognized instantly → Team predicts solutions before analysis completes → Wisdom achieved

### Key Insight
Early on, the system is conservative (building wisdom). Over time, recurring patterns show high confidence because the team has *proven* them real. New issue types start at 0% but follow a repeatable learning curve.

---

## 🧪 Test Coverage

The project includes 9 unit tests covering all core functionality:

- **Test 1**: `normalizeIssues()` correctly maps all issue types (missing_values, data_type_inconsistency, outlier)
- **Test 2**: Severity thresholds apply correctly (≥50→CRITICAL, ≥20→HIGH, <20→MEDIUM)
- **Test 3**: `POST /analyze` returns 400 when file is missing
- **Test 4**: `POST /approval` validates required fields (is_real, submitted_by)
- **Test 5**: `GET /fix-library` returns sorted list with valid schema
- **Test 6**: `GET /report/:id` generates plain-text report; 404 on unknown ID
- **Test 7**: `GET /history` maintains invariant: approved + rejected + pending = total
- **Test 8**: `POST /fix-library/vote` increments/decrements votes correctly
- **Test 9**: `POST /fix-library` validates schema and persists to disk

**Result: 9/9 tests passing in ~417ms**

---

## 📁 Project Structure

```
GuardRails/
├── README.md                    # This file
├── package.json                 # Dependencies & scripts
├── server.js                    # Express backend (all endpoints)
├── .env                         # API keys (add to .gitignore)
├── todo.md                      # Development roadmap
├── dataQuality.md               # Wisdom formula + phase specs
├── ourCore.md                   # Systemic wisdom whitepaper
├── public/
│   └── index.html               # Frontend SPA (drag-drop + approval UI)
├── tests/
│   └── guardrails.test.js       # Unit tests (9 tests)
├── Data/                        # Sample test files
│   ├── test.csv                 # Surf quality data (5 rows)
│   ├── ecomTest.csv             # E-commerce test (20 rows, score: 88.84)
│   ├── surfspot.csv             # Comprehensive surf data (157 rows, score: 69.07)
│   └── [other test files]
└── data/
    ├── analyses.json            # Historical analysis records
    └── fix-library.json         # Team knowledge base (fixes + votes)
```

---

## 💾 Sample Test Data

Try these files in the UI to see Guardrails in action:

| File | Rows | Score | Key Issues |
|------|------|-------|-----------|
| `test.csv` | 5 | 84.0 | Missing Surf Date (80%), mixed types, outliers |
| `ecomTest.csv` | 20 | 88.84 | Mixed types in Price/Date/CustomerName |
| `surfspot.csv` | 157 | 69.07 | 9 columns 99%+ missing (CRITICAL) |

---

## 🔌 Integration with SysWisdom API

The backend proxies file uploads to the **SysWisdom Data Quality API** (Google Cloud):

```
POST https://data-quality-api-u2mjys756a-uc.a.run.app/analyze
Header: X-API-Key: [your_key]
Body: multipart/form-data (file)

Response:
{
  "overall_score": 84.0,
  "consistency_score": 87.5,
  "completeness_score": 80.0,
  "validity_score": 85.0,
  "issues": [
    {
      "type": "missing_values",
      "column": "Surf Date",
      "missing_percentage": 80.0,
      "severity": "CRITICAL"
    },
    ...
  ]
}
```

The backend normalizes this response using `normalizeIssues()` and persists results to `data/analyses.json`.

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 22.13.1 |
| **Backend** | Express | 4.18.3 |
| **File Upload** | multer | 2.1.1 |
| **HTTP Client** | axios + form-data | 1.6.7 / 4.0.0 |
| **ID Gen** | uuid | 9.0.1 |
| **Config** | dotenv | 16.4.5 |
| **Dev** | nodemon | 3.1.0 |
| **Testing** | node:test (built-in) | Node 22 |
| **Frontend** | Vanilla JS SPA | — |
| **Storage** | JSON files | — |

**Security**: 0 vulnerabilities (verified by npm audit)

---

## 🚦 Next Steps (Roadmap)

### Priority 1: Custom Rules Endpoint
- [ ] `POST /custom-rules` — Create domain-specific validation rules (no code required)
- [ ] `GET /custom-rules` — List active rules
- [ ] Frontend UI for rule builder

### Priority 2: Postman Collection
- [ ] Export API endpoints as Postman collection for external testing
- [ ] Test scripts per endpoint
- [ ] Local/staging/production environment templates

### Priority 3: Dashboard & Trends
- [ ] Team quality trend visualization (over time graph)
- [ ] Fix Library export (CSV/JSON download of team wisdom)
- [ ] Email report delivery

---

## 🤝 Contributing

This project is built for quality professionals to collaborate and build institutional knowledge together.

**Workflow**:
1. Upload a file → AI detects issues
2. Review each issue → Add domain context
3. Rate suggested fixes → Vote on best solutions
4. Share reports → Build team consensus
5. Repeat → System learns and improves

The more your team uses Guardrails, the smarter it becomes.

---

## 📚 Learning Resources

- **`ourCore.md`** — Read the Systemic Wisdom whitepaper (foundational philosophy)
- **`dataQuality.md`** — Complete phase walkthrough with real API examples
- **`todo.md`** — Development roadmap and detailed specifications
- **Tests** — See `tests/guardrails.test.js` for endpoint behavior examples

---

## � License & Legal

### Commercial License

**© 2024 SysWisdom.AI LLC** • *Building with heart in Georgia*

This project is proprietary software owned by SysWisdom.AI LLC. All rights reserved.

**License Type**: Proprietary Commercial License  
**License File**: See `LICENSE` in the project root

### Usage Rights

✅ **You may**:
- Use the Software for internal business purposes
- Evaluate the Software (30-day trial period)
- Integrate with your proprietary systems
- Make modifications for your own use

❌ **You may not**:
- Reproduce, distribute, or sell the Software
- Reverse engineer or decompile the source code
- Use the Software to create competing products
- Sublicense or transfer rights to third parties
- Publicly disclose performance metrics or benchmarks

### Commercial Use

For commercial licensing options, product integration, custom development, or enterprise deployment:

📧 **Sales**: sales@syswisdom.ai  
📧 **General**: info@syswisdom.ai

### Privacy & Terms

Your use of this Software is governed by our policies:

- **Privacy Policy**: https://www.syswisdom.ai/privacy
- **Terms of Service**: https://docs.google.com/document/d/e/2PACX-1vSeNXJb2ED03yonMIF5rTx-U_4wrI75HsCCW8lEb5Wv-tbVkqRNjpH6pQnw9S2_wakjTsUAoxbcBbZ7/pub

### Contributing

Interested in contributing? See `CONTRIBUTING.md` for guidelines on how to contribute improvements, report issues, and submit feedback.

### Code of Conduct

We're committed to fostering an inclusive and respectful community. See `CODE_OF_CONDUCT.md` for our standards and values.

---

## ❓ Questions or Issues?

Check the `todo.md` for known issues and planned features.  
Ensure your `.env` file is configured correctly before running `npm start`.

**Contact SysWisdom.AI**:
- 📧 Info: info@syswisdom.ai
- 💼 Sales: sales@syswisdom.ai
- 🌐 Website: https://www.syswisdom.ai

---

**SysWisdom Guardrails**: Set governance rules once. Enforce automatically. Build with confidence.

*Last Updated: March 31, 2026*
