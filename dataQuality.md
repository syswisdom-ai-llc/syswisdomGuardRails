# SysWisdom Guardrails - CO-INTELLIGENCE Edition

## Guiding Philosophy: Systemic Wisdom for Quality Professionals

**Systemic Wisdom = (Experience / Wisdom) ^ Time**

This CO-INTELLIGENCE platform transforms data quality from a reactive testing-only function into a proactive quality mindset. By coupling human judgment with AI detection, we create a feedback loop that builds institutional knowledge. Each file analyzed, each issue approved, each fix documented—these experiences compound over time, enabling quality professionals to achieve **predictive quality outcomes**.

The guardrails system implements the wisdom formula: **Consistency (all issues detected) + Validity (human approval = real issues) + Completeness (comprehensive rules) = DATA QUALITY WISDOM**.

---

## Foundation: SysWisdom 4-Step System
This platform is built on SysWisdom's proven framework for turning raw data into insights:

### Step 1: Collecting & Cleaning Raw Data
- **Source Identification**: Gather relevant data from structured (databases, spreadsheets) and unstructured sources
- **Data Cleaning**: Remove inconsistencies, missing values, and duplicate entries to ensure data integrity
- **Normalization & Formatting**: Standardize data for seamless integration and processing

### Step 2: Curating & Organizing Data (GUARDRAILS CORE)
- **Tagging & Categorization**: Organize data into meaningful categories based on predefined parameters
- **Filtering & Validation**: Ensure data relevance and accuracy through human + AI validation techniques
- **Metadata Enrichment**: Add contextual information and human judgment to improve data usability
- **Guardrails & Standards**: Humans define domain-specific quality rules that AI enforces automatically
- **Wisdom Extraction**: Each validation decision contributes to the team's quality knowledge base

### Step 3: Training the AI Model
- **Feature Engineering**: Extract meaningful patterns that contribute to better quality detection
- **Model Selection**: Use appropriate ML models for data validation and anomaly detection
- **Continuous Learning**: Improve accuracy through human feedback and iterative approval workflows
- **Optimization**: Leverage team's approved fixes to make recommendations smarter

### Step 4: Delivering Insights
- **Plain Text Reports**: Share findings in accessible format ready for team tools
- **Fix Recommendations**: Provide actionable solutions that improve over time via team feedback
- **Visual Dashboards**: Show team's data quality trends and what's been learned
- **Institutional Knowledge**: Build a Fix Library that captures team expertise

---

## Core Philosophy: "First Your Data"
**Every file analyzed teaches the system about your organization's data quality standards.** The more humans validate and approve issues, the smarter the system becomes at detecting what matters *to your team*.

**Systemic Wisdom Implementation**:
- **Capture Experience**: Each file upload captures domain-specific data patterns and quality challenges
- **Feedback Loop**: Human approvals/rejections create a closed-loop system that validates AI detection accuracy
- **Repository of Experiences**: Fix Library stores team-approved solutions, voting mechanisms rank effectiveness
- **Reporting**: Plain-text reports surface trends, team confidence scores, and predictive insights
- **Quality Mindset Over Time**: As the team evaluates more experiences, the system predicts quality issues before they reach production

---

## Project Overview
**SysWisdom Guardrails**: Set governance rules once, enforce automatically, build with confidence.

Where **humans and AI get smarter together**:
- Drag-drop file (.csv, .json, .xlsx) → AI finds issues instantly
- **Human approves or rejects each issue** (add context/reasoning)
- **System learns** which issues matter to your team
- **Build a team Fix Library** (crowdsourced, voted on, ranked)
- **Create custom validation rules** (no code, UI-based)
- Export plain text + email reports

**Model**: GitHub template → fork → deploy to Vercel → team learns from every analysis  
**Target**: 1-day build, guardrails enforcement grows over time

---

## Core Value Proposition
- **AI alone**: Fast but generic recommendations
- **Humans alone**: Slow, repeats same decisions
- **Together**: Fast + contextual + learns → Institutional knowledge

Every file analyzed adds to your team's data quality knowledge base.

---

## Data Quality Score = Wisdom Formula in Action

The Data Quality Score translates systemic wisdom into a single actionable metric:

```
OVERALL SCORE = (Consistency × Validity × Completeness) ^ Team_Experience

Where:
  - Consistency = All anomalies detected (AI's job) [0-100%]
  - Validity = Issues approved as real by humans (Quality Mindset) [0-100%]
  - Completeness = Comprehensive validation rules applied (Guardrails coverage) [0-100%]
  - Team_Experience = # of files analyzed by team to date (Time component)

Example Calculation:
  File 1: AI=85% consistent, Human validates 70% as real, Rules cover 80% → Score = (0.85 × 0.70 × 0.80) = 47.6%
  File 45: AI=85% consistent, Human validates 95% as real (learned from 44 prior files), Rules cover 95% → Score = (0.85 × 0.95 × 0.95) ^ 44 = Much Higher Confidence

Key Insight: The same AI detection improves from 47.6% to a trusted >90% score because VALIDITY improves through Team_Experience.
This is (Experience/Wisdom)^Time in action.
```

**Why This Matters for Quality Professionals**:
- Early on: Score is conservative (wisdom is still building)
- Over time: Score reflects team's true quality standards (wisdom is accumulated)
- Recurring patterns: Score jumps immediately (Fix Library validates the issue type)
- New issue types: Score starts low but you have a process to build wisdom fast

---

## API & Integration Details

**Data Quality API Endpoint**:
```
curl -X POST -H "X-API-Key: XXXXXXXXXX" -F "file=@test.csv;type=text/csv" https://data-quality-api-u2mjys756a-uc.a.run.app/analyze
```

**Supported File Types**: .csv, .json, .xlsx  
**Authentication**: API key stored in GitHub Secrets (testers never see it)  
**Demo Site**: https://www.syswisdom.ai/data-quality-score

**Score Response includes**:
- `overall_score`: Data Quality Score calculated via Wisdom Formula
- `consistency_score`: AI detection confidence
- `validity_score`: Team approval rate from historical data
- `completeness_score`: Rules coverage
- `team_experience`: # of files analyzed (Time component)
- `pattern_match`: Matches against Fix Library (Institutional Wisdom reference)

---

## Phase 1: Core UI + File Upload (1 hour)
**SYSTEMIC WISDOM COMPONENT: Capture Experience + Feedback Loop Initialization**

Quality professionals submit data files → System extracts experience patterns → AI detects consistency issues → Results provide baseline data quality wisdom.

- [ ] Create GitHub template repo
- [ ] Build dead-simple HTML UI:
  - Large drag-drop zone for file upload
  - Upload button (fallback for non-drag-drop)
  - Single submit button
  - Loading spinner (during API call)
- [ ] Create backend endpoint: `POST /analyze`
  - Accept file upload (via form)
  - Validate file type (.csv, .json, .xlsx)
  - Get API key from environment variable
  - Relay to SysWisdom API
  - Parse response (quality metrics, issues detected)
  - Return results to frontend
- [ ] Display results instantly:
  - Overall quality score (big, bold, color-coded: red/yellow/green)
    - **Wisdom Score Explanation**: Reflects consistency (all anomalies detected) + completeness (comprehensive checks applied)
  - List of issues found (in readable format)
  - Show data samples (preview of bad/incomplete rows if available)
  - **Confidence Baseline**: "First analysis of this pattern - machine confidence: XX%"

**Success Criteria**: Drag test.csv → See quality score + issues list → System begins learning from this experience

---

## Phase 2: Human Approval Workflow (1.5 hours)
**SYSTEMIC WISDOM COMPONENT: Feedback Loop + Repository of Experiences**

THIS IS THE GUARDRAILS CORE PIECE - Where quality professionals inject domain expertise and validity into the system. Each approval/rejection + reasoning creates documented wisdom that compounds over time.

**Wisdom Formula Application**:
- AI provides Consistency: "I found XX issues matching known patterns"
- Human provides Validity: "This issue is real/false positive based on our domain requirements"  
- Together: Consistency + Validity = Institutional quality knowledge
- Over Time: (Experience/Wisdom)^Time = Predictive quality ability for future files

- [ ] For each issue AI detects, show approval interface:
  ```
  ┌─────────────────────────────────────────────────────────┐
  │ AI Found: Missing Values (Consistency: 92%)             │
  │ 15 rows in "email" column                               │
  │ Severity: HIGH                                          │
  │                                                         │
  │ IS THIS REAL FOR YOUR DOMAIN?                           │
  │ [✓ This is real] [✗ False positive]                    │
  │                                                         │
  │ Why? Add context (helps team learn):                   │
  │ "Email required per compliance rule #42" ______________|
  │                                                         │
  │ Suggested fix: Backfill default                         │
  │ [✓ Good fix] [≈ Meh] [✗ Wrong]                         │
  │                                                         │
  │ Better fix: _____________________________________|
  │                                                         │
  │ ➜ This approval adds to team wisdom repository          │
  └─────────────────────────────────────────────────────────┘
  ```

- [ ] Store human feedback:
  - Issue is real/false positive
  - Fix is good/meh/wrong
  - Human's reasoning/context (becomes reference knowledge)
  - Timestamp + who approved + domain they represent
  - **Tag with quality principle** (e.g., "compliance", "data integrity", "user experience")

- [ ] Track confidence scores (Wisdom Accumulation):
  - AI says: "Missing email issue" - Machine Confidence: 85%
  - First human approves: "Yes, real issue" - Team Confidence: 85% (1 approval)
  - Next 5 teammates also approve same type: Team Confidence: 95% (6 approvals)
  - If human rejects as false positive: Machine learns domain exception - Confidence: 30%
  - **Report shows**: "Your team has validated this pattern 6 times. 95% confidence this is a real issue in your data."

- [ ] Create plain text export (Reportable Wisdom):
  ```
  ===== DATA QUALITY REPORT =====
  File: test.csv
  Overall Score: 78%
  Analyzed: 2024-03-30
  Team: Quality Professionals (5 people)
  
  ACCUMULATED WISDOM (From Evaluated Experiences):
  ✓ Missing Values: 15 rows in "email" column
    Status: APPROVED (Team Confidence: 95% - 6 validations)
    Domain Context: "Email required for compliance"
    Who Approved: John Doe (QA Lead), Sarah Chen (Data Gov), 4 others
    When: Multiple approvals from 2024-03-15 to present
  
  TEAM RECOMMENDED FIXES (Voted by Team):
  → Backfill with default@company.com (Team Confidence: 92%, 8 approvals)
  
  WISDOM TREND:
  - This issue type has appeared in 12 previous analyses
  - Team confidence improving: 65% (Mar 15) → 95% (Mar 30)
  - Pattern shows mail data needs validation in Q1 migrations
  
  ---
  Machine learning from: 18 prior files analyzed
  Issues awaiting approval: 3
  ```

- [ ] Add "Copy to Clipboard" button for plain text export
- [ ] Add "Download as TXT" option
- [ ] **NEW**: Add "This matches our known pattern #X" tag when AI recognizes previously-validated issue type
- [ ] **NEW**: Show "quality principle" tags (compliance, security, performance, integrity) so team builds domain-specific wisdom

**Success Criteria**: 
- AI-found issue → Human approves/rejects with context → Confidence score updated
- Team can cite "95% confidence" because wisdom is documented and accumulated
- System recognizes when the SAME issue type appears in future files → starts at 95% confidence, not 0%

---

## Phase 3: Fix Library (Team Knowledge Base) (1.5 hours)
**SYSTEMIC WISDOM COMPONENT: Repository of Experiences + Reporting**

The Fix Library is the institutional wisdom repository where approved quality solutions are documented, ranked by team validation, and shared. This is where systemic wisdom becomes tangible and transferable across the organization.

**Wisdom Principles**:
- Each fix is tagged with the quality principle it protects (compliance, security, performance, data integrity)
- Fixes ranked by team approvals show organizational consensus on best practices
- When the same issue type reappears, the team already has wisdom to apply immediately
- Enables "predictive quality" - new team members inherit collective experience

- [ ] Create team Fix Library (JSON stored in repo):
  ```json
  {
    "version": "1.0",
    "organization": "SysWisdom Quality Team",
    "last_updated": "2024-03-30",
    "wisdom_components": {
      "quality_principles": ["compliance", "security", "data_integrity", "performance", "usability"],
      "team_confidence_threshold": 0.75
    },
    "fixes": [
      {
        "id": "fix_001",
        "issue": "Missing Email Values",
        "fix": "Backfill with domain@company.com",
        "quality_principle": "data_integrity",
        "effort": "5 minutes",
        "approvals": 12,
        "votes": 10,
        "team_confidence": 0.95,
        "createdBy": "john_doe",
        "created_date": "2024-03-15",
        "context": "Standard for customer data - required by CRM integration",
        "tags": ["email", "backfill", "customer-data", "required-field"],
        "times_applied": 18,
        "effectiveness_rating": 4.8,
        "related_pattern": "missing_critical_fields"
      },
      {
        "id": "fix_002",
        "issue": "Duplicate Records",
        "fix": "De-duplicate on (customer_id, date)",
        "quality_principle": "data_integrity",
        "effort": "15 minutes",
        "approvals": 8,
        "votes": 7,
        "team_confidence": 0.88,
        "context": "Use customer_id + date as unique key - prevents revenue double-counting",
        "times_applied": 23,
        "effectiveness_rating": 4.5
      }
    ]
  }
  ```

- [ ] UI features (Wisdom Sharing):
  - When AI recommends a fix, show if it's in the team library
    - Badge: "Your team has validated this fix 12 times - 95% confidence"
    - Instead of generic AI recommendation, show team-approved wisdom
  - "Voting" buttons: 👍 Good fix / 👎 Needs refinement
  - Top-rated fixes shown first (sorted by team confidence)
  - Sort/filter by: Issue type, quality principle, effort, votes, tags, effectiveness
  - Show "times successfully applied" counter to build team confidence
  - **NEW**: Display "Quality Principle" - what organizational value does this fix protect?

- [ ] Allow humans to add new fixes to library:
  - If AI's suggestion is wrong, human enters correct fix + explanation
  - Tag with quality principle (compliance? security? data integrity?)
  - Fix immediately available for team
  - "Save to team library" button
  - Automatic notification: "New fix added by Sarah Chen: [description]"
  - Other team members can vote immediately

---

## LIVE IMPLEMENTATION: Real API Test (March 30, 2026)

**File Analyzed**: `test.csv` (Surf/Wave Quality Data)  
**Rows**: 5 | **Columns**: 4  
**Overall Data Quality Score**: 84.0

### API Response Breakdown (Wisdom Formula Components):

| Component | Score | Issues Detected |
|-----------|-------|-----------------|
| **Completeness** (Comprehensiveness of checks) | 80.0 | ⚠️ CRITICAL: "Surf Date" column 80% missing |
| **Consistency** (All anomalies detected) | 87.5 | ⚠️ "Surf Date": Mixed data types detected |
| **Validity** (Data integrity checks) | 85 | ⚠️ "Wave Height (ft)": 20% outliers detected |
| **OVERALL** | **84.0** | Ready for human quality mindset review |

### Phase 1 Analysis (Raw Experience Captured)

**System Output**:
```
===== DATA QUALITY REPORT =====
File: test.csv
Overall Score: 84.0
Analyzed: 2026-03-30
Rows: 5 | Columns: 4

DETECTED ISSUES:
1. [CRITICAL] Missing Values: "Surf Date" column
   - Missing: 80% of values
   - Severity: HIGH
   - Impact: Cannot correlate conditions to date

2. [HIGH] Data Type Inconsistency: "Surf Date"  
   - Issue: Mixed data types detected
   - Machine Confidence: 87.5%
   - Next Step: Requires human validation

3. [MEDIUM] Outliers Detected: "Wave Height (ft)"
   - Outliers: 20.0% of values
   - Potential Issue: Measurement errors or extreme conditions
   - Severity: MEDIUM
```

**Phase 1 Success**: ✅ AI detected issues instantly on upload

---

### Phase 2 Implementation: Human Approval Workflow (Quality Mindset Injection)

**Quality Professional Review** (John Doe, Data Quality Lead):

#### Issue #1: Surf Date Missing Values (80%)

```
┌─────────────────────────────────────────────────────────┐
│ ISSUE #1: Missing Values - "Surf Date" Column           │
│ Machine Confidence: 87.5%                               │
│ 4 out of 5 rows missing date                            │
│                                                         │
│ IS THIS REAL FOR YOUR DOMAIN?                           │
│ [✓ This is real] [⭘ False positive]                    │
│                                                         │
│ Context (why this matters):                             │
│ "Date field is required for all surf reports.           │
│  Without dates, we can't correlate to tide/weather.     │
│  This MUST be fixed before data goes to forecasting     │
│  model."                                                │
│                                                         │
│ Quality Principle: [DATA_INTEGRITY]                     │
│                                                         │
│ Suggested Fix: Backfill from log metadata              │
│ [✓ Good fix] [≈ Meh] [✗ Wrong]                         │
│                                                         │
│ APPROVAL STATUS: ✓ APPROVED                            │
│ Approved By: John Doe (Data Quality Lead)              │
│ Time: 2026-03-30 14:23                                 │
│                                                         │
│ TEAM FEEDBACK: "First time seeing this; needs workflow"│
│ Confidence Increased: 87.5% → 95% (1 approval)         │
└─────────────────────────────────────────────────────────┘
```

#### Issue #2: Surf Date Mixed Data Types

```
┌─────────────────────────────────────────────────────────┐
│ ISSUE #2: Data Type Inconsistency - "Surf Date"        │
│ Machine Confidence: 87.5%                               │
│                                                         │
│ [✓ This is real] [⭘ False positive]                    │
│                                                         │
│ Context:                                                │
│ "Dates are coming from 3 different CSV sources.         │
│  Some are YYYY-MM-DD, others are Unix timestamps.       │
│  This is a data pipeline integration issue."            │
│                                                         │
│ Quality Principle: [CONSISTENCY]                        │
│                                                         │
│ Suggested Fix: Standardize to ISO 8601 format          │
│ [✓ Good fix] [≈ Meh] [✗ Wrong]                         │
│                                                         │
│ Better Fix: "Also validate in schema at source;         │
│  prevent mixed types upstream"                          │
│                                                         │
│ APPROVAL STATUS: ✓ APPROVED + ENHANCED                 │
│ Context captured for Fix Library (see Phase 3)          │
│ Confidence: 87.5% → 92% (quality principle identified)  │
└─────────────────────────────────────────────────────────┘
```

#### Issue #3: Wave Height Outliers (20%)

```
┌─────────────────────────────────────────────────────────┐
│ ISSUE #3: Outliers Detected - "Wave Height (ft)"       │
│ Machine Confidence: 85%                                 │
│ 20% of values are statistical outliers                  │
│                                                         │
│ [✓ This is real] [⭘ False positive]                    │
│                                                         │
│ Context:                                                │
│ "For our region, 20ft+ waves are rare but real during   │
│  winter swells. This is valid data, not an outlier.     │
│  Machine needs domain knowledge."                       │
│                                                         │
│ Quality Principle: [DOMAIN_KNOWLEDGE]                   │
│                                                         │
│ APPROVAL STATUS: ⭘ REJECTED AS FALSE POSITIVE          │
│ Approved By: Sarah Chen (Surf Forecasting Expert)       │
│ Time: 2026-03-30 14:25                                 │
│                                                         │
│ WISDOM LEARNED:                                         │
│ "Wave Height outlier detection should account for       │
│  seasonal patterns. Winter swells are expected."        │
│ Confidence: 85% → 15% (domain exception identified)     │
│ Machine learns: Don't flag Wave Height as outlier       │
│ during winter months                                    │
└─────────────────────────────────────────────────────────┘
```

**Phase 2 Result: Human Quality Mindset Applied**
- Issue #1: Real issue, fix identified (Human Confidence: 95%)
- Issue #2: Real issue, method enhanced (Human Confidence: 92%)
- Issue #3: Not an issue in your domain (Machine learns domain exception)
- **Wisdom Captured**: 3 domain-specific validation patterns documented

---

### Phase 3 Implementation: Fix Library (Institutional Wisdom Repository)

**New Fixes Added to Team Library** (Auto-generated from Phase 2 approvals):

```json
{
  "version": "1.0",
  "organization": "SysWisdom Guardrails - Surf Quality Team",
  "last_updated": "2026-03-30",
  "new_fixes_from_test_analysis": [
    {
      "id": "fix_SURF_001",
      "issue": "Missing Surf Date Values",
      "description": "80% of records missing date field",
      "fix": "Backfill from log metadata or ETL source",
      "quality_principle": "data_integrity",
      "severity": "CRITICAL",
      "effort_minutes": 45,
      "approvals": 1,
      "created_by": "john_doe",
      "created_date": "2026-03-30",
      "context": "Date field is required for all surf reports. Without dates, cannot correlate to tide/weather. Must fix before forecasting model ingestion.",
      "tags": ["date", "backfill", "surf-data", "critical"],
      "times_applied": 1,
      "effectiveness": "pending",
      "related_pattern": "required_field_missing",
      "team_confidence": 0.95
    },
    {
      "id": "fix_SURF_002",
      "issue": "Mixed Data Types in Date Column",
      "description": "Dates arriving in YYYY-MM-DD and Unix timestamp formats",
      "fix": "Standardize to ISO 8601 format in ETL pipeline",
      "quality_principle": "consistency",
      "severity": "HIGH",
      "effort_minutes": 60,
      "approvals": 1,
      "enhanced_by": "sarah_chen",
      "enhanced_fix": "Also add schema validation at source to prevent mixed types upstream",
      "created_date": "2026-03-30",
      "context": "Data pipeline consolidates from 3 CSV sources with different format standards. Standardization prevents downstream parsing errors.",
      "tags": ["date-format", "pipeline", "consistency", "schema-validation"],
      "times_applied": 1,
      "related_pattern": "data_type_inconsistency",
      "team_confidence": 0.92
    },
    {
      "id": "fix_SURF_003",
      "issue": "Wave Height Outlier Detection - Domain Exception",
      "description": "Machine flagged 20% of Wave Height values as outliers (incorrectly)",
      "fix": "Disable generic outlier detection for Wave Height; use seasonal thresholds instead",
      "quality_principle": "domain_knowledge",
      "severity": "INFORMATIONAL",
      "effort_minutes": 30,
      "approvals": 1,
      "created_by": "sarah_chen",
      "created_date": "2026-03-30",
      "context": "For our coastal region, 20ft+ waves are rare but VALID during winter swells. Generic statistical outlier detection doesn't account for seasonal patterns.",
      "tags": ["wave-height", "outlier-detection", "seasonal", "domain-knowledge"],
      "times_applied": 1,
      "rule": "Skip Wave Height outlier flags November-March; 15ft+ is normal in winter",
      "team_confidence": 0.98,
      "machine_learning_update": "Retrain outlier detector with seasonal masks"
    }
  ]
}
```

**Phase 3 Success**:
- ✅ 3 new institutional knowledge items captured
- ✅ Team confidence scores established (95%, 92%, 98%)
- ✅ Domain exceptions documented (seasonal patterns)
- ✅ Upstream improvements identified (schema validation)
- ✅ Machine learning feedback logged (retrain with seasonal masks)

---

## How Guardrails Enables Predictive Quality: The Systemic Wisdom Timeline

**Month 1 (Early Learning Phase)**:
- Team uploads 10 files, approves ~50 issues
- Consistency (AI detection): 85% - strong on common patterns
- Validity (human approval): Variable - team is learning what matters to them
- **Wisdom Formula**: Consistency + Human judgment building = Early wisdom
- Result: Fix Library has 5-10 approved solutions

**Month 3 (Feedback Loop Matures)**:
- Team has analyzed 40+ files, approved 200+ issues
- Recurring patterns emerge: "This same missing email issue found in 18 files"
- Team confidence scores crystallize: Duplicates validation = 92%, Email backfill = 95%
- **Wisdom Formula**: (Experience/Wisdom)^Time = AI now starts recommending BEFORE human review
- Result: 30+ team-approved fixes, quality professionals see 40% reduction in review time

**Month 6 (Predictive Quality Enabled)**:
- 100+ files analyzed, clear patterns established
- System recognizes file types on upload: "This looks like Q1 customer migration - expect duplicate + email issues (95% confidence)"
- Quality professionals work proactively: "Let's fix this pattern before it gets to production"
- **Wisdom Formula**: (Experience/Wisdom)^6 = Exponential return on investment
- Result: Team prevents quality issues from shipping → customer satisfaction increases

**The Quality Mindset Outcome** (per SysWisdom whitepaper):
> "Systemic wisdom can be measured in several ways. We can create a baseline from our first experience using the quality mindset. Then we can track our trend against our baseline to verify you are seeing an increase in quality... By adjusting our system to include several interactions, we can provide a more accurate result. Every adjustment to the system you will need to verify your baseline is still correct."

Guardrails implements this with each phase:
- **Phase 1**: Establish baseline data quality score
- **Phase 2**: Human feedback loop validates and improves AI model
- **Phase 3**: Fix Library is the repository proving "systemic wisdom" through validated patterns

---

## Addressing Time-to-Market Pressure with Quality

**The Challenge** (from SysWisdom whitepaper):
> "Teams commonly have very little time to develop let alone test before rushing to production... time-to-market pressures will only increase, shift left culture helps AND adds pressure to reduce timelines."

**Guardrails Solution**:
1. **Shift-Left Quality**: AI detects issues on upload, not during production deployment
2. **Fast Human Validation**: Pre-approved fixes (from Fix Library) = no rework cycles
3. **Confidence Transparency**: "95% team confidence in this fix" = team can decide fast
4. **Accumulated Wisdom**: Recurring patterns use historical team knowledge, not fresh analysis
5. **Predictive Intelligence**: "Your data looks like last quarter's migration - expect these 3 issue types" = proactive prevention

**Trade-off Resolution**: 
- Without Guardrails: Choose speed OR quality
- With Guardrails: Choose speed WITH quality (accumulated team wisdom makes it fast AND safe)

---

## Implementation Roadmap: Building Quality Mindset in Your Team

**Week 1**: Phase 1 + Phase 2 basic approval workflow
- **Goal**: Team experiences the feedback loop (Capture Experience + Feedback Loop)
- **Success**: 5 files analyzed, issues approved/rejected with reasoning

**Week 2-3**: Phase 3 Fix Library
- **Goal**: Repository of Experiences becomes actionable (Repository + Reporting)
- **Success**: 10+ team-approved fixes documented, new team member can reference them

**Week 4+**: Wisdom compounds over time
- **Goal**: System recognizes patterns, quality professionals think predictively
- **Success**: Recurring issues caught < 5 min via library lookup, not re-analyzed fresh each time
- **Measurement**: Track (Experience/Wisdom)^Time = Quality improvement metric

---

**Success Criteria**: AI suggests generic fix → Team provides better one in library → Next analysis uses team's fix

---

## Phase 4: Custom Rule Builder (No-Code) (1 hour)
**DOMAIN-SPECIFIC EXPERTISE IN RULES**

- [ ] Simple rule creator (UI-based, no SQL/code):
  - Rule name: "Email domain validation"
  - Trigger: "When column name contains 'email'"
  - Rule type dropdown: "Exact match" / "Pattern" / "Range" / "Unique constraint"
  - Value: `@company.com` or `^[A-Z0-9]+@.*\.com$` (regex-friendly)
  - Severity: HIGH / MEDIUM / LOW
  - auto-apply: Toggle "Apply to all future analyses"

- [ ] Example rules for team to create:
  - "All ZIP codes must be 5 digits"
  - "Date columns must be YYYY-MM-DD"
  - "Phone numbers must start with 1-9"
  - "Customer IDs must be unique"

- [ ] Store rules in `.custom-rules.json`:
  ```json
  {
    "rules": [
      {
        "name": "Email Domain",
        "columnPattern": "email",
        "type": "regex",
        "pattern": "@company\\.com$",
        "severity": "HIGH",
        "createdBy": "data_lead",
        "createdDate": "2024-03-30"
      }
    ]
  }
  ```

- [ ] Integration:
  - Pre-populate issues from custom rules when file analyzed
  - Show "Team rule triggered" vs "AI found this"
  - Track which custom rules are most useful

**Success Criteria**: Data Lead creates rule → System auto-detects violations → Team never misses this issue again

---

## Phase 5: History = Institutional Learning (1 hour)

- [ ] Create analysis history view:
  - Each file analyzed is logged (timestamp, file name, score, issues)
  - BUT: organized by "what we learned"
  - Show trending issues:
    ```
    Most Common Issues (Last 30 Days):
    1. Missing Email (12 files flagged, 11 approved)
    2. Duplicate Records (8 files flagged, 7 approved)
    3. Invalid Date Format (5 files flagged, 3 approved)
    ```
  - Show "Fixed" vs "Recurring" issues
  - Pull reports by issue type or team member

- [ ] Create "Lessons Learned" dashboard:
  - Top 5 issues your team faces
  - Top 5 approved fixes by your team
  - Your custom rules (and how often they catch issues)
  - Team confidence trending (getting better at data quality?)

- [ ] Email summary (weekly optional):
  - Files analyzed: 8
  - Issues approved: 34
  - New fixes added to library: 2
  - Custom rules triggered: 127 violations caught
  - "Team is 12% better at data quality this week"

**Success Criteria**: See what you've learned + where you're improving

---

## Phase 6: Postman Integration (30 minutes)
**ENABLE API TESTING & DOCUMENTATION**

- [ ] Create Postman Collection:
  - `POST /analyze` (file upload)
  - `POST /approval` (submit human feedback)
  - `GET /fix-library` (retrieve team fixes)
  - `POST /custom-rules` (create/update custom rules)
  - `GET /analysis-history` (retrieve past analyses)
  - `POST /jira/create-ticket` (optional: send to Jira)

- [ ] Include in collection:
  - Pre-configured environment variables (API_KEY, BASE_URL)
  - Example request bodies (CSV, JSON, XLSX file formats)
  - Expected response formats
  - Test scripts to validate API responses

- [ ] Export Postman collection to repo:
  - `postman-collection.json`
  - `postman-environment.json`
  - Include in README: "Import these into Postman for quick API testing"

- [ ] Document in README:
  ```
  ## API Testing with Postman
  1. Import `postman-collection.json` into Postman
  2. Create environment from `postman-environment.json`
  3. Set `SYSWISDOM_API_KEY` in environment
  4. Run requests against local (`npm run dev`) or deployed instance
  ```

- [ ] Benefits:
  - Testers can validate API without code
  - Easier debugging if something breaks
  - Shared API contract for team
  - Can run automated tests from Postman

**Success Criteria**: Postman collection works, can upload file & get quality score without frontend

---

## Phase 7: Deployment + Documentation (1 hour)
- [ ] Create GitHub repo: `syswisdom-guardrails`
- [ ] Add setup documentation in `README.md`:
  - **For Teams**: Fork → Vercel → set guardrails → deploy
  - **For Team Leads**: How to enable custom rules, build fix library, access guardrails insights
  - **For QA Managers**: How to run reports, track data quality governance
  - **For API Users**: How to use Postman collection for testing guardrails
- [ ] Create `.env.example`
- [ ] Deploy to Vercel

---

## Tech Stack

**Frontend**:
- Plain HTML5 + CSS
- Vanilla JavaScript
- Drag-drop file upload

**Backend**:
- Node.js + Express
- dotenv for config
- axios for API calls
- Low-code rule engine (evaluates regex/patterns against data)

**Data Storage**:
- `.fix-library.json` (shared in GitHub repo)
- `.custom-rules.json` (shared in GitHub repo)
- `.analysis-history.json` (one per deployed instance)
- These files are checked into the repo so team sees changes

**API Testing**:
- Postman Collection (export-ready, version-controlled)

**Deployment**:
- Vercel

---

## File Structure
```
syswisdom-guardrails/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── analyze.js (API relay + rule evaluation)
│   │   ├── approval.js (store human approvals)
│   │   ├── rules.js (custom rule builder + evaluator)
│   │   └── library.js (fix library management)
│   ├── utils/
│   │   ├── confidence.js (track confidence scores)
│   │   └── ruleEngine.js (evaluate custom rules)
│   ├── package.json
│   └── .env.example
├── .fix-library.json (team shared fixes + votes)
├── .custom-rules.json (team validation rules)
├── .analysis-history.json (cumulative learning)
├── postman-collection.json (API testing ready)
├── postman-environment.json (template for env vars)
├── README.md
├── .gitignore
└── vercel.json
```

---

## Success Criteria (MVP - Guardrails Foundation)
- ✅ File upload → AI finds issues
- ✅ Human approves/rejects each issue + adds reasoning
- ✅ Confidence scores track human validation
- ✅ Fix Library stores team-approved solutions (with voting)
- ✅ Custom rules builder (no-code, simple UI)
- ✅ History shows "what we learned" not "what we analyzed"
- ✅ Plain text export includes confidence + team insights
- ✅ Postman collection enables API testing without frontend
- ✅ GitHub repo is a template anyone can fork

---

## Key Differences from "Stateless AI"
| Feature | AI-only | **SysWisdom Guardrails** |
|---------|---------|-------------------|
| Issue detection | Fast, generic | Fast, then human validates |
| Fix recommendations | Generic suggestion | Team's best practice library |
| Rules | Static API rules | Team creates custom rules |
| History | Log of analyses | What we learned + trending |
| Confidence | None | Grows as humans approve |
| Knowledge | Nowhere | Stored in .json, shared, versioned |
| Learning | None | From human feedback |
| API Testing | None | Postman collection included |

---

## Dependencies to Install

**Node packages** (backend):
```
express
dotenv
axios
cors
multer (file uploads)
pdfkit (PDF generation, optional)
@sendgrid/mail (email, optional)
```

**Frontend**: None (vanilla JS)

---

## How Implementation Phases Map to SysWisdom Framework

| Phase | SysWisdom Step | What Happens | Human Role |
|-------|-----------------|--------------|-----------|
| **Phase 1** | Step 1: Collect & Clean | Upload file, detect data quality issues | Tester uploads data |
| **Phase 2** | Step 2: Curate & Organize | Human validates each issue, adds reasoning | **QA/Data Lead reviews + approves** |
| **Phase 3** | Step 4: Deliver Insights | Fix Library shows team's best practices | **Team builds institutional knowledge** |
| **Phase 4** | Step 2: Curate & Organize | Custom rules encode team standards | **Data Lead creates domain rules** |
| **Phase 5** | Step 4: Deliver Insights | Trends show what team has learned | **Manager tracks improvement** |
| **Phase 6** | All Steps | Postman enables API-level validation | **Developers test end-to-end** |

---

## Success Means
✅ **Raw data enters the system** → Steps 1 & 2 deliver clean, validated data  
✅ **Human judgment is captured** → Fix Library becomes your org's data quality playbook  
✅ **AI learns team standards** → Custom rules prevent issues before they happen  
✅ **Insights shared broadly** → Plain text reports, dashboards, Jira tickets  
✅ **Knowledge compounds** → Each analysis makes the system smarter for next time

---

## Notes for Implementation
- Approval workflow (Phase 2) is the heart—start here after Phase 1
- Fix Library (Phase 3) = valuable IP your team creates together
- Custom rules (Phase 4) = data quality governance for your domain
- History (Phase 5) = shows team's improvement over time
- Postman collection (Phase 6) = enables non-frontend testing
- Keep it simple—focus on *human judgment*, not perfection
- Remember: SysWisdom Guardrails captures your team's data governance expertise, making it reusable and scalable

