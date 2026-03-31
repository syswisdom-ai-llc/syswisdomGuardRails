/**
 * SysWisdom Guardrails — Unit Tests
 * Run with: npm test
 *
 * Uses Node.js built-in test runner (node:test + node:assert).
 * No extra dependencies required.
 *
 * Coverage:
 *   Test 1 — normalizeIssues: correctly maps all three API issue types
 *   Test 2 — normalizeIssues: severity thresholds (missing_pct → CRITICAL/HIGH/MEDIUM)
 *   Test 3 — POST /analyze: rejects request with no file → 400
 *   Test 4 — POST /approval: rejects missing required fields → 400
 *   Test 5 — GET /fix-library: returns seeded fixes sorted by votes with total count
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Boot the app on an ephemeral port ─────────────────────────────────────────
import { app, normalizeIssues, readJSON, writeJSON, ANALYSES_FILE, LIBRARY_FILE } from '../server.js';

let server;
let BASE_URL;
let TMP_DATA;
let TEST_ANALYSES_FILE;
let TEST_LIBRARY_FILE;

// Real API response shape returned by SysWisdom (matches test.csv result)
const SAMPLE_API_RESPONSE = {
  column_count: 4,
  row_count: 5,
  overall_score: 84.0,
  completeness: {
    score: 80.0,
    critical_missing: [{ column: 'Surf Date', missing_pct: 80.0 }]
  },
  consistency: {
    score: 87.5,
    issues: [{ column: 'Surf Date', issue: 'Mixed data types detected' }]
  },
  validity: {
    score: 85,
    validity_checks: [{ column: 'Wave Height (ft)', issue: '20.0% outliers detected' }]
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Make a JSON HTTP request against the test server */
function request(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: '127.0.0.1',
      port: server.address().port,
      path: urlPath,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };
    const req = http.request(opts, res => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

/** Multipart POST helper — send a file buffer as form-data */
function requestMultipart(urlPath, filename, fileBuffer, mimeType) {
  return new Promise((resolve, reject) => {
    const boundary = `----TestBoundary${Date.now()}`;
    const CRLF = '\r\n';
    const header =
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"${CRLF}` +
      `Content-Type: ${mimeType}${CRLF}${CRLF}`;
    const footer = `${CRLF}--${boundary}--${CRLF}`;

    const body = Buffer.concat([
      Buffer.from(header, 'utf8'),
      fileBuffer,
      Buffer.from(footer, 'utf8')
    ]);

    const opts = {
      hostname: '127.0.0.1',
      port: server.address().port,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    };
    const req = http.request(opts, res => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

before(async () => {
  // Use a temp analyses file so tests never clobber real recorded data
  TMP_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'guardrails-test-'));
  TEST_ANALYSES_FILE = path.join(TMP_DATA, 'analyses.json');
  TEST_LIBRARY_FILE = path.join(TMP_DATA, 'fix-library.json');
  
  fs.writeFileSync(TEST_ANALYSES_FILE, JSON.stringify({ records: [] }, null, 2));
  
  // Seed the fix library with one example fix for TEST 5
  const seededLibrary = {
    fixes: [
      {
        id: 'seed-fix-001',
        issue: 'Missing Values in "Email"',
        fix: 'Backfill from CRM database using phone number lookup',
        quality_principle: 'completeness',
        team_confidence: 92,
        votes: 5,
        created_at: new Date().toISOString()
      }
    ]
  };
  fs.writeFileSync(TEST_LIBRARY_FILE, JSON.stringify(seededLibrary, null, 2));

  // Set environment variables BEFORE app starts so server reads from temp files
  process.env.ANALYSES_FILE = TEST_ANALYSES_FILE;
  process.env.LIBRARY_FILE = TEST_LIBRARY_FILE;

  server = app.listen(0); // port 0 = random available port
  await new Promise(resolve => server.once('listening', resolve));
  BASE_URL = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
  fs.rmSync(TMP_DATA, { recursive: true, force: true });
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST 1 — normalizeIssues: maps all three API issue types
// ═════════════════════════════════════════════════════════════════════════════
test('TEST 1 — normalizeIssues maps all three API issue types correctly', () => {
  const issues = normalizeIssues(SAMPLE_API_RESPONSE);

  assert.equal(issues.length, 3, 'Should produce exactly 3 issues from sample API response');

  // Issue type presence
  const types = issues.map(i => i.type);
  assert.ok(types.includes('missing_values'),        'Should include missing_values issue');
  assert.ok(types.includes('data_type_inconsistency'),'Should include data_type_inconsistency issue');
  assert.ok(types.includes('outlier'),               'Should include outlier issue');

  // missing_values shape
  const mv = issues.find(i => i.type === 'missing_values');
  assert.equal(mv.column, 'Surf Date',   'missing_values should target Surf Date column');
  assert.equal(mv.approval, null,        'approval should be null (awaiting review)');
  assert.ok(mv.id,                       'Each issue should have a UUID id');
  assert.ok(mv.suggested_fix.length > 0, 'suggested_fix should be populated');

  // outlier shape
  const out = issues.find(i => i.type === 'outlier');
  assert.equal(out.column, 'Wave Height (ft)', 'outlier should target Wave Height column');
  assert.equal(out.machine_confidence, 85,     'outlier confidence should be 85 (from validity.score)');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST 2 — normalizeIssues: severity thresholds
// ═════════════════════════════════════════════════════════════════════════════
test('TEST 2 — normalizeIssues assigns correct severity based on missing_pct thresholds', () => {
  const makeApi = (pct) => ({
    completeness: { score: 80, critical_missing: [{ column: 'TestCol', missing_pct: pct }] },
    consistency:  { score: 80, issues: [] },
    validity:     { score: 80, validity_checks: [] }
  });

  const issuesHigh     = normalizeIssues(makeApi(50));  // exactly 50 → CRITICAL
  const issuesMid      = normalizeIssues(makeApi(49));  // 49 → HIGH
  const issuesMidLow   = normalizeIssues(makeApi(20));  // exactly 20 → HIGH
  const issuesLow      = normalizeIssues(makeApi(19));  // 19 → MEDIUM

  assert.equal(issuesHigh[0].severity,   'CRITICAL', '50% missing should be CRITICAL');
  assert.equal(issuesMid[0].severity,    'HIGH',     '49% missing should be HIGH');
  assert.equal(issuesMidLow[0].severity, 'HIGH',     '20% missing should be HIGH');
  assert.equal(issuesLow[0].severity,    'MEDIUM',   '19% missing should be MEDIUM');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST 3 — POST /analyze: rejects request with no file → 400
// ═════════════════════════════════════════════════════════════════════════════
test('TEST 3 — POST /analyze returns 400 when no file is attached', async () => {
  const res = await request('POST', '/analyze', null);

  // multer + our guard both result in a non-200 response
  assert.ok(
    res.status === 400 || res.status === 500,
    `Expected 400 or 500 without a file, got ${res.status}`
  );
  // Response must be JSON with an error field
  assert.ok(
    typeof res.body === 'object' && res.body !== null,
    'Response body should be JSON'
  );
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST 4 — POST /approval: rejects missing required fields → 400
// ═════════════════════════════════════════════════════════════════════════════
test('TEST 4 — POST /approval returns 400 for missing required fields', async () => {
  // Case A: completely empty body
  const resEmpty = await request('POST', '/approval', {});
  assert.equal(resEmpty.status, 400, 'Empty body should return 400');
  assert.ok(resEmpty.body.error, 'Error message should be present');

  // Case B: is_real missing (analysis_id, issue_id, submitted_by all present)
  const resMissingIsReal = await request('POST', '/approval', {
    analysis_id:  'test-id',
    issue_id:     'issue-id',
    submitted_by: 'tester'
    // is_real intentionally omitted
  });
  assert.equal(resMissingIsReal.status, 400, 'Missing is_real should return 400');

  // Case C: submitted_by blank string
  const resBlankSubmitter = await request('POST', '/approval', {
    analysis_id:  'test-id',
    issue_id:     'issue-id',
    is_real:      true,
    submitted_by: '   '   // whitespace only
  });
  assert.equal(resBlankSubmitter.status, 400, 'Blank submitted_by should return 400');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST 5 — GET /fix-library: returns fixes sorted by votes, includes total
// ═════════════════════════════════════════════════════════════════════════════
test('TEST 5 — GET /fix-library returns fixes sorted by votes with correct total', async () => {
  const res = await request('GET', '/fix-library?sort_by=votes', null);

  assert.equal(res.status, 200, 'Fix library should return 200');
  assert.ok(Array.isArray(res.body.fixes), 'fixes should be an array');
  assert.equal(typeof res.body.total, 'number', 'total should be a number');
  assert.equal(res.body.total, res.body.fixes.length, 'total should equal fixes array length');
  assert.ok(res.body.total > 0, 'Fix library should have at least one seeded fix');

  // Verify descending sort by votes
  const votes = res.body.fixes.map(f => f.votes ?? 0);
  for (let i = 0; i < votes.length - 1; i++) {
    assert.ok(
      votes[i] >= votes[i + 1],
      `Fix at index ${i} (votes: ${votes[i]}) should have >= votes than index ${i + 1} (votes: ${votes[i + 1]})`
    );
  }

  // Verify each fix has required fields
  for (const fix of res.body.fixes) {
    assert.ok(fix.id,     `Fix "${fix.issue}" must have an id`);
    assert.ok(fix.issue,  `Fix id "${fix.id}" must have an issue description`);
    assert.ok(fix.fix,    `Fix id "${fix.id}" must have a fix value`);
    assert.ok(fix.quality_principle, `Fix id "${fix.id}" must have a quality_principle`);
    assert.ok(typeof fix.team_confidence === 'number', `Fix id "${fix.id}" team_confidence must be a number`);
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST 6 — GET /report/:id: returns report string with score and branding
// ═════════════════════════════════════════════════════════════════════════════
test('TEST 6 — GET /report/:id returns plain-text report with score and branding', async () => {
  // Use the test temp analyses file
  const testId = 'test-report-unit-001';
  const testRecord = {
    id:                 testId,
    filename:           'unit-test-report.csv',
    file_size:          512,
    timestamp:          new Date().toISOString(),
    row_count:          20,
    column_count:       5,
    overall_score:      91.0,
    completeness_score: 95.0,
    consistency_score:  88.0,
    validity_score:     90.0,
    issues: [
      {
        id:                 'report-issue-001',
        type:               'missing_values',
        column:             'Email',
        description:        'Missing Values in "Email"',
        detail:             '5% of rows have no value',
        severity:           'MEDIUM',
        machine_confidence: 95,
        suggested_fix:      'Backfill from CRM',
        approval:           null
      }
    ]
  };

  // Write test record to temp analyses file
  const analyses = readJSON(TEST_ANALYSES_FILE, { records: [] });
  writeJSON(TEST_ANALYSES_FILE, { records: [testRecord, ...analyses.records] });

  const res = await request('GET', `/report/${testId}`, null);

  assert.equal(res.status, 200, 'Report endpoint should return 200');
  assert.ok(typeof res.body.report === 'string', 'Response body.report should be a string');
  assert.ok(res.body.report.length > 0,               'Report text should be non-empty');
  assert.ok(res.body.report.includes('unit-test-report.csv'), 'Report should contain the filename');
  assert.ok(res.body.report.includes('91'),            'Report should contain overall score 91');
  assert.ok(res.body.report.includes('SysWisdom'),     'Report should include SysWisdom branding');
  assert.ok(res.body.report.includes('AWAITING HUMAN REVIEW'), 'Pending issue should appear in report');
  assert.ok(res.body.record,                           'Response should include the full record object');
  assert.equal(res.body.record.id, testId,             'record.id should match the requested id');

  // 404 for unknown id
  const resNotFound = await request('GET', '/report/nonexistent-analysis-id', null);
  assert.equal(resNotFound.status, 404, 'Unknown analysis id should return 404');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST 7 — GET /history: returns records with correct summary shape
// ═════════════════════════════════════════════════════════════════════════════
test('TEST 7 — GET /history returns records array with correct summary shape', async () => {
  const res = await request('GET', '/history', null);

  assert.equal(res.status, 200, 'History endpoint should return 200');
  assert.ok(Array.isArray(res.body.records),        'records should be an array');
  assert.ok(typeof res.body.total === 'number',     'total should be a number');
  assert.equal(res.body.total, res.body.records.length, 'total must equal records array length');

  // Validate summary schema on every record
  for (const r of res.body.records) {
    assert.ok(r.id,                              `Record must have id`);
    assert.ok(r.filename,                        `Record ${r.id} must have filename`);
    assert.ok(r.timestamp,                       `Record ${r.id} must have timestamp`);
    assert.ok(typeof r.overall_score === 'number', `Record ${r.id} overall_score must be a number`);
    assert.ok(typeof r.total    === 'number',    `Record ${r.id} total must be a number`);
    assert.ok(typeof r.approved === 'number',    `Record ${r.id} approved must be a number`);
    assert.ok(typeof r.rejected === 'number',    `Record ${r.id} rejected must be a number`);
    assert.ok(typeof r.pending  === 'number',    `Record ${r.id} pending must be a number`);
    // counts must add up
    assert.equal(
      r.approved + r.rejected + r.pending, r.total,
      `Record ${r.id}: approved + rejected + pending must equal total`
    );
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST 8 — POST /fix-library/vote: increments and decrements votes correctly
// ═════════════════════════════════════════════════════════════════════════════
test('TEST 8 — POST /fix-library/vote increments and decrements votes correctly', async () => {
  const lib = readJSON(TEST_LIBRARY_FILE, { fixes: [] });
  assert.ok(lib.fixes.length > 0, 'Fix library must have at least one fix to test voting');

  const target = lib.fixes[0];
  const startVotes = target.votes ?? 0;

  // Vote up
  const resUp = await request('POST', '/fix-library/vote', { fix_id: target.id, direction: 'up' });
  assert.equal(resUp.status, 200, 'Vote up should return 200');
  assert.equal(resUp.body.votes, startVotes + 1, 'Vote up should increment by exactly 1');

  // Vote down to restore (net zero change to real data)
  const resDown = await request('POST', '/fix-library/vote', { fix_id: target.id, direction: 'down' });
  assert.equal(resDown.status, 200, 'Vote down should return 200');
  assert.equal(resDown.body.votes, startVotes, 'Vote down should restore original vote count');

  // Invalid direction → 400
  const resBad = await request('POST', '/fix-library/vote', { fix_id: target.id, direction: 'sideways' });
  assert.equal(resBad.status, 400, 'Invalid direction should return 400');
  assert.ok(resBad.body.error, 'Error field should be present for bad direction');

  // Unknown fix_id → 404
  const resMissing = await request('POST', '/fix-library/vote', { fix_id: 'fix_DOES_NOT_EXIST', direction: 'up' });
  assert.equal(resMissing.status, 404, 'Unknown fix_id should return 404');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST 9 — POST /fix-library: validates required fields and creates new fix
// ═════════════════════════════════════════════════════════════════════════════
test('TEST 9 — POST /fix-library validates required fields and creates a new fix', async () => {
  // Missing all required fields → 400
  const resEmpty = await request('POST', '/fix-library', {});
  assert.equal(resEmpty.status, 400, 'Empty body should return 400');
  assert.ok(resEmpty.body.error, 'Error field should be present');

  // Missing fix field → 400
  const resMissingFix = await request('POST', '/fix-library', {
    issue: 'Null values in Email',
    created_by: 'unit_tester'
    // fix intentionally omitted
  });
  assert.equal(resMissingFix.status, 400, 'Missing fix should return 400');

  // Missing created_by → 400
  const resMissingCreator = await request('POST', '/fix-library', {
    issue: 'Null values in Email',
    fix:   'Backfill from CRM'
    // created_by intentionally omitted
  });
  assert.equal(resMissingCreator.status, 400, 'Missing created_by should return 400');

  // All required fields present → 200 with new fix object
  const resOk = await request('POST', '/fix-library', {
    issue:             'Unit Test Issue — safe to delete',
    fix:               'Unit Test Fix — no real action needed',
    quality_principle: 'test_coverage',
    severity:          'LOW',
    created_by:        'unit_tester'
  });
  assert.equal(resOk.status, 200, 'Valid body should return 200');
  assert.ok(resOk.body.fix.id,                        'Created fix must have an id');
  assert.equal(resOk.body.fix.created_by, 'unit_tester', 'created_by should match input');
  assert.equal(resOk.body.fix.quality_principle, 'test_coverage', 'quality_principle should match input');
  assert.equal(resOk.body.fix.votes, 0,               'New fix starts with 0 votes');

  // Clean up — remove the test fix so real data stays clean
  const lib = readJSON(TEST_LIBRARY_FILE, { fixes: [] });
  lib.fixes = lib.fixes.filter(f => f.id !== resOk.body.fix.id);
  writeJSON(TEST_LIBRARY_FILE, lib);
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST 10 — GET /drift-analysis — Monthly accuracy tracking & drift detection
// ══════════════════════════════════════════════════════════════════════════════
test('TEST 10: GET /drift-analysis returns monthly accuracy & drift status', async () => {
  const res = await request('GET', '/drift-analysis');
  assert.equal(res.status, 200, 'GET /drift-analysis should return 200');

  const body = res.body;
  assert.ok(body.monthly_accuracy, 'Response should have monthly_accuracy');
  assert.ok(typeof body.drift_detected === 'boolean', 'drift_detected should be boolean');
  assert.ok(body.recommendation, 'Response should have recommendation string');
  assert.ok(typeof body.current_accuracy === 'number', 'current_accuracy should be number');
  assert.ok(body.total_records !== undefined, 'Response should have total_records count');
});

// ══════════════════════════════════════════════════════════════════════════════
// TEST 11 — GET /training-export — Labeled dataset for ML engineers
// ══════════════════════════════════════════════════════════════════════════════
test('TEST 11: GET /training-export returns labeled training dataset', async () => {
  const res = await request('GET', '/training-export');
  assert.equal(res.status, 200, 'GET /training-export should return 200');

  const body = res.body;
  assert.ok(body.export_timestamp, 'Response should have export_timestamp');
  assert.ok(body.dataset_info, 'Response should have dataset_info');
  assert.ok(body.labeled_data, 'Response should have labeled_data array');
  assert.ok(Array.isArray(body.labeled_data), 'labeled_data should be an array');
  assert.ok(body.usage_notes, 'Response should have usage_notes');

  // Validate dataset_info shape
  const info = body.dataset_info;
  assert.ok(typeof info.total_analyses === 'number', 'total_analyses should be number');
  assert.ok(typeof info.total_issues === 'number', 'total_issues should be number');
  assert.ok(typeof info.real_issues === 'number', 'real_issues should be number');
  assert.ok(typeof info.false_positives === 'number', 'false_positives should be number');

  // Validate labeled_data structure (if any records exist)
  if (body.labeled_data.length > 0) {
    const sample = body.labeled_data[0];
    assert.ok(sample.analysis_id, 'Each record should have analysis_id');
    assert.ok(sample.filename, 'Each record should have filename');
    assert.ok(sample.api_scores, 'Each record should have api_scores');
    assert.ok(Array.isArray(sample.detected_issues), 'detected_issues should be array');

    // Validate issue structure
    if (sample.detected_issues.length > 0) {
      const issue = sample.detected_issues[0];
      assert.ok(['REAL', 'FALSE_POSITIVE', 'PENDING'].includes(issue.human_verdict), 'human_verdict must be REAL/FALSE_POSITIVE/PENDING');
      assert.ok(typeof issue.machine_confidence === 'number', 'machine_confidence should be number');
    }
  }
});
