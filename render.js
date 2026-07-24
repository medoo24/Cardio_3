/* Reusable presentation components. No application state belongs here. */
(() => {
  "use strict";
  const escapeHTML = value => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  const section = (title, body, note = "", extraClass = "") => `
    <section class="section-block speech-unit ${extraClass}">
      <div class="section-heading"><div><h2>${title}</h2>${note ? `<p>${note}</p>` : ""}</div></div>
      ${body}
    </section>`;
  const cards = items => `<div class="section-grid ${items.length >= 4 ? "four" : items.length === 3 ? "three" : ""}">${items.map(item => `
    <article class="mini-card speech-unit ${item.className || ""}">
      <span class="icon-badge" aria-hidden="true">${item.icon || "•"}</span>
      <h3>${item.title}</h3>${item.body}
    </article>`).join("")}</div>`;
  const callout = (title, body, type = "info") => `<aside class="callout ${type} speech-unit"><h3>${title}</h3>${typeof body === "string" && !body.trim().startsWith("<") ? `<p>${body}</p>` : body}</aside>`;
  const table = (headers, rows, caption = "") => `<div class="table-wrap speech-unit"><table>${caption ? `<caption class="sr-only">${caption}</caption>` : ""}<thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>`<td${i===0?' data-label="'+escapeHTML(headers[i])+'"':''}>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const bullets = items => `<ul class="clean-list">${items.map(item=>`<li>${item}</li>`).join("")}</ul>`;
  const numbered = items => `<ol class="clean-list">${items.map(item=>`<li>${item}</li>`).join("")}</ol>`;
  const flow = items => `<div class="flow speech-unit">${items.map(item=>`<div class="flow-step"><strong>${item.title}</strong><span>${item.body}</span></div>`).join("")}</div>`;
  const routeLinks = items => `<div class="choice-row interactive-only">${items.map(item=>`<button class="secondary-button" type="button" data-route="${item[0]}">${item[1]} →</button>`).join("")}</div>`;
  const badge = (text, tone="") => `<span class="badge ${tone}">${text}</span>`;
  const stats = items => `<div class="section-grid ${items.length >= 4 ? "four" : items.length === 3 ? "three" : ""}">${items.map(item=>`<div class="mini-card stat-card"><strong>${item.value}</strong><span>${item.label}</span></div>`).join("")}</div>`;
  const compareBars = items => `<div class="compare-bars speech-unit">${items.map(item=>`<div class="compare-row"><strong>${item.label}</strong><div class="compare-track" aria-hidden="true"><span style="width:${item.value}%"></span></div><span>${item.note}</span></div>`).join("")}</div>`;
  const heartDiagram = () => `<div class="heart-diagram" aria-label="Simplified four-valve heart diagram">
    <svg viewBox="0 0 520 340" role="img" aria-labelledby="heartTitle heartDesc">
      <title id="heartTitle">Simplified cardiac valve anatomy</title><desc id="heartDesc">Right atrium and ventricle are shown on the left of the diagram, left atrium and ventricle on the right, with tricuspid, pulmonary, mitral, and aortic valves labeled.</desc>
      <defs><linearGradient id="blueFill" x1="0" x2="1"><stop offset="0" stop-color="#d8eef2"/><stop offset="1" stop-color="#9ed4dd"/></linearGradient><linearGradient id="redFill" x1="0" x2="1"><stop offset="0" stop-color="#f8d9df"/><stop offset="1" stop-color="#e99cac"/></linearGradient></defs>
      <path d="M62 78c0-25 20-45 45-45h72c21 0 38 17 38 38v74c0 18-10 35-27 43l-35 17-39-15c-33-13-54-45-54-80Z" fill="url(#blueFill)" stroke="currentColor" stroke-width="3"/>
      <path d="M79 194c15-11 47-12 78 1l39 16c23 10 37 33 35 58l-5 51H105c-24 0-43-19-43-43v-36c0-18 6-35 17-47Z" fill="url(#blueFill)" stroke="currentColor" stroke-width="3"/>
      <path d="M303 50h76c28 0 51 23 51 51v34c0 24-15 45-37 53l-45 16-34-18c-20-11-33-32-33-55V72c0-12 10-22 22-22Z" fill="url(#redFill)" stroke="currentColor" stroke-width="3"/>
      <path d="M322 207l39-15c33-13 70 2 85 34 5 11 8 24 8 36v15c0 24-19 43-43 43H263l-4-54c-2-26 14-50 39-59Z" fill="url(#redFill)" stroke="currentColor" stroke-width="3"/>
      <path d="M219 52h52v93h-52z" fill="#f7fbfc" stroke="currentColor" stroke-width="3"/><path d="M239 145v54" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
      <path d="M193 174l48 28 48-28" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M165 176c14 17 31 17 47 0M310 176c14 17 31 17 47 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      <circle cx="186" cy="184" r="13" fill="#176173"/><circle cx="326" cy="184" r="13" fill="#b13e59"/><circle cx="244" cy="132" r="13" fill="#67579b"/><circle cx="276" cy="90" r="13" fill="#9b6819"/>
      <text x="121" y="166" class="valve-label">Tricuspid</text><text x="345" y="166" class="valve-label">Mitral</text><text x="172" y="119" class="valve-label">Pulmonary</text><text x="300" y="84" class="valve-label">Aortic</text>
      <text x="88" y="104" class="valve-label">RA</text><text x="93" y="268" class="valve-label">RV</text><text x="379" y="110" class="valve-label">LA</text><text x="390" y="272" class="valve-label">LV</text>
    </svg></div>`;
  const severityCaution = () => callout("Integrated severity, not one-number medicine", "Valve severity is interpreted from anatomy, Doppler or hemodynamic measurements, chamber response, symptoms, loading conditions, flow state, rhythm, and measurement quality. A single discordant number should trigger reassessment rather than automatic labeling.", "warning");
  window.VHLabUI = {escapeHTML, section, cards, callout, table, bullets, numbered, flow, routeLinks, badge, stats, compareBars, heartDiagram, severityCaution};
})();
