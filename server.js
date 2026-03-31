require('dotenv').config();
const express = require('express');
const multer  = require('multer');
const FormData = require('form-data');
const axios   = require('axios');
const fs      = require('fs');
const path    = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// ── Data storage ───────────────────────────────────────────────────────────────
const DATA_DIR       = path.join(__dirname, 'data');
const ANALYSES_FILE  = path.join(DATA_DIR, 'analyses.json');
const LIBRARY_FILE   = path.join(DATA_DIR, 'fix-library.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ANALYSES_FILE)) fs.writeFileSync(ANALYSES_FILE, JSON.stringify({ records: [] }, null, 2));

const readJSON  = (file, fallback) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } };
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ── File type map ──────────────────────────────────────────────────────────────
const MIME_MAP = {
  '.csv':  'text/csv',
  '.json': 'application/json',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    MIME_MAP[ext] ? cb(null, true) : cb(new Error(`Unsupported file type. Use: ${Object.keys(MIME_MAP).join(', ')}`));
  }
});

// ── Normalize raw API response into flat issue list ────────────────────────────
function normalizeIssues(api) {
  const issues = [];

  (api.completeness?.critical_missing || []).forEach(item => {
    const pct = item.missing_pct;
    issues.push({
      id:                 uuidv4(),
      type:               'missing_values',
      column:             item.column,
      description:        `Missing Values in "${item.column}"`,
      detail:             `${pct}% of rows have no value`,
      severity:           pct >= 50 ? 'CRITICAL' : pct >= 20 ? 'HIGH' : 'MEDIUM',
      machine_confidence: Math.round(api.completeness.score),
      suggested_fix:      `Backfill "${item.column}" from source system or assign a default value`,
      approval:           null
    });
  });

  (api.consistency?.issues || []).forEach(item => {
    issues.push({
      id:                 uuidv4(),
      type:               'data_type_inconsistency',
      column:             item.column,
      description:        `Data Type Issue in "${item.column}"`,
      detail:             item.issue,
      severity:           'HIGH',
      machine_confidence: Math.round(api.consistency.score),
      suggested_fix:      `Standardize "${item.column}" to a consistent format (e.g. ISO 8601 for dates)`,
      approval:           null
    });
  });

  (api.validity?.validity_checks || []).forEach(item => {
    issues.push({
      id:                 uuidv4(),
      type:               'outlier',
      column:             item.column,
      description:        `Outliers Detected in "${item.column}"`,
      detail:             item.issue,
      severity:           'MEDIUM',
      machine_confidence: Math.round(api.validity.score),
      suggested_fix:      `Review values in "${item.column}" — may be valid domain data or measurement errors`,
      approval:           null
    });
  });

  return issues;
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 1 — Analyze file
// ══════════════════════════════════════════════════════════════════════════════
app.post('/analyze', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });

  try {
    const ext  = path.extname(req.file.originalname).toLowerCase();
    const mime = MIME_MAP[ext] || 'application/octet-stream';

    const form = new FormData();
    form.append('file', Buffer.from(req.file.buffer), { filename: req.file.originalname, contentType: mime });

    const { data: api } = await axios.post(process.env.dq_api_url, form, {
      headers: { 'X-API-Key': process.env.dq_api_key, ...form.getHeaders() },
      timeout: 30000
    });

    const issues   = normalizeIssues(api);
    const analyses = readJSON(ANALYSES_FILE, { records: [] });

    const record = {
      id:                uuidv4(),
      filename:          req.file.originalname,
      file_size:         req.file.size,
      timestamp:         new Date().toISOString(),
      row_count:         api.row_count,
      column_count:      api.column_count,
      overall_score:     api.overall_score,
      completeness_score: api.completeness?.score ?? null,
      consistency_score:  api.consistency?.score  ?? null,
      validity_score:     api.validity?.score     ?? null,
      issues
    };

    analyses.records.unshift(record);
    if (analyses.records.length > 200) analyses.records.length = 200;
    writeJSON(ANALYSES_FILE, analyses);

    res.json(record);
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error('[/analyze]', msg);
    res.status(502).json({ error: `API error: ${msg}` });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 2 — Human approval
// ══════════════════════════════════════════════════════════════════════════════
app.post('/approval', (req, res) => {
  const { analysis_id, issue_id, is_real, fix_quality, comment, better_fix, quality_principle, submitted_by } = req.body;

  if (!analysis_id || !issue_id || typeof is_real !== 'boolean' || !submitted_by?.trim()) {
    return res.status(400).json({ error: 'Required: analysis_id, issue_id, is_real (boolean), submitted_by' });
  }

  const analyses = readJSON(ANALYSES_FILE, { records: [] });
  const record   = analyses.records.find(a => a.id === analysis_id);
  if (!record) return res.status(404).json({ error: 'Analysis not found' });

  const issue = record.issues.find(i => i.id === issue_id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  const confAfter = is_real
    ? Math.min(issue.machine_confidence + 8, 99)
    : Math.max(issue.machine_confidence - 65, 5);

  issue.approval = {
    is_real,
    fix_quality:       fix_quality    || null,
    comment:           (comment       || '').trim() || null,
    better_fix:        (better_fix    || '').trim() || null,
    quality_principle: quality_principle || null,
    submitted_by:      submitted_by.trim(),
    timestamp:         new Date().toISOString(),
    confidence_after:  confAfter
  };

  writeJSON(ANALYSES_FILE, analyses);

  // Auto-add to fix library when approved with a usable fix
  if (is_real && (fix_quality === 'good' || issue.approval.better_fix)) {
    const lib = readJSON(LIBRARY_FILE, { fixes: [] });
    if (!lib.fixes) lib.fixes = [];
    lib.fixes.unshift({
      id:                `fix_${uuidv4().split('-')[0].toUpperCase()}`,
      issue:             issue.description,
      issue_type:        issue.type,
      column:            issue.column,
      fix:               issue.approval.better_fix || issue.suggested_fix,
      quality_principle: quality_principle || 'data_integrity',
      severity:          issue.severity,
      approvals:         1,
      votes:             0,
      team_confidence:   parseFloat((confAfter / 100).toFixed(2)),
      created_by:        submitted_by.trim(),
      created_date:      new Date().toISOString().split('T')[0],
      context:           issue.approval.comment || '',
      tags:              [issue.type, issue.column.toLowerCase().replace(/[\s()]+/g, '-')],
      times_applied:     0,
      effectiveness_rating: 0
    });
    writeJSON(LIBRARY_FILE, lib);
  }

  res.json({ success: true, issue });
});

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 3 — Fix Library
// ══════════════════════════════════════════════════════════════════════════════
app.get('/fix-library', (req, res) => {
  const lib   = readJSON(LIBRARY_FILE, { fixes: [] });
  const fixes = [...(lib.fixes || [])];
  const sort  = req.query.sort_by || 'votes';
  fixes.sort((a, b) => ((b[sort] ?? 0) - (a[sort] ?? 0)));
  res.json({ fixes, total: fixes.length });
});

app.post('/fix-library', (req, res) => {
  const { issue, fix, quality_principle, severity, context, created_by } = req.body;
  if (!issue?.trim() || !fix?.trim() || !created_by?.trim()) {
    return res.status(400).json({ error: 'issue, fix, and created_by are required' });
  }
  const lib = readJSON(LIBRARY_FILE, { fixes: [] });
  if (!lib.fixes) lib.fixes = [];
  const newFix = {
    id:                `fix_${uuidv4().split('-')[0].toUpperCase()}`,
    issue:             issue.trim(),
    issue_type:        'manual',
    column:            '',
    fix:               fix.trim(),
    quality_principle: quality_principle || 'data_integrity',
    severity:          severity           || 'MEDIUM',
    approvals:         1,
    votes:             0,
    team_confidence:   0.80,
    created_by:        created_by.trim(),
    created_date:      new Date().toISOString().split('T')[0],
    context:           (context || '').trim(),
    tags:              [],
    times_applied:     0,
    effectiveness_rating: 0
  };
  lib.fixes.unshift(newFix);
  writeJSON(LIBRARY_FILE, lib);
  res.json({ success: true, fix: newFix });
});

app.post('/fix-library/vote', (req, res) => {
  const { fix_id, direction } = req.body;
  if (!fix_id || !['up', 'down'].includes(direction)) {
    return res.status(400).json({ error: 'fix_id and direction (up|down) required' });
  }
  const lib = readJSON(LIBRARY_FILE, { fixes: [] });
  const fix = (lib.fixes || []).find(f => f.id === fix_id);
  if (!fix) return res.status(404).json({ error: 'Fix not found' });
  fix.votes = (fix.votes || 0) + (direction === 'up' ? 1 : -1);
  writeJSON(LIBRARY_FILE, lib);
  res.json({ success: true, votes: fix.votes });
});

// ══════════════════════════════════════════════════════════════════════════════
// REPORT — Plain-text export
// ══════════════════════════════════════════════════════════════════════════════
app.get('/report/:id', (req, res) => {
  const analyses = readJSON(ANALYSES_FILE, { records: [] });
  const record   = analyses.records.find(a => a.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Analysis not found' });

  const approved = record.issues.filter(i => i.approval?.is_real === true);
  const rejected = record.issues.filter(i => i.approval?.is_real === false);
  const pending  = record.issues.filter(i => !i.approval);
  const SEP      = '─'.repeat(52);

  const lines = [
    '╔════════════════════════════════════════════════════╗',
    '║      SysWisdom Guardrails — Quality Report         ║',
    '╚════════════════════════════════════════════════════╝',
    '',
    `  File:           ${record.filename}`,
    `  Analyzed:       ${new Date(record.timestamp).toLocaleString()}`,
    `  Rows / Columns: ${record.row_count} rows, ${record.column_count} columns`,
    '',
    SEP,
    '  SCORE BREAKDOWN  (Wisdom Formula Components)',
    SEP,
    `  Overall Score:  ${record.overall_score}%`,
    `  Completeness:   ${record.completeness_score}%   (are all expected values present?)`,
    `  Consistency:    ${record.consistency_score}%   (are types and formats uniform?)`,
    `  Validity:       ${record.validity_score}%   (are values within expected ranges?)`,
    ''
  ];

  if (approved.length) {
    lines.push(SEP, `  CONFIRMED ISSUES  (${approved.length} approved by team)`, SEP);
    approved.forEach((issue, n) => {
      lines.push(
        `  ${n + 1}. ✓ ${issue.description}`,
        `     Detail:     ${issue.detail}`,
        `     Severity:   ${issue.severity}`,
        `     Approved by: ${issue.approval.submitted_by}`,
        `     Context:    ${issue.approval.comment || '(none provided)'}`,
        `     Recommended Fix: ${issue.approval.better_fix || issue.suggested_fix}`,
        `     Quality Principle: ${issue.approval.quality_principle || 'N/A'}`,
        `     Team Confidence: ${issue.approval.confidence_after}%`,
        ''
      );
    });
  }

  if (rejected.length) {
    lines.push(SEP, `  FALSE POSITIVES  (${rejected.length} rejected — domain exceptions captured)`, SEP);
    rejected.forEach((issue, n) => {
      lines.push(
        `  ${n + 1}. ✗ ${issue.description}`,
        `     Rejected by: ${issue.approval.submitted_by}`,
        `     Domain Context: ${issue.approval.comment || '(none provided)'}`,
        ''
      );
    });
  }

  if (pending.length) {
    lines.push(SEP, `  AWAITING HUMAN REVIEW  (${pending.length} issues)`, SEP);
    pending.forEach(issue => lines.push(`  ⏳ ${issue.description} — ${issue.detail}`));
    lines.push('');
  }

  lines.push(
    SEP,
    `  Systemic Wisdom: (Experience / Wisdom) ^ Time`,
    `  Issues Reviewed: ${record.issues.length - pending.length} of ${record.issues.length}`,
    `  Report Generated: ${new Date().toISOString()}`,
    '  ── SysWisdom.AI Guardrails ────────────────────────'
  );

  res.json({ report: lines.join('\n'), record });
});

// ══════════════════════════════════════════════════════════════════════════════
// HISTORY
// ══════════════════════════════════════════════════════════════════════════════
app.get('/history', (_req, res) => {
  const analyses = readJSON(ANALYSES_FILE, { records: [] });
  const records  = (analyses.records || []).map(a => ({
    id:            a.id,
    filename:      a.filename,
    timestamp:     a.timestamp,
    overall_score: a.overall_score,
    total:         a.issues.length,
    approved:      a.issues.filter(i => i.approval?.is_real === true).length,
    rejected:      a.issues.filter(i => i.approval?.is_real === false).length,
    pending:       a.issues.filter(i => !i.approval).length
  }));
  res.json({ records, total: records.length });
});

// ══════════════════════════════════════════════════════════════════════════════
// STEP 3D: DRIFT DETECTION & TRAINING DATA EXPORT
// ══════════════════════════════════════════════════════════════════════════════
app.get('/drift-analysis', (_req, res) => {
  const analyses = readJSON(ANALYSES_FILE, { records: [] });
  const records = analyses.records || [];

  // Group by month (YYYY-MM)
  const byMonth = {};
  records.forEach(a => {
    const date = new Date(a.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[monthKey]) byMonth[monthKey] = [];
    byMonth[monthKey].push(a);
  });

  // Calculate accuracy per month
  const monthlyAccuracy = {};
  Object.entries(byMonth).forEach(([month, monthRecords]) => {
    const approved = monthRecords.filter(a => a.issues.some(i => i.approval?.is_real === true)).length;
    const total = monthRecords.length;
    monthlyAccuracy[month] = total > 0 ? Math.round((approved / total) * 100) : 0;
  });

  // Detect drift
  const months = Object.keys(monthlyAccuracy).sort();
  let driftDetected = false;
  let driftReason = '';

  if (months.length >= 2) {
    const prevMonth = months[months.length - 2];
    const currentMonth = months[months.length - 1];
    const prevAccuracy = monthlyAccuracy[prevMonth];
    const currentAccuracy = monthlyAccuracy[currentMonth];
    const drop = prevAccuracy - currentAccuracy;

    if (drop > 10) {
      driftDetected = true;
      driftReason = `Accuracy dropped ${drop}% from ${prevAccuracy}% to ${currentAccuracy}% — model may need retraining`;
    }
  }

  res.json({
    monthly_accuracy: monthlyAccuracy,
    current_month: months[months.length - 1],
    current_accuracy: months.length > 0 ? monthlyAccuracy[months[months.length - 1]] : 0,
    previous_month: months.length > 1 ? months[months.length - 2] : null,
    previous_accuracy: months.length > 1 ? monthlyAccuracy[months[months.length - 2]] : null,
    drift_detected: driftDetected,
    recommendation: driftDetected ? driftReason : 'Model accuracy stable. No retraining needed.',
    total_records: records.length,
    approved_records: records.filter(a => a.issues.some(i => i.approval?._real === true)).length
  });
});

app.get('/training-export', (_req, res) => {
  const analyses = readJSON(ANALYSES_FILE, { records: [] });
  const records = analyses.records || [];

  // Filter only records with approved/rejected issues (labeled data)
  const labeledData = records
    .filter(a => a.issues.some(i => i.approval))
    .map(a => ({
      analysis_id: a.id,
      filename: a.filename,
      timestamp: a.timestamp,
      api_scores: {
        overall: a.overall_score,
        completeness: a.completeness_score,
        consistency: a.consistency_score,
        validity: a.validity_score
      },
      detected_issues: a.issues.map(i => ({
        issue_id: i.id,
        type: i.type,
        column: i.column,
        machine_confidence: i.machine_confidence,
        suggested_fix: i.suggested_fix,
        human_verdict: i.approval ? (i.approval.is_real ? 'REAL' : 'FALSE_POSITIVE') : 'PENDING',
        human_confidence_after: i.approval?.confidence_after || null,
        submitted_by: i.approval?.submitted_by || null,
        domain_context: i.approval?.comment || null,
        fix_quality_rating: i.approval?.fix_quality || null,
        better_fix: i.approval?.better_fix || null
      }))
    }));

  // Calculate metadata
  const totalLabeled = labeledData.length;
  const totalIssues = labeledData.reduce((sum, a) => sum + a.detected_issues.length, 0);
  const realIssues = labeledData.reduce((sum, a) => sum + a.detected_issues.filter(i => i.human_verdict === 'REAL').length, 0);
  const falsePositives = labeledData.reduce((sum, a) => sum + a.detected_issues.filter(i => i.human_verdict === 'FALSE_POSITIVE').length, 0);

  res.json({
    export_timestamp: new Date().toISOString(),
    dataset_info: {
      total_analyses: totalLabeled,
      total_issues: totalIssues,
      real_issues: realIssues,
      false_positives: falsePositives,
      positives_rate: totalIssues > 0 ? ((realIssues / totalIssues) * 100).toFixed(2) + '%' : '0%'
    },
    labeled_data: labeledData,
    usage_notes: [
      'This dataset contains human-labeled quality issues suitable for ML model training.',
      'Use human_verdict as the target label (REAL=1, FALSE_POSITIVE=0).',
      'Features: machine_confidence, issue type, column characteristics.',
      'Monitor positives_rate to detect dataset bias.',
      'Re-export monthly to track drift and retrain models.'
    ]
  });
});

// ── Start ──────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('\n  ╔═══════════════════════════════════════════╗');
    console.log('  ║   SysWisdom Guardrails CO-INTELLIGENCE    ║');
    console.log('  ╚═══════════════════════════════════════════╝');
    console.log(`\n  URL:     http://localhost:${PORT}`);
    console.log(`  API Key: ${process.env.dq_api_key ? '✓ loaded' : '✗ MISSING — check .env'}`);
    console.log(`  API URL: ${process.env.dq_api_url || '✗ MISSING — check .env'}\n`);
  });
}

module.exports = { app, normalizeIssues, readJSON, writeJSON, ANALYSES_FILE, LIBRARY_FILE };
