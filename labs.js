/* Interactive clinical-reasoning labs. */
(() => {
  "use strict";
  const $ = (s,r=document)=>r.querySelector(s);
  const data = window.VHLabData;
  const safe = window.VHLabUI.escapeHTML;

  function initHemodynamics(){
    const root=$("#hemodynamics-tool"); if(!root)return;
    const lesion=$("#hemo-lesion",root),focus=$("#hemo-focus",root),out=$("#hemo-output",root);
    const render=()=>{
      const p=data.lesionProfiles.find(x=>x.id===lesion.value)||data.lesionProfiles[0];
      if(focus.value==="sequence") out.innerHTML=`<span class="score-badge">${safe(p.id.toUpperCase())}</span><h3>${safe(p.name)}: flow sequence</h3><div class="flow">${p.sequence.split("→").map((x,i)=>`<div class="flow-step"><strong>${i+1}</strong><span>${safe(x.trim())}</span></div>`).join("")}</div>`;
      else if(focus.value==="exam") out.innerHTML=`<h3>${safe(p.name)}: translate physiology to bedside</h3><ul class="key-list"><li><b>M</b><span><strong>Murmur:</strong> ${safe(p.timing)}, ${safe(p.character)}, maximal at the ${safe(p.site)}; radiation: ${safe(p.radiation)}.</span></li><li><b>P</b><span><strong>Pulse/JVP:</strong> ${safe(p.pulse)}.</span></li><li><b>A</b><span><strong>Apex:</strong> ${safe(p.apex)}.</span></li><li><b>+</b><span><strong>Associated:</strong> ${safe(p.extra)}.</span></li><li><b>↕</b><span><strong>Dynamic clue:</strong> ${safe(p.maneuver)}.</span></li></ul>`;
      else out.innerHTML=`<h3>${safe(p.name)}: chamber load</h3><p><strong>Primary load:</strong> ${safe(p.load)}.</p><p>${safe(p.sequence)}</p><div class="callout purple"><h3>Reasoning prompt</h3><p>Which chamber is immediately upstream or receiving regurgitant flow? What remodeling would preserve output initially, and what late finding signals failure?</p></div>`;
    };
    lesion.addEventListener("change",render);focus.addEventListener("change",render);render();
  }

  const decoderProfiles = [
    {id:"ms",timing:"diastolic",site:"apex",radiation:"none",inspiration:"same",title:"Mitral stenosis",why:"Apical low-pitched mid-diastolic rumble, often with an opening snap and tapping apex."},
    {id:"mr",timing:"systolic",site:"apex",radiation:"axilla",inspiration:"same",title:"Mitral regurgitation",why:"Apical holosystolic blowing murmur classically radiating to the axilla; handgrip often augments it."},
    {id:"mvp",timing:"late-systolic",site:"apex",radiation:"none",inspiration:"same",title:"Mitral valve prolapse",why:"Mid-systolic click with a late systolic murmur; standing moves the click earlier."},
    {id:"as",timing:"systolic",site:"rusb",radiation:"carotids",inspiration:"same",title:"Aortic stenosis",why:"Harsh crescendo-decrescendo ejection systolic murmur at the right upper sternal border radiating to carotids."},
    {id:"ar",timing:"diastolic",site:"lsb",radiation:"apex",inspiration:"same",title:"Aortic regurgitation",why:"High-pitched early diastolic decrescendo murmur along the left sternal border toward the apex."},
    {id:"ts",timing:"diastolic",site:"llsb",radiation:"none",inspiration:"increase",title:"Tricuspid stenosis",why:"Lower sternal diastolic rumble with inspiratory augmentation and prominent a waves."},
    {id:"tr",timing:"systolic",site:"llsb",radiation:"none",inspiration:"increase",title:"Tricuspid regurgitation",why:"Lower sternal holosystolic murmur that increases with inspiration, often with large v waves."}
  ];
  function initMurmur(){
    const root=$("#murmur-tool"); if(!root)return;
    const controls=["timing","site","radiation","inspiration"].map(k=>$("#murmur-"+k,root)),out=$("#murmur-output",root);
    const render=()=>{
      const values={timing:controls[0].value,site:controls[1].value,radiation:controls[2].value,inspiration:controls[3].value};
      const ranked=decoderProfiles.map(p=>{let score=0; if(p.timing===values.timing)score+=4;if(p.site===values.site)score+=4;if(p.radiation===values.radiation)score+=2;if(p.inspiration===values.inspiration)score+=2;return{...p,score}}).sort((a,b)=>b.score-a.score);
      const top=ranked[0],second=ranked[1];const confidence=Math.round(top.score/12*100);
      out.innerHTML=`<div style="display:flex;gap:.8rem;align-items:center"><span class="score-badge">${confidence}%</span><div><h3 style="margin:0">Best fit: ${safe(top.title)}</h3><p class="muted" style="margin:.2rem 0">Teaching match score, not diagnostic probability.</p></div></div><div class="result-meter"><span style="width:${confidence}%"></span></div><p>${safe(top.why)}</p><p><strong>Second consideration:</strong> ${safe(second.title)}. Recheck associated sounds, pulse/JVP, exact timing, radiation, and dynamic maneuvers.</p>`;
    };
    controls.forEach(c=>c.addEventListener("change",render));render();
  }

  const maneuverRules={
    ms:{inspiration:"Usually little specific augmentation because MS is left-sided; the left lateral position and mild exercise may make the rumble easier to hear.",handgrip:"Usually no decisive change; increased afterload is less useful than timing, opening snap, and position.",standing:"Reduced preload may soften the flow-dependent rumble.",squat:"Increased venous return may increase transmitral flow and make the rumble more apparent.",expiration:"Left lateral position with the bell is the key transmission maneuver."},
    mr:{inspiration:"Usually no clear increase; marked inspiratory augmentation should raise TR in the differential.",handgrip:"Usually louder because increased afterload promotes LV-to-LA regurgitant flow.",standing:"Often softer as preload and LV stroke volume fall.",squat:"Often louder as venous return and stroke volume rise.",expiration:"Left-sided sounds may be easier to hear at end-expiration."},
    mvp:{inspiration:"No characteristic right-sided augmentation.",handgrip:"The MR component may become louder, but click timing is mainly governed by LV volume.",standing:"Smaller LV volume makes the click earlier and the murmur longer.",squat:"Larger LV volume makes the click later and the murmur shorter.",expiration:"No defining change; dynamic volume maneuvers are more useful."},
    as:{inspiration:"Usually not augmented; right-sided ejection murmurs may increase instead.",handgrip:"Often softer relative to MR/AR because higher afterload reduces the transvalvular flow advantage.",standing:"Reduced preload usually makes the murmur softer.",squat:"Increased venous return and stroke volume often make the murmur louder.",expiration:"A left-sided murmur may transmit more clearly at end-expiration."},
    ar:{inspiration:"Usually no right-sided augmentation.",handgrip:"Usually louder because higher aortic afterload promotes regurgitant flow.",standing:"The response is variable; the defining maneuver is posture and end-expiration.",squat:"May increase forward and regurgitant volumes, but is not the classic bedside discriminator.",expiration:"Sitting forward at end-expiration makes the early diastolic murmur easier to hear."},
    ts:{inspiration:"Louder because inspiration increases right-heart venous return.",handgrip:"No defining response.",standing:"Reduced venous return may soften the murmur.",squat:"Increased venous return may make it louder.",expiration:"Inspiration, not expiration, is the key respiratory clue."},
    tr:{inspiration:"Louder: Carvallo sign. Increased systemic venous return raises right-sided regurgitant flow.",handgrip:"May change less predictably than left-sided MR; inspiration is more discriminating.",standing:"Reduced venous return may soften the murmur.",squat:"Increased venous return may increase it.",expiration:"Loss of inspiratory augmentation makes it less prominent."}
  };
  function initManeuver(){
    const root=$("#maneuver-tool");if(!root)return;
    const lesion=$("#maneuver-lesion",root),choice=$("#maneuver-choice",root),out=$("#maneuver-output",root);
    const render=()=>{const p=data.lesionProfiles.find(x=>x.id===lesion.value),m=data.maneuversData.find(x=>x.id===choice.value);const rule=maneuverRules[lesion.value]?.[choice.value]||"Use the full examination; this pairing has no strong classic teaching response.";out.innerHTML=`<h3>${safe(p.name)} + ${safe(m.name)}</h3><p><strong>Prediction:</strong> ${safe(rule)}</p><p><strong>Mechanism of the maneuver:</strong> ${safe(m.mechanism)}</p><div class="callout success"><h3>Anchor</h3><p>${safe(m.increases)} ${safe(m.decreases)}</p></div>`};
    lesion.addEventListener("change",render);choice.addEventListener("change",render);render();
  }

  function initSeverity(){
    const root=$("#severity-tool");if(!root)return;
    const tabs=[...root.querySelectorAll("[data-severity-tab]")],controls=$("#severity-controls",root),out=$("#severity-output",root);let active="as";
    const renderControls=()=>{
      tabs.forEach(b=>b.classList.toggle("active",b.dataset.severityTab===active));
      if(active==="as")controls.innerHTML=`<label class="field"><span>Peak velocity (m/s)</span><input id="sev-vmax" type="number" min="0" step="0.1" value="4.2"></label><label class="field"><span>Mean gradient (mmHg)</span><input id="sev-grad" type="number" min="0" step="1" value="42"></label><label class="field"><span>Valve area (cm²)</span><input id="sev-area" type="number" min="0" step="0.1" value="0.9"></label><label class="field"><span>LVEF (%)</span><input id="sev-ef" type="number" min="5" max="90" step="1" value="60"></label>`;
      else if(active==="ms")controls.innerHTML=`<label class="field"><span>Mitral valve area (cm²)</span><input id="sev-ms-area" type="number" min="0" step="0.1" value="1.0"></label><label class="field"><span>Mean gradient (mmHg)</span><input id="sev-ms-grad" type="number" min="0" step="1" value="11"></label><label class="field"><span>Heart rate (bpm)</span><input id="sev-ms-hr" type="number" min="30" max="220" step="1" value="92"></label><label class="field"><span>Rhythm</span><select id="sev-ms-rhythm"><option>Sinus rhythm</option><option>Atrial fibrillation</option></select></label>`;
      else controls.innerHTML=`<label class="field"><span>Symptoms attributable to lesion?</span><select id="sev-reg-sym"><option value="no">No / uncertain</option><option value="yes">Yes</option></select></label><label class="field"><span>Ventricular enlargement or dysfunction?</span><select id="sev-reg-lv"><option value="no">No</option><option value="yes">Yes</option></select></label><label class="field"><span>Quantitative and qualitative measures concordant?</span><select id="sev-reg-con"><option value="yes">Yes</option><option value="no">No</option></select></label><label class="field"><span>Acute hemodynamic instability?</span><select id="sev-reg-acute"><option value="no">No</option><option value="yes">Yes</option></select></label>`;
      [...controls.querySelectorAll("input,select")].forEach(x=>x.addEventListener("input",render));render();
    };
    const n=id=>Number($(id,root)?.value||0);
    const render=()=>{
      if(active==="as"){
        const v=n("#sev-vmax"),g=n("#sev-grad"),a=n("#sev-area"),ef=n("#sev-ef");const hits=[v>=4,g>=40,a<=1&&a>0].filter(Boolean).length;let title,body,tone;
        if(hits===3){title="Concordant severe AS pattern";body="Velocity, mean gradient, and valve area all support severe AS. Next integrate symptoms, LV response, anatomy, and intervention strategy.";tone="danger"}
        else if(a<=1&&a>0&&(v<4||g<40)){title="Discordant / possible low-gradient AS";body=`A small valve area is not matched by high velocity or gradient. Check measurement quality, blood pressure, stroke volume and flow. ${ef<50?"Reduced EF raises classical low-flow, low-gradient AS; dobutamine stress echo may help.":"With preserved EF, assess stroke-volume index and consider paradoxical low-flow or measurement discordance."}`;tone="warning"}
        else if(v>=5||g>=60){title="Very high-gradient / very severe marker";body="This is a high-risk hemodynamic feature, but management still integrates symptoms, ventricular response, progression, and procedural assessment.";tone="danger"}
        else{title="Not a concordant severe pattern";body="The entered values do not all meet typical severe thresholds. Review the full echo and clinical context rather than labeling from one value.";tone="success"}
        out.innerHTML=`<div class="callout ${tone}"><h3>${title}</h3><p>${body}</p></div><p><strong>Threshold count:</strong> ${hits}/3 classic severe measurements.</p>`;
      } else if(active==="ms"){
        const a=n("#sev-ms-area"),g=n("#sev-ms-grad"),hr=n("#sev-ms-hr"),rh=$("#sev-ms-rhythm",root).value;let category=a<=1?"Severe anatomic obstruction":"Clinically significant / nonsevere range";let note=a<=1?"Valve area near or below 1.0 cm² usually represents severe obstruction.":a<=1.5?"Valve area ≤1.5 cm² generally represents clinically significant rheumatic MS.":"The area is above the usual clinically significant threshold, but morphology and symptoms still matter.";out.innerHTML=`<h3>${category}</h3><p>${note}</p><p><strong>Flow warning:</strong> A mean gradient of ${g} mmHg at heart rate ${hr} bpm in ${safe(rh)} is flow- and rate-dependent. ${hr>90?"Tachycardia may substantially raise the gradient.":"Interpret at the recorded rate and rhythm."}</p>`;
      } else {
        const sym=$("#sev-reg-sym",root).value,lv=$("#sev-reg-lv",root).value,con=$("#sev-reg-con",root).value,acute=$("#sev-reg-acute",root).value;
        if(acute==="yes")out.innerHTML=`<div class="callout danger"><h3>Emergency physiology outranks numeric grading</h3><p>Acute severe MR or AR can be hemodynamically catastrophic with a short or soft murmur and without chronic chamber enlargement. Urgent imaging and Heart Team assessment are required.</p></div>`;
        else if(sym==="yes"||lv==="yes")out.innerHTML=`<div class="callout warning"><h3>Consequences may trigger intervention</h3><p>Attributable symptoms or objective ventricular decompensation can be more important than any single jet measurement. Confirm severity and mechanism in an expert setting.</p></div>`;
        else if(con==="no")out.innerHTML=`<div class="callout purple"><h3>Resolve discordance</h3><p>Reassess loading conditions, rhythm, jet eccentricity, image quality, multiple jets, and chamber response. Consider TEE or CMR as appropriate.</p></div>`;
        else out.innerHTML=`<div class="callout success"><h3>Integrated follow-up pattern</h3><p>Concordant imaging without symptoms or ventricular consequences usually calls for guideline-based surveillance, while remaining alert to exercise-limited symptoms, new AF, pulmonary hypertension, or progression.</p></div>`;
      }
    };
    tabs.forEach(b=>b.addEventListener("click",()=>{active=b.dataset.severityTab;renderControls()}));renderControls();
  }

  function initRoute(route){
    if(route==="hemodynamics-lab")initHemodynamics();
    if(route==="murmur-lab")initMurmur();
    if(route==="maneuver-lab")initManeuver();
    if(route==="severity-lab")initSeverity();
  }
  window.VHLabLabs={initRoute};
})();
