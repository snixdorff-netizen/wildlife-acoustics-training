'use strict';

/** Curriculum snapshot derived from public Wildlife Acoustics Academy course catalog (2026). */
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const TRACKS = [
  {
    id: 'bioacoustics-fundamentals',
    name: 'Bioacoustics Fundamentals',
    description:
      'Core concepts for wildlife professionals new to acoustic monitoring — recording basics, species vocalization, and data management.',
    modules: ['intro-bioacoustics-novice'],
  },
  {
    id: 'song-meter-hardware',
    name: 'Song Meter Recorder Deployment',
    description:
      'Hardware setup, configuration, and field deployment for Song Meter SM5, SM5BAT, and related recorders.',
    modules: ['sm5-sm5bat-deep-dive', 'kscope-lite-song-meter'],
  },
  {
    id: 'kaleidoscope-analysis',
    name: 'Kaleidoscope Analysis Workflows',
    description:
      'Sound analysis with Kaleidoscope Lite and Pro — non-bat acoustics, bat call analysis, Bat Auto-ID, and batch processing.',
    modules: [
      'kscope-birds-amphibians',
      'kscope-lite-bat-analysis',
      'bat-auto-id',
      'acoustic-analysis-kscope-part1',
    ],
  },
  {
    id: 'species-applications',
    name: 'Species & Application Modules',
    description:
      'Targeted workflows for birds, owls and nocturnal species, frogs and toads, and BirdNET integration.',
    modules: ['frogs-toads-kscope', 'owls-nocturnal-birds', 'birdnet-kscope-integration'],
  },
  {
    id: 'regulatory-guidelines',
    name: 'Regulatory & Survey Guidelines',
    description:
      'Federal survey protocols and compliance standards for professional bat acoustic monitoring.',
    modules: ['usfws-2026-bat-guidelines'],
  },
];

const MODULES = {
  'intro-bioacoustics-novice': {
    id: 'intro-bioacoustics-novice',
    title: 'Intro to Bioacoustics for the Complete Novice',
    level: 'Beginner',
    instructor: 'Dr. Fran Tattersall',
    duration: '2 hours',
    academyRef: 'Intro to Bioacoustics for the Complete Novice (Beginner)',
    summary:
      'Learn sound recording basics, how species vocalize, equipment selection, and data management — with case studies and simple phone-based recording exercises.',
    lessons: [
      {
        id: 'bio-basics',
        title: 'What Is Bioacoustics?',
        content: [
          'Bioacoustics is the study of how animals produce, transmit, and receive sound — and how researchers use those sounds to monitor wildlife.',
          'Passive acoustic monitoring lets biologists survey species over weeks or months without disturbing habitats, especially for cryptic or nocturnal animals.',
          'Wildlife Acoustics Song Meter recorders capture audio continuously in the field; Kaleidoscope software helps you review, label, and analyze recordings.',
          'The Academy novice course positions bioacoustics within conservation: acoustic data supports presence-absence surveys, occupancy modeling, and long-term biodiversity trend analysis.',
        ],
      },
      {
        id: 'recording-fundamentals',
        title: 'Recording Fundamentals',
        content: [
          'Key recording concepts include sample rate (how many digital snapshots per second), bit depth (dynamic range), and microphone placement relative to the sound source.',
          'Sample rate determines the maximum frequency you can capture — you need at least twice the highest frequency of interest (Nyquist theorem). A 48 kHz sample rate captures sounds up to 24 kHz; bat surveys often require 256–500 kHz.',
          'Bit depth affects dynamic range: 16-bit recording is standard for wildlife work and balances file size with the ability to resolve quiet distant calls against loud nearby sounds.',
          'Microphone placement matters as much as equipment choice. Orient mics toward expected sound sources, minimize handling noise, and shield from wind with foam windscreens or strategic siting behind vegetation.',
          'Different taxa vocalize in different frequency bands: birds and frogs are typically audible (1–8 kHz); insects may reach higher; bats use ultrasonic echolocation from 20 kHz to 120+ kHz depending on species.',
          'Always document deployment metadata — GPS coordinates, habitat type, mount height, recording schedule, firmware version, and microphone model — so analysis results are reproducible and defensible in reports and peer review.',
        ],
      },
      {
        id: 'species-vocalization-cases',
        title: 'Species Vocalization & Academy Case Studies',
        content: [
          'Dr. Fran Tattersall\'s novice workshop emphasizes that species vocalize for distinct biological reasons: territorial defense, mate attraction, alarm, offspring contact, and echolocation navigation — each produces different acoustic signatures.',
          'Case studies from the Academy include dawn chorus bird monitoring where continuous recording revealed species presence across weeks without repeated site visits, reducing surveyor disturbance in sensitive habitats.',
          'Phone-based recording exercises taught in the live workshop demonstrate that even consumer devices can illustrate frequency and rhythm concepts before investing in dedicated field recorders — useful for training field crews.',
          'Data management basics covered in the course include consistent folder naming by site and date, backing up SD cards before analysis, and maintaining a field log that links physical deployment notes to digital file names.',
          'The workshop bridges into Wildlife Acoustics hardware by explaining when a Song Meter autonomous recorder is warranted versus handheld point-survey recording — typically when continuous multi-night coverage is required.',
          'Learners completing this module are prepared for Kaleidoscope Lite training where recorded files become visual sonograms for manual review and labeling.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-intro-bioacoustics',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'What is the primary advantage of passive acoustic monitoring in field biology?',
          options: [
            'It eliminates the need for permits',
            'It enables long-duration, low-disturbance species surveys',
            'It replaces all visual survey methods',
            'It only works for diurnal species',
          ],
          correctIndex: 1,
          rationale:
            'Passive acoustic monitoring runs unattended for days or weeks, capturing vocal activity with minimal habitat disturbance — a core theme of the Academy novice workshop.',
        },
        {
          id: 'q2',
          prompt: 'Why is deployment metadata (GPS, schedule, mount height) critical?',
          options: [
            'It is only needed for Kaleidoscope Pro licenses',
            'It enables reproducible, defensible analysis and reporting',
            'It reduces file sizes on the SD card',
            'It is required only for bat surveys',
          ],
          correctIndex: 1,
          rationale:
            'The novice course emphasizes managing and interpreting data; metadata ties each recording to its field context for valid scientific conclusions.',
        },
        {
          id: 'q3',
          prompt: 'Bat echolocation calls are typically found in which frequency range?',
          options: [
            'Below 1 kHz',
            '1–8 kHz (audible bird range)',
            'Above 20 kHz (ultrasonic)',
            'Only in infrasound below 20 Hz',
          ],
          correctIndex: 2,
          rationale:
            'Understanding how different species vocalize across frequency bands is a foundational topic in the complete-novice bioacoustics introduction.',
        },
        {
          id: 'q4',
          prompt: 'According to the Nyquist theorem, what sample rate is needed to capture sounds up to 24 kHz?',
          options: [
            '12 kHz',
            '24 kHz',
            'At least 48 kHz',
            '384 kHz minimum for all wildlife',
          ],
          correctIndex: 2,
          rationale:
            'Sample rate must be at least twice the highest frequency of interest; 48 kHz captures up to 24 kHz — a core recording fundamental in the novice workshop.',
        },
      ],
    },
  },

  'sm5-sm5bat-deep-dive': {
    id: 'sm5-sm5bat-deep-dive',
    title: 'Deep Dive: Song Meter SM5 & SM5BAT',
    level: 'Beginner',
    instructor: 'Paul Howden-Leach',
    duration: '2 hours',
    academyRef: 'Deep Dive: Meet the New Song Meter SM5 & SM5BAT',
    summary:
      'Explore SM5 and SM5BAT hardware, multi-channel ultrasonic and acoustic configuration, and the 2026–2027 SM5 family roadmap.',
    lessons: [
      {
        id: 'sm5-hardware',
        title: 'SM5 Family Hardware Overview',
        content: [
          'The Song Meter SM5 is Wildlife Acoustics\' latest generation field recorder, designed for rugged, long-term autonomous deployment.',
          'SM5BAT is optimized for bat surveys with ultrasonic-capable microphones and scheduling tuned for nocturnal echolocation capture.',
          'Both units support programming multiple channels to record acoustic and ultrasonic audio simultaneously — a key differentiator from earlier Song Meter models.',
          'The March 2026 Academy deep-dive compares physical dimensions, power budgets, and microphone options against SM4 and Mini models to help teams choose the right hardware.',
        ],
      },
      {
        id: 'sm5-configuration',
        title: 'Configuration & Multi-Channel Recording',
        content: [
          'Use the Song Meter configuration utility to set recording schedules, trigger modes, sample rates, and channel assignments before deployment.',
          'Paul Howden-Leach\'s SM5 deep-dive walks through programming simultaneous ultrasonic and acoustic channels — enabling one deployment to capture bats on an ultrasonic mic and birds or frogs on an acoustic channel.',
          'Match sample rate to your target species: 384 kHz or higher for full-spectrum bat work; 256 kHz may suffice for some regional species; 48 kHz is typical for birds, frogs, and general soundscape monitoring.',
          'Trigger modes include scheduled recording (most common for surveys), duty-cycle recording to extend battery life, and optional sound-activated triggers for targeted capture.',
          'Verify battery life estimates and storage capacity for your schedule — a 2-week bat survey at 384 kHz requires different power and SD planning than a dawn-chorus bird study at 48 kHz.',
          'The workshop previews the 2026–2027 SM5 family roadmap including new accessories and firmware features — check Wildlife Acoustics release notes before each field season.',
        ],
      },
      {
        id: 'sm5-field-deployment',
        title: 'Field Deployment Best Practices',
        content: [
          'Physical deployment topics from the Academy workshop include selecting mount type (tripod, tree strap, mast), securing against wildlife interference, and weatherproofing cable connections.',
          'Pre-deployment checklist: verify clock sync, test recording locally, confirm GPS lock if equipped, label SD cards with site IDs matching your study design spreadsheet.',
          'SM5BAT deployments for bat surveys typically use elevated microphone placement 1.5–2 m above ground, oriented to minimize ground-clutter echoes while maintaining open sky for passing bats.',
          'Compare SM5/SM5BAT against legacy Song Meter SM4 and Mini models: SM5 offers improved multi-channel flexibility and next-generation power management for longer autonomous deployments.',
          'Post-retrieval workflow: verify file integrity in the field when possible, note any equipment anomalies in the field log, and transport SD cards with chain-of-custody documentation for regulatory surveys.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-sm5',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'What distinguishes SM5BAT from the standard SM5 for field work?',
          options: [
            'SM5BAT cannot record audible frequencies',
            'SM5BAT is optimized for ultrasonic bat echolocation surveys',
            'SM5BAT requires Kaleidoscope Pro to record',
            'SM5BAT has no scheduling capability',
          ],
          correctIndex: 1,
          rationale:
            'The SM5/SM5BAT deep-dive workshop covers hardware differences and how SM5BAT targets bat monitoring with ultrasonic channels.',
        },
        {
          id: 'q2',
          prompt: 'Why program multiple channels on an SM5 deployment?',
          options: [
            'To reduce power consumption to zero',
            'To capture acoustic and ultrasonic audio simultaneously',
            'To disable metadata embedding',
            'Channels are only for live streaming',
          ],
          correctIndex: 1,
          rationale:
            'Multi-channel configuration — recording audible and ultrasonic audio at once — is a central topic in the SM5 family training.',
        },
        {
          id: 'q3',
          prompt: 'What sample rate is typically appropriate for dawn-chorus bird monitoring on an SM5?',
          options: [
            '4 kHz',
            '48 kHz',
            '384 kHz ultrasonic only',
            '1 MHz',
          ],
          correctIndex: 1,
          rationale:
            'The SM5 configuration lesson contrasts bat ultrasonic rates (384 kHz+) with 48 kHz for birds, frogs, and soundscape monitoring.',
        },
      ],
    },
  },

  'kscope-lite-song-meter': {
    id: 'kscope-lite-song-meter',
    title: 'Using Kaleidoscope Lite with Song Meter Recorders',
    level: 'Intermediate',
    instructor: 'Dave Roberts',
    duration: '2 hours',
    academyRef: 'Using Kaleidoscope Lite with Wildlife Acoustics Song Meter Recorders (Intermediate)',
    summary:
      'Create file inventories from Song Meter deployments, use the Viewer for metadata context, vet recordings, and export spreadsheets with project notes.',
    lessons: [
      {
        id: 'inventory-viewer',
        title: 'File Inventory & Viewer Workflow',
        content: [
          'Kaleidoscope Lite (free) integrates with Song Meter deployments: point it at an SD card or copied folder to build a searchable file inventory.',
          'The Viewer displays each WAV with embedded Song Meter metadata — deployment ID, schedule, temperature, GPS — providing context beyond the audio alone.',
          'Use the inventory list to quickly scan recording dates, filter by channel, and flag files that need closer review.',
          'Dave Roberts demonstrates building a project spreadsheet from the inventory — the first deliverable many consultants produce after retrieving field equipment.',
        ],
      },
      {
        id: 'vetting-export',
        title: 'Vetting, Comments & Export',
        content: [
          'Vet recordings by listening and viewing sonograms; add per-file comments to document species heard, quality issues, or follow-up needs.',
          'Dave Roberts\' intermediate workshop demonstrates creating a simple file inventory list from a Song Meter SD card — the first step in any analysis pipeline before opening individual WAV files.',
          'The Kaleidoscope Viewer shows Song Meter-specific metadata embedded in each file: deployment name, schedule segment, temperature, battery voltage, and GPS coordinates when available.',
          'General project notes capture study design reminders, site conditions, or analyst decisions that apply across the entire deployment rather than individual clips.',
          'Export spreadsheets for reporting — the inventory plus your labels and notes become the foundation for species tables, effort metrics, and QA documentation delivered to clients or agencies.',
          'This workflow supports SM5, SM4, Song Meter Mini 2, and Song Meter Micro 2 deployments — any recorder producing standard WAV output with Wildlife Acoustics metadata headers.',
        ],
      },
      {
        id: 'metadata-workflow',
        title: 'Metadata-Driven Project Management',
        content: [
          'Song Meters provide a wealth of metadata beyond audio; Kaleidoscope Lite delivers tools for managing that information without requiring a Pro license.',
          'Filter inventory lists by date range, channel, or custom tags to focus QA effort on high-priority nights (e.g., peak migration or breeding windows).',
          'Per-file comments create an audit trail: document who reviewed each file, what was heard, and whether the recording quality supports species-level conclusions.',
          'Combine inventory exports with GIS site layers to map vocal activity spatially — a technique environmental consultants use for impact assessment reporting.',
          'The Academy course positions Kaleidoscope Lite + Song Meter integration as the bridge between field deployment and advanced Kaleidoscope Pro analysis workflows.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-kscope-lite-sm',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'What does Kaleidoscope Lite provide when pointed at a Song Meter deployment folder?',
          options: [
            'Automatic federal permit submission',
            'A searchable file inventory with embedded recorder metadata',
            'Real-time GPS tracking of animals',
            'Hardware firmware updates',
          ],
          correctIndex: 1,
          rationale:
            'The intermediate Kaleidoscope Lite + Song Meter course teaches inventory creation and using the Viewer to access Song Meter metadata.',
        },
        {
          id: 'q2',
          prompt: 'Why add per-file comments during vetting?',
          options: [
            'Comments are discarded on export',
            'They document analyst decisions for QA and reporting',
            'They replace the need for sonogram review',
            'Only Kaleidoscope Pro supports comments',
          ],
          correctIndex: 1,
          rationale:
            'File comments and project notes are part of the workflow for managing Song Meter metadata and producing defensible deliverables.',
        },
        {
          id: 'q3',
          prompt: 'Which Song Meter models are explicitly covered in the Kaleidoscope Lite + Song Meter workshop?',
          options: [
            'SM5, SM4, Song Meter Mini 2, and Song Meter Micro 2',
            'Only legacy SM2 models',
            'Only SM5BAT with no acoustic channel',
            'Song Meter models are not supported by Kaleidoscope',
          ],
          correctIndex: 0,
          rationale:
            'The intermediate Academy course description lists SM5, SM4, Mini 2, and Micro 2 as supported recorders for the Kaleidoscope Lite inventory workflow.',
        },
      ],
    },
  },

  'kscope-birds-amphibians': {
    id: 'kscope-birds-amphibians',
    title: 'Kaleidoscope for Birds, Amphibians & More',
    level: 'Beginner',
    instructor: 'Dave Roberts',
    duration: '2 hours',
    academyRef: 'Introduction to Kaleidoscope for Sound Analysis of Birds, Amphibians, and More (Beginner)',
    summary:
      'Manage files, read sonograms, and perform manual and automated analysis — foundation for cluster analysis, classifiers, and acoustic indices.',
    lessons: [
      {
        id: 'sonogram-basics',
        title: 'Sonograms & Sound as Data',
        content: [
          'A sonogram (spectrogram) plots frequency against time with color or brightness showing amplitude — the primary visual tool for bioacoustics analysis in Kaleidoscope.',
          'Dave Roberts\' beginner workshop uses free Kaleidoscope Lite to explore how sound tells a story: each vocalization leaves a unique trace in the time-frequency domain.',
          'Bird songs appear as repeated motifs with harmonic stacks; frog calls show pulsed energy bands; insect stridulation often produces sustained high-frequency carriers.',
          'Navigate recordings with zoom, loop, and playback speed controls to train your ear and eye together — a skill that transfers across all taxonomic groups.',
          'Kaleidoscope Lite lets you measure call duration, peak frequency, and inter-call interval without a Pro license — ideal for learning and small-scale monitoring projects.',
          'Sample recordings are provided in the live Academy class so learners can follow along in real time during the 2-hour session.',
        ],
      },
      {
        id: 'manual-automated-analysis',
        title: 'Manual & Automated Analysis Foundations',
        content: [
          'The course introduces both manual scanning (listening while watching the sonogram scroll) and automated approaches that scale to thousands of files.',
          'Manual analysis remains the gold standard for QA: automated tools propose candidates, but trained analysts confirm species identity and document uncertainty.',
          'File management in Kaleidoscope organizes recordings into projects with consistent naming — critical before running any batch operation or classifier.',
          'Upon completion, learners have the foundation for higher-level Academy classes: cluster analysis (grouping similar sounds), custom classifiers, SPL analysis, and acoustic index metrics.',
          'Acoustic indices summarize community activity over time without species-level ID — useful for trend monitoring when full classification is not required.',
          'The workshop connects bird and amphibian analysis to the same Kaleidoscope Viewer skills used in bat workflows, differing mainly in frequency range and call morphology.',
        ],
      },
      {
        id: 'higher-level-pathways',
        title: 'Pathways to Advanced Kaleidoscope Skills',
        content: [
          'Wildlife Acoustics Academy structures learning progressively: this beginner birds/amphibians class precedes intermediate batch processing and advanced classifier development.',
          'Cluster analysis groups acoustically similar events across a dataset — the first step toward building species-specific recognizers in Kaleidoscope Pro.',
          'SPL (Sound Pressure Level) analysis quantifies acoustic energy for environmental noise compliance and habitat disturbance studies alongside biodiversity monitoring.',
          'Classifiers trained on vetted clusters can automate species detection, but require representative training data from the geographic region and habitat of your project.',
          'Learners are encouraged to enroll in follow-on live virtual training for species-specific deep dives (owls, frogs, bats) once Viewer skills are comfortable.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-kscope-birds',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'What does a sonogram display?',
          options: [
            'GPS tracks of tagged animals',
            'Frequency over time with amplitude shown as color intensity',
            'Only bat echolocation above 100 kHz',
            'Weather station readings',
          ],
          correctIndex: 1,
          rationale:
            'The birds/amphibians Kaleidoscope intro teaches sonogram interpretation as the foundation for manual and automated analysis.',
        },
        {
          id: 'q2',
          prompt: 'What advanced Academy topics does this beginner course prepare you for?',
          options: [
            'Only hardware firmware hacking',
            'Cluster analysis, classifiers, SPL analysis, and acoustic indices',
            'Federal permit writing only',
            'Live streaming video',
          ],
          correctIndex: 1,
          rationale:
            'The course description explicitly lists cluster analysis, classifiers, SPL, and acoustic index analysis as follow-on topics after this foundation.',
        },
        {
          id: 'q3',
          prompt: 'Which Kaleidoscope license is required for this introductory birds/amphibians workshop?',
          options: [
            'Kaleidoscope Pro only',
            'Free Kaleidoscope Lite is sufficient',
            'BirdNET subscription',
            'No software needed',
          ],
          correctIndex: 1,
          rationale:
            'The Academy course uses free Kaleidoscope Lite for hands-on sonogram exploration during the beginner session.',
        },
      ],
    },
  },

  'kscope-lite-bat-analysis': {
    id: 'kscope-lite-bat-analysis',
    title: 'Kaleidoscope Lite for Bat Analysis',
    level: 'Beginner',
    instructor: 'Paul Howden-Leach',
    duration: 'On-demand',
    academyRef: 'Kaleidoscope Lite for Bat Analysis',
    summary:
      'Process and label bat call files, understand spectrograms, convert WAC/WAV/ZC formats, and use Analyze view and shortcut keys. Foundation for Bat Auto-ID.',
    lessons: [
      {
        id: 'bat-processing',
        title: 'Processing & Labeling Bat Calls',
        content: [
          'Import bat recordings in WAC, WAV, or ZC formats; Kaleidoscope batch-processes files to generate spectrograms for review.',
          'Label search-phase, approach-phase, and terminal feeding buzz calls — each phase has distinct frequency and pulse characteristics.',
          'No Kaleidoscope Pro license is required for this on-demand course; sample data is provided for hands-on practice.',
          'Processing settings affect spectrogram appearance: learn which FFT length and window functions the Academy recommends for North American bat survey data.',
        ],
      },
      {
        id: 'bat-spectrogram',
        title: 'Understanding the Bat Spectrogram',
        content: [
          'Bat calls appear as short, steep frequency-modulated sweeps on the spectrogram; pulse interval and bandwidth help distinguish species.',
          'Paul Howden-Leach teaches search-phase calls (relatively regular pulses as bats survey space), approach-phase calls (faster pulse rates closing on prey), and terminal feeding buzzes (continuous energy as bats capture insects).',
          'Frequency-modulated (FM) sweeps, constant-frequency (CF) components, and mixed calls vary by family — Myotis often show short FM sweeps while horseshoe bats emphasize CF tails.',
          'Use Analyze view to measure call parameters: start frequency, end frequency, call duration, and pulse interval — values that feed into manual ID keys and automated classifiers.',
          'Bolt-on Academy content covers shortcut key commands to speed through large file sets during manual vetting — essential when a single deployment produces thousands of clips.',
          'This on-demand course is the prerequisite foundation for Kaleidoscope Pro Bat Auto-ID and cluster analysis workflows taught in advanced live sessions.',
        ],
      },
      {
        id: 'bat-hands-on',
        title: 'Hands-On Activities & Sample Data',
        content: [
          'The on-demand Kaleidoscope Lite for Bat Analysis course includes downloadable sample data so learners practice processing and labeling without needing their own field recordings.',
          'Hands-on activities walk through importing a folder, running batch spectrogram generation, and confirming that WAC, WAV, and ZC formats convert correctly.',
          'Labeling exercises teach consistent terminology: assign species or call-type labels only when confident, use "uncertain" or "noise" categories rather than forcing IDs on poor-quality clips.',
          'Optional bolt-on videos cover the Analyze view in depth and file conversion edge cases encountered with legacy detector outputs.',
          'Certificate of completion is awarded through Wildlife Acoustics Academy upon finishing all modules — showcase skills to employers alongside live workshop attendance.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-bat-lite',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'Which file formats can Kaleidoscope process for bat analysis?',
          options: [
            'PDF and DOCX only',
            'WAC, WAV, and ZC',
            'MP4 video only',
            'Proprietary Kaleidoscope-only (.kld) exclusively',
          ],
          correctIndex: 1,
          rationale:
            'File conversion and format support (WAC, WAV, ZC) is a core skill in the Kaleidoscope Lite for Bat Analysis on-demand course.',
        },
        {
          id: 'q2',
          prompt: 'Is a Kaleidoscope Pro license required for the bat analysis beginner course?',
          options: [
            'Yes, Pro is mandatory',
            'No — Kaleidoscope Lite is sufficient for this foundation course',
            'Only for European species',
            'Only when using Song Meter Mini',
          ],
          correctIndex: 1,
          rationale:
            'The Academy course explicitly states a Pro license is not required; it builds skills needed before advancing to Bat Auto-ID.',
        },
        {
          id: 'q3',
          prompt: 'What call phases does the bat analysis course teach you to recognize?',
          options: [
            'Only feeding buzzes',
            'Search-phase, approach-phase, and terminal feeding buzz calls',
            'Bird dawn chorus phases',
            'Frog advertisement and release calls only',
          ],
          correctIndex: 1,
          rationale:
            'Labeling search, approach, and feeding buzz phases is core content in the Kaleidoscope Lite for Bat Analysis on-demand course.',
        },
      ],
    },
  },

  'bat-auto-id': {
    id: 'bat-auto-id',
    title: 'How to Use Bat Auto-ID in Kaleidoscope Pro',
    level: 'Advanced',
    instructor: 'Dave Roberts',
    duration: '2 hours',
    academyRef: 'How to use Bat Auto-ID in Kaleidoscope Pro (Advanced)',
    summary:
      'Run automatic species ID on bat recordings, understand classifier limitations, manage results reliably, and combine Auto-ID with manual vetting.',
    lessons: [
      {
        id: 'auto-id-workflow',
        title: 'Bat Auto-ID Workflow & Limitations',
        content: [
          'Bat Auto-ID in Kaleidoscope Pro estimates species from call shape using regional classifiers trained on reference libraries — results include confidence scores, not certainties.',
          'Dave Roberts\' advanced workshop runs on Kaleidoscope Lite for demonstration but teaches Pro features for Auto-ID batch runs across full deployment datasets.',
          'The classifier compares measured call parameters against regional species models; geographic mismatch (using wrong regional classifier) is a common source of systematic error.',
          'Auto-ID can misclassify overlapping calls from multiple bats, clipped recordings with missing frequency bands, and species with convergent call morphologies.',
          'Sample recordings are provided in class so attendees follow along with identical files — mirroring the Academy\'s hands-on teaching approach.',
        ],
      },
      {
        id: 'managing-results',
        title: 'Managing Auto-ID Results for Reliable Use',
        content: [
          'Predictable results require documented QA thresholds: e.g., accept automated IDs above a project-specific confidence cut-off only after validation on a reference subset.',
          'Batch exports should preserve linkage between original WAV files, spectrogram clips, Auto-ID species label, and confidence score for audit trails.',
          'Consistent file naming conventions prevent downstream GIS and database import errors when combining results from multiple analysts or field seasons.',
          'The course discusses how Auto-ID mistakes manifest: false positives from insect noise, split-single-bat calls counted as two, and Myotis species confusion in eastern North America.',
          'Manage results with version-controlled classifier releases — note which Kaleidoscope Pro and classifier version produced each deliverable.',
        ],
      },
      {
        id: 'manual-vetting-combo',
        title: 'Combining Auto-ID with Manual Vetting',
        content: [
          'Professional practice combines automated screening with manual vetting: Auto-ID narrows thousands of files to candidate species lists; analysts confirm or correct each.',
          'Kaleidoscope Pro\'s Viewer lets you jump from Auto-ID results directly to the source spectrogram for rapid confirmation using shortcut navigation.',
          'Manual vetting is especially critical for regulatory surveys where USFWS or state agencies expect documented analyst review of automated classifications.',
          'The workshop teaches when to re-run Auto-ID with adjusted parameters versus when to fall back to fully manual ID for ambiguous recordings.',
          'Upon mastering this workflow, learners can scale bat acoustic surveys while maintaining defensible QA — the balance the advanced Academy session is designed to achieve.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-bat-auto-id',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'How should Bat Auto-ID results be treated in professional reports?',
          options: [
            'As legally binding species determinations without review',
            'As estimates requiring manual vetting and documented QA',
            'As invalid for all USFWS surveys',
            'Only valid above 95% confidence with no exceptions',
          ],
          correctIndex: 1,
          rationale:
            'The advanced Bat Auto-ID course emphasizes how the tool works, how it makes mistakes, and combining automated results with manual vetting.',
        },
        {
          id: 'q2',
          prompt: 'What is a common cause of systematic Auto-ID error?',
          options: [
            'Using a regional classifier that does not match your survey geography',
            'Recording at 48 kHz for birds',
            'Exporting spreadsheets from Kaleidoscope Lite',
            'Using Song Meter GPS metadata',
          ],
          correctIndex: 0,
          rationale:
            'Geographic classifier mismatch produces systematic misidentifications — covered when discussing how Bat Auto-ID works and its limitations.',
        },
        {
          id: 'q3',
          prompt: 'What does the advanced workshop provide for hands-on practice?',
          options: [
            'Live Song Meter hardware shipped to attendees',
            'Sample bat recordings to follow along in Kaleidoscope',
            'Federal permits',
            'Automatic publication in peer-reviewed journals',
          ],
          correctIndex: 1,
          rationale:
            'The Academy course description provides sample recordings for attendees to play along during the 2-hour advanced session.',
        },
      ],
    },
  },

  'acoustic-analysis-kscope-part1': {
    id: 'acoustic-analysis-kscope-part1',
    title: 'Acoustic Analysis in Kaleidoscope Part 1',
    level: 'Intermediate',
    instructor: 'Dave Roberts',
    duration: '2 hours',
    academyRef: 'Acoustic Analysis in Kaleidoscope Parts 1–2',
    summary:
      'Batch processing workflows, classifier setup, and efficient review patterns for large acoustic datasets in Kaleidoscope Pro.',
    lessons: [
      {
        id: 'batch-processing',
        title: 'Batch Processing Large Datasets',
        content: [
          'Batch processing runs Kaleidoscope Pro operations across hundreds or thousands of files — essential for multi-site monitoring programs spanning entire field seasons.',
          'Acoustic Analysis in Kaleidoscope Part 1 (Dave Roberts, intermediate) introduces processing chains: spectrogram generation, noise reduction, and optional classifier pre-screening.',
          'Configure input folders to mirror field structure (site → date → channel) so batch outputs remain traceable to deployment metadata on each WAV.',
          'Processing chains save analyst time by automating repetitive steps, but never eliminate the need for spot-checking outputs on a reference subset before full QA.',
          'Monitor disk space during batch runs — spectrogram caches and intermediate files can exceed raw WAV storage by several multiples.',
        ],
      },
      {
        id: 'classifier-setup',
        title: 'Classifier Setup & Review Patterns',
        content: [
          'Part 1 bridges into classifier configuration: selecting regional models, setting confidence thresholds, and defining output formats for downstream GIS or database import.',
          'Efficient review patterns include sorting batch outputs by confidence (review lowest first), by species of concern, or by site priority for regulatory deadlines.',
          'Parallel QA workflows assign analysts to non-overlapping site folders after batch processing completes — a project management approach taught for consulting teams.',
          'Document batch settings in a project README: Kaleidoscope version, classifier version, date run, and any custom filters applied.',
          'Part 2 of the Academy series extends these concepts to advanced classifier tuning and cluster-based custom model development.',
        ],
      },
      {
        id: 'workflow-integration',
        title: 'Integrating Batch Workflows with Field Operations',
        content: [
          'Align batch processing schedules with field retrieval: process deployments as SD cards arrive rather than waiting until season end to catch equipment issues early.',
          'Cross-reference batch outputs with field logs noting weather events, livestock disturbance, or equipment malfunctions that explain anomalous recording gaps.',
          'For bird and amphibian projects, batch spectrogram generation precedes manual species ID; for bat projects, batch runs may include Auto-ID before manual vetting.',
          'Export summary statistics (files processed, errors, processing time) for client reporting and internal quality metrics.',
          'This intermediate module connects Song Meter deployment training with species-specific advanced workshops (BirdNET, Bat Auto-ID, frogs/toads).',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-kscope-part1',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'When is batch processing most valuable in Kaleidoscope?',
          options: [
            'For single 10-second test clips only',
            'When working with large multi-file deployment datasets',
            'Only after federal permit approval',
            'Batch processing is not supported',
          ],
          correctIndex: 1,
          rationale:
            'Parts 1–2 of Acoustic Analysis in Kaleidoscope cover batch workflows for managing and analyzing large recording sets.',
        },
        {
          id: 'q2',
          prompt: 'What should be documented for each batch processing run?',
          options: [
            'Only the final species list',
            'Kaleidoscope version, classifier version, settings, and run date',
            'Analyst social media handles',
            'Nothing — batch runs are self-documenting',
          ],
          correctIndex: 1,
          rationale:
            'Reproducible batch workflows require documented settings and software versions — emphasized in intermediate analysis training.',
        },
        {
          id: 'q3',
          prompt: 'What is a recommended QA pattern after batch Auto-ID or classification?',
          options: [
            'Accept all outputs without review',
            'Spot-check a reference subset, then parallel manual QA by site or priority',
            'Delete all low-confidence files permanently',
            'Re-record all field audio',
          ],
          correctIndex: 1,
          rationale:
            'Efficient review patterns with parallel QA teams are core content in Acoustic Analysis Parts 1–2.',
        },
      ],
    },
  },

  'frogs-toads-kscope': {
    id: 'frogs-toads-kscope',
    title: 'Finding Frogs & Toads Using Kaleidoscope Pro',
    level: 'Intermediate',
    instructor: 'Dave Roberts',
    duration: '2 hours',
    academyRef: 'How to Find Frogs and Toads Using Kaleidoscope Pro (Intermediate)',
    summary:
      'Isolate complex mating calls, individual calls, and choruses in noisy soundscapes — herpetologist-focused Kaleidoscope techniques.',
    lessons: [
      {
        id: 'frog-chorus',
        title: 'Chorus vs. Individual Call Isolation',
        content: [
          'Frog and toad breeding choruses create overlapping calls that mask individual species — the central challenge addressed in Dave Roberts\' herpetologist-focused intermediate workshop.',
          'The Academy session helps learners find and isolate complex mating calls, individual advertisement calls, and full choruses within noisy wetland soundscapes.',
          'Frequency filtering in Kaleidoscope Pro highlights energy bands where target species dominate, separating them from overlapping congeners and background insects.',
          'Mating calls vary in pulse rate and spectral envelope; zoomed sonogram views reveal fine structure (amplitude modulation, harmonics) hidden during full-spectrum playback.',
          'Attendees are encouraged to submit their own frog/toad recordings to training@wildlifeacoustics.com for live review — a unique interactive element of the workshop.',
        ],
      },
      {
        id: 'frog-spectrogram-techniques',
        title: 'Spectrogram Techniques for Herpetologists',
        content: [
          'Selection tools isolate time-frequency regions containing target calls, exporting clips for species catalogs or training data for automated recognizers.',
          'Pulse rate measurement distinguishes species with similar carrier frequencies but different call repetition patterns — critical in multi-species breeding aggregations.',
          'Rain, wind, and flowing water raise noise floors; the workshop teaches when high-pass filtering helps versus when re-deployment is the better remedy.',
          'Document ambiguous choruses for manual follow-up rather than forcing a species label when signal-to-noise is insufficient for defensible ID.',
          'Combine Kaleidoscope Pro manual isolation with BirdNET custom recognizer development (covered in the advanced BirdNET integration course) for semi-automated amphibian monitoring.',
        ],
      },
      {
        id: 'frog-reporting',
        title: 'Reporting & QA for Amphibian Acoustic Surveys',
        content: [
          'Amphibian acoustic indices (call rate, chorus intensity) support trend monitoring for wetland health assessment alongside species presence-absence.',
          'QA documentation should note analyst, review date, and confidence level for each labeled species — especially when choruses prevented individual-level ID.',
          'Export labeled clips with metadata for peer review or agency submission; maintain linkage to original deployment WAV and Song Meter site coordinates.',
          'The intermediate workshop assumes comfort with Kaleidoscope Viewer from the beginner birds/amphibians course — take that foundation first if new to sonograms.',
          'Herpetologists completing this module can advance to BirdNET + Kaleidoscope clustering workflows for custom frog recognizers in multilingual Academy sessions.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-frogs',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'What is a common challenge when analyzing frog and toad recordings?',
          options: [
            'Frogs vocalize only in ultrasonic ranges',
            'Overlapping chorus calls mask individual species',
            'Frogs cannot be recorded with Song Meters',
            'Kaleidoscope cannot display amphibian sounds',
          ],
          correctIndex: 1,
          rationale:
            'The frogs and toads workshop focuses on finding and isolating complex mating calls and choruses — a key herpetology challenge.',
        },
        {
          id: 'q2',
          prompt: 'What interactive element does the Academy frogs/toads workshop offer?',
          options: [
            'Mandatory purchase of Kaleidoscope Pro',
            'Opportunity to submit your own recordings for class review',
            'Automatic USFWS permit approval',
            'Live bat mist-netting demonstration',
          ],
          correctIndex: 1,
          rationale:
            'The course invites attendees to contact Dave Roberts with sample frog/toad recordings for review during the live session.',
        },
        {
          id: 'q3',
          prompt: 'When should you avoid assigning a species label to a recording?',
          options: [
            'Whenever Auto-ID is available',
            'When signal-to-noise is too poor for defensible identification',
            'Only for diurnal recordings',
            'Never — always assign the most common species',
          ],
          correctIndex: 1,
          rationale:
            'Document ambiguous choruses for follow-up rather than forcing labels — a QA principle emphasized in the herpetology workshop.',
        },
      ],
    },
  },

  'owls-nocturnal-birds': {
    id: 'owls-nocturnal-birds',
    title: 'Surveying Owls & Nocturnal Birds with Acoustic Monitoring',
    level: 'Beginner',
    instructor: 'Paul Howden-Leach',
    duration: '2 hours',
    academyRef: 'Surveying Owls and Other Nocturnal Birds with Acoustic Monitoring: How to Get Started',
    summary:
      'Deploy recorders for nocturnal avian surveys, select schedules and sample rates, and begin identifying owl and nightjar vocalizations.',
    lessons: [
      {
        id: 'owl-deployment',
        title: 'Getting Started with Nocturnal Bird Monitoring',
        content: [
          'Paul Howden-Leach\'s beginner Academy workshop covers surveying owls and other nocturnal birds with acoustic monitoring — how to get started from project design through first analysis.',
          'Schedule recordings to cover dusk-through-dawn activity windows when owls, nightjars, night-herons, and rails are most vocal; avoid gaps during peak territorial periods.',
          'Song Meter deployments at 48 kHz capture owl hoots, trills, and wing rustles while remaining practical for multi-week battery life compared to ultrasonic bat rates.',
          'Use elevated or open-habitat microphone placement to reduce ground-noise (insects, rodents) while capturing distant territorial calls from canopy-level owls.',
          'Site selection should consider road noise, flowing water, and industrial sources that elevate noise floors in the same frequency bands as target species.',
        ],
      },
      {
        id: 'owl-identification',
        title: 'Identifying Owl & Nightjar Vocalizations',
        content: [
          'Begin with regional reference libraries: owl species show species-specific hoot patterns, rhythm, and pitch contours visible on sonograms.',
          'Nightjars produce mechanical-sounding churring and wing-clap displays; spectrograms reveal periodic amplitude modulation distinct from owl calls.',
          'Rails and bitterns may vocalize from dense marsh — expect high attenuation and prioritize mic placement at wetland edges for clearer recordings.',
          'Combine acoustic index trends (increased nocturnal activity metrics) with targeted manual review of candidate owl spectrograms for efficient survey design.',
          'The course connects to Kaleidoscope Viewer skills from the beginner birds/amphibians module — sonogram navigation is prerequisite for nocturnal ID.',
        ],
      },
      {
        id: 'owl-survey-design',
        title: 'Survey Design & Reporting for Nocturnal Birds',
        content: [
          'Grid or point-count acoustic designs from diurnal bird surveys adapt to nocturnal species with adjusted effort metrics (hours of recording per site).',
          'Document moon phase, cloud cover, and wind in field logs — environmental covariates that affect nocturnal vocalization rates in analysis and reporting.',
          'Presence-absence conclusions require sufficient sampling effort; the Academy session discusses minimum deployment durations for common survey objectives.',
          'Integrate results with BirdNET Analyzer (advanced course) for semi-automated owl and nightjar detection, followed by Kaleidoscope Pro manual QA.',
          'This beginner module prepares field biologists for species-specific follow-on training and regulatory survey planning where nocturnal birds are conservation priorities.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-owls',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'When should recording schedules target owls and other nocturnal birds?',
          options: [
            'Midday only to avoid bats',
            'Dusk through dawn activity windows',
            'Only during migration in daylight',
            'Continuous 24/7 at 4 kHz sample rate only',
          ],
          correctIndex: 1,
          rationale:
            'The nocturnal bird survey course teaches deployment timing aligned with when owls and related species are acoustically active.',
        },
        {
          id: 'q2',
          prompt: 'What sample rate is practical for multi-week owl monitoring on Song Meters?',
          options: [
            '384 kHz ultrasonic',
            '48 kHz',
            '1 kHz only',
            '500 kHz minimum',
          ],
          correctIndex: 1,
          rationale:
            'Owl and nocturnal bird vocalizations are audible-frequency; 48 kHz balances capture quality with battery life for extended deployments.',
        },
        {
          id: 'q3',
          prompt: 'What environmental factors should be logged during nocturnal bird surveys?',
          options: [
            'Only SD card serial numbers',
            'Moon phase, cloud cover, and wind conditions',
            'Bat Auto-ID confidence scores only',
            'Microphone manufacturer stock price',
          ],
          correctIndex: 1,
          rationale:
            'Field logs with moon, cloud, and wind covariates support interpretation of vocalization rates — taught in survey design content.',
        },
      ],
    },
  },

  'birdnet-kscope-integration': {
    id: 'birdnet-kscope-integration',
    title: 'Integrating BirdNET Analyzer & Kaleidoscope Pro',
    level: 'Advanced',
    instructor: 'Dr. Carlos Abrahams',
    duration: '2 hours',
    academyRef: 'Integrating BirdNET Analyzer & Kaleidoscope Pro',
    summary:
      'Combine BirdNET automated bird detections with Kaleidoscope Pro QA, and use clustering to build custom amphibian BirdNET recognizers.',
    lessons: [
      {
        id: 'birdnet-qa',
        title: 'BirdNET + Kaleidoscope QA Workflow',
        content: [
          'Dr. Carlos Abrahams\' advanced Academy session teaches integrating BirdNET Analyzer with Kaleidoscope Pro for robust acoustic analysis and quality assurance.',
          'Workflow (i): Run BirdNET Analyzer for automated bird detections across large recording sets, then import detection tables into Kaleidoscope Pro for efficient manual QA of species and timestamps.',
          'BirdNET excels at scalable detection with pre-trained global bird models; Kaleidoscope Pro excels at visualization, clip extraction, and analyst-driven correction of false positives.',
          'QA workflow sorts BirdNET outputs by confidence, flags detections outside expected geographic range, and jumps to source audio for rapid confirmation.',
          'Designed for ecologists, bioacousticians, and practitioners — the course emphasizes reproducible workflows and confidence in automated monitoring results.',
        ],
      },
      {
        id: 'birdnet-clustering',
        title: 'Clustering for Custom Amphibian Recognizers',
        content: [
          'Workflow (ii): Apply Kaleidoscope Pro clustering tools to group similar amphibian vocalizations, curating high-quality training clips for custom BirdNET recognizer development.',
          'Clustering reveals acoustic similarity independent of prior labels — analysts then assign species to clusters with representative sonograms.',
          'Custom recognizers extend BirdNET to regional frog and toad assemblages not fully covered by default models — demonstrated in Academy Spanish-language amphibian sessions as well.',
          'Training clip quality (clean signal, correct species, minimal background) determines recognizer accuracy more than quantity alone.',
          'Export clustered clips in BirdNET-compatible formats following the reproducible pipeline taught in the 2-hour advanced workshop.',
        ],
      },
      {
        id: 'birdnet-scalable-monitoring',
        title: 'Scalable & Reproducible Monitoring Pipelines',
        content: [
          'Document software versions (BirdNET, Kaleidoscope Pro), model checkpoints, and analysis parameters for each project deliverable.',
          'Combine automated detection rates with manual QA sample sizes in client reports — transparency builds trust with agencies reviewing acoustic monitoring studies.',
          'Scale across field seasons by reusing QA protocols and analyst training materials; Wildlife Acoustics Academy on-demand courses support team onboarding.',
          'This advanced module assumes intermediate Kaleidoscope skills and familiarity with bird vocalization ecology; take prerequisite courses if new to either tool.',
          'Learners gain practical skills for multi-tool pipelines increasingly required in large-scale conservation and environmental impact assessment projects.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-birdnet',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'Why combine BirdNET Analyzer with Kaleidoscope Pro?',
          options: [
            'BirdNET replaces all manual review permanently',
            'BirdNET scales detection; Kaleidoscope supports QA and custom recognizer development',
            'Kaleidoscope cannot open WAV files without BirdNET',
            'Integration is only for bat Auto-ID',
          ],
          correctIndex: 1,
          rationale:
            'The advanced integration course teaches two workflows: BirdNET detections with Kaleidoscope QA, and clustering for custom amphibian recognizers.',
        },
        {
          id: 'q2',
          prompt: 'What is Workflow (ii) in the BirdNET + Kaleidoscope integration course?',
          options: [
            'Hardware firmware updates for SM5BAT',
            'Using Kaleidoscope clustering to build custom amphibian BirdNET training clips',
            'Replacing all Kaleidoscope features with BirdNET',
            'USFWS permit submission automation',
          ],
          correctIndex: 1,
          rationale:
            'Carlos Abrahams teaches clustering in Kaleidoscope to generate training clips for custom amphibian BirdNET recognizers as the second core workflow.',
        },
        {
          id: 'q3',
          prompt: 'Who is the instructor for the BirdNET + Kaleidoscope Pro integration workshop?',
          options: [
            'Mike Fishman',
            'Dr. Carlos Abrahams',
            'Dr. Fran Tattersall only',
            'Guest instructor from Song Meter hardware team',
          ],
          correctIndex: 1,
          rationale:
            'Dr. Carlos Abrahams, ecoacoustics specialist and CIEEM fellow, leads the advanced BirdNET + Kaleidoscope integration Academy session.',
        },
      ],
    },
  },

  'usfws-2026-bat-guidelines': {
    id: 'usfws-2026-bat-guidelines',
    title: '2026 USFWS Range-wide Bat Survey Guidelines',
    level: 'Beginner',
    instructor: 'Mike Fishman',
    duration: '2 hours',
    academyRef: '2026 USFWS Range-wide Bat Survey Guidelines: From Methods to Application',
    summary:
      'Approved survey methods for Indiana Bat, Northern Long-eared Bat, and Tricolored Bat — protocols, data standards, and reporting for regulatory compliance.',
    lessons: [
      {
        id: 'usfws-protocols',
        title: '2026 Guidelines Overview',
        content: [
          'The 2026 USFWS range-wide guidelines define approved acoustic survey methods for Indiana Bat (Myotis sodalis), Northern Long-eared Bat (Myotis septentrionalis), and Tricolored Bat (Perimyotis subflavus).',
          'Surveys must follow updated deployment standards, detector specifications, seasonal timing windows, and data collection formats accepted by federal and state agencies.',
          'Reporting expectations include documented QA of acoustic identifications, chain-of-custody for recordings, and alignment with range-wide protocol versions.',
          'The May 2026 Academy live session walks through updated protocols from methods to application — this module captures the study themes for self-paced review.',
        ],
      },
      {
        id: 'usfws-application',
        title: 'From Methods to Application',
        content: [
          'Consultants and agency biologists use these guidelines to plan project surveys, select equipment, and structure deliverables for permitting and environmental review.',
          'Mike Fishman — Certified Wildlife Biologist, NASBR board member, and developer of USFWS-recognized bat acoustic training — leads this Academy session.',
          'Acoustic data should be analyzed with USFWS-recognized workflows including appropriate manual vetting when using automated classifiers such as Kaleidoscope Bat Auto-ID.',
          'Application topics include matching detector placement and seasonal timing windows to the species and project action area under consultation.',
          'Coordinate with state natural heritage programs: some states add requirements beyond federal range-wide minimum standards.',
          'Stay current with guideline revisions; Wildlife Acoustics Academy live sessions cover updates as protocols evolve through 2026 and beyond.',
        ],
      },
      {
        id: 'usfws-reporting',
        title: 'Data Standards, Reporting & Compliance',
        content: [
          'Reporting expectations include species-specific presence results with effort metrics (detector-nights), QA documentation, and chain-of-custody for raw and processed files.',
          'Data collection standards specify acceptable detector types, mounting heights, and survey periods — deviations require agency consultation before field work.',
          'Indiana Bat, Northern Long-eared Bat, and Tricolored Bat have distinct range-wide survey windows; missing windows may invalidate presence-absence conclusions for permitting.',
          'Integrate Kaleidoscope analysis outputs with guideline-compliant tables: nightly activity, species ID method (manual vs automated), and analyst credentials.',
          'Fishman\'s course received USFWS recognition for federal protocol bat acoustic survey training — this companion module summarizes key compliance themes for study.',
        ],
      },
    ],
    knowledgeCheck: {
      id: 'kc-usfws',
      passThreshold: 0.7,
      questions: [
        {
          id: 'q1',
          prompt: 'Which species are covered by the 2026 USFWS range-wide bat survey guidelines taught in this course?',
          options: [
            'Only Little Brown Bat',
            'Indiana Bat, Northern Long-eared Bat, and Tricolored Bat',
            'All North American bat species equally',
            'Only European horseshoe bats',
          ],
          correctIndex: 1,
          rationale:
            'The Academy USFWS course explicitly covers survey guidelines for Indiana Bat, Northern Long-eared Bat, and Tricolored Bat.',
        },
        {
          id: 'q2',
          prompt: 'What must acoustic survey deliverables include under federal protocol expectations?',
          options: [
            'Only raw WAV files with no metadata',
            'Documented QA of identifications and protocol-aligned data standards',
            'Social media posts from the field site',
            'Guaranteed species presence for every deployment night',
          ],
          correctIndex: 1,
          rationale:
            'The guidelines course covers data collection standards, reporting expectations, and compliance with federal and state regulations.',
        },
        {
          id: 'q3',
          prompt: 'Who leads the Wildlife Acoustics Academy USFWS 2026 guidelines course?',
          options: [
            'Dave Roberts',
            'Mike Fishman',
            'Dr. Carlos Abrahams',
            'Paul Howden-Leach',
          ],
          correctIndex: 1,
          rationale:
            'Michael Fishman, USFWS-recognized bat acoustic training developer and NASBR board member, leads the 2026 range-wide guidelines Academy session.',
        },
      ],
    },
  },
};

module.exports = { LEVELS, TRACKS, MODULES };