(() => {
  "use strict";

  const routeMeta = [
    { id: "overview", title: "Overview", summary: "The stenosis-versus-regurgitation model, anatomy, stages, and the study roadmap." },
    { id: "principles", title: "General principles", summary: "Valve physiology, structured murmur description, imaging, complications, and management framework." },
    { id: "mitral-stenosis", title: "Mitral stenosis", summary: "Rheumatic anatomy, pressure consequences, opening snap, Doppler evaluation, anticoagulation, and commissurotomy." },
    { id: "mitral-regurgitation", title: "Mitral regurgitation", summary: "Primary versus secondary disease, acute versus chronic physiology, echo assessment, repair, and transcatheter treatment." },
    { id: "mvp", title: "Mitral valve prolapse", summary: "Click–murmur syndrome, dynamic maneuvers, echocardiography, and arrhythmic red flags." },
    { id: "aortic-stenosis", title: "Aortic stenosis", summary: "Calcific and bicuspid disease, classic symptoms, severe thresholds, low-flow states, and AVR strategy." },
    { id: "aortic-regurgitation", title: "Aortic regurgitation", summary: "Leaflet and aortic-root causes, wide pulse pressure, acute emergency, imaging, and surgery timing." },
    { id: "tricuspid", title: "Tricuspid disease", summary: "Tricuspid stenosis and regurgitation, JVP findings, systemic congestion, RV consequences, and intervention timing." },
    { id: "prosthetic", title: "Prosthetic valves", summary: "Mechanical versus bioprosthetic choice, antithrombotic principles, dysfunction, endocarditis, and pregnancy." },
    { id: "murmur-lab", title: "Murmur laboratory", summary: "An interactive tool using timing, location, radiation, and maneuvers to build a bedside differential." },
    { id: "cases", title: "Clinical cases", summary: "Case-based questions covering examination, investigations, severity, and management traps." },
    { id: "sources", title: "Sources & notes", summary: "Source chapter, official guideline links, educational scope, and content limitations." }
  ];

  const routeIds = routeMeta.map(item => item.id);
  const contentRoot = document.getElementById("app-content");
  const currentLabel = document.getElementById("current-section-label");
  const nav = document.getElementById("course-nav");
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebar-scrim");
  const menuButton = document.getElementById("menu-button");
  const closeButton = document.getElementById("sidebar-close");
  const searchInput = document.getElementById("site-search");
  const searchResults = document.getElementById("search-results");
  const progressLabel = document.getElementById("progress-label");
  const progressBar = document.getElementById("progress-bar");
  const toast = document.getElementById("toast");

  const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const hero = ({ eyebrow, title, intro, chips = [], actions = [] }) => `
    <header class="page-hero">
      <p class="eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      <p>${intro}</p>
      ${actions.length ? `<div class="hero-actions">${actions.map(action => `<button class="button ${action.className || ""}" data-route="${action.route}" type="button">${action.label}</button>`).join("")}</div>` : ""}
      ${chips.length ? `<div class="hero-meta">${chips.map(chip => `<span class="meta-chip">${chip}</span>`).join("")}</div>` : ""}
    </header>`;

  const sectionHeader = (kicker, title, intro = "") => `
    <div class="section-header">
      <div>
        <div class="section-kicker">${kicker}</div>
        <h2>${title}</h2>
        ${intro ? `<p>${intro}</p>` : ""}
      </div>
    </div>`;

  const table = (headers, rows, ariaLabel = "Clinical comparison table") => `
    <div class="data-table-wrap" role="region" tabindex="0" aria-label="${ariaLabel}">
      <table>
        <thead><tr>${headers.map(header => `<th scope="col">${header}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;

  const tabSet = (id, tabs) => `
    <div class="tab-set" data-tab-group="${id}">
      <div class="tab-list" role="tablist" aria-label="Topic views">
        ${tabs.map((tab, index) => `<button class="tab-button" id="${id}-tab-${index}" role="tab" aria-selected="${index === 0}" aria-controls="${id}-panel-${index}" tabindex="${index === 0 ? 0 : -1}" type="button">${tab.label}</button>`).join("")}
      </div>
      ${tabs.map((tab, index) => `<section class="tab-panel" id="${id}-panel-${index}" role="tabpanel" aria-labelledby="${id}-tab-${index}" ${index === 0 ? "" : "hidden"}>${tab.content}</section>`).join("")}
    </div>`;

  const heartDiagram = () => `
    <div class="anatomy-visual" aria-label="Simplified diagram of the four heart valves">
      <svg viewBox="0 0 620 380" role="img" aria-labelledby="heart-title heart-desc">
        <title id="heart-title">Simplified four-valve heart diagram</title>
        <desc id="heart-desc">Right atrium and ventricle connect through the tricuspid valve; left atrium and ventricle through the mitral valve; blood exits through the pulmonary and aortic valves.</desc>
        <defs>
          <linearGradient id="blueFill" x1="0" x2="1"><stop offset="0" stop-color="#d9eef6"/><stop offset="1" stop-color="#a9d5e6"/></linearGradient>
          <linearGradient id="redFill" x1="0" x2="1"><stop offset="0" stop-color="#fde8ea"/><stop offset="1" stop-color="#f1bfc4"/></linearGradient>
          <filter id="softShadow"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0d2742" flood-opacity=".12"/></filter>
        </defs>
        <path d="M286 323C216 286 157 238 150 172c-8-77 79-114 136-49 57-65 144-28 136 49-7 66-66 114-136 151Z" fill="#ffffff" stroke="#9eb2c0" stroke-width="3" filter="url(#softShadow)"/>
        <path d="M286 320c-59-34-100-72-110-121-12-58 45-91 91-43 10 11 16 24 19 40Z" fill="url(#blueFill)" opacity=".95"/>
        <path d="M286 320c59-34 100-72 110-121 12-58-45-91-91-43-10 11-16 24-19 40Z" fill="url(#redFill)" opacity=".95"/>
        <path d="M286 130v190" stroke="#8399aa" stroke-width="4"/>
        <path d="M207 194h69" stroke="#0b6d69" stroke-width="9" stroke-linecap="round"/>
        <path d="M297 194h75" stroke="#a93b44" stroke-width="9" stroke-linecap="round"/>
        <circle cx="242" cy="194" r="18" fill="#fff" stroke="#0b6d69" stroke-width="4"/>
        <circle cx="334" cy="194" r="18" fill="#fff" stroke="#a93b44" stroke-width="4"/>
        <path d="M220 137c-6-38 5-74 26-101" fill="none" stroke="#1e79ad" stroke-width="20" stroke-linecap="round"/>
        <path d="M350 137c14-42 10-76-2-106" fill="none" stroke="#c6535b" stroke-width="20" stroke-linecap="round"/>
        <circle cx="237" cy="117" r="17" fill="#fff" stroke="#1e79ad" stroke-width="4"/>
        <circle cx="354" cy="116" r="17" fill="#fff" stroke="#c6535b" stroke-width="4"/>
        <text x="68" y="184" class="anatomy-label">Tricuspid valve</text>
        <path d="M177 188h42" stroke="#0b6d69" stroke-width="2"/>
        <text x="405" y="184" class="anatomy-label">Mitral valve</text>
        <path d="M373 188h27" stroke="#a93b44" stroke-width="2"/>
        <text x="66" y="82" class="anatomy-label">Pulmonary valve</text>
        <path d="M181 88l39 18" stroke="#1e79ad" stroke-width="2"/>
        <text x="424" y="81" class="anatomy-label">Aortic valve</text>
        <path d="M408 87l-38 19" stroke="#c6535b" stroke-width="2"/>
        <text x="181" y="260" class="anatomy-small">Right ventricle</text>
        <text x="327" y="260" class="anatomy-small">Left ventricle</text>
        <text x="194" y="166" class="anatomy-small">Right atrium</text>
        <text x="331" y="166" class="anatomy-small">Left atrium</text>
      </svg>
    </div>`;

  function overviewPage() {
    return `
      ${hero({
        eyebrow: "Cardiology · Chapter 3",
        title: "Valvular Heart Disease, made clinically navigable",
        intro: "Learn the chapter as a connected system: start with pressure versus volume overload, then link the pulse, apex, heart sounds, murmur, imaging, and timing of intervention.",
        chips: ["12 interconnected modules", "Interactive murmur reasoning", "Case-based revision", "Works offline"],
        actions: [
          { route: "principles", label: "Start the core lesson" },
          { route: "murmur-lab", label: "Open murmur lab", className: "ghost" }
        ]
      })}

      <section class="content-grid four" aria-label="Chapter statistics">
        <article class="card stat-card"><span class="stat-value">4</span><span class="stat-label">major cardiac valves integrated into one examination framework</span></article>
        <article class="card stat-card"><span class="stat-value">2</span><span class="stat-label">dominant lesion types: stenosis and regurgitation</span></article>
        <article class="card stat-card"><span class="stat-value">A–D</span><span class="stat-label">stages from risk to symptomatic severe valve disease</span></article>
        <article class="card stat-card"><span class="stat-value">1st</span><span class="stat-label">transthoracic echocardiography is the usual first-line imaging study</span></article>
      </section>

      ${sectionHeader("Core mental model", "Begin with the load, not the eponym", "The same reasoning framework applies across valves and prevents memorizing each lesion as an isolated list.")}
      <section class="content-grid two">
        <article class="card concept-card interactive">
          <div class="concept-icon">↥</div>
          <h3>Stenosis</h3>
          <p>A narrowed valve obstructs forward flow. The chamber upstream must generate more pressure, leading to hypertrophy or atrial enlargement, reduced reserve, and eventually congestion or low output.</p>
          <div class="callout teal"><strong>Think:</strong> pressure gradient, upstream pressure, slow forward flow.</div>
        </article>
        <article class="card concept-card red interactive">
          <div class="concept-icon">↩</div>
          <h3>Regurgitation</h3>
          <p>An incompetent valve permits backward flow. The receiving chamber and often the ventricle face volume overload, initially dilating to preserve stroke volume before dysfunction develops.</p>
          <div class="callout danger"><strong>Think:</strong> volume overload, chamber dilatation, hyperdynamic compensation.</div>
        </article>
      </section>

      <section class="card section-block interactive-only" id="overload-lab">
        <div class="section-header" style="margin-top:0">
          <div><div class="section-kicker">Interactive physiology</div><h2>Pressure–volume overload visualizer</h2><p>Toggle the dominant physiology and observe the typical chamber response.</p></div>
          <div class="toggle-group" role="group" aria-label="Select lesion physiology">
            <button class="toggle-button is-active" data-overload="stenosis" type="button">Stenosis</button>
            <button class="toggle-button" data-overload="regurgitation" type="button">Regurgitation</button>
          </div>
        </div>
        <div class="overload-demo">
          <div class="demo-chamber"><div class="demo-ring" id="demo-ring"><span id="demo-ring-label">Thick wall<br>smaller reserve</span></div></div>
          <div>
            <h3 id="demo-title">Pressure overload response</h3>
            <p id="demo-text">The upstream chamber generates higher pressure. A ventricle often develops concentric hypertrophy; an atrium enlarges when it must sustain an elevated filling pressure.</p>
            <div class="flow-chain" id="demo-flow">
              <div class="flow-node">Fixed obstruction</div><div class="flow-node">Pressure gradient</div><div class="flow-node">Hypertrophy / atrial enlargement</div><div class="flow-node">Congestion or low output</div>
            </div>
          </div>
        </div>
      </section>

      ${sectionHeader("Anatomy map", "Four valves, two circulations, one logic", "The lesion name tells you where flow is obstructed or leaking; the chamber response tells you why the patient develops symptoms.")}
      <section class="content-grid sidebar-layout">
        ${heartDiagram()}
        <aside class="card sticky-card">
          <h3>Read the diagram in flow order</h3>
          <ol class="number-list">
            <li>Systemic venous blood enters the right atrium.</li>
            <li>The tricuspid valve controls right-atrial to right-ventricular inflow.</li>
            <li>The pulmonary valve controls ejection to the lungs.</li>
            <li>Oxygenated blood enters the left atrium.</li>
            <li>The mitral valve controls left-atrial to left-ventricular inflow.</li>
            <li>The aortic valve controls systemic ejection.</li>
          </ol>
        </aside>
      </section>

      ${sectionHeader("Chapter map", "Choose a route through the material", "Every disease module uses the same sequence: definition → mechanism → bedside pattern → investigations → management → traps.")}
      <section class="content-grid three">
        ${routeMeta.slice(1, 9).map((item, index) => `<button class="card concept-card interactive route-card" data-route="${item.id}" type="button" style="text-align:left;cursor:pointer"><div class="concept-icon">${String(index + 2).padStart(2,"0")}</div><h3>${item.title}</h3><p>${item.summary}</p></button>`).join("")}
      </section>

      <div class="callout warning section-block"><strong>Study rule:</strong> murmur loudness alone does not reliably grade severity. Low-flow aortic stenosis and acute severe mitral regurgitation can be deceptively quiet.</div>
    `;
  }

  function principlesPage() {
    const majorPatterns = table(
      ["Lesion", "Dominant load", "Apex / pulse", "Murmur & sounds", "Typical radiation"],
      [
        ["Mitral stenosis", "LA pressure overload", "Tapping apex; AF may make pulse irregular", "Loud S1, opening snap, low-pitched mid-diastolic rumble", "Usually localized to the apex"],
        ["Mitral regurgitation", "LA/LV volume overload", "Displaced hyperdynamic apex in chronic severe MR", "Soft S1; blowing holosystolic murmur", "Classically to axilla; posterior leaflet disease may radiate toward base"],
        ["Aortic stenosis", "LV pressure overload", "Sustained apex; slow-rising low-volume carotid pulse", "Harsh crescendo–decrescendo ejection systolic murmur; soft/late A2 when severe", "Carotids and sometimes apex"],
        ["Aortic regurgitation", "LV volume overload", "Hyperdynamic displaced apex; bounding pulse and wide pulse pressure", "High-pitched early diastolic decrescendo murmur", "Left sternal border toward apex"]
      ],
      "Bedside patterns of the major left-sided valve lesions"
    );

    return `
      ${hero({
        eyebrow: "Module 02 · Foundation",
        title: "General principles of valve assessment",
        intro: "Build a complete diagnosis by integrating mechanism, chamber response, symptoms, pulse, apex, JVP, heart sounds, murmur behavior, and multimodality imaging.",
        chips: ["Stages A–D", "Seven-part murmur description", "Echo-first pathway", "Heart Team decisions"]
      })}

      ${sectionHeader("Circulatory effect", "What valve disease does to the circulation")}
      ${table(
        ["Lesion", "Primary load", "Typical chamber response", "Late consequence"],
        [
          ["Stenosis", "Pressure overload upstream from the valve", "Hypertrophy or atrial enlargement, depending on the chamber", "Reduced forward output, pulmonary/systemic congestion, secondary regurgitation"],
          ["Regurgitation", "Volume overload of the receiving chamber and often the ventricle", "Dilatation with initially increased total stroke volume", "Progressive ventricular dysfunction, congestion, arrhythmia"]
        ],
        "Pressure versus volume overload"
      )}

      ${sectionHeader("Etiology", "Major cause groups")}
      <section class="content-grid four">
        <article class="card concept-card"><div class="concept-icon">Ca</div><h3>Degenerative / calcific</h3><p>Calcific aortic stenosis, mitral annular calcification, and age-related leaflet degeneration.</p></article>
        <article class="card concept-card teal"><div class="concept-icon">Rh</div><h3>Rheumatic</h3><p>Classically mitral stenosis, mixed mitral disease, or combined mitral and aortic involvement.</p></article>
        <article class="card concept-card amber"><div class="concept-icon">Cg</div><h3>Congenital</h3><p>Bicuspid or unicuspid aortic valve, parachute mitral valve, and commissural abnormalities.</p></article>
        <article class="card concept-card red"><div class="concept-icon">Ac</div><h3>Acquired structural</h3><p>Infective destruction, ischemic papillary dysfunction, aortopathy, carcinoid, radiation, devices, or trauma.</p></article>
      </section>

      ${sectionHeader("Disease stage", "Stage the patient, not only the valve")}
      <section class="content-grid four">
        <article class="card"><span class="tag">Stage A</span><h3>At risk</h3><p>Risk factor or anatomic predisposition without significant valve dysfunction.</p></article>
        <article class="card"><span class="tag teal">Stage B</span><h3>Progressive</h3><p>Mild-to-moderate dysfunction without severe-stage consequences.</p></article>
        <article class="card"><span class="tag amber">Stage C</span><h3>Asymptomatic severe</h3><p>Severe dysfunction without attributable symptoms; ventricular compensation may be preserved or beginning to fail.</p></article>
        <article class="card"><span class="tag red">Stage D</span><h3>Symptomatic severe</h3><p>Severe valve dysfunction with symptoms attributable to the lesion.</p></article>
      </section>

      ${sectionHeader("Clinical examination", "Describe every murmur in seven linked dimensions")}
      <section class="content-grid sidebar-layout">
        <article class="card">
          <ol class="number-list">
            <li><strong>Timing:</strong> systolic, diastolic, continuous, or mixed; then early, mid, late, holo-, or ejection pattern.</li>
            <li><strong>Maximum site:</strong> identify the point of maximum intensity before tracing radiation.</li>
            <li><strong>Character:</strong> harsh, blowing, rumbling, musical, or machinery-like; note pitch.</li>
            <li><strong>Radiation:</strong> follow where sound travels, such as carotids or axilla.</li>
            <li><strong>Intensity:</strong> grade it, but never use intensity alone to determine severity.</li>
            <li><strong>Maneuvers:</strong> respiration, posture, handgrip, standing, squatting, and Valsalva.</li>
            <li><strong>Associated signs:</strong> S1/S2, clicks, opening snap, S3/S4, pulse contour, apex, and JVP.</li>
          </ol>
        </article>
        <aside class="card sticky-card">
          <h3>Fast verbal template</h3>
          <p>“A <strong>[timing]</strong>, <strong>[character]</strong> murmur, maximal at <strong>[site]</strong>, radiating to <strong>[location]</strong>, grade <strong>[x/6]</strong>, which <strong>[changes]</strong> with <strong>[maneuver]</strong>, associated with <strong>[sound/pulse/apex/JVP]</strong>.”</p>
          <button class="button secondary" data-route="murmur-lab" type="button">Practice in murmur lab</button>
        </aside>
      </section>

      <div class="section-block">${majorPatterns}</div>

      ${sectionHeader("Diagnostic strategy", "Move from bedside suspicion to mechanism, severity, and consequences")}
      <div class="flow-chain">
        <div class="flow-node">History & examination</div><div class="flow-node">TTE with Doppler</div><div class="flow-node">Define mechanism & severity</div><div class="flow-node">Assess chamber response</div><div class="flow-node">Resolve discordance</div><div class="flow-node">Heart Team plan</div>
      </div>
      ${table(
        ["Test", "Main contribution", "When limitations matter"],
        [
          ["Transthoracic echocardiography", "First-line anatomy, gradients, valve area, regurgitation, chamber size/function, and pulmonary pressure", "Poor windows, irregular rhythm, loading conditions, or discordant parameters"],
          ["Transesophageal echocardiography", "Detailed morphology, LA thrombus, endocarditis, and procedural planning", "Semi-invasive and not required for every stable lesion"],
          ["Exercise testing / stress echo", "Unmasks symptoms, abnormal BP response, pulmonary hypertension, or latent severity", "Avoid in unstable patients or when symptoms are already clearly severe"],
          ["Cardiac CT", "Aortic valve calcium, aortic anatomy, TAVI planning, prosthetic structure", "Radiation/contrast and limited functional data"],
          ["Cardiac magnetic resonance", "Ventricular volumes and regurgitant fraction when echo is uncertain", "Availability, devices, arrhythmia, and patient tolerance"],
          ["Catheterization", "Coronary assessment and invasive hemodynamics when noninvasive results are discordant or before selected interventions", "Not routinely needed only to confirm an obvious echo diagnosis"]
        ],
        "Imaging and invasive tests in valvular heart disease"
      )}

      ${sectionHeader("Management framework", "Treat consequences, prevent complications, and intervene before irreversible damage")}
      <section class="content-grid three">
        <article class="card concept-card"><div class="concept-icon">Sx</div><h3>Control symptoms</h3><p>Diuretics for congestion, blood-pressure control, rhythm or rate management, and treatment of heart failure or ischemia.</p></article>
        <article class="card concept-card teal"><div class="concept-icon">Cl</div><h3>Prevent clot and infection</h3><p>Anticoagulate for established indications. Emphasize dental hygiene; reserve antibiotic prophylaxis for defined high-risk settings.</p></article>
        <article class="card concept-card red"><div class="concept-icon">Tx</div><h3>Choose timely intervention</h3><p>Use symptoms, severity, ventricular response, pulmonary pressure, rhythm, exercise findings, anatomy, and procedural risk.</p></article>
      </section>

      <div class="callout danger"><strong>Current-practice correction:</strong> native valve disease or isolated mitral valve prolapse does not automatically require infective endocarditis prophylaxis. Prophylaxis is restricted to defined high-risk cardiac conditions and relevant procedures.</div>
    `;
  }

  function mitralStenosisPage() {
    return `
      ${hero({
        eyebrow: "Module 03 · Mitral inflow obstruction",
        title: "Mitral stenosis",
        intro: "A narrowed mitral orifice raises left-atrial pressure, transmits congestion backward to the lungs, and eventually strains the right heart. Tachycardia is especially harmful because it shortens diastolic filling time.",
        chips: ["Normal MVA ≈ 4–6 cm²", "Clinically significant ≲ 1.5 cm²", "Severe near ≤ 1.0 cm²", "Rheumatic disease is classic"]
      })}

      ${tabSet("ms-tabs", [
        { label: "Mechanism", content: `
          <section class="content-grid two">
            <article class="card"><h3>Definition and anatomy</h3><p>Mitral stenosis is obstruction to left-ventricular inflow at the mitral valve. Rheumatic disease thickens the leaflets, fuses the commissures, and may shorten, fuse, or calcify the chordae and papillary apparatus. The classic orifice is described as fish-mouth or buttonhole shaped.</p></article>
            <article class="card"><h3>Important mimics</h3><p>Not every apical diastolic murmur represents fixed MS. Increased transmitral flow in severe MR, VSD, or PDA, the Austin Flint murmur of severe AR, and the Carey Coombs murmur of acute rheumatic carditis can resemble it.</p></article>
          </section>
          <div class="flow-chain"><div class="flow-node">Mitral obstruction</div><div class="flow-node">Raised LA pressure</div><div class="flow-node">Pulmonary venous congestion</div><div class="flow-node">Pulmonary hypertension</div><div class="flow-node">RV dysfunction + functional TR</div></div>
          <div class="callout warning"><strong>Why tachycardia decompensates MS:</strong> a faster rate shortens diastole, increases the transmitral gradient, and reduces filling time. Exercise, fever, anemia, thyrotoxicosis, pregnancy, or rapid AF can therefore trigger sudden dyspnea.</div>
        `},
        { label: "Clinical pattern", content: `
          ${table(
            ["Domain", "Typical findings"],
            [
              ["Symptoms", "Exertional dyspnea, orthopnea, PND, fatigue, reduced exercise capacity, hemoptysis, palpitations, embolic events, and occasionally hoarseness from recurrent laryngeal nerve compression"],
              ["Inspection / palpation", "Malar flush in advanced pulmonary hypertension, tapping apex, possible diastolic thrill, and RV heave when pulmonary hypertension develops"],
              ["Heart sounds", "Loud S1 while leaflets remain mobile; opening snap after A2; loud P2 with pulmonary hypertension"],
              ["Murmur", "Low-pitched rumbling mid-diastolic murmur at the apex, best heard with the bell in the left lateral position; presystolic accentuation disappears in AF"],
              ["Late disease", "Functional TR, systemic venous congestion, hepatomegaly, edema, ascites, and low-output symptoms"]
            ],
            "Clinical features of mitral stenosis"
          )}
          <section class="content-grid two section-block">
            <article class="card"><h3>Clues suggesting greater severity</h3><ul class="mini-list"><li>Shorter A2–opening snap interval because higher LA pressure opens the valve earlier.</li><li>Longer duration of the diastolic rumble, reflecting a sustained gradient.</li><li>Pulmonary hypertension or right-heart findings.</li></ul></article>
            <article class="card"><h3>Do not misread quiet signs</h3><ul class="mini-list"><li>A soft S1 or absent opening snap may reflect heavy calcification or immobile leaflets, not mild disease.</li><li>Presystolic accentuation is absent in AF because organized atrial contraction is lost.</li></ul></article>
          </section>
        `},
        { label: "Investigations", content: `
          ${table(
            ["Test", "What it contributes"],
            [
              ["ECG", "Left-atrial enlargement, AF, and in advanced pulmonary hypertension RV hypertrophy or right-axis deviation"],
              ["Chest radiograph", "Left-atrial enlargement, pulmonary venous redistribution/edema, enlarged pulmonary arteries, right-heart enlargement, or valve calcification"],
              ["TTE with Doppler", "Valve area, mean gradient, morphology, commissural fusion, MR severity, pulmonary pressure, and right-heart response"],
              ["TEE", "Left-atrial appendage thrombus and detailed anatomy before percutaneous commissurotomy when needed"],
              ["Exercise testing / stress echo", "Clarifies symptoms or hemodynamic significance when resting findings and functional status disagree"]
            ],
            "Investigations in mitral stenosis"
          )}
          <div class="callout teal"><strong>Interpret gradients in context:</strong> the transmitral gradient depends on heart rate and flow. A high gradient during tachycardia is not interchangeable with the same gradient at a controlled rate.</div>
        `},
        { label: "Management", content: `
          ${table(
            ["Situation", "Management principles"],
            [
              ["Congestion", "Diuretics and sodium moderation; identify and treat precipitating infection, anemia, or excessive rate"],
              ["Tachycardia or AF", "Rate control lengthens diastolic filling time; rhythm strategy is individualized"],
              ["Thromboembolic risk", "Use a vitamin K antagonist for rheumatic MS with AF, left-atrial thrombus, or prior embolism; direct oral anticoagulants are not recommended for rheumatic MS with AF"],
              ["Suitable symptomatic rheumatic MS", "Percutaneous mitral commissurotomy when anatomy is favorable, no LA thrombus is present, and MR is no more than mild"],
              ["Unfavorable anatomy / associated disease", "Surgical commissurotomy or valve replacement when calcification, significant MR, unfavorable subvalvular disease, or another surgical indication is present"],
              ["Selected asymptomatic significant MS", "Consider intervention for high embolic risk, pulmonary hypertension, planned pregnancy, or symptoms revealed on exercise testing"]
            ],
            "Management of mitral stenosis"
          )}
          <div class="callout success"><strong>Pregnancy planning:</strong> pregnancy increases heart rate and blood volume. Significant rheumatic MS may decompensate, so pre-pregnancy assessment and timely commissurotomy in suitable patients can be protective.</div>
        `}
      ])}
    `;
  }

  function mitralRegurgitationPage() {
    return `
      ${hero({
        eyebrow: "Module 04 · Mitral backflow",
        title: "Mitral regurgitation",
        intro: "MR is not one disease. First decide whether the valve apparatus itself is abnormal or whether ventricular/atrial geometry prevents normal leaflets from coapting; then decide whether the lesion is acute or chronic.",
        chips: ["Primary vs secondary", "Acute vs chronic", "Repairability matters", "EF can look deceptively normal"]
      })}

      ${sectionHeader("Classification", "Four labels that immediately change management")}
      ${table(
        ["Type", "Mechanism", "Examples"],
        [
          ["Primary MR", "Intrinsic disease of leaflets, chordae, papillary muscles, or annulus", "Degenerative prolapse/flail leaflet, rheumatic disease, endocarditis, connective tissue disease"],
          ["Secondary MR", "Leaflets are near-normal but fail to coapt because LV or LA geometry is abnormal", "Ischemic cardiomyopathy, dilated cardiomyopathy, atrial functional MR"],
          ["Acute MR", "Sudden loss of competence before LA and LV adaptation", "Papillary muscle rupture after MI, chordal rupture, endocarditis, trauma"],
          ["Chronic MR", "Progressive regurgitation with compensatory LA and LV dilatation", "Degenerative, rheumatic, or functional disease"]
        ],
        "Mechanistic classification of mitral regurgitation"
      )}

      ${sectionHeader("Hemodynamics", "Why acute severe MR can be catastrophic and surprisingly quiet")}
      <section class="content-grid two">
        <article class="card"><h3>Chronic MR</h3><p>During systole, part of LV stroke volume enters the left atrium. During diastole, that volume returns to the LV, causing chronic volume overload. LA and LV dilatation initially preserve total stroke volume, but progressive remodeling eventually reduces forward output and causes heart failure.</p><div class="flow-chain"><div class="flow-node">Regurgitant systolic volume</div><div class="flow-node">LA/LV dilatation</div><div class="flow-node">High total stroke volume</div><div class="flow-node">Late LV dysfunction</div></div></article>
        <article class="card"><h3>Acute severe MR</h3><p>A noncompliant LA cannot accommodate sudden regurgitant volume. LA pressure rises abruptly, producing pulmonary edema, hypotension, and sometimes cardiogenic shock.</p><div class="callout danger"><strong>Classic trap:</strong> the murmur can be short or soft because LA and LV pressures rapidly equalize. A quiet murmur does not exclude a mechanical emergency.</div></article>
      </section>

      ${sectionHeader("Clinical comparison", "Acute and chronic MR look different")}
      ${table(
        ["Feature", "Chronic MR", "Acute severe MR"],
        [
          ["Symptoms", "Palpitations, exertional dyspnea, fatigue; later orthopnea, edema, and AF", "Abrupt dyspnea, pulmonary edema, hypotension, shock"],
          ["Apex", "Displaced, diffuse, and hyperdynamic in significant disease", "May not be displaced"],
          ["S1", "Often soft", "May be soft and examination findings can be subtle"],
          ["Murmur", "Blowing holosystolic murmur at apex, usually to axilla", "May be early systolic, short, or less intense than expected"],
          ["Additional sounds", "S3 from increased early diastolic filling; loud P2 if pulmonary hypertension develops", "S3 and signs of pulmonary edema may dominate"]
        ],
        "Acute versus chronic mitral regurgitation"
      )}

      ${sectionHeader("Echo questions", "Do not stop at “MR present”")}
      <section class="content-grid four">
        <article class="card concept-card"><div class="concept-icon">1</div><h3>Mechanism</h3><p>Prolapse, flail segment, restriction, annular dilatation, ischemic tethering, endocarditis, or papillary injury.</p></article>
        <article class="card concept-card teal"><div class="concept-icon">2</div><h3>Severity</h3><p>Integrate vena contracta, effective regurgitant orifice, regurgitant volume/fraction, pulmonary venous flow, jet features, and remodeling.</p></article>
        <article class="card concept-card amber"><div class="concept-icon">3</div><h3>Consequences</h3><p>LV and LA size, LVEF, pulmonary pressure, RV function, AF, and secondary TR.</p></article>
        <article class="card concept-card red"><div class="concept-icon">4</div><h3>Repairability</h3><p>Leaflet segments, calcification, chordal anatomy, coaptation, and annular dimensions; use TEE/3D imaging when planning intervention.</p></article>
      </section>
      <div class="callout warning"><strong>Important EF concept:</strong> in chronic primary MR, an LVEF of 60% may already represent impaired contractile reserve because the LV ejects into both the aorta and a low-pressure left atrium.</div>

      ${sectionHeader("Management", "Treat primary and secondary MR by different logic")}
      ${table(
        ["Scenario", "Management principles"],
        [
          ["Acute severe primary MR", "Stabilize oxygenation and perfusion, reduce afterload when appropriate, treat ischemia or infection, and obtain urgent surgical/Heart Team evaluation"],
          ["Severe chronic primary MR", "Durable valve repair is preferred. Intervene for symptoms and before irreversible LV dysfunction using ventricular and clinical thresholds"],
          ["Asymptomatic severe primary MR", "Expert surveillance; intervene when LV function begins to decline, new AF or pulmonary hypertension appears, or durable low-risk repair is highly likely in selected patients"],
          ["Secondary MR", "First optimize guideline-directed HF therapy, revascularization when indicated, and CRT when appropriate; consider transcatheter edge-to-edge repair or surgery in selected persistently symptomatic patients"],
          ["Congestion or AF", "Diuretics for congestion, anticoagulation according to AF and valve-specific indications, and appropriate rate/rhythm management"]
        ],
        "Management of mitral regurgitation"
      )}

      <section class="content-grid two section-block">
        <article class="card"><h3>Complications to anticipate</h3><ul class="mini-list"><li>AF and systemic thromboembolism.</li><li>Pulmonary hypertension and functional TR.</li><li>Progressive LV dysfunction and heart failure.</li><li>Infective endocarditis in susceptible structural lesions.</li></ul></article>
        <article class="card"><h3>Mechanical emergency</h3><p>Papillary muscle rupture or chordal rupture can cause sudden hemodynamic collapse. After MI, acute pulmonary edema with hypotension and a new or unimpressive systolic murmur should prompt urgent echocardiography.</p></article>
      </section>
    `;
  }

  function mvpPage() {
    return `
      ${hero({
        eyebrow: "Module 05 · Dynamic mitral lesion",
        title: "Mitral valve prolapse",
        intro: "MVP is systolic displacement of one or both mitral leaflets into the left atrium. The click and murmur move because changes in LV volume alter when the prolapsing apparatus becomes tense.",
        chips: ["Mid-systolic click", "Late systolic murmur if MR", "Earlier with standing/Valsalva", "Echo confirms anatomy"]
      })}

      <section class="content-grid sidebar-layout">
        <article>
          ${table(
            ["Domain", "Key points"],
            [
              ["Symptoms", "Most patients are asymptomatic. Some report atypical chest discomfort, palpitations, dizziness, or anxiety-like symptoms"],
              ["Classic sign", "A mid-systolic click from sudden tensing of the prolapsing apparatus, followed by a late systolic murmur when MR is present"],
              ["Diagnosis", "Echocardiography confirms prolapse, defines MR severity, and identifies flail leaflet or high-risk morphology"],
              ["Management", "Reassurance when uncomplicated; selected use of beta-blockers for troublesome palpitations; manage associated MR by severity; no routine antibiotic prophylaxis solely for MVP"]
            ],
            "Mitral valve prolapse clinical features"
          )}
          ${sectionHeader("Dynamic examination", "Change LV volume and the click moves")}
          <section class="content-grid two interactive-only">
            <button class="card interactive mvp-maneuver" data-mvp="low" type="button" style="text-align:left;cursor:pointer"><span class="tag red">Lower LV volume</span><h3>Standing or Valsalva</h3><p>The valve prolapses earlier: the click moves earlier in systole and the murmur becomes longer.</p></button>
            <button class="card interactive mvp-maneuver" data-mvp="high" type="button" style="text-align:left;cursor:pointer"><span class="tag teal">Higher LV volume</span><h3>Squatting or leg raise</h3><p>Prolapse is delayed: the click moves later and the murmur becomes shorter.</p></button>
          </section>
          <div class="card section-block" id="mvp-output"><h3>Click timeline</h3><p>Select a maneuver above to visualize the change.</p><div style="height:14px;border-radius:999px;background:#e8eef2;position:relative;margin-top:1rem"><span id="mvp-click" style="position:absolute;top:-6px;left:55%;width:26px;height:26px;border-radius:50%;background:#c6535b;border:5px solid white;box-shadow:0 0 0 1px #c6535b;transition:left .35s ease"></span></div><div style="display:flex;justify-content:space-between;color:#6f7f91;font-size:.76rem;margin-top:.55rem"><span>S1</span><span>S2</span></div></div>
        </article>
        <aside class="card sticky-card">
          <h3>Arrhythmic MVP: when reassurance is insufficient</h3>
          <p>A small subgroup has ventricular arrhythmias or high-risk imaging features.</p>
          <div class="tag-list"><span class="tag red">Syncope</span><span class="tag red">Complex ventricular ectopy</span><span class="tag red">Family history of sudden death</span><span class="tag red">Severe myxomatous disease</span></div>
          <div class="callout danger"><strong>Action:</strong> these features warrant specialist evaluation rather than simple reassurance.</div>
        </aside>
      </section>
    `;
  }

  function aorticStenosisPage() {
    return `
      ${hero({
        eyebrow: "Module 06 · Fixed LV outflow obstruction",
        title: "Aortic stenosis",
        intro: "Fixed aortic obstruction creates LV pressure overload and concentric hypertrophy. The disease becomes dangerous when symptoms, ventricular decompensation, or high-risk severity markers appear.",
        chips: ["Angina · syncope · dyspnea", "Parvus et tardus", "Vmax ≥ 4.0 m/s", "Mean gradient ≥ 40 mmHg"]
      })}

      ${sectionHeader("Cause and mechanism", "Why the hypertrophied ventricle eventually fails")}
      <section class="content-grid two">
        <article class="card"><h3>Common causes</h3><ul class="mini-list"><li><strong>Calcific degenerative:</strong> most common in older adults.</li><li><strong>Bicuspid aortic valve:</strong> earlier stenosis with possible ascending aortopathy.</li><li><strong>Rheumatic:</strong> commissural fusion, often with mitral disease and mixed AS/AR.</li><li><strong>Sub- or supravalvular obstruction:</strong> mimics the murmur but is not valvular AS.</li></ul></article>
        <article class="card"><h3>Pathophysiology</h3><p>Fixed obstruction raises LV systolic pressure, causing concentric hypertrophy. Myocardial oxygen demand rises while coronary perfusion reserve falls. Diastolic dysfunction appears first; later the LV dilates or loses contractile function, causing low output and heart failure.</p></article>
      </section>

      ${sectionHeader("Classic syndrome", "Symptoms are a major turning point")}
      <section class="content-grid four">
        <article class="card concept-card red"><div class="concept-icon">A</div><h3>Angina</h3><p>High LV oxygen demand, reduced coronary reserve, and possible coexisting coronary disease.</p></article>
        <article class="card concept-card amber"><div class="concept-icon">S</div><h3>Syncope</h3><p>Fixed cardiac output cannot increase sufficiently during exercise or peripheral vasodilation.</p></article>
        <article class="card concept-card teal"><div class="concept-icon">D</div><h3>Dyspnea / HF</h3><p>Elevated filling pressure and progressive LV dysfunction.</p></article>
        <article class="card concept-card"><div class="concept-icon">P</div><h3>Parvus et tardus</h3><p>Slow-rising, low-amplitude carotid pulse in severe high-gradient AS.</p></article>
      </section>

      ${sectionHeader("Examination", "A systolic murmur supported by pulse, apex, and A2")}
      ${table(
        ["Finding", "Description"],
        [
          ["Apex", "Sustained or heaving impulse from pressure overload; may become displaced with late dilatation"],
          ["Murmur", "Harsh crescendo–decrescendo ejection systolic murmur, maximal at the right upper sternal border and radiating to carotids"],
          ["A2", "Soft, delayed, or absent in advanced calcific disease; paradoxical splitting may occur"],
          ["Additional sounds", "Ejection click with a mobile congenital valve, S4 from a stiff hypertrophied LV, and S3 with failure"],
          ["Severity caveat", "A soft murmur does not exclude severe AS in low-flow states or severe LV dysfunction"]
        ],
        "Aortic stenosis examination findings"
      )}

      ${sectionHeader("Echo severity", "Use multiple parameters and account for flow")}
      <section class="content-grid sidebar-layout">
        <article>
          ${table(
            ["Parameter", "Typical severe threshold"],
            [
              ["Peak aortic jet velocity", "≥ 4.0 m/s"],
              ["Mean transvalvular gradient", "≥ 40 mmHg"],
              ["Aortic valve area", "≤ 1.0 cm², interpreted with flow and body size"],
              ["Very severe AS", "Often Vmax ≥ 5.0 m/s or mean gradient ≥ 60 mmHg"]
            ],
            "Typical severe aortic stenosis thresholds"
          )}
          <div class="callout warning"><strong>Discordant or low-gradient AS:</strong> when valve area suggests severe disease but velocity and gradient are lower, reassess measurement quality, blood pressure, stroke volume, and LVEF; use dobutamine stress echo or CT calcium scoring when appropriate.</div>
        </article>
        <aside class="card sticky-card interactive-only">
          <h3>Educational severity checker</h3>
          <div class="form-grid" style="grid-template-columns:1fr">
            <div class="form-field"><label for="as-vmax">Peak velocity (m/s)</label><input id="as-vmax" type="number" min="0" max="8" step="0.1" value="4.2"></div>
            <div class="form-field"><label for="as-gradient">Mean gradient (mmHg)</label><input id="as-gradient" type="number" min="0" max="120" step="1" value="42"></div>
            <div class="form-field"><label for="as-area">Valve area (cm²)</label><input id="as-area" type="number" min="0.2" max="4" step="0.1" value="0.9"></div>
          </div>
          <button class="button" id="as-check" type="button" style="margin-top:.8rem">Interpret pattern</button>
          <div class="output-panel" id="as-output"><h3>Typical severe pattern</h3><p>All three example parameters are within commonly used severe ranges.</p></div>
        </aside>
      </section>

      ${sectionHeader("Management", "No medication removes the fixed obstruction")}
      ${table(
        ["Situation", "Approach"],
        [
          ["Symptomatic severe AS", "Aortic valve replacement is indicated unless intervention is futile because expected benefit is very limited"],
          ["Asymptomatic severe AS", "Close surveillance; consider earlier intervention with LV systolic dysfunction, abnormal exercise test, very severe stenosis, rapid progression, or other high-risk markers"],
          ["TAVI versus SAVR", "Shared Heart Team decision based on age, life expectancy, surgical risk, transfemoral access, bicuspid/root anatomy, coronary access, durability, and lifetime valve strategy"],
          ["Medical therapy", "Treat hypertension carefully and manage congestion, AF, and coronary disease, but do not delay appropriate referral because no drug reverses fixed severe AS"]
        ],
        "Management of aortic stenosis"
      )}

      <div class="callout danger"><strong>High-yield cautions:</strong> do not grade AS by murmur intensity alone; apparently asymptomatic patients may reveal limitation during supervised exercise testing; assess the ascending aorta in bicuspid disease.</div>
    `;
  }

  function aorticRegurgitationPage() {
    return `
      ${hero({
        eyebrow: "Module 07 · Aortic diastolic backflow",
        title: "Aortic regurgitation",
        intro: "Chronic AR produces LV volume overload, a large total stroke volume, and wide pulse pressure. Acute severe AR is different: the unadapted LV develops a rapid rise in diastolic pressure, pulmonary edema, and low forward output.",
        chips: ["Leaflet or aortic-root disease", "Early diastolic decrescendo", "Bounding pulse in chronic AR", "Acute severe AR is an emergency"]
      })}

      ${sectionHeader("Causes", "Ask whether the problem is the cusp or the aorta")}
      ${table(
        ["Mechanism", "Examples"],
        [
          ["Leaflet disease", "Bicuspid valve, rheumatic disease, infective endocarditis, fenestration/prolapse, or trauma"],
          ["Aortic-root / ascending-aorta disease", "Hypertension, Marfan or Loeys–Dietz syndromes, bicuspid aortopathy, inflammatory aortitis, or aneurysm"],
          ["Acute aortic catastrophe", "Aortic dissection, endocarditis, or traumatic cusp disruption"]
        ],
        "Causes of aortic regurgitation"
      )}

      ${sectionHeader("Acute versus chronic", "Adaptation determines the presentation")}
      <section class="content-grid two">
        <article class="card"><h3>Chronic AR</h3><p>Diastolic backflow increases LV end-diastolic volume. The LV dilates and ejects a high total stroke volume, creating high systolic pressure and low diastolic pressure. Symptoms often emerge after a long compensated phase.</p><div class="tag-list"><span class="tag teal">Wide pulse pressure</span><span class="tag teal">Bounding/collapsing pulse</span><span class="tag teal">Hyperdynamic displaced apex</span></div></article>
        <article class="card"><h3>Acute severe AR</h3><p>The LV has not dilated enough to accept the sudden regurgitant volume. LV diastolic pressure rises quickly, reducing forward output and causing pulmonary edema or shock.</p><div class="callout danger"><strong>Emergency pattern:</strong> tachycardia, a short early-diastolic murmur, pulmonary edema, and shock may occur without the classic peripheral signs.</div></article>
      </section>

      ${sectionHeader("Clinical signs", "Peripheral signs support the diagnosis but do not decide severity")}
      ${table(
        ["Domain", "Findings"],
        [
          ["Symptoms", "Forceful heartbeat, exertional dyspnea, fatigue, angina, orthopnea, and late heart failure"],
          ["Pulse and BP", "Wide pulse pressure, bounding/collapsing pulse; pulsus bisferiens may appear in severe AR or mixed AS/AR"],
          ["Head and neck", "Visible carotid pulsation and head bobbing in marked chronic disease"],
          ["Peripheral signs", "Capillary pulsation, femoral pistol-shot sounds, Duroziez murmur, and exaggerated leg–arm systolic pressure difference"],
          ["Apex", "Displaced, diffuse, hyperdynamic impulse from LV volume overload"]
        ],
        "Clinical findings in chronic aortic regurgitation"
      )}
      <div class="callout warning"><strong>Do not overvalue eponyms:</strong> peripheral signs are most likely in severe chronic AR with a large stroke volume. Their absence does not exclude important disease, especially in acute AR.</div>

      ${sectionHeader("Auscultation", "Listen in the correct position and phase")}
      ${table(
        ["Sound", "Description"],
        [
          ["Primary AR murmur", "High-pitched blowing early diastolic decrescendo, often best along the left sternal border with the patient sitting forward at end-expiration"],
          ["Flow murmur", "Ejection systolic murmur caused by increased forward stroke volume across the aortic valve"],
          ["Austin Flint murmur", "Low-pitched apical mid-diastolic murmur in severe AR caused by interference with mitral inflow; no opening snap"],
          ["S2", "May be soft when the valve itself is diseased, but can remain normal when root dilatation is the main mechanism"]
        ],
        "Auscultation in aortic regurgitation"
      )}

      ${sectionHeader("Investigations and management", "Track the valve, aorta, LV size, and LV function")}
      <section class="content-grid two">
        <article class="card"><h3>Imaging priorities</h3><ul class="mini-list"><li><strong>TTE:</strong> valve morphology, root/ascending aorta, AR severity, LV size, and systolic function.</li><li><strong>TEE:</strong> mechanism, endocarditis, dissection, or procedural planning when TTE is insufficient.</li><li><strong>CT/CMR:</strong> aortic dimensions; CMR regurgitant fraction and LV volumes when echo is discordant.</li><li><strong>Serial imaging:</strong> rate of LV dilatation, EF change, and aortic enlargement.</li></ul></article>
        <article class="card"><h3>Management principles</h3><ul class="mini-list"><li><strong>Acute severe AR:</strong> urgent surgery after rapid stabilization and treatment of dissection/endocarditis.</li><li><strong>Symptomatic severe chronic AR:</strong> surgery when symptoms are attributable to AR.</li><li><strong>Asymptomatic severe AR:</strong> intervene when LV function declines or LV size reaches guideline thresholds.</li><li><strong>Aortic-root disease:</strong> include diameter, growth rate, genetic syndrome, bicuspid anatomy, family history, and planned valve surgery.</li><li><strong>Medical treatment:</strong> treat hypertension and congestion; it does not replace timely surgery.</li></ul></article>
      </section>

      ${sectionHeader("Compare", "Aortic stenosis versus aortic regurgitation")}
      ${table(
        ["Feature", "Aortic stenosis", "Aortic regurgitation"],
        [
          ["Primary load", "Pressure overload", "Volume overload"],
          ["Apex", "Sustained / heaving", "Hyperdynamic and displaced"],
          ["Pulse", "Slow-rising and low-volume", "Bounding/collapsing with wide pulse pressure"],
          ["Murmur", "Ejection systolic, radiates to carotids", "Early diastolic decrescendo at left sternal border"],
          ["Classic symptoms", "Angina, syncope, dyspnea", "Forceful pulsations, dyspnea, angina"]
        ],
        "Aortic stenosis versus aortic regurgitation"
      )}
    `;
  }

  function tricuspidPage() {
    return `
      ${hero({
        eyebrow: "Module 08 · Right-sided valve disease",
        title: "Tricuspid stenosis and regurgitation",
        intro: "Right-sided lesions are read through the JVP, liver, edema, ascites, RV impulse, and respiratory variation. Tricuspid regurgitation is usually secondary to right-heart or pulmonary disease rather than primary leaflet pathology.",
        chips: ["Inspiration usually increases right-sided murmurs", "Large v waves in TR", "Prominent a waves in TS", "Avoid waiting for advanced RV failure"]
      })}

      ${sectionHeader("Tricuspid stenosis", "An uncommon inflow obstruction, usually rheumatic")}
      ${table(
        ["Domain", "Findings"],
        [
          ["Hemodynamics", "Raised right-atrial pressure, limited RV filling, and reduced forward pulmonary flow"],
          ["Symptoms and signs", "Fatigue, abdominal discomfort, edema, ascites, hepatomegaly, and elevated JVP with prominent a waves"],
          ["Murmur", "Low-pitched mid-diastolic or presystolic murmur at lower left sternal border, increasing with inspiration"],
          ["Investigations", "Echo defines valve thickening, doming, gradient, valve area, and associated lesions"],
          ["Treatment", "Diuretics for congestion; intervention for severe symptomatic disease, often during surgery for another valve"]
        ],
        "Tricuspid stenosis"
      )}

      ${sectionHeader("Tricuspid regurgitation", "Systolic backflow creates visible venous systolic waves")}
      <section class="content-grid two">
        <article class="card"><h3>Secondary / functional — most common</h3><p>RV or right-atrial dilatation from pulmonary hypertension, left-sided valve disease, AF, or RV dysfunction prevents leaflet coaptation.</p></article>
        <article class="card"><h3>Primary leaflet disease</h3><p>Endocarditis, carcinoid, congenital disease, rheumatic disease, trauma, device-lead injury, or leaflet prolapse.</p></article>
      </section>
      <div class="flow-chain"><div class="flow-node">Systolic backflow to RA</div><div class="flow-node">Large JVP v waves</div><div class="flow-node">Hepatic systolic pulsation</div><div class="flow-node">Edema + ascites</div><div class="flow-node">RV failure + low output</div></div>

      ${table(
        ["Finding", "Description"],
        [
          ["JVP", "Prominent systolic v waves and rapid y descent; neck veins may visibly pulsate"],
          ["Liver", "Enlarged, tender, and systolically pulsatile; cardiac cirrhosis may develop late"],
          ["Edema / ascites", "Ascites can be prominent; peripheral edema and pleural effusions may occur"],
          ["Murmur", "Holosystolic murmur at lower left sternal border that increases with inspiration — Carvallo sign"],
          ["Cardiac impulse", "RV heave and possible systolic thrill; AF is common in atrial functional TR"]
        ],
        "Clinical findings in tricuspid regurgitation"
      )}

      ${sectionHeader("Evaluation and timing", "Treat the driver, but do not refer too late")}
      ${table(
        ["Step", "Practical approach"],
        [
          ["Define mechanism", "Assess leaflet structure, annulus, RV/RA size, pulmonary pressure, device leads, and left-sided lesions"],
          ["Treat drivers", "Manage left-sided valve disease, pulmonary hypertension causes, AF, and heart failure; use diuretics for congestion"],
          ["Time intervention", "Consider repair or replacement before severe RV dysfunction, advanced pulmonary vascular disease, or irreversible liver/kidney injury"],
          ["Concomitant surgery", "Tricuspid repair is often performed during left-sided valve surgery when TR is significant or the annulus is dilated"],
          ["Transcatheter therapy", "An option for selected symptomatic high-risk patients with suitable anatomy in experienced centres"]
        ],
        "Evaluation and management of tricuspid regurgitation"
      )}
      <div class="callout warning"><strong>Carcinoid clue:</strong> flushing and diarrhea with combined tricuspid and pulmonary valve disease strongly suggests carcinoid heart disease. Left-sided involvement is less common unless a right-to-left shunt or overwhelming tumor burden is present.</div>
    `;
  }

  function prostheticPage() {
    return `
      ${hero({
        eyebrow: "Module 09 · Treated valve disease",
        title: "Prosthetic valves and special management issues",
        intro: "Choosing a prosthesis is a lifetime strategy balancing durability, anticoagulation, bleeding, pregnancy plans, reintervention options, anatomy, and patient preference.",
        chips: ["Mechanical = durable + lifelong VKA", "Bioprosthetic = less long-term anticoagulation", "DOACs contraindicated in mechanical valves", "Watch for dysfunction"]
      })}

      ${sectionHeader("Prosthesis choice", "Mechanical versus bioprosthetic")}
      ${table(
        ["Feature", "Mechanical valve", "Bioprosthetic valve"],
        [
          ["Durability", "Very durable", "Limited by structural valve degeneration"],
          ["Anticoagulation", "Lifelong vitamin K antagonist", "Usually no lifelong VKA unless another indication exists"],
          ["Bleeding burden", "Higher because anticoagulation is lifelong", "Lower long-term anticoagulation burden"],
          ["Reintervention", "Less structural degeneration, but thrombosis or pannus can occur", "Valve-in-valve therapy may be possible for selected degeneration"],
          ["Typical fit", "Often younger patients who accept anticoagulation and have no contraindication", "Often older patients or those in whom lifelong anticoagulation is undesirable"]
        ],
        "Mechanical versus bioprosthetic valves"
      )}

      ${sectionHeader("Antithrombotic principles", "Four statements worth memorizing")}
      <article class="card"><ol class="number-list"><li>Mechanical prosthetic valves require vitamin K antagonist therapy; direct oral anticoagulants are contraindicated.</li><li>Rheumatic mitral stenosis with AF is treated with a vitamin K antagonist rather than a direct oral anticoagulant.</li><li>For other native valve lesions with AF, anticoagulation is generally based on thromboembolic risk and guideline-specific considerations.</li><li>Early antithrombotic treatment after surgical or transcatheter bioprosthetic implantation depends on valve position, procedure, bleeding risk, rhythm, and protocol.</li></ol></article>

      ${sectionHeader("Dysfunction", "A rising gradient or new regurgitation demands a mechanism")}
      ${table(
        ["Problem", "Clues and response"],
        [
          ["Thrombosis", "Rising gradients, restricted leaflet motion, embolism, or acute symptoms; urgent imaging and specialist treatment"],
          ["Structural degeneration", "Progressive stenosis or regurgitation years after implantation; consider redo surgery or valve-in-valve treatment"],
          ["Paravalvular leak", "Regurgitation around the sewing ring, hemolysis, or heart failure; evaluate for infection and consider repair/closure"],
          ["Prosthetic endocarditis", "Fever, bacteremia, new dysfunction, abscess, or embolism; multidisciplinary Endocarditis/Valve Team management"],
          ["Patient–prosthesis mismatch", "Persistently high gradient despite normally functioning prosthesis because the effective orifice is too small for body size"]
        ],
        "Prosthetic valve dysfunction"
      )}

      ${sectionHeader("Prevention and pregnancy", "Special situations require planned team care")}
      <section class="content-grid two">
        <article class="card"><h3>Infective endocarditis prevention</h3><ul class="mini-list"><li>Emphasize oral and skin hygiene and prompt treatment of infection.</li><li>Use antibiotic prophylaxis only for selected high-risk cardiac conditions before relevant dental procedures.</li><li>High-risk examples include prosthetic valves/repair material, previous infective endocarditis, and certain congenital heart diseases.</li><li>Do not routinely prophylax uncomplicated native valve disease or isolated MVP.</li></ul></article>
        <article class="card"><h3>Pregnancy and valve disease</h3><ul class="mini-list"><li>Mitral stenosis may be poorly tolerated as blood volume and heart rate rise.</li><li>Mechanical valves require expert anticoagulation planning because maternal thrombosis and fetal risks differ among regimens.</li><li>Severe AS or aortopathy needs pre-pregnancy risk assessment; intervention may be needed before conception.</li><li>High-risk care should integrate cardiology, maternal–fetal medicine, anesthesia, and cardiac surgery.</li></ul></article>
      </section>
    `;
  }

  const murmurDatabase = [
    { name: "Aortic stenosis", timing: "systolic", site: "rusb", radiation: "carotids", maneuver: "squat", details: "Harsh crescendo–decrescendo ejection murmur; slow-rising carotid pulse and sustained apex support the diagnosis." },
    { name: "Mitral regurgitation", timing: "systolic", site: "apex", radiation: "axilla", maneuver: "handgrip", details: "Blowing holosystolic apical murmur, classically to the axilla; handgrip commonly increases regurgitant intensity." },
    { name: "Tricuspid regurgitation", timing: "systolic", site: "llsb", radiation: "none", maneuver: "inspiration", details: "Holosystolic lower-left sternal murmur that increases with inspiration, often with large JVP v waves and pulsatile liver." },
    { name: "Hypertrophic cardiomyopathy", timing: "systolic", site: "llsb", radiation: "none", maneuver: "valsalva", details: "Dynamic systolic murmur that typically becomes louder with standing or Valsalva and softer with squatting." },
    { name: "Ventricular septal defect", timing: "systolic", site: "llsb", radiation: "none", maneuver: "handgrip", details: "Harsh holosystolic lower sternal murmur; small restrictive defects may be especially loud." },
    { name: "Mitral stenosis", timing: "diastolic", site: "apex", radiation: "none", maneuver: "left-lateral", details: "Low-pitched apical mid-diastolic rumble with opening snap, best with the bell in the left lateral position." },
    { name: "Aortic regurgitation", timing: "diastolic", site: "lsb", radiation: "apex", maneuver: "handgrip", details: "High-pitched early diastolic decrescendo along the left sternal border; sit forward at end-expiration." },
    { name: "Tricuspid stenosis", timing: "diastolic", site: "llsb", radiation: "none", maneuver: "inspiration", details: "Low-pitched diastolic murmur at the lower left sternal border, louder with inspiration, with prominent a waves." },
    { name: "Pulmonary regurgitation", timing: "diastolic", site: "lusb", radiation: "none", maneuver: "inspiration", details: "Early diastolic murmur at the left upper sternal border; Graham Steell murmur occurs with pulmonary hypertension." },
    { name: "Patent ductus arteriosus", timing: "continuous", site: "lusb", radiation: "back", maneuver: "none", details: "Continuous machinery-like murmur in the left infraclavicular area, often radiating to the back." }
  ];

  function murmurLabPage() {
    return `
      ${hero({
        eyebrow: "Interactive tool",
        title: "Murmur laboratory",
        intro: "Build a differential from the sequence used at the bedside: timing first, then maximum site, radiation, maneuver response, and associated signs. The output is a study prompt, not a diagnostic device.",
        chips: ["Timing before loudness", "Respiration separates right from left", "Use pulse, apex, JVP, and S2", "Educational differential"]
      })}

      <section class="content-grid sidebar-layout">
        <article class="card interactive-only">
          <h2 style="margin-top:0">Enter the examination pattern</h2>
          <div class="form-grid">
            <div class="form-field"><label for="murmur-timing">Timing</label><select id="murmur-timing"><option value="any">Not selected</option><option value="systolic">Systolic</option><option value="diastolic">Diastolic</option><option value="continuous">Continuous</option></select></div>
            <div class="form-field"><label for="murmur-site">Maximum site</label><select id="murmur-site"><option value="any">Not selected</option><option value="apex">Apex</option><option value="rusb">Right upper sternal border</option><option value="lusb">Left upper sternal border</option><option value="lsb">Left sternal border</option><option value="llsb">Lower left sternal border</option></select></div>
            <div class="form-field"><label for="murmur-radiation">Radiation</label><select id="murmur-radiation"><option value="any">Not selected</option><option value="carotids">Carotids</option><option value="axilla">Axilla</option><option value="apex">Toward apex</option><option value="back">Back / interscapular</option><option value="none">Localized / none</option></select></div>
            <div class="form-field"><label for="murmur-maneuver">Maneuver that increases it</label><select id="murmur-maneuver"><option value="any">Not selected</option><option value="inspiration">Inspiration</option><option value="handgrip">Handgrip</option><option value="valsalva">Standing / Valsalva</option><option value="squat">Squatting / leg raise</option><option value="left-lateral">Left lateral position</option><option value="none">No clear change</option></select></div>
          </div>
          <button class="button" id="murmur-analyze" type="button" style="margin-top:1rem">Build differential</button>
          <button class="button secondary" id="murmur-reset" type="button" style="margin-top:1rem">Clear</button>
          <div class="output-panel" id="murmur-output"><h3>Start with timing</h3><p>Select at least one feature. More matching features produce a more focused differential.</p></div>
        </article>
        <aside class="card sticky-card">
          <h3>Bedside checkpoints</h3>
          <ol class="number-list"><li>Is the murmur systolic, diastolic, or continuous?</li><li>Where is it loudest?</li><li>Where does it radiate?</li><li>Does inspiration, handgrip, Valsalva, or squatting change it?</li><li>What do the pulse, apex, JVP, S1/S2, clicks, snap, S3, and S4 show?</li></ol>
          <div class="callout danger"><strong>Safety rule:</strong> a diastolic murmur is pathologic until proven otherwise.</div>
        </aside>
      </section>

      ${sectionHeader("Maneuver matrix", "Use physiology rather than memorizing isolated arrows")}
      ${table(
        ["Maneuver", "Usually increases", "Usually decreases or shifts"],
        [
          ["Inspiration", "Right-sided murmurs such as TR and TS", "Most left-sided murmurs"],
          ["Handgrip", "MR, AR, and VSD by increasing afterload", "AS and HCM often become softer"],
          ["Standing / Valsalva", "HCM; MVP click occurs earlier and murmur lengthens", "Most flow murmurs and AS become softer"],
          ["Squatting / leg raise", "Most murmurs including AS because venous return rises", "HCM becomes softer; MVP click later and murmur shorter"]
        ],
        "Effect of common bedside maneuvers"
      )}
    `;
  }

  const quizQuestions = [
    {
      question: "A patient has exertional syncope, a slow-rising carotid pulse, and a harsh ejection systolic murmur radiating to the carotids. Which lesion is most likely?",
      options: ["Mitral regurgitation", "Aortic stenosis", "Aortic regurgitation", "Tricuspid regurgitation"],
      answer: 1,
      explanation: "The combination of exertional syncope, pulsus parvus et tardus, and a carotid-radiating ejection systolic murmur is classic for aortic stenosis."
    },
    {
      question: "Which finding most strongly explains why rapid atrial fibrillation worsens symptoms in mitral stenosis?",
      options: ["It prolongs systole", "It shortens diastole and increases the transmitral gradient", "It decreases left-atrial pressure", "It causes acute aortic regurgitation"],
      answer: 1,
      explanation: "Mitral inflow occurs during diastole. Tachycardia shortens diastole, raising the gradient and pulmonary venous pressure."
    },
    {
      question: "A patient develops abrupt pulmonary edema and hypotension three days after myocardial infarction. The new systolic murmur is short and not very loud. What is the key concern?",
      options: ["Mild chronic MR", "Acute severe MR from papillary muscle rupture", "Stable aortic sclerosis", "Mitral stenosis"],
      answer: 1,
      explanation: "Acute severe MR can be deceptively quiet because LA and LV pressures equalize rapidly. After MI, papillary muscle rupture is a mechanical emergency."
    },
    {
      question: "Which typical parameter is within the severe range for aortic stenosis?",
      options: ["Peak velocity 2.5 m/s", "Mean gradient 20 mmHg", "Aortic valve area 0.9 cm²", "Aortic valve area 2.0 cm²"],
      answer: 2,
      explanation: "A valve area of 1.0 cm² or less is a typical severe threshold, interpreted with flow, body size, velocity, and gradient."
    },
    {
      question: "Standing causes the click of mitral valve prolapse to move earlier because standing:",
      options: ["Increases LV volume", "Reduces LV volume", "Increases aortic pressure only", "Eliminates mitral regurgitation"],
      answer: 1,
      explanation: "Reduced LV volume allows the valve to prolapse earlier, producing an earlier click and a longer late systolic murmur."
    },
    {
      question: "A holosystolic murmur at the lower left sternal border becomes louder with inspiration. Which associated sign is most supportive?",
      options: ["Slow-rising carotid pulse", "Large systolic v waves in the JVP", "Opening snap", "Wide pulse pressure"],
      answer: 1,
      explanation: "This is the pattern of tricuspid regurgitation; large JVP v waves and a pulsatile liver reflect systolic backflow into the right atrium."
    },
    {
      question: "Why can an LVEF of 60% already be concerning in chronic primary mitral regurgitation?",
      options: ["Normal EF is always below 50%", "The LV ejects into both the aorta and a low-pressure left atrium", "MR prevents all systolic ejection", "EF is not measurable in MR"],
      answer: 1,
      explanation: "The low-pressure regurgitant pathway can make total EF appear preserved despite declining intrinsic LV contractile reserve."
    },
    {
      question: "Which anticoagulant principle is correct?",
      options: ["DOACs are preferred for mechanical valves", "Mechanical valves require a vitamin K antagonist", "Rheumatic MS with AF never needs anticoagulation", "All native valve disease requires lifelong anticoagulation"],
      answer: 1,
      explanation: "Mechanical prosthetic valves require VKA therapy; direct oral anticoagulants are contraindicated."
    },
    {
      question: "Which statement about infective endocarditis prophylaxis is most accurate?",
      options: ["All patients with a murmur require it", "All patients with MVP require it", "It is restricted to defined high-risk cardiac conditions and relevant procedures", "Dental hygiene is unimportant if antibiotics are given"],
      answer: 2,
      explanation: "Routine prophylaxis is not recommended for uncomplicated native valve disease or isolated MVP. Oral hygiene remains central."
    },
    {
      question: "A patient with chronic AR has a bounding pulse and wide pulse pressure. Which ventricular response is expected?",
      options: ["Concentric LV hypertrophy without dilatation", "LV volume overload with dilatation and high total stroke volume", "Isolated RV pressure overload", "Reduced LA inflow from mitral stenosis"],
      answer: 1,
      explanation: "Chronic AR creates LV volume overload, progressive dilatation, and an initially large total stroke volume."
    },
    {
      question: "Which is the best first-line imaging study for most suspected valve lesions?",
      options: ["Routine invasive catheterization", "Transthoracic echocardiography with Doppler", "Cardiac CT for every patient", "TEE for every stable lesion"],
      answer: 1,
      explanation: "TTE with Doppler usually defines anatomy, severity, chamber response, and pulmonary pressure. Other tests resolve specific questions or discordance."
    },
    {
      question: "In secondary mitral regurgitation, the first management priority is usually:",
      options: ["Immediate valve replacement for every patient", "Optimize guideline-directed heart-failure therapy and relevant revascularization/CRT", "Antibiotic prophylaxis", "Percutaneous mitral commissurotomy"],
      answer: 1,
      explanation: "Secondary MR is driven by abnormal LV or LA geometry, so optimized HF therapy and correction of drivers come before selected transcatheter or surgical intervention."
    }
  ];

  function casesPage() {
    return `
      ${hero({
        eyebrow: "Interactive revision",
        title: "Clinical cases and exam traps",
        intro: "Work through short clinical problems. Each answer includes the reason the finding matters and the common trap it is designed to expose.",
        chips: [`${quizQuestions.length} questions`, "Immediate explanation", "Score saved locally", "Restart anytime"]
      })}
      <section class="content-grid sidebar-layout">
        <article class="card quiz-card interactive-only" id="quiz-root"></article>
        <aside class="card sticky-card">
          <h3>How to reason through a valve case</h3>
          <ol class="number-list"><li>Identify acute instability or a mechanical emergency.</li><li>Classify stenosis versus regurgitation.</li><li>Locate the valve using murmur timing and site.</li><li>Add pulse, apex, JVP, and associated sounds.</li><li>Use echo to define mechanism, severity, and chamber response.</li><li>Choose treatment based on symptoms, consequences, anatomy, and timing.</li></ol>
          <div class="callout warning"><strong>Exam trap:</strong> acute severe regurgitation and low-flow stenosis may produce softer murmurs than expected.</div>
        </aside>
      </section>
    `;
  }

  function sourcesPage() {
    return `
      ${hero({
        eyebrow: "Sources, scope, and limitations",
        title: "Evidence trail and educational use",
        intro: "The website reorganizes the uploaded valvular heart disease study chapter into an interactive curriculum and links to the major official guideline resources used for cross-checking.",
        chips: ["Uploaded 23-page study chapter", "2025 ESC/EACTS VHD guideline", "2020 ACC/AHA VHD guideline", "2023 ESC endocarditis guideline"]
      })}

      <section class="content-grid two">
        <article class="card reference-card"><span class="tag teal">Primary course source</span><h3>Uploaded Valvular Heart Disease study chapter</h3><p>The chapter covers general assessment; mitral, aortic, and tricuspid lesions; prosthetic valves; intervention; murmur differentials; and revision.</p><small>Local source file included by the user. The website paraphrases and restructures it rather than reproducing the PDF layout.</small></article>
        <article class="card reference-card"><span class="tag">Official guideline</span><h3>2025 ESC/EACTS Guidelines for valvular heart disease</h3><p>Current European guidance emphasizing Heart Teams, Heart Valve Centres, advanced imaging, and updated indications and timing of intervention.</p><a href="https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/valvular-heart-disease/" target="_blank" rel="noopener noreferrer">Open the official ESC guideline page</a></article>
        <article class="card reference-card"><span class="tag">Official guideline</span><h3>2020 ACC/AHA Guideline for valvular heart disease</h3><p>US guidance on stages A–D, correlation of bedside and noninvasive findings, Valve Center review, intervention, and antithrombotic principles.</p><a href="https://professional.heart.org/en/science-news/2020-acc-aha-guideline-for-the-management-of-patients-with-valvular-heart-disease" target="_blank" rel="noopener noreferrer">Open the official AHA professional page</a></article>
        <article class="card reference-card"><span class="tag">Official guideline</span><h3>2023 ESC Guidelines for infective endocarditis</h3><p>Guidance on prevention, diagnosis, imaging, Endocarditis Teams, antimicrobial treatment, surgery, and follow-up.</p><a href="https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/endocarditis/" target="_blank" rel="noopener noreferrer">Open the official ESC endocarditis page</a></article>
      </section>

      ${sectionHeader("What the site does well", "Designed as a learning interface rather than a PDF viewer")}
      <section class="content-grid three">
        <article class="card concept-card"><div class="concept-icon">↔</div><h3>Interconnection</h3><p>Disease pages link back to the same physiology, examination, imaging, and management framework.</p></article>
        <article class="card concept-card teal"><div class="concept-icon">⌁</div><h3>Active recall</h3><p>Murmur matching, maneuver logic, severity interpretation, and cases turn passive reading into retrieval practice.</p></article>
        <article class="card concept-card amber"><div class="concept-icon">✓</div><h3>Accessible structure</h3><p>Keyboard-friendly tabs, responsive tables, semantic headings, print layout, and offline operation.</p></article>
      </section>

      <div class="callout danger section-block"><strong>Educational limitation:</strong> this website is a study aid, not a clinical decision-support system. Intervention thresholds, antithrombotic regimens, pregnancy plans, and emergency management must be individualized using the complete current guideline and a treating specialist or Heart Team.</div>
      <div class="callout warning"><strong>Copyright note:</strong> guideline links point to the original publishers. This site uses concise educational summaries and does not reproduce complete guideline text, figures, or recommendation tables.</div>
    `;
  }

  const pageRenderers = {
    overview: overviewPage,
    principles: principlesPage,
    "mitral-stenosis": mitralStenosisPage,
    "mitral-regurgitation": mitralRegurgitationPage,
    mvp: mvpPage,
    "aortic-stenosis": aorticStenosisPage,
    "aortic-regurgitation": aorticRegurgitationPage,
    tricuspid: tricuspidPage,
    prosthetic: prostheticPage,
    "murmur-lab": murmurLabPage,
    cases: casesPage,
    sources: sourcesPage
  };

  function resolveRoute() {
    const candidate = window.location.hash.replace(/^#/, "").trim();
    return routeIds.includes(candidate) ? candidate : "overview";
  }

  function markVisited(route) {
    const visited = new Set(JSON.parse(localStorage.getItem("valvelab-visited") || "[]"));
    visited.add(route);
    localStorage.setItem("valvelab-visited", JSON.stringify([...visited]));
    updateProgress();
  }

  function updateProgress() {
    const visited = new Set(JSON.parse(localStorage.getItem("valvelab-visited") || "[]"));
    const count = Math.min(visited.size, routeIds.length);
    progressLabel.textContent = `${count} / ${routeIds.length}`;
    progressBar.style.width = `${(count / routeIds.length) * 100}%`;
  }

  function navigate(route) {
    if (!routeIds.includes(route)) return;
    if (window.location.hash === `#${route}`) {
      renderRoute(route);
    } else {
      window.location.hash = route;
    }
    closeSidebar();
  }

  function renderRoute(route) {
    const meta = routeMeta.find(item => item.id === route) || routeMeta[0];
    const renderer = pageRenderers[route] || pageRenderers.overview;
    contentRoot.innerHTML = `<div class="fade-in">${renderer()}</div>`;
    currentLabel.textContent = meta.title;
    document.title = `${meta.title} | ValveLab`;
    document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("is-active", item.dataset.route === route));
    markVisited(route);
    initializeTabs();
    initializeRouteFeatures(route);
    window.scrollTo({ top: 0, behavior: "auto" });
    contentRoot.focus?.({ preventScroll: true });
  }

  function initializeTabs() {
    document.querySelectorAll("[data-tab-group]").forEach(group => {
      const tabs = [...group.querySelectorAll('[role="tab"]')];
      const panels = [...group.querySelectorAll('[role="tabpanel"]')];
      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(index));
        tab.addEventListener("keydown", event => {
          let nextIndex = null;
          if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
          if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
          if (event.key === "Home") nextIndex = 0;
          if (event.key === "End") nextIndex = tabs.length - 1;
          if (nextIndex !== null) {
            event.preventDefault();
            activateTab(nextIndex);
            tabs[nextIndex].focus();
          }
        });
      });
      function activateTab(activeIndex) {
        tabs.forEach((tab, index) => {
          const active = index === activeIndex;
          tab.setAttribute("aria-selected", String(active));
          tab.tabIndex = active ? 0 : -1;
          panels[index].hidden = !active;
        });
      }
    });
  }

  function initializeRouteFeatures(route) {
    if (route === "overview") initOverloadDemo();
    if (route === "mvp") initMvpDemo();
    if (route === "aortic-stenosis") initAsChecker();
    if (route === "murmur-lab") initMurmurLab();
    if (route === "cases") initQuiz();
  }

  function initOverloadDemo() {
    const buttons = document.querySelectorAll("[data-overload]");
    const ring = document.getElementById("demo-ring");
    const ringLabel = document.getElementById("demo-ring-label");
    const title = document.getElementById("demo-title");
    const text = document.getElementById("demo-text");
    const flow = document.getElementById("demo-flow");
    buttons.forEach(button => button.addEventListener("click", () => {
      buttons.forEach(item => item.classList.toggle("is-active", item === button));
      if (button.dataset.overload === "regurgitation") {
        ring.style.width = "190px";
        ring.style.height = "190px";
        ring.style.borderWidth = "9px";
        ring.style.borderColor = "#c6535b";
        ringLabel.innerHTML = "Dilated chamber<br>high volume";
        title.textContent = "Volume overload response";
        text.textContent = "Regurgitant flow repeatedly loads the receiving chamber. Dilatation initially preserves total stroke volume, but progressive remodeling eventually causes systolic dysfunction, congestion, and arrhythmia.";
        flow.innerHTML = '<div class="flow-node">Backward flow</div><div class="flow-node">Volume overload</div><div class="flow-node">Chamber dilatation</div><div class="flow-node">Late dysfunction</div>';
      } else {
        ring.style.width = "150px";
        ring.style.height = "150px";
        ring.style.borderWidth = "16px";
        ring.style.borderColor = "#1e79ad";
        ringLabel.innerHTML = "Thick wall<br>smaller reserve";
        title.textContent = "Pressure overload response";
        text.textContent = "The upstream chamber generates higher pressure. A ventricle often develops concentric hypertrophy; an atrium enlarges when it must sustain an elevated filling pressure.";
        flow.innerHTML = '<div class="flow-node">Fixed obstruction</div><div class="flow-node">Pressure gradient</div><div class="flow-node">Hypertrophy / atrial enlargement</div><div class="flow-node">Congestion or low output</div>';
      }
    }));
  }

  function initMvpDemo() {
    const click = document.getElementById("mvp-click");
    const output = document.getElementById("mvp-output");
    document.querySelectorAll("[data-mvp]").forEach(button => button.addEventListener("click", () => {
      if (button.dataset.mvp === "low") {
        click.style.left = "30%";
        output.querySelector("p").innerHTML = "<strong>Standing / Valsalva:</strong> lower LV volume makes prolapse occur earlier, so the click shifts toward S1 and the murmur lengthens.";
      } else {
        click.style.left = "72%";
        output.querySelector("p").innerHTML = "<strong>Squatting / leg raise:</strong> higher LV volume delays prolapse, so the click shifts toward S2 and the murmur shortens.";
      }
    }));
  }

  function initAsChecker() {
    const button = document.getElementById("as-check");
    if (!button) return;
    button.addEventListener("click", () => {
      const vmax = Number(document.getElementById("as-vmax").value);
      const gradient = Number(document.getElementById("as-gradient").value);
      const area = Number(document.getElementById("as-area").value);
      const severeFlags = [vmax >= 4, gradient >= 40, area <= 1].filter(Boolean).length;
      const output = document.getElementById("as-output");
      if (![vmax, gradient, area].every(Number.isFinite) || vmax < 0 || gradient < 0 || area <= 0) {
        output.innerHTML = "<h3>Check the inputs</h3><p>Enter positive numeric values for velocity, gradient, and valve area.</p>";
        return;
      }
      if (severeFlags === 3) {
        output.innerHTML = "<h3>Concordant typical severe pattern</h3><p>Velocity, mean gradient, and valve area all fall within commonly used severe ranges. Clinical symptoms, LV response, measurement quality, and Heart Team review still determine management.</p>";
      } else if (severeFlags >= 1) {
        output.innerHTML = "<h3>Discordant pattern</h3><p>At least one parameter suggests severe AS while others do not. Reassess flow, blood pressure, stroke volume, LVEF, and measurement quality; additional stress echo or CT calcium assessment may be appropriate.</p>";
      } else {
        output.innerHTML = "<h3>Not a typical severe pattern</h3><p>None of the entered values meets the common severe thresholds shown in this lesson. This does not substitute for complete echocardiographic interpretation.</p>";
      }
    });
  }

  function initMurmurLab() {
    const analyze = document.getElementById("murmur-analyze");
    const reset = document.getElementById("murmur-reset");
    const output = document.getElementById("murmur-output");
    const fieldIds = ["murmur-timing", "murmur-site", "murmur-radiation", "murmur-maneuver"];
    analyze.addEventListener("click", () => {
      const values = Object.fromEntries(fieldIds.map(id => [id, document.getElementById(id).value]));
      const selected = Object.values(values).filter(value => value !== "any").length;
      if (!selected) {
        output.innerHTML = "<h3>Start with timing</h3><p>Select at least one feature. More matching features produce a more focused differential.</p>";
        return;
      }
      const matches = murmurDatabase.map(item => {
        let score = 0;
        if (values["murmur-timing"] !== "any" && item.timing === values["murmur-timing"]) score += 4;
        if (values["murmur-site"] !== "any" && item.site === values["murmur-site"]) score += 3;
        if (values["murmur-radiation"] !== "any" && item.radiation === values["murmur-radiation"]) score += 2;
        if (values["murmur-maneuver"] !== "any" && item.maneuver === values["murmur-maneuver"]) score += 2;
        return { ...item, score };
      }).filter(item => item.score > 0).sort((a,b) => b.score - a.score).slice(0, 4);
      const max = matches[0]?.score || 0;
      const focused = matches.filter(item => item.score >= Math.max(2, max - 2));
      output.innerHTML = `<h3>${focused.length === 1 ? "Leading match" : "Focused differential"}</h3>${focused.map((item, index) => `<div style="padding:.65rem 0;${index ? "border-top:1px solid #d7e0e8" : ""}"><strong>${item.name}</strong><p>${item.details}</p><span class="tag ${item.score === max ? "teal" : ""}">Match score ${item.score}</span></div>`).join("")}<p style="margin-top:.8rem"><strong>Next step:</strong> add pulse, apex, JVP, S1/S2, clicks/snaps, and echocardiography rather than diagnosing from the murmur alone.</p>`;
    });
    reset.addEventListener("click", () => {
      fieldIds.forEach(id => document.getElementById(id).value = "any");
      output.innerHTML = "<h3>Start with timing</h3><p>Select at least one feature. More matching features produce a more focused differential.</p>";
    });
  }

  function initQuiz() {
    const root = document.getElementById("quiz-root");
    let index = 0;
    let score = 0;
    let answered = false;
    const storedBest = Number(localStorage.getItem("valvelab-best-score") || 0);

    function renderQuestion() {
      answered = false;
      const item = quizQuestions[index];
      root.innerHTML = `
        <div class="quiz-progress"><span>Question ${index + 1} of ${quizQuestions.length}</span><span>Score ${score} · Best ${storedBest}/${quizQuestions.length}</span></div>
        <h2 class="quiz-question">${item.question}</h2>
        <div class="quiz-options">${item.options.map((option, optionIndex) => `<button class="quiz-option" data-option="${optionIndex}" type="button"><span class="letter">${String.fromCharCode(65 + optionIndex)}</span><span>${option}</span></button>`).join("")}</div>
        <div id="quiz-feedback"></div>
      `;
      root.querySelectorAll("[data-option]").forEach(button => button.addEventListener("click", () => answer(Number(button.dataset.option))));
    }

    function answer(selected) {
      if (answered) return;
      answered = true;
      const item = quizQuestions[index];
      const buttons = [...root.querySelectorAll("[data-option]")];
      buttons.forEach((button, optionIndex) => {
        button.disabled = true;
        if (optionIndex === item.answer) button.classList.add("is-correct");
        if (optionIndex === selected && selected !== item.answer) button.classList.add("is-wrong");
      });
      if (selected === item.answer) score += 1;
      const finalQuestion = index === quizQuestions.length - 1;
      document.getElementById("quiz-feedback").innerHTML = `<div class="quiz-explanation"><strong>${selected === item.answer ? "Correct." : "Not quite."}</strong> ${item.explanation}</div><button class="button" id="quiz-next" type="button" style="margin-top:.8rem">${finalQuestion ? "See results" : "Next question"}</button>`;
      document.getElementById("quiz-next").addEventListener("click", () => {
        if (finalQuestion) renderResults(); else { index += 1; renderQuestion(); }
      });
    }

    function renderResults() {
      const best = Math.max(storedBest, score);
      localStorage.setItem("valvelab-best-score", String(best));
      const percentage = Math.round((score / quizQuestions.length) * 100);
      root.innerHTML = `<div style="text-align:center"><div class="section-kicker">Quiz complete</div><h2>${percentage >= 80 ? "Strong valve reasoning" : percentage >= 60 ? "Good foundation — review the traps" : "Revisit the core patterns"}</h2><div class="score-ring" style="--score-angle:${percentage * 3.6}deg"><span>${score}/${quizQuestions.length}</span></div><p>You scored ${percentage}%. Your best score is ${best}/${quizQuestions.length}.</p><button class="button" id="quiz-restart" type="button">Restart quiz</button><button class="button secondary" data-route="murmur-lab" type="button" style="margin-left:.4rem">Practice murmurs</button></div>`;
      document.getElementById("quiz-restart").addEventListener("click", () => { index = 0; score = 0; renderQuestion(); });
    }

    renderQuestion();
  }

  function openSidebar() {
    sidebar.classList.add("is-open");
    scrim.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    scrim.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 2600);
  }

  function performSearch(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      searchResults.hidden = true;
      searchResults.innerHTML = "";
      return;
    }
    const results = routeMeta.filter(item => `${item.title} ${item.summary}`.toLowerCase().includes(normalized));
    searchResults.hidden = false;
    searchResults.innerHTML = results.length
      ? results.map(item => `<button class="search-result" data-route="${item.id}" role="option" type="button"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.summary)}</small></button>`).join("")
      : `<div class="search-empty">No matching module. Try “murmur”, “mitral”, “aortic”, “prosthetic”, or “cases”.</div>`;
  }

  document.addEventListener("click", event => {
    const routeTarget = event.target.closest("[data-route]");
    if (routeTarget) {
      event.preventDefault();
      navigate(routeTarget.dataset.route);
      searchResults.hidden = true;
      searchInput.value = "";
    }
    if (!event.target.closest(".search-box") && !event.target.closest(".search-results")) searchResults.hidden = true;
  });

  menuButton.addEventListener("click", openSidebar);
  closeButton.addEventListener("click", closeSidebar);
  scrim.addEventListener("click", closeSidebar);
  window.addEventListener("hashchange", () => renderRoute(resolveRoute()));
  document.getElementById("print-button").addEventListener("click", () => window.print());
  document.getElementById("reset-progress").addEventListener("click", () => {
    localStorage.removeItem("valvelab-visited");
    updateProgress();
    showToast("Study progress reset.");
  });

  searchInput.addEventListener("input", () => performSearch(searchInput.value));
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Escape") { searchInput.value = ""; searchResults.hidden = true; searchInput.blur(); }
    if (event.key === "Enter") {
      const first = searchResults.querySelector("[data-route]");
      if (first) navigate(first.dataset.route);
    }
  });

  document.addEventListener("keydown", event => {
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    const typing = ["input", "textarea", "select"].includes(activeTag) || document.activeElement?.isContentEditable;
    if (event.key === "/" && !typing) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === "Escape") closeSidebar();
  });

  updateProgress();
  renderRoute(resolveRoute());
})();
