/* Wildlife Acoustics Training Companion — UI (v1.1.0) */
(function () {
  'use strict';

  function showFileProtocolBanner(message) {
    const banner = document.getElementById('file-protocol-banner');
    if (!banner) return;
    banner.classList.remove('view-hidden');
    banner.innerHTML =
      '<strong>Setup help:</strong> ' +
      message +
      ' Open <code>public/index.html</code> from the built project (run <code>npm run build</code> first). ' +
      'For local HTTP serving: <code>npx serve public -p 8080</code> then visit <code>http://localhost:8080</code>.';
  }

  function detectFileProtocolIssues() {
    if (location.protocol !== 'file:') return false;
    const header = document.querySelector('header.site-header');
    if (header) {
      const bg = window.getComputedStyle(header).backgroundImage;
      if (!bg || bg === 'none') {
        showFileProtocolBanner('Styles did not load when opened via file://.');
        return true;
      }
    }
    return false;
  }

  if (typeof WAT === 'undefined') {
    const errorHtml =
      '<div class="hero-card" style="margin:2rem"><p><strong>Training app failed to load.</strong> Ensure <code>js/wat-core.js</code> is present. Run <code>npm run build</code> in the project root, then open <code>public/index.html</code> (not <code>index.template.html</code>).</p></div>';
    if (location.protocol === 'file:') {
      showFileProtocolBanner('<code>js/wat-core.js</code> did not load. Keep the <code>public/</code> folder intact.');
      const main = document.getElementById('app-main');
      if (main) main.innerHTML = errorHtml;
      else document.body.insertAdjacentHTML('beforeend', errorHtml);
    } else {
      document.body.innerHTML =
        '<p style="padding:2rem;font-family:sans-serif;">Training app failed to load. Ensure <code>js/wat-core.js</code> is present. Run <code>npm run build</code> in the project root, then open <code>public/index.html</code>.</p>';
    }
    return;
  }

  detectFileProtocolIssues();

  const {
    getTracks,
    getModuleById,
    getModulesForTrack,
    filterModulesByLevel,
    gradeKnowledgeCheck,
    STORAGE_KEY,
    createEmptyProgress,
    markLessonComplete,
    recordKnowledgeCheckResult,
    getModuleProgress,
    getTrackProgress,
    getOverallProgress,
    serializeProgress,
    deserializeProgress,
    LEVELS,
    searchCurriculum,
    getStudyPaths,
    getRecommendedModules,
    filterFieldReference,
    getFieldReferenceCategories,
    getDeploymentChecklist,
    getRemediationQueue,
  } = WAT;

  let progress = loadProgress();
  let currentView = 'catalog';
  let currentModuleId = null;
  let activeLevelFilter = 'all';
  let activeStudyPathId = '';
  let activeFieldRefCategory = 'all';
  let fieldRefQuery = '';
  let studyPathSelectInitialized = false;

  const els = {
    viewCatalog: document.getElementById('view-catalog'),
    viewFieldref: document.getElementById('view-fieldref'),
    viewModule: document.getElementById('view-module'),
    viewProgress: document.getElementById('view-progress'),
    trackGrid: document.getElementById('track-grid'),
    overallPercent: document.getElementById('overall-percent'),
    completedModules: document.getElementById('completed-modules'),
    totalModules: document.getElementById('total-modules'),
    filterBar: document.getElementById('level-filter'),
    moduleContent: document.getElementById('module-content'),
    progressDetail: document.getElementById('progress-detail'),
    fieldrefContent: document.getElementById('fieldref-content'),
    curriculumSearch: document.getElementById('curriculum-search'),
    studyPathSelect: document.getElementById('study-path-select'),
    searchResults: document.getElementById('search-results'),
    navButtons: document.querySelectorAll('[data-nav]'),
  };

  function loadProgress() {
    try {
      return deserializeProgress(localStorage.getItem(STORAGE_KEY));
    } catch {
      return createEmptyProgress();
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, serializeProgress(progress));
  }

  function showView(view) {
    currentView = view;
    els.viewCatalog.classList.toggle('view-hidden', view !== 'catalog');
    els.viewFieldref.classList.toggle('view-hidden', view !== 'fieldref');
    els.viewModule.classList.toggle('view-hidden', view !== 'module');
    els.viewProgress.classList.toggle('view-hidden', view !== 'progress');

    els.navButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.nav === view);
    });

    if (view === 'catalog') renderCatalog();
    if (view === 'fieldref') renderFieldReference();
    if (view === 'progress') renderProgressView();
  }

  function levelClass(level) {
    return 'level-' + level.toLowerCase();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderOverview() {
    const overall = getOverallProgress(progress);
    els.overallPercent.textContent = Math.round(overall.percentComplete * 100) + '%';
    els.completedModules.textContent = String(overall.completedModules);
    els.totalModules.textContent = String(overall.totalModules);
  }

  function initStudyPathSelect() {
    if (!els.studyPathSelect || studyPathSelectInitialized) return;
    for (const path of getStudyPaths()) {
      const opt = document.createElement('option');
      opt.value = path.id;
      opt.textContent = path.name;
      els.studyPathSelect.appendChild(opt);
    }
    els.studyPathSelect.addEventListener('change', () => {
      activeStudyPathId = els.studyPathSelect.value;
      renderCatalog();
    });
    studyPathSelectInitialized = true;
  }

  function getPathModuleIds() {
    if (!activeStudyPathId) return null;
    const mods = getRecommendedModules(activeStudyPathId);
    return new Set(mods.map((m) => m.id));
  }

  function renderSearchResults(query) {
    if (!els.searchResults) return;
    const q = (query || '').trim();
    if (!q) {
      els.searchResults.classList.add('view-hidden');
      els.searchResults.innerHTML = '';
      return;
    }

    const hits = searchCurriculum(q, { limit: 12 });
    if (!hits.length) {
      els.searchResults.classList.remove('view-hidden');
      els.searchResults.innerHTML = '<p>No matches for <strong>' + escapeHtml(q) + '</strong>.</p>';
      return;
    }

    els.searchResults.classList.remove('view-hidden');
    els.searchResults.innerHTML = hits
      .map(
        (hit) => `
      <div class="search-hit">
        <button type="button" data-open-module="${hit.moduleId}">
          ${escapeHtml(hit.moduleTitle)} <span class="level-badge ${levelClass(hit.level)}">${hit.level}</span>
        </button>
        <ul>${hit.matches.map((m) => `<li>${m.type}: ${escapeHtml(m.title)} — ${escapeHtml(m.excerpt)}…</li>`).join('')}</ul>
      </div>
    `
      )
      .join('');

    els.searchResults.querySelectorAll('[data-open-module]').forEach((btn) => {
      btn.addEventListener('click', () => openModule(btn.dataset.openModule));
    });
  }

  function renderCatalog() {
    renderOverview();
    initStudyPathSelect();
    renderFilters();

    const pathIds = getPathModuleIds();
    const tracks = getTracks();
    els.trackGrid.innerHTML = '';

    for (const track of tracks) {
      const trackProg = getTrackProgress(progress, track.id);
      let modules = getModulesForTrack(track.id);

      if (activeLevelFilter !== 'all') {
        modules = modules.filter((m) => m.level === activeLevelFilter);
      }
      if (pathIds) {
        modules = modules.filter((m) => pathIds.has(m.id));
      }

      if (modules.length === 0) continue;

      const card = document.createElement('article');
      card.className = 'track-card';
      card.innerHTML = `
        <div class="track-header">
          <h3>${escapeHtml(track.name)}</h3>
          <p>${escapeHtml(track.description)}</p>
          <div class="track-progress-bar">
            <div class="track-progress-fill" style="width:${Math.round(trackProg.percentComplete * 100)}%"></div>
          </div>
          <small>${trackProg.modulesComplete} of ${trackProg.moduleTotal} modules complete</small>
        </div>
        <ul class="module-list"></ul>
      `;

      const list = card.querySelector('.module-list');
      for (const mod of modules) {
        const mp = getModuleProgress(progress, mod.id);
        const li = document.createElement('li');
        li.className = 'module-item';
        li.innerHTML = `
          <div class="module-link" data-module="${mod.id}" role="button" tabindex="0">
            <div class="module-info">
              <h4>${escapeHtml(mod.title)}</h4>
              <div class="module-meta">
                <span class="level-badge ${levelClass(mod.level)}">${mod.level}</span>
                · ${escapeHtml(mod.instructor)} · ${escapeHtml(mod.duration)}
              </div>
            </div>
            <span class="module-status">${mp.moduleComplete ? '✓ Complete' : Math.round(mp.overallPercent * 100) + '%'}</span>
          </div>
        `;
        list.appendChild(li);
      }

      els.trackGrid.appendChild(card);
    }

    els.trackGrid.querySelectorAll('[data-module]').forEach((el) => {
      el.addEventListener('click', () => openModule(el.dataset.module));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModule(el.dataset.module);
        }
      });
    });
  }

  function renderFilters() {
    els.filterBar.innerHTML = `
      <button type="button" data-level="all" class="${activeLevelFilter === 'all' ? 'active' : ''}">All Levels</button>
      ${LEVELS.map(
        (l) =>
          `<button type="button" data-level="${l}" class="${activeLevelFilter === l ? 'active' : ''}">${l}</button>`
      ).join('')}
    `;

    els.filterBar.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeLevelFilter = btn.dataset.level;
        renderCatalog();
      });
    });
  }

  function renderFieldReference() {
    const entries = filterFieldReference({ category: activeFieldRefCategory, query: fieldRefQuery });
    const categories = getFieldReferenceCategories();
    const checklist = getDeploymentChecklist();

    els.fieldrefContent.innerHTML = `
      <div class="hero-card hero-card--split">
        <div class="hero-card__body">
          <div>
            <h2>Field Quick Reference</h2>
            <p>Deployment specs, taxa frequency bands, and QA checklists for field season — aligned with Academy training themes.</p>
            <label class="search-field" for="fieldref-search">
              <span class="sr-only">Search field reference</span>
              <input type="search" id="fieldref-search" placeholder="Filter reference (bat, Nyquist, metadata)…" value="${escapeHtml(fieldRefQuery)}" />
            </label>
            <div class="fieldref-filters" id="fieldref-filters">
              <button type="button" data-cat="all" class="${activeFieldRefCategory === 'all' ? 'active' : ''}">All</button>
              ${categories
                .map(
                  (c) =>
                    `<button type="button" data-cat="${c}" class="${activeFieldRefCategory === c ? 'active' : ''}">${escapeHtml(c)}</button>`
                )
                .join('')}
            </div>
          </div>
          <div class="hero-card__aside" aria-hidden="true">
            <img src="assets/wa-field-reference.jpg" alt="" width="480" height="320" decoding="async" />
          </div>
        </div>
      </div>
      <div class="fieldref-panel">
        <section>
          <h3>Reference Cards (${entries.length})</h3>
          ${entries
            .map(
              (e) => `
            <article class="ref-card">
              <h4>${escapeHtml(e.title)}</h4>
              <p>${escapeHtml(e.summary)}</p>
              <p><small>${escapeHtml(e.detail)}</small></p>
              <p class="ref-tags">${e.tags.map((t) => '#' + escapeHtml(t)).join(' ')}</p>
            </article>
          `
            )
            .join('')}
        </section>
        <section>
          <h3>Pre-Deployment Checklist</h3>
          <ul class="deployment-checklist">
            ${checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </section>
      </div>
    `;

    const searchInput = document.getElementById('fieldref-search');
    searchInput.addEventListener('input', () => {
      fieldRefQuery = searchInput.value;
      renderFieldReference();
    });

    els.fieldrefContent.querySelectorAll('#fieldref-filters button').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFieldRefCategory = btn.dataset.cat;
        renderFieldReference();
      });
    });
  }

  function openModule(moduleId) {
    currentModuleId = moduleId;
    const mod = getModuleById(moduleId);
    if (!mod) return;

    const mp = getModuleProgress(progress, moduleId);
    const lessonsHtml = mod.lessons
      .map((lesson) => {
        const done = (progress.completedLessons[moduleId] ?? []).includes(lesson.id);
        const paras = lesson.content.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
        return `
          <section class="lesson-block" id="lesson-${lesson.id}">
            <h3>${escapeHtml(lesson.title)} ${done ? '<span aria-label="completed">✓</span>' : ''}</h3>
            ${paras}
            <div class="lesson-actions">
              <button type="button" class="btn btn-secondary" data-complete-lesson="${lesson.id}" ${done ? 'disabled' : ''}>
                ${done ? 'Lesson Completed' : 'Mark Lesson Complete'}
              </button>
            </div>
          </section>
        `;
      })
      .join('');

    const questionsHtml = mod.knowledgeCheck.questions
      .map(
        (q, qi) => `
        <div class="question-card" data-question="${q.id}">
          <p class="prompt">${qi + 1}. ${escapeHtml(q.prompt)}</p>
          <div class="options">
            ${q.options
              .map(
                (opt, oi) => `
              <label>
                <input type="radio" name="q-${q.id}" value="${oi}" />
                ${escapeHtml(opt)}
              </label>
            `
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('');

    els.moduleContent.innerHTML = `
      <div class="breadcrumb">
        <a data-nav="catalog" role="button" tabindex="0">← Back to Catalog</a>
      </div>
      <article class="module-detail">
        <span class="level-badge ${levelClass(mod.level)}">${mod.level}</span>
        <h2>${escapeHtml(mod.title)}</h2>
        <p class="instructor-line">Instructor: ${escapeHtml(mod.instructor)} · ${escapeHtml(mod.duration)}</p>
        <p>${escapeHtml(mod.summary)}</p>
        <p><small>Academy reference: <em>${escapeHtml(mod.academyRef)}</em></small></p>
        ${lessonsHtml}
        <section class="knowledge-check" id="knowledge-check">
          <h3>Knowledge Check</h3>
          <p>Answer all questions, then submit for immediate scored feedback. Pass threshold: ${Math.round(mod.knowledgeCheck.passThreshold * 100)}%.</p>
          ${mp.knowledgeCheckPassed ? '<p><strong>✓ You have passed this knowledge check.</strong></p>' : ''}
          <form id="quiz-form">
            ${questionsHtml}
            <button type="submit" class="btn btn-primary">Submit Answers</button>
          </form>
          <div id="quiz-feedback" class="feedback-panel" role="status" aria-live="polite"></div>
        </section>
      </article>
    `;

    els.moduleContent.querySelector('[data-nav="catalog"]').addEventListener('click', () => showView('catalog'));

    els.moduleContent.querySelectorAll('[data-complete-lesson]').forEach((btn) => {
      btn.addEventListener('click', () => {
        progress = markLessonComplete(progress, moduleId, btn.dataset.completeLesson);
        saveProgress();
        openModule(moduleId);
      });
    });

    document.getElementById('quiz-form').addEventListener('submit', (e) => {
      e.preventDefault();
      submitQuiz(mod);
    });

    showView('module');
  }

  function submitQuiz(mod) {
    const answers = {};
    for (const q of mod.knowledgeCheck.questions) {
      const selected = formRadioValue(`q-${q.id}`);
      if (selected !== null) answers[q.id] = selected;
    }

    const result = gradeKnowledgeCheck(mod.knowledgeCheck, answers);
    progress = recordKnowledgeCheckResult(progress, mod.id, result);
    saveProgress();

    const panel = document.getElementById('quiz-feedback');
    panel.className = 'feedback-panel visible ' + (result.passed ? 'passed' : 'failed');
    panel.innerHTML = `
      <h4>${escapeHtml(result.summary)}</h4>
      ${result.results
        .map(
          (r) => `
        <div class="feedback-item ${r.correct ? 'correct' : 'incorrect'}">
          <strong>${r.correct ? '✓' : '✗'}</strong> ${escapeHtml(r.prompt)}<br/>
          <span>${escapeHtml(r.feedback)}</span>
        </div>
      `
        )
        .join('')}
      ${result.passed ? '' : '<p><em>Missed items were added to your remediation queue on My Progress.</em></p>'}
    `;

    if (panel.scrollIntoView) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    renderOverview();
  }

  function formRadioValue(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? parseInt(el.value, 10) : null;
  }

  function renderProgressView() {
    const overall = getOverallProgress(progress);
    const remediation = getRemediationQueue(progress);

    const remediationHtml =
      remediation.length > 0
        ? `
      <section class="remediation-queue">
        <h3>Review Missed Knowledge-Check Items (${remediation.length})</h3>
        <p>Study rationales before retaking a module quiz.</p>
        ${remediation
          .map(
            (item) => `
          <article class="remediation-item">
            <strong>${escapeHtml(item.moduleTitle)}</strong>
            <p>${escapeHtml(item.prompt)}</p>
            <p><small>Correct: ${escapeHtml(item.correctAnswer)}</small></p>
            <p>${escapeHtml(item.rationale)}</p>
            <button type="button" class="btn btn-secondary" data-review-module="${item.moduleId}">Open module</button>
          </article>
        `
          )
          .join('')}
      </section>
    `
        : '<p class="remediation-queue"><em>No missed items in your remediation queue.</em></p>';

    els.progressDetail.innerHTML = `
      <div class="hero-card">
        <h2>Your Learning Progress</h2>
        <p>Progress is saved locally in your browser and persists across sessions.</p>
        <div class="progress-overview">
          <div class="progress-stat">
            <div class="value">${Math.round(overall.percentComplete * 100)}%</div>
            <div class="label">Overall Complete</div>
          </div>
          <div class="progress-stat">
            <div class="value">${overall.completedModules}</div>
            <div class="label">Modules Passed</div>
          </div>
          <div class="progress-stat">
            <div class="value">${overall.totalModules}</div>
            <div class="label">Total Modules</div>
          </div>
        </div>
      </div>
      ${remediationHtml}
      ${overall.tracks
        .map(
          (t) => `
        <article class="track-card" style="margin-bottom:1rem;">
          <div class="track-header">
            <h3>${escapeHtml(t.trackName)}</h3>
            <div class="track-progress-bar">
              <div class="track-progress-fill" style="width:${Math.round(t.percentComplete * 100)}%"></div>
            </div>
            <small>${t.modulesComplete} / ${t.moduleTotal} modules complete (${Math.round(t.percentComplete * 100)}%)</small>
          </div>
          <ul class="module-list">
            ${t.modules
              .map((m) => {
                const mod = getModuleById(m.moduleId);
                return `
              <li class="module-item">
                <div class="module-link" data-open-module="${m.moduleId}" role="button" tabindex="0">
                  <div class="module-info">
                    <h4>${escapeHtml(mod.title)}</h4>
                    <div class="module-meta">
                      Lessons: ${m.lessonsComplete}/${m.lessonTotal} ·
                      Quiz: ${m.knowledgeCheckPassed ? 'Passed' : Math.round(m.knowledgeCheckBestScore * 100) + '% best'}
                    </div>
                  </div>
                  <span class="module-status">${m.moduleComplete ? '✓' : Math.round(m.overallPercent * 100) + '%'}</span>
                </div>
              </li>
            `;
              })
              .join('')}
          </ul>
        </article>
      `
        )
        .join('')}
      <button type="button" class="btn btn-secondary" id="reset-progress">Reset All Progress</button>
    `;

    els.progressDetail.querySelectorAll('[data-open-module], [data-review-module]').forEach((el) => {
      el.addEventListener('click', () => openModule(el.dataset.openModule || el.dataset.reviewModule));
    });

    document.getElementById('reset-progress').addEventListener('click', () => {
      if (confirm('Reset all learning progress? This cannot be undone.')) {
        progress = createEmptyProgress();
        saveProgress();
        renderProgressView();
        renderOverview();
      }
    });
  }

  if (els.curriculumSearch) {
    els.curriculumSearch.addEventListener('input', () => renderSearchResults(els.curriculumSearch.value));
  }

  els.navButtons.forEach((btn) => {
    btn.addEventListener('click', () => showView(btn.dataset.nav));
  });

  showView('catalog');
})();