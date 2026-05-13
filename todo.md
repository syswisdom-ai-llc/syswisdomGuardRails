# SysWisdom Guardrails - Master TODO

## Overview
CO-INTELLIGENCE data quality platform for quality professionals. Humans + AI build institutional knowledge together via the Wisdom Formula: **(Experience / Wisdom) ^ Time**.

---

## ✅ Completed Work

### Phase 1: Foundation and Philosophy
- [x] Read `ourCore.md` Systemic Wisdom whitepaper
- [x] Integrated Systemic Wisdom framework into `dataQuality.md`
- [x] Added Wisdom Formula section, phase-by-phase mappings, predictive quality timeline
- [x] Documented SysWisdom 4-Step System in `dataQuality.md`

### Phase 2: Live API Integration
- [x] Connected to SysWisdom Data Quality API (`https://data-quality-api-u2mjys756a-uc.a.run.app/analyze`)
- [x] Stored API key + URL in `.env` file (`dq_api_key`, `dq_api_url`)
- [x] Tested `test.csv` → **score: 84.0** (5 rows, 4 columns)
  - Completeness: 80.0 (Surf Date 80% missing, CRITICAL)
  - Consistency: 87.5 (Mixed data types in Surf Date, HIGH)
  - Validity: 85.0 (Wave Height 20% outliers, MEDIUM)
- [x] Documented real API response with Phase mockups in `dataQuality.md`

### Phase 3: Backend (server.js)
- [x] Built full Express 4.18.3 backend
- [x] `POST /analyze`: multer file upload, SysWisdom API proxy, normalize, persist
- [x] `POST /approval`: human review with confidence scoring (+8 real / -65 false positive)
- [x] `GET /fix-library`, `POST /fix-library`, `POST /fix-library/vote`: CRUD with vote ranking
- [x] `GET /report/:id`: plain-text quality report generation
- [x] `GET /history`: paginated analysis history
- [x] `normalizeIssues()`: maps raw API response to flat issue array (missing_values, data_type_inconsistency, outlier)
- [x] Upgraded multer 1.x → 2.x (security fix; updated to `Buffer.from(req.file.buffer)`)
- [x] `require.main === module` guard + `module.exports` added for testability

### Phase 4: Frontend (public/index.html)
- [x] Built single-file Vanilla JS SPA (no framework, no external dependencies)
- [x] Phase 1 tab: drag-drop upload, SVG score rings (Overall, Completeness, Consistency, Validity)
- [x] Phase 2 tab: per-issue approval cards, confidence bar animation, fix quality rating
- [x] Phase 3 tab: Fix Library with vote buttons, sort selector, add-new-fix form
- [x] Report tab: generate/copy/download plain-text reports
- [x] History tab: click-to-reload past analyses

### Phase 5: Data and Seeding
- [x] `data/fix-library.json` seeded with 3 real surf data fixes:
  - `fix_SURF_001`: Missing Surf Date Values (votes: 2, confidence: 0.95)
  - `fix_SURF_002`: Mixed Data Types in Date Column (votes: 1, confidence: 0.92)
  - `fix_SURF_003`: Wave Height Outlier Domain Exception (votes: 3, confidence: 0.98)
- [x] `data/analyses.json` stores real end-to-end test record (id: `6a4e17a2`, score: 84, 3 issues)
- [x] Test data files in `Data/`: `test.csv`, `surfspot.csv`, `ecomTest.csv`, `waveData.csv`
- [x] `npm install`: 126 packages, 0 vulnerabilities
- [x] `npm start` boots cleanly; server serves on port 3000

### Phase 5B: Unit Tests (tests/guardrails.test.js)
- [x] Refactored `server.js` for testability (`module.exports`, port 0 isolation)
- [x] Added `"test": "node --test tests/guardrails.test.js"` to `package.json`
- [x] Created `tests/guardrails.test.js` using Node 22 built-in `node:test`
- [x] **TEST 1**: `normalizeIssues` maps all 3 issue types (shape and field validation) ✅
- [x] **TEST 2**: Severity thresholds correct (≥50→CRITICAL, ≥20→HIGH, <20→MEDIUM) ✅
- [x] **TEST 3**: `POST /analyze` returns 400 with no file attached ✅
- [x] **TEST 4**: `POST /approval` returns 400 for empty body, missing `is_real`, blank `submitted_by` ✅
- [x] **TEST 5**: `GET /fix-library` returns 200, sorted descending by votes, schema valid on all fixes ✅
- [x] **TEST 6**: `GET /report/:id` returns 200 with report string, filename, score, branding; 404 for unknown id ✅
- [x] **TEST 7**: `GET /history` returns records array with correct summary shape; `approved + rejected + pending === total` ✅
- [x] **TEST 8**: `POST /fix-library/vote` increments votes (+1 up), decrements (−1 down), 400 for invalid direction, 404 for unknown fix ✅
- [x] **TEST 9**: `POST /fix-library` returns 400 for missing issue/fix/created_by; 200 with schema-valid fix on success ✅
- [x] **RESULT: 9/9 tests passing in 417ms** ✅

### Phase 5C: Live API Wisdom Seeding
- [x] `ecomTest.csv` → API score **88.84** (20 rows, 6 cols)
  - Consistency: 66.67, 4 columns with mixed data types (CustomerName, Product, Price, Date)
  - Completeness: 96.67, nearly complete
  - Validity: 100.0, no outliers
- [x] `waveData.csv` rejected by API (binary ZIP file, not a valid CSV)
- [x] `surfspot.csv` API score 69.07 (157 rows, 14 cols)
  - Completeness: 36.12, 9 columns at 99.36% missing (CRITICAL)
  - Consistency: 71.43, 8 columns with mixed types
  - Validity: 100.0, no outliers
- [x] Fix library expanded from **3 → 7 seeded fixes** (`data/fix-library.json`):
  - `fix_ECOM_001`: Mixed Types in Price, currency strip + float cast (votes:3)
  - `fix_ECOM_002`: Mixed Types in Date, multi-format `to_datetime` coerce (votes:2)
  - `fix_ECOM_003`: Mixed Types in CustomerName, ID vs name separation (votes:1)
  - `fix_SPOT_001`: Mass Missing Location Columns, MapBox + Surfline API enrichment (votes:2)

### Phase 5D: Drift Detection and Training Export
- [x] `GET /drift-analysis` endpoint implemented
  - Calculates monthly accuracy trend from approvals
  - Detects drift: flags if accuracy drops >10% month-over-month
  - Returns: monthly_accuracy, drift_detected, recommendation
  - Enables proactive model retraining before performance degrades
  
- [x] `GET /training-export` endpoint implemented
  - Exports all human-labeled issues as training dataset
  - Schema: analysis_id, timestamps, api_scores, issues with human verdicts
  - Includes usage notes for ML engineers
  - Addresses **ML drift problem** – provides ground truth for retraining
  
- [x] **TEST 10**: `/drift-analysis` returns monthly accuracy & drift status ✅
- [x] **TEST 11**: `/training-export` returns labeled dataset with correct schema ✅
- [x] **RESULT: 11/11 tests passing in 437ms** ✅

---

## High Priority: Next Steps

### Priority 1: Drift Detection & Export Pipeline (Step 3d - Solves ML Drift Problem) ✅ COMPLETED
- [x] Implement `GET /training-export` endpoint in `server.js` ✅ (exports labeled dataset JSON)
- [x] Add `GET /drift-analysis` endpoint ✅ (calculates monthly accuracy, detects drift)
- [x] Add unit test: Test 10, `/drift-analysis` returns monthly accuracy and drift status ✅
- [x] Add unit test: Test 11, `/training-export` returns labeled dataset with correct schema ✅
- [x] Add UI panel showing drift trends and export button ✅
  - [x] Create "Drift Monitor" tab in main navigation ✅
  - [x] Display monthly accuracy trend chart ✅
  - [x] Show drift detection alerts (red/yellow warnings) ✅
  - [x] Add "Export Training Data" button (downloads JSON & CSV) ✅
  - [x] Show dataset statistics (total issues, real vs false positives) ✅

### Phase 6: ML Models & Training Data (High-Drift Model Library) ✅ COMPLETED
- [x] Created `models/` directory structure for ML model implementations
- [x] **Model 1: Weather-Stock Predictor** (`1_weather_stock_predictor.py`) ✅
  - RandomForestRegressor for weather-based stock price prediction
  - Tracks: temperature range, humidity, wind speed, seasonal patterns
  - Drift detection: Flags temperature shifts >20°F, seasonal pattern changes >30%
  - Data: `Data/weather_stock_training.csv` (60 records, 4 seasons)
  - Drift Risk: HIGH (climate change, moving to new regions)
  
- [x] **Model 2: E-Commerce Dynamic Pricing** (`2_ecommerce_price_predictor.py`) ✅
  - GradientBoostingRegressor for inventory-based price optimization
  - Tracks: inventory levels, competitor prices, demand scores, seasonality
  - Drift detection: Flags inventory shocks ±50%, competitor price swings >30%, demand changes >40%
  - Data: `Data/ecommerce_pricing_training.csv` (60 records, 3 SKUs, 4 seasons)
  - Drift Risk: VERY HIGH (supply chain disruptions, competitive pricing wars)
  - **TRAINED & TESTED** ✅ (99.9% R², MAE $0.20)
  
- [x] **Model 3: Fraud Detection** (`3_fraud_detection.py`) ✅
  - RandomForestClassifier + IsolationForest for transaction fraud detection
  - Tracks: transaction amounts, merchant categories, velocity scores, international flags
  - Drift detection: Flags fraud amount shifts >40%, velocity changes >2/hour, new merchant categories
  - Data: `Data/fraud_detection_training.csv` (70 records, ~35% fraud rate for demo)
  - Drift Risk: EXTREMELY HIGH (fraudsters change tactics monthly)
  
- [x] **Model 4: Healthcare Readmission Prediction** (`4_healthcare_readmission.py`) ✅
  - GradientBoostingClassifier for 30-day readmission risk scoring
  - Tracks: patient age, comorbidity index, medications, diagnoses, admission type
  - Drift detection: Flags age shifts >10 years, comorbidity changes >2.0, new medications >3, readmission baseline >5%
  - Data: `Data/healthcare_readmission_training.csv` (60 records, 56-83 age range, ~40% readmission rate)
  - Drift Risk: EXTREMELY HIGH (medical protocols evolve quarterly, COVID changed everything)
  
- [x] Created comprehensive `models/README.md` documenting:
  - All 4 models with use cases and required data fields
  - Drift detection signals (thresholds, triggers, impact levels)
  - Integration with Guardrails `/drift-analysis` and `/training-export` endpoints
  - Training data specifications for each model
  - Why drift detection matters (silent model degradation problem)
  - Monitoring metrics and retraining workflows
  
- [x] Generated training datasets for all 4 models:
  - `Data/weather_stock_training.csv`: 60 rows, seasonal weather + stock price
  - `Data/ecommerce_pricing_training.csv`: 62 rows, inventory + competitor pricing + demand
  - `Data/fraud_detection_training.csv`: 70 rows, payment transactions with fraud labels
  - `Data/healthcare_readmission_training.csv`: 60 rows, patient admission data + readmission outcome
  
- [x] Created **SIMPLE TRAINING DOCUMENT** with executable training script:
  - `models/train_ecommerce_pricing.py`: Step-by-step walkthrough of model training
  - `models/MODEL_TRAINING_GUIDE.md`: Complete guide with expected output + troubleshooting
  - **Model training VERIFIED** ✅ (successfully trains on real data, shows predictions, explains drift)
  
- [x] All models integrate with Guardrails platform:
  - Train on `Data/*.csv` files
  - Use Guardrails `/training-export` for retraining ground truth
  - Monitor drift via `/drift-analysis` monthly
  - Export labeled data for continuous learning

### Phase 6A: Training Script Execution ✅ COMPLETED

### Priority 1b: Custom Rules Endpoint (Backend Gap)
- [ ] Implement `POST /custom-rules` in `server.js`
  - Schema: `{ name, column_pattern, rule_type, pattern, severity, auto_apply }`
  - Returns: `{ rule_id, created_at }`
  - Persist to `data/custom-rules.json`
- [ ] Add `GET /custom-rules` to list active rules
- [ ] Wire up to frontend (custom rules tab or modal)
- [ ] Add unit test: Test 12, POST /custom-rules creates rule with rule_id

### Priority 1c: Apply Fixes and Rerun Model
**Purpose**: Implement lightweight database + automated workflow to apply approved fixes to data, rerun analysis, and capture learning
- [ ] Create `data/applied-fixes.json`: lightweight database tracking which fixes applied to which data
  - Schema: `{ analysis_id, fix_id, applied_at, improvement_score, before_score, after_score }`
- [ ] Implement `POST /apply-fixes` endpoint
  - Accepts: `{ analysis_id, fix_ids?: [array of fix IDs to apply] }`
  - Fetches original data from analyses.json
  - Applies each approved fix in sequence (column cleaning, type casting, outlier handling)
  - Persists applied fixes record to applied-fixes.json
  - Returns: improved data blob + before/after quality scores
- [ ] Implement `POST /reanalyze-with-fixes` endpoint
  - Accepts: fixed data from /apply-fixes
  - Sends to SysWisdom API for re-analysis
  - Compares new scores to original (calculates improvement delta)
  - Updates applied-fixes.json with actual improvement metrics
  - Returns: { original_score, improved_score, improvement_pct, fixed_issues }
- [ ] Create feedback loop UI panel
  - Show applied fixes history with improvement tracking
  - Highlight fixes that had highest positive impact
  - Track cumulative learning (total issues fixed across all datasets)
- [ ] Add unit test: Test 13, POST /apply-fixes applies fixes correctly and returns improved data
- [ ] Add unit test: Test 14, POST /reanalyze-with-fixes calculates improvement delta correctly
- [ ] Add to `/training-export` endpoint: Include fix application history (which fixes helped most)
- [ ] **Learning Outcome**: System learns which fixes work best → higher-confidence auto-apply suggestions over time

### Priority 2: Postman Collection
- [ ] Create `postman-collection.json` (Collection v2.1)
  - Name: "Data Quality Tester API"
  - Variables: `{{BASE_URL}}`, `{{SYSWISDOM_API_KEY}}`
  - Endpoints: POST /analyze, POST /approval, GET /fix-library, POST /custom-rules, GET /history
- [ ] Add Postman test scripts per endpoint (status + response shape validation)
- [ ] Create `postman-environment.json` with local/staging/production variants
- [ ] Add collection-level pre-request scripts (API key validation, timestamp headers)
- [ ] Create `POSTMAN_GUIDE.md` (quick start in <5 minutes)

### Priority 3: Expand Test Coverage
- [x] **TEST 1**: `normalizeIssues` maps all 3 issue types (shape and field validation) ✅
- [x] **TEST 2**: Severity thresholds correct (≥50→CRITICAL, ≥20→HIGH, <20→MEDIUM) ✅
- [x] **TEST 3**: `POST /analyze` returns 400 with no file attached ✅
- [x] **TEST 4**: `POST /approval` returns 400 for empty body, missing `is_real`, blank `submitted_by` ✅
- [x] **TEST 5**: `GET /fix-library` returns 200, sorted descending by votes, schema valid on all fixes ✅
- [x] **TEST 6**: `GET /report/:id` returns 200 with report string, filename, score, branding; 404 for unknown id ✅
- [x] **TEST 7**: `GET /history` returns records array with correct summary shape; `approved + rejected + pending === total` ✅
- [x] **TEST 8**: `POST /fix-library/vote` increments votes (+1 up), decrements (−1 down), 400 for invalid direction, 404 for unknown fix ✅
- [x] **TEST 9**: `POST /fix-library` returns 400 for missing issue/fix/created_by; 200 with schema-valid fix on success ✅
- [x] **TEST 10**: `GET /drift-analysis` returns monthly accuracy and drift detection status ✅
- [x] **TEST 11**: `GET /training-export` returns labeled dataset for ML engineers ✅
- [x] Ran `ecomTest.csv` through live API (score 88.84) ✅
- [x] `waveData.csv` rejected by API (binary ZIP, invalid format) ✅
- [x] Ran `surfspot.csv` through live API (score 69.07) ✅
- [x] **11/11 tests passing in 437ms** ✅
- [x] Fix library expanded to **7 seeded fixes** from 3 real datasets ✅

---

## 🟡 MEDIUM PRIORITY

### Additional Endpoints
- [ ] `GET /analysis-history` with pagination (`limit`, `offset`, `issue_type` filter)
- [ ] `POST /jira/create-ticket`: send analysis to Jira (optional, requires Jira token)

### README
- [ ] Create `README.md` with:
  - Project overview + wisdom formula
  - `npm install` + `npm start` + `npm test` quickstart
  - API endpoint reference table
  - Postman section (link to POSTMAN_GUIDE.md)
  - Environment variables reference

### Backend Hardening
- [ ] Ensure all endpoints return consistent JSON response shape
- [ ] Add `analysis_id` to all responses for client-side linking
- [ ] Add test data fixtures to `/backend/test-data/` (test.csv, test.json, test.xlsx)

---

## 🟢 LOW PRIORITY / FUTURE

- [ ] GitHub Actions CI: run `npm test` on every push
- [ ] Vercel deploy config (`vercel.json`) for staging environment
- [ ] Email report export (SMTP integration)
- [ ] Team dashboard for quality trends across all analyses
- [ ] Fix Library export (CSV/JSON download of team wisdom)

---

## Current Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 22.13.1 |
| Backend | Express | 4.18.3 |
| File Upload | multer | 2.1.1 |
| HTTP Client | axios + form-data | 1.6.7 / 4.0.0 |
| ID Generation | uuid | 9.0.1 |
| Config | dotenv | 16.4.5 |
| Dev server | nodemon | 3.1.0 |
| Test runner | node:test (built-in) | Node 22 |
| Frontend | Vanilla JS SPA | N/A |
| Storage | JSON files on disk | N/A |
| DQ API | SysWisdom Cloud | N/A |

---

## Postman Integration Detail
> Full spec preserved below for reference when building the collection

### 6.1 Create Base Postman Collection (10 min)
- [ ] Create `postman-collection.json` with collection metadata:
  - Name: "Data Quality Tester API"
  - Description: "Complete API collection for testing data quality analysis"
  - Schema: Postman Collection v2.1
- [ ] Setup collection-level properties:
  - Base URL variable: `{{BASE_URL}}`
  - API Key variable: `{{SYSWISDOM_API_KEY}}`
  - Bearer token template (optional for future auth)

---

## Phase 6: Postman Integration (30 minutes)

### 6.1 Create Base Postman Collection (10 min)
- [ ] Create `postman-collection.json` with collection metadata:
  - Name: "Data Quality Tester API"
  - Description: "Complete API collection for testing data quality analysis"
  - Schema: Postman Collection v2.1
- [ ] Setup collection-level properties:
  - Base URL variable: `{{BASE_URL}}`
  - API Key variable: `{{SYSWISDOM_API_KEY}}`
  - Bearer token template (optional for future auth)

---

### 6.2 Build API Endpoints (15 min)

#### File Analysis Endpoint
- [ ] Create `POST /analyze` request
  - **Description**: Upload file for data quality analysis
  - **URL**: `{{BASE_URL}}/analyze`
  - **Headers**:
    - `X-API-Key: {{SYSWISDOM_API_KEY}}`
    - `Content-Type: multipart/form-data`
  - **Body** (form-data):
    - `file` (file type) - Pre-populate with example CSV path
  - **Example form data files to include**:
    - `test.csv` - Sample with missing values
    - `test.json` - Sample with bad formatting
    - `test.xlsx` - Sample with duplicates
  - **Test script** (validate response):
    ```javascript
    pm.test("Status code is 200", function() {
      pm.response.to.have.status(200);
    });
    
    pm.test("Response has quality score", function() {
      var jsonData = pm.response.json();
      pm.expect(jsonData).to.have.property("overall_score");
    });
    
    pm.test("Response has issues detected", function() {
      var jsonData = pm.response.json();
      pm.expect(jsonData.issues).to.be.an("array");
    });
    ```

#### Human Approval Endpoint
- [ ] Create `POST /approval` request
  - **Description**: Submit human feedback on detected issues
  - **URL**: `{{BASE_URL}}/approval`
  - **Headers**:
    - `X-API-Key: {{SYSWISDOM_API_KEY}}`
    - `Content-Type: application/json`
  - **Body** (JSON):
    ```json
    {
      "analysis_id": "abc123",
      "issue_id": "missing_email_001",
      "is_real": true,
      "fix_quality": "good",
      "comment": "Real issue, needs backfill",
      "submitted_by": "john_doe"
    }
    ```
  - **Test script** (validate approval stored):
    ```javascript
    pm.test("Approval recorded successfully", function() {
      pm.response.to.have.status(200);
    });
    ```

#### Fix Library Endpoint
- [ ] Create `GET /fix-library` request
  - **Description**: Retrieve team's approved fixes
  - **URL**: `{{BASE_URL}}/fix-library`
  - **Headers**:
    - `X-API-Key: {{SYSWISDOM_API_KEY}}`
  - **Query params** (optional):
    - `issue_type` - Filter by issue category
    - `sort_by` - "votes" or "approvals"
  - **Test script**:
    ```javascript
    pm.test("Library returns array of fixes", function() {
      var jsonData = pm.response.json();
      pm.expect(jsonData.fixes).to.be.an("array");
    });
    ```

#### Custom Rules Endpoint
- [ ] Create `POST /custom-rules` request
  - **Description**: Create or update custom validation rules
  - **URL**: `{{BASE_URL}}/custom-rules`
  - **Headers**:
    - `X-API-Key: {{SYSWISDOM_API_KEY}}`
    - `Content-Type: application/json`
  - **Body** (JSON):
    ```json
    {
      "name": "Email Domain Validation",
      "column_pattern": "email",
      "rule_type": "regex",
      "pattern": "@company\\.com$",
      "severity": "HIGH",
      "auto_apply": true
    }
    ```
  - **Test script**:
    ```javascript
    pm.test("Rule created with ID", function() {
      var jsonData = pm.response.json();
      pm.expect(jsonData).to.have.property("rule_id");
    });
    ```

#### Analysis History Endpoint
- [ ] Create `GET /analysis-history` request
  - **Description**: Retrieve past analyses and team trends
  - **URL**: `{{BASE_URL}}/analysis-history`
  - **Headers**:
    - `X-API-Key: {{SYSWISDOM_API_KEY}}`
  - **Query params** (optional):
    - `limit` - Number of records (default: 10)
    - `offset` - Pagination offset
    - `issue_type` - Filter by type
  - **Test script**:
    ```javascript
    pm.test("History returns paginated results", function() {
      var jsonData = pm.response.json();
      pm.expect(jsonData).to.have.property("total");
      pm.expect(jsonData).to.have.property("results");
    });
    ```

#### Jira Integration Endpoint (Optional)
- [ ] Create `POST /jira/create-ticket` request
  - **Description**: Send analysis results to Jira
  - **URL**: `{{BASE_URL}}/jira/create-ticket`
  - **Headers**:
    - `X-API-Key: {{SYSWISDOM_API_KEY}}`
    - `Content-Type: application/json`
  - **Body** (JSON):
    ```json
    {
      "analysis_id": "abc123",
      "jira_instance": "https://company.atlassian.net",
      "jira_token": "{{JIRA_API_TOKEN}}",
      "project_key": "QA",
      "issue_type": "Bug",
      "auto_assign": "qa_lead@company.com"
    }
    ```

---

### 6.3 Create Environment Template (5 min)
- [ ] Create `postman-environment.json`:
  ```json
  {
    "name": "Data Quality Tester",
    "values": [
      {
        "key": "BASE_URL",
        "value": "http://localhost:3000",
        "enabled": true
      },
      {
        "key": "SYSWISDOM_API_KEY",
        "value": "your-api-key-here",
        "enabled": true
      },
      {
        "key": "JIRA_API_TOKEN",
        "value": "your-jira-token-here",
        "enabled": true
      }
    ]
  }
  ```

- [ ] Document environment variations:
  - **Local**: BASE_URL = `http://localhost:3000`
  - **Staging**: BASE_URL = `https://staging-quality.vercel.app`
  - **Production**: BASE_URL = `https://quality.syswisdom.ai`

---

### 6.4 Add Pre-Request Scripts (5 min)
- [ ] Collection-level scripts:
  - Validate API key is set
  - Add timestamp headers
  - Log request/response info

- [ ] Endpoint-level scripts:
  - Generate unique analysis IDs
  - Format file paths for local testing
  - Extract data from previous responses

---

### 6.5 Document & Export (5 min)
- [ ] Create `POSTMAN_GUIDE.md`:
  ```markdown
  # Postman Integration Guide

  ## Quick Start
  1. Download Postman (free version at postman.com)
  2. Import collection: `File → Import → postman-collection.json`
  3. Import environment: `File → Import → postman-environment.json`
  4. Select environment in top-right dropdown
  5. Update `SYSWISDOM_API_KEY` in environment
  6. Click "File Upload" request to test

  ## Running Requests
  - **Individual Request**: Click "Send"
  - **Full Workflow**: Click "Runner" tab → Select collection → Run
  - **Automated Tests**: Collection has pre-built test scripts

  ## Environment Setup
  | Env | BASE_URL | Use Case |
  |-----|----------|----------|
  | Local | http://localhost:3000 | Development & debugging |
  | Staging | https://staging.app | Pre-production testing |
  | Prod | https://quality.syswisdom.ai | Production validation |

  ## Example Workflow
  1. Run `POST /analyze` with test.csv
  2. Copy `analysis_id` from response
  3. Use in `POST /approval` to validate issue
  4. Check `GET /fix-library` for team recommendations
  5. View trends in `GET /analysis-history`
  ```

- [ ] Export collection to JSON (Postman → Collection → Export → v2.1)
- [ ] Add both files to GitHub repo:
  - `/postman-collection.json`
  - `/postman-environment.json`
  - `/POSTMAN_GUIDE.md`

---

## Integration with Main Build

### Add to Backend
- [ ] Ensure all endpoints support `X-API-Key` header auth
- [ ] Return consistent JSON response format
- [ ] Include `analysis_id` in all responses (for linking)
- [ ] Add test data fixtures in `/backend/test-data/`:
  - `test.csv` (with missing values)
  - `test.json` (with formatting issues)
  - `test.xlsx` (with duplicates)

### Add to README
- [ ] Include Postman section:
  ```markdown
  ## API Testing with Postman

  Import the collection for quick testing without code:

  1. [Download Postman](https://postman.com)
  2. Click "Import" → Select `postman-collection.json`
  3. Import environment: `postman-environment.json`
  4. Set your API key in the environment
  5. Start testing!

  See [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) for full instructions.
  ```

---

## Success Criteria
- ✅ Postman collection imports without errors
- ✅ All 6 endpoints documented with examples
- ✅ Environment template works for local/staging/prod
- ✅ Test scripts validate responses correctly
- ✅ Collection can be run end-to-end in Postman Runner
- ✅ README includes Postman setup instructions
- ✅ New testers can test API in <5 minutes without code

---

## Files to Create
```
data-quality-tester-template/
├── postman-collection.json  (API endpoints + test scripts)
├── postman-environment.json (variables template)
├── POSTMAN_GUIDE.md (usage instructions)
├── backend/
│   └── test-data/
│       ├── test.csv
│       ├── test.json
│       └── test.xlsx
└── README.md (add Postman section)
```

---

## Notes
- Postman Cloud sync is optional (local files sufficient)
- Collection can be shared via GitHub for team collaboration
- Pre-request scripts help with test data setup
- Response validation scripts catch API regressions early
