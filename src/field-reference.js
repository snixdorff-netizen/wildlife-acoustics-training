'use strict';

const FIELD_REFERENCE = [
  { id: 'nyquist-rule', category: 'recording-specs', title: 'Nyquist Sample Rate Rule', summary: 'Sample rate must be at least 2× the highest frequency you need.', detail: '48 kHz captures up to 24 kHz; bat surveys need 256–500 kHz hardware.', tags: ['sample-rate'] },
  { id: 'bird-band', category: 'taxa-frequency', title: 'Bird Vocalizations', summary: 'Most calls: ~1–8 kHz.', detail: 'Song Meter bird deployments often use 48 kHz / 16-bit.', tags: ['birds'] },
  { id: 'bat-band', category: 'taxa-frequency', title: 'Bat Echolocation', summary: 'Ultrasonic calls ~20–120+ kHz.', detail: 'Use SM5BAT; Kaleidoscope bat workflows and USFWS guidelines assume ultrasonic capture.', tags: ['bats'] },
  { id: 'frog-band', category: 'taxa-frequency', title: 'Frogs & Toads', summary: 'Advertisement calls ~0.2–5 kHz.', detail: 'Wetland edge placement maximizes chorus detection.', tags: ['amphibians'] },
  { id: 'owl-band', category: 'taxa-frequency', title: 'Owls & Nocturnal Birds', summary: 'Low-frequency hoots ~0.2–4 kHz.', detail: 'Schedule nocturnal windows; minimize wind noise.', tags: ['owls'] },
  { id: 'sm5-mount', category: 'deployment', title: 'Song Meter Mount Height', summary: '1.5–2 m typical for birds.', detail: 'Document GPS, habitat, height, schedule, firmware, mic model.', tags: ['song-meter'] },
  { id: 'wind-qa', category: 'qa-checklist', title: 'Wind Noise QA', summary: 'Review first hour for clipping and rumble.', detail: 'Re-site or add windscreens before batch analysis.', tags: ['qa'] },
  { id: 'metadata-min', category: 'qa-checklist', title: 'Minimum Metadata', summary: 'GPS, date/time, habitat, mic aim, schedule, firmware.', detail: 'Required for reproducible analysis and regulatory reports.', tags: ['metadata'] },
  { id: 'file-inventory', category: 'deployment', title: 'Kaleidoscope File Inventory', summary: 'Verify SD file counts match field notes.', detail: 'Kaleidoscope Lite + Song Meter module covers inventory and export.', tags: ['kaleidoscope'] },
  { id: 'kc-threshold', category: 'recording-specs', title: 'Knowledge Check Threshold', summary: 'Default 70% to pass.', detail: 'Use remediation queue to review missed items before retaking.', tags: ['training'] },
];

const DEPLOYMENT_CHECKLIST = [
  'Confirm sample rate matches target taxa (Nyquist)',
  'Record GPS coordinates and habitat description',
  'Note mount height, mic orientation, and recording schedule',
  'Verify firmware version and power plan',
  'Run first-hour audio QA for wind and clipping',
  'Match SD inventory to field datasheets',
];

function getFieldReferenceEntries() {
  return FIELD_REFERENCE.slice();
}

function getDeploymentChecklist() {
  return DEPLOYMENT_CHECKLIST.slice();
}

function filterFieldReference({ category, query } = {}) {
  let entries = getFieldReferenceEntries();
  if (category && category !== 'all') {
    entries = entries.filter((e) => e.category === category);
  }
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    entries = entries.filter((e) =>
      [e.title, e.summary, e.detail, ...e.tags].join(' ').toLowerCase().includes(q)
    );
  }
  return entries;
}

function getFieldReferenceCategories() {
  return [...new Set(FIELD_REFERENCE.map((e) => e.category))].sort();
}

module.exports = {
  getFieldReferenceEntries,
  getDeploymentChecklist,
  filterFieldReference,
  getFieldReferenceCategories,
};