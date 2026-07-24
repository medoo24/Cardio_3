/* Structured educational content bank for the Valvular Heart Disease Lab. */
(() => {
  "use strict";
  const U = window.VHLabUI;
  if (!U) throw new Error("VHLabUI must load before data.js");
  const {section,cards,callout,table,bullets,numbered,flow,routeLinks,badge,stats,compareBars,heartDiagram,severityCaution} = U;

  const navGroups = [
    {title:"Foundations",items:[
      {id:"overview",label:"Overview & study map"},{id:"core-model",label:"Stenosis vs regurgitation"},{id:"disease-stages",label:"Stages & consequences"},{id:"murmur-method",label:"Murmur description"},{id:"maneuvers",label:"Dynamic maneuvers"},{id:"diagnostic-pathway",label:"Diagnostic pathway"},{id:"management-framework",label:"Management framework"}
    ]},
    {title:"Mitral valve",items:[
      {id:"mitral-stenosis",label:"Mitral stenosis"},{id:"ms-exam",label:"MS examination"},{id:"ms-investigation",label:"MS investigation"},{id:"ms-management",label:"MS management"},{id:"mitral-regurgitation",label:"Mitral regurgitation"},{id:"mr-exam",label:"MR examination"},{id:"mr-investigation",label:"MR investigation"},{id:"mr-management",label:"MR management"},{id:"mvp",label:"Mitral valve prolapse"}
    ]},
    {title:"Aortic valve",items:[
      {id:"aortic-stenosis",label:"Aortic stenosis"},{id:"as-severity",label:"AS severity & low flow"},{id:"as-management",label:"AS intervention"},{id:"aortic-regurgitation",label:"Aortic regurgitation"},{id:"ar-signs",label:"AR pulse & auscultation"},{id:"ar-management",label:"AR management"},{id:"aortic-compare",label:"AS vs AR"}
    ]},
    {title:"Right-sided valves",items:[
      {id:"tricuspid-stenosis",label:"Tricuspid stenosis"},{id:"tricuspid-regurgitation",label:"Tricuspid regurgitation"},{id:"right-sided-management",label:"Right-sided management"}
    ]},
    {title:"Prostheses & special issues",items:[
      {id:"prosthetic-valves",label:"Prosthetic valves"},{id:"anticoagulation-ie",label:"Anticoagulation & IE"},{id:"pregnancy-mixed",label:"Pregnancy & mixed disease"},{id:"emergencies",label:"Valve emergencies"},{id:"revision-matrix",label:"High-yield revision matrix"}
    ]},
    {title:"Interactive revision",items:[
      {id:"hemodynamics-lab",label:"Hemodynamics lab"},{id:"murmur-lab",label:"Murmur decoder"},{id:"maneuver-lab",label:"Maneuver lab"},{id:"severity-lab",label:"Severity reasoning lab"},{id:"clinical-cases",label:"Clinical cases"},{id:"flashcards",label:"Flashcards"},{id:"quiz",label:"Scored quiz"},{id:"sources",label:"Sources & original PDF"}
    ]}
  ];

  const clusters = {
    foundations:["overview","core-model","disease-stages","murmur-method","maneuvers","diagnostic-pathway","management-framework"],
    mitral:["mitral-stenosis","ms-exam","ms-investigation","ms-management","mitral-regurgitation","mr-exam","mr-investigation","mr-management","mvp"],
    aortic:["aortic-stenosis","as-severity","as-management","aortic-regurgitation","ar-signs","ar-management","aortic-compare"],
    right:["tricuspid-stenosis","tricuspid-regurgitation","right-sided-management"],
    special:["prosthetic-valves","anticoagulation-ie","pregnancy-mixed","emergencies","revision-matrix"],
    revision:["hemodynamics-lab","murmur-lab","maneuver-lab","severity-lab","clinical-cases","flashcards","quiz","sources"]
  };

  const lesionProfiles = [
    {id:"ms",name:"Mitral stenosis",timing:"Mid-diastolic",site:"Apex",character:"Low-pitched rumble",radiation:"Usually localized",maneuver:"Left lateral position; exercise may intensify",respiration:"Usually left-sided pattern",pulse:"Often irregular if AF",apex:"Tapping",extra:"Loud S1 and opening snap if mobile valve",load:"Left atrial pressure overload",sequence:"Mitral obstruction → raised LA pressure → pulmonary venous congestion → pulmonary hypertension → RV dysfunction and functional TR"},
    {id:"mr",name:"Mitral regurgitation",timing:"Holosystolic",site:"Apex",character:"Blowing",radiation:"Axilla classically; may radiate to base depending on jet",maneuver:"Handgrip usually increases",respiration:"Usually little inspiratory augmentation",pulse:"May be normal or low output late",apex:"Displaced, diffuse, hyperdynamic in chronic severe MR",extra:"Soft S1; S3 may reflect increased diastolic inflow",load:"LA and LV volume overload",sequence:"Systolic LV-to-LA flow → LA pressure/volume load → pulmonary congestion → LV volume overload → dilatation and dysfunction"},
    {id:"mvp",name:"Mitral valve prolapse",timing:"Mid-to-late systolic",site:"Apex",character:"Click followed by late systolic murmur",radiation:"Variable",maneuver:"Earlier click and longer murmur with standing/Valsalva",respiration:"Usually left-sided pattern",pulse:"Usually normal",apex:"Usually normal unless important MR",extra:"Squatting moves click later and shortens murmur",load:"Variable MR volume load",sequence:"Leaflet displacement → sudden chordal tension (click) → late systolic regurgitation"},
    {id:"as",name:"Aortic stenosis",timing:"Ejection systolic",site:"Right upper sternal border",character:"Harsh crescendo-decrescendo",radiation:"Carotids; sometimes apex",maneuver:"Often louder with squatting/leg raise; softer with Valsalva",respiration:"Usually left-sided pattern",pulse:"Pulsus parvus et tardus",apex:"Sustained/heaving",extra:"Soft or delayed A2 in advanced calcific disease; S4 may occur",load:"LV pressure overload",sequence:"Fixed outflow obstruction → high LV systolic pressure → concentric hypertrophy → impaired coronary reserve/diastolic filling → low output and HF"},
    {id:"ar",name:"Aortic regurgitation",timing:"Early diastolic",site:"Left sternal border",character:"High-pitched blowing decrescendo",radiation:"Toward apex",maneuver:"Sitting forward, end-expiration; handgrip may increase",respiration:"Usually left-sided pattern",pulse:"Bounding/collapsing with wide pulse pressure in chronic severe AR",apex:"Displaced, diffuse, hyperdynamic",extra:"Flow systolic murmur; Austin Flint murmur may occur in severe AR",load:"LV volume overload",sequence:"Diastolic aorta-to-LV flow → increased LV end-diastolic volume → eccentric dilatation and high total stroke volume → eventual LV dysfunction"},
    {id:"ts",name:"Tricuspid stenosis",timing:"Mid-diastolic or presystolic",site:"Lower left sternal border",character:"Low-pitched rumble",radiation:"Limited",maneuver:"Louder with inspiration",respiration:"Increases with inspiration",pulse:"Prominent a waves in JVP",apex:"RV impulse may coexist",extra:"Often rheumatic and accompanied by mitral disease",load:"Right atrial pressure overload",sequence:"Tricuspid obstruction → raised RA pressure → systemic venous congestion + reduced RV filling"},
    {id:"tr",name:"Tricuspid regurgitation",timing:"Holosystolic",site:"Lower left sternal border",character:"Blowing",radiation:"Right lower sternal edge or epigastrium",maneuver:"Carvallo sign: louder with inspiration",respiration:"Clearly increases with inspiration",pulse:"Large systolic v waves",apex:"RV heave",extra:"Pulsatile liver, edema, ascites",load:"RA and RV volume overload",sequence:"Systolic RV-to-RA flow → large v waves → hepatic/venous pulsation → systemic congestion → RV failure and low output"}
  ];

  const maneuversData = [
    {id:"inspiration",name:"Inspiration",mechanism:"Increases venous return to the right heart and transiently reduces left-sided filling.",increases:"Right-sided murmurs, especially TR and TS.",decreases:"Most left-sided murmurs may soften slightly.",trap:"Auscultate over multiple respiratory cycles; do not confuse louder breath sounds with a louder murmur."},
    {id:"handgrip",name:"Sustained handgrip",mechanism:"Raises systemic vascular resistance and LV afterload.",increases:"MR, AR, and VSD often become louder because backward or shunt flow rises.",decreases:"AS and HCM often become softer relative to baseline.",trap:"The response is supportive, not definitive, and may be blunted in low output or poor effort."},
    {id:"standing",name:"Standing / Valsalva strain",mechanism:"Reduces venous return and LV volume.",increases:"HCM; MVP click occurs earlier and the murmur lengthens.",decreases:"Most flow murmurs and AS become softer.",trap:"Different phases of Valsalva produce different hemodynamics; exam questions usually mean the strain phase."},
    {id:"squat",name:"Squatting / passive leg raise",mechanism:"Increases venous return; squatting also raises systemic resistance.",increases:"Most murmurs, including AS, may become louder with increased stroke volume.",decreases:"HCM becomes softer; MVP click moves later and the murmur shortens.",trap:"Passive leg raise is easier in frail or symptomatic patients and mainly tests preload."},
    {id:"expiration",name:"End-expiration and posture",mechanism:"Reduces lung volume and brings left-sided structures closer to the chest wall.",increases:"AR is best heard sitting forward at end-expiration; MS is best in the left lateral position with the bell.",decreases:"Not a universal intensity rule; it mainly optimizes transmission.",trap:"Correct position and stethoscope side can matter more than forceful pressure."}
  ];

  const modules = {
    overview:{title:"Valvular Heart Disease",kicker:"Interactive cardiology study lab",summary:"Build a coherent bedside-to-intervention model: identify the valve, define stenosis or regurgitation, assess severity and chamber response, then decide when expert intervention is needed.",meta:["39 connected modules","7 valve profiles","Offline-first"],body:()=>`
      ${section("Start with the whole map",`${heartDiagram()}${callout("The core idea","Stenosis obstructs forward flow and creates a pressure gradient upstream. Regurgitation permits backward flow and usually creates volume overload. Symptoms appear when compensation fails, pulmonary or systemic pressures rise, or forward output becomes inadequate.","success")}`)}
      ${section("Five questions for every valve case",cards([
        {icon:"1",title:"Which valve?",body:"<p>Use murmur site, timing, radiation, pulse, apex, JVP, and associated sounds.</p>"},
        {icon:"2",title:"Stenosis or regurgitation?",body:"<p>Obstruction mainly creates pressure load; incompetence mainly creates volume load.</p>"},
        {icon:"3",title:"Acute or chronic?",body:"<p>Acute regurgitation can be catastrophic before chambers have time to dilate.</p>"},
        {icon:"4",title:"How severe and what is the response?",body:"<p>Integrate anatomy, Doppler, chamber remodeling, pulmonary pressure, rhythm, symptoms, and flow state.</p>"}
      ])+callout("Fifth question: what changes management?","Symptoms, ventricular decompensation, pulmonary hypertension, new atrial fibrillation, exercise findings, aortic dimensions, procedural risk, repairability, and patient goals all influence timing.","purple"))}
      ${section("Recommended learning routes",cards([
        {icon:"⌁",title:"First pass",body:`<p>Core model → murmur method → one mitral lesion → one aortic lesion → revision matrix.</p>${routeLinks([["core-model","Core model"],["murmur-method","Murmur method"],["revision-matrix","Revision matrix"]])}`},
        {icon:"▣",title:"Clinical examination",body:`<p>Study the murmur method, maneuvers, MS/MR/AS/AR examination pages, then use the decoder.</p>${routeLinks([["murmur-method","Murmur method"],["maneuvers","Maneuvers"],["murmur-lab","Decoder"]])}`},
        {icon:"⚕",title:"Management revision",body:`<p>Diagnostic pathway → intervention pages → prosthetic valves → emergencies.</p>${routeLinks([["diagnostic-pathway","Diagnosis"],["management-framework","Framework"],["emergencies","Emergencies"]])}`}
      ]))}
      ${section("What the site includes",stats([{value:"12",label:"clinical cases"},{value:"72",label:"flip cards"},{value:"36",label:"quiz questions"},{value:"4",label:"interactive reasoning labs"}]))}`},

    "core-model":{title:"Stenosis vs Regurgitation",kicker:"Foundation 1",summary:"Translate a mechanical valve lesion into chamber loading, remodeling, physical signs, and late clinical consequences.",meta:["Pressure vs volume","Upstream vs receiving chamber","Acute vs chronic"],body:()=>`
      ${section("Mechanical lesion → physiologic load",table(["Lesion","Primary load","Typical chamber response","Late consequence"],[
        ["Stenosis","Pressure overload upstream from the valve","Hypertrophy or atrial enlargement, depending on which chamber faces the obstruction","Reduced forward output, pulmonary or systemic congestion, secondary regurgitation"],
        ["Regurgitation","Volume overload of the receiving chamber and usually the ventricle","Dilatation with initially increased total stroke volume","Progressive ventricular dysfunction, congestion, arrhythmia"],
        ["Mixed disease","Both pressure and volume load","Combined hypertrophy and dilatation; physiology depends on the dominant lesion","Clinical and echo findings may be discordant unless each component is assessed"]
      ]))}
      ${section("Think upstream",flow([{title:"Valve lesion",body:"Narrow or incompetent orifice"},{title:"Pressure/volume change",body:"Gradient or backward flow"},{title:"Chamber adaptation",body:"Hypertrophy, dilatation, atrial enlargement"},{title:"Clinical syndrome",body:"Congestion, low output, rhythm disturbance"},{title:"Irreversible damage",body:"Ventricular, pulmonary vascular, hepatic or renal injury"}]))}
      ${section("Acute regurgitation is not simply faster chronic regurgitation",cards([
        {icon:"!",title:"No time to adapt",body:"<p>A sudden large regurgitant volume enters a noncompliant atrium or ventricle. Pressure rises abruptly rather than being buffered by dilatation.</p>"},
        {icon:"≈",title:"The murmur may be misleading",body:"<p>Rapid pressure equalization can shorten or soften the murmur despite severe disease.</p>"},
        {icon:"⚠",title:"Hemodynamic collapse",body:"<p>Pulmonary edema, hypotension, and shock can develop in acute severe MR or AR and require urgent specialist intervention.</p>"}
      ]))}
      ${callout("Exam rule","Never use murmur loudness alone as a severity scale. Low-flow AS and acute severe MR can be deceptively quiet.","danger")}`},

    "disease-stages":{title:"Disease Stages & Consequences",kicker:"Foundation 2",summary:"Stage valve disease by anatomy, severity, symptoms, and ventricular compensation, then recognize the complications that signal progression.",meta:["A to D stages","Complications","Referral timing"],body:()=>`
      ${section("Four-stage model",table(["Stage","Meaning","Clinical task"],[
        ["A - At risk","Risk factors or anatomic predisposition without significant dysfunction","Identify bicuspid valve, rheumatic history, aortopathy, prior radiation, or family risk and plan surveillance"],
        ["B - Progressive","Mild to moderate dysfunction without severe-stage consequences","Track lesion progression and chamber response; control associated conditions"],
        ["C - Asymptomatic severe","Severe valve dysfunction without attributable symptoms; compensation may be preserved or beginning to fail","Confirm true absence of symptoms, consider exercise testing, and monitor intervention triggers"],
        ["D - Symptomatic severe","Severe dysfunction with symptoms attributable to the lesion","Prompt Heart Team assessment for intervention unless benefit is unlikely"]
      ]))}
      ${section("Complication domains",cards([
        {icon:"V",title:"Valve-related",body:"<p>Progressive calcification, infective endocarditis, acute leaflet or chordal failure, prosthetic degeneration.</p>"},
        {icon:"C",title:"Chamber-related",body:"<p>Atrial enlargement, ventricular remodeling, atrial fibrillation, conduction disease, secondary MR or TR.</p>"},
        {icon:"P",title:"Pulmonary/systemic",body:"<p>Pulmonary congestion, pulmonary hypertension, systemic venous congestion, pleural effusion.</p>"},
        {icon:"E",title:"Embolic and end-organ",body:"<p>Left atrial thrombus, stroke, prosthetic thrombosis, hepatic or renal dysfunction, low-output state.</p>"}
      ]))}
      ${callout("Referral principle","Severe disease should be referred early enough to avoid irreversible ventricular dysfunction, pulmonary vascular disease, advanced RV failure, or end-organ injury.","warning")}`},

    "murmur-method":{title:"A Structured Murmur Description",kicker:"Bedside foundation",summary:"Describe what you hear before naming the lesion. A disciplined sequence reduces pattern-recognition errors and makes the examination reproducible.",meta:["Timing","Site & radiation","Maneuvers"],body:()=>`
      ${section("The seven-part description",cards([
        {icon:"1",title:"Timing",body:"<p>Systolic, diastolic, continuous, or mixed; then early, mid, late, ejection, holo-, or decrescendo.</p>"},
        {icon:"2",title:"Maximum site",body:"<p>Find the point of maximum intensity before following radiation.</p>"},
        {icon:"3",title:"Character",body:"<p>Harsh, blowing, rumbling, musical, machinery-like; include pitch.</p>"},
        {icon:"4",title:"Radiation",body:"<p>Carotids, axilla, apex, back, epigastrium, or localized.</p>"}
      ])+cards([
        {icon:"5",title:"Intensity and duration",body:"<p>Grade intensity, but give timing and duration greater diagnostic weight.</p>"},
        {icon:"6",title:"Dynamic response",body:"<p>Respiration, posture, handgrip, standing, squatting, and Valsalva.</p>"},
        {icon:"7",title:"Associated findings",body:"<p>S1/S2, clicks, opening snap, S3/S4, pulse contour, apex, thrills, JVP, and liver pulsation.</p>"}
      ]))}
      ${section("Classic bedside patterns",table(["Lesion","Apex/pulse","Characteristic sound or murmur","Typical radiation"],lesionProfiles.filter(x=>["ms","mr","as","ar"].includes(x.id)).map(x=>[x.name,`${x.apex}; ${x.pulse}`,`${x.extra}; ${x.timing} ${x.character}`,x.radiation])))}
      ${callout("Diastolic murmur rule","A diastolic murmur is pathologic until proved otherwise. Localize it and distinguish an apical rumble from a left sternal border decrescendo.","danger")}
      ${routeLinks([["murmur-lab","Practice with the murmur decoder"],["maneuvers","Review dynamic maneuvers"]])}`},

    maneuvers:{title:"Dynamic Auscultation Maneuvers",kicker:"Bedside foundation",summary:"Use predictable changes in preload, afterload, and chamber volume to support a murmur diagnosis—never as a substitute for the full examination.",meta:["Preload","Afterload","Respiration"],body:()=>`
      ${section("Mechanism-first table",table(["Maneuver","Hemodynamic effect","Usually increases","Usually decreases or changes"],maneuversData.map(x=>[x.name,x.mechanism,x.increases,x.decreases])))}
      ${section("High-yield pairings",cards([
        {icon:"R",title:"Right-sided with inspiration",body:"<p>TR and TS become louder because right-heart venous return rises.</p>"},
        {icon:"H",title:"Handgrip favors regurgitation",body:"<p>Increasing afterload tends to augment MR and AR while AS often softens.</p>"},
        {icon:"M",title:"MVP tracks LV volume",body:"<p>Smaller LV: earlier click and longer murmur. Larger LV: later click and shorter murmur.</p>"},
        {icon:"P",title:"Position optimizes transmission",body:"<p>Left lateral for MS; sitting forward at end-expiration for AR.</p>"}
      ]))}
      ${callout("Safety","Do not ask an unstable, severely dyspneic, syncopal, or frail patient to perform strenuous bedside maneuvers. Use passive positioning or proceed to definitive assessment.","warning")}
      ${routeLinks([["maneuver-lab","Open the maneuver lab"],["murmur-lab","Decode a murmur"]])}`},

    "diagnostic-pathway":{title:"Diagnostic Pathway",kicker:"From bedside to Heart Team",summary:"Confirm the lesion, quantify severity, assess chamber response, resolve discordance, and connect the result to a management plan.",meta:["TTE first-line","Multimodality imaging","Discordance"],body:()=>`
      ${section("A practical sequence",flow([{title:"History & examination",body:"Symptoms, pulse, apex, JVP, sounds, murmur, rhythm"},{title:"TTE with Doppler",body:"Anatomy, gradients, areas, regurgitation, chambers"},{title:"Define mechanism & severity",body:"Primary vs secondary; acute vs chronic; integrated grading"},{title:"Assess consequences",body:"LV/RV, atria, pulmonary pressure, aorta, rhythm"},{title:"Resolve discordance",body:"Repeat measurements, stress echo, TEE, CT, CMR, catheterization"},{title:"Heart Team plan",body:"Surveillance, repair, replacement, transcatheter strategy"}]))}
      ${section("What each test contributes",table(["Test","Main contribution","When limitations matter"],[
        ["Transthoracic echocardiography","First-line anatomy, Doppler gradients and areas, regurgitation, chamber size/function, pulmonary pressure","Image quality, irregular rhythm, loading conditions, and discordant parameters"],
        ["Transesophageal echocardiography","Detailed morphology, LA appendage thrombus, endocarditis, procedural planning","Semi-invasive; not required for every stable lesion"],
        ["Exercise testing / stress echo","Reveals symptoms, abnormal BP response, exercise pulmonary hypertension, or latent severity","Avoid in clearly symptomatic severe disease or instability"],
        ["Cardiac CT","Aortic valve calcium, aortic anatomy, TAVI planning, prosthetic structure","Radiation/contrast; limited functional data"],
        ["Cardiac magnetic resonance","Ventricular volumes and regurgitant fraction when echo is uncertain","Availability, devices, arrhythmia, tolerance"],
        ["Catheterization","Coronary assessment and invasive hemodynamics when noninvasive data are discordant or before selected interventions","Not routinely needed solely to confirm an obvious echo diagnosis"]
      ]))}
      ${severityCaution()}`},

    "management-framework":{title:"General Management Framework",kicker:"Principles before procedures",summary:"Treat consequences, prevent avoidable events, and intervene before irreversible damage, using repair, replacement, or transcatheter therapy according to anatomy and lifetime strategy.",meta:["Symptoms","Thromboembolism","Heart Team"],body:()=>`
      ${section("Six management goals",table(["Goal","Practical approach"],[
        ["Treat symptoms and consequences","Diuretics for congestion; manage rate/rhythm, blood pressure, heart failure, ischemia, and precipitating illness"],
        ["Prevent thromboembolism","Anticoagulate for established indications such as AF with rheumatic MS, mechanical valves, or documented thrombus"],
        ["Prevent infection appropriately","Prioritize oral and skin hygiene; reserve antibiotic prophylaxis for defined high-risk cardiac conditions and relevant procedures"],
        ["Intervene before irreversible damage","Use symptoms, lesion severity, ventricular response, pulmonary pressure, rhythm, exercise findings, aortic size, and procedural risk"],
        ["Choose the procedure","Repair when durable and feasible; replacement when repair is unsuitable; transcatheter options for selected anatomy and risk profiles"],
        ["Use specialist review","Severe or complex disease belongs in a multidisciplinary Heart Team and experienced Heart Valve Centre"]
      ]))}
      ${section("Medical therapy: what it can and cannot do",cards([
        {icon:"✓",title:"Can improve consequences",body:"<p>Diuretics relieve congestion; blood pressure and HF therapy reduce load; rate control can improve filling in MS; treatment of ischemia or infection addresses drivers.</p>"},
        {icon:"×",title:"Cannot reverse a fixed severe obstruction",body:"<p>No drug opens a heavily calcified aortic valve or repairs a flail leaflet. Symptom improvement must not delay indicated intervention.</p>"},
        {icon:"↻",title:"Can optimize secondary regurgitation",body:"<p>Guideline-directed HF therapy, revascularization when appropriate, and CRT may reduce functional MR or TR by improving geometry.</p>"}
      ]))}
      ${callout("Current-practice correction","Routine infective endocarditis prophylaxis is not recommended simply because a patient has native valvular disease or isolated MVP.","warning")}`},

    "mitral-stenosis":{title:"Mitral Stenosis",kicker:"Mitral valve · mechanism",summary:"Rheumatic commissural fusion obstructs LV inflow, raises left atrial pressure, and transmits the burden backward to the pulmonary circulation and right heart.",meta:["Usually rheumatic","Diastolic obstruction","Tachycardia-sensitive"],body:()=>`
      ${section("Definition and anatomy",cards([
        {icon:"M",title:"Fixed inflow obstruction",body:"<p>MS is obstruction to left ventricular filling at the mitral valve. Normal valve area is roughly 4–6 cm²; clinically important rheumatic MS is generally present at ≤1.5 cm², and an area near or below 1.0 cm² is usually severe.</p>"},
        {icon:"C",title:"Commissural fusion",body:"<p>Rheumatic disease thickens leaflets, fuses commissures, and may shorten, fuse, and calcify the chordal apparatus.</p>"},
        {icon:"◊",title:"Fish-mouth orifice",body:"<p>Symmetric commissural fusion produces the classic buttonhole appearance and a doming anterior leaflet on echo.</p>"}
      ]))}
      ${section("Causes and mimics",table(["Type","Examples and distinction"],[
        ["Rheumatic","Classic worldwide cause; often appears years after acute rheumatic fever and frequently coexists with other valve lesions"],
        ["Degenerative","Mitral annular calcification causing inflow obstruction, especially in older adults; anatomy differs from commissural fusion"],
        ["Congenital","Parachute valve, double-orifice valve, or congenital commissural abnormality"],
        ["Flow-related diastolic murmur","High transmitral flow in severe MR, VSD, or PDA; Austin Flint murmur in severe AR. These are not fixed organic MS"]
      ]))}
      ${section("Hemodynamic chain",flow([{title:"Mitral obstruction",body:"Reduced diastolic orifice"},{title:"Raised LA pressure",body:"Gradient rises, especially with faster flow"},{title:"Pulmonary venous congestion",body:"Dyspnea, edema, hemoptysis"},{title:"Pulmonary hypertension",body:"Reactive and structural vascular change"},{title:"RV dysfunction + TR",body:"Late systemic congestion"}]))}
      ${callout("Why tachycardia is poorly tolerated","Tachycardia shortens diastole, so the same cardiac output must cross the narrowed valve in less time. Exercise, fever, anemia, thyrotoxicosis, pregnancy, or rapid AF can abruptly increase the gradient and precipitate dyspnea.","danger")}`},

    "ms-exam":{title:"Mitral Stenosis Examination",kicker:"Mitral valve · bedside",summary:"Combine the tapping apex, S1 and opening snap pattern, apical diastolic rumble, rhythm, and evidence of pulmonary hypertension or right-heart failure.",meta:["Opening snap","Apical rumble","AF changes findings"],body:()=>`
      ${section("Clinical presentation",table(["Domain","Findings"],[
        ["Symptoms","Exertional dyspnea, orthopnea, PND, fatigue, reduced exercise capacity, hemoptysis, palpitations, embolic events; hoarseness may occur from left recurrent laryngeal nerve compression"],
        ["Inspection/palpation","Malar flush in advanced pulmonary hypertension; tapping apex; possible diastolic thrill; RV heave when pulmonary hypertension develops"],
        ["Heart sounds","Loud S1 while leaflets remain mobile; opening snap after A2; loud P2 with pulmonary hypertension"],
        ["Murmur","Low-pitched rumbling mid-diastolic murmur at the apex, best with the bell in the left lateral position; presystolic accentuation requires organized atrial contraction"],
        ["Late disease","Functional TR, hepatomegaly, edema, ascites, and low-output symptoms"]
      ]))}
      ${section("Auscultatory severity clues",cards([
        {icon:"OS",title:"Short A2–opening snap interval",body:"<p>Higher LA pressure forces the valve open earlier after A2, generally suggesting more severe obstruction while the valve remains mobile.</p>"},
        {icon:"↔",title:"Longer murmur duration",body:"<p>A sustained diastolic gradient extends the rumble and often indicates more severe MS.</p>"},
        {icon:"S1",title:"Soft S1 or absent opening snap",body:"<p>May reflect heavy calcification, immobile leaflets, or associated MR—not mild disease.</p>"},
        {icon:"AF",title:"No presystolic accentuation",body:"<p>Expected in AF because organized atrial contraction is absent.</p>"}
      ]))}
      ${callout("Bedside sequence","Palpate the apex, listen with the diaphragm for S1 and the opening snap, then use the bell lightly at the apex in the left lateral position. Time the murmur against the carotid pulse or S2.","success")}`},

    "ms-investigation":{title:"Mitral Stenosis Investigation",kicker:"Mitral valve · diagnostics",summary:"Echo defines valve morphology, area, gradient, pulmonary pressure, associated MR, and suitability for commissurotomy; TEE excludes left atrial thrombus when needed.",meta:["TTE/Doppler","Valve morphology","LA appendage thrombus"],body:()=>`
      ${section("Core investigations",table(["Test","Typical findings and purpose"],[
        ["ECG","Left atrial enlargement, atrial fibrillation, RV hypertrophy or right-axis deviation in advanced pulmonary hypertension"],
        ["Chest radiograph","Left atrial enlargement, pulmonary venous redistribution or edema, enlarged pulmonary arteries, right-heart enlargement, and valve calcification"],
        ["TTE/Doppler","Valve area, mean gradient, commissural fusion, leaflet/subvalvular morphology, pulmonary pressure, MR severity, and right-heart response"],
        ["TEE","Left atrial appendage thrombus and detailed anatomy when intervention is planned or TTE is inadequate"],
        ["Exercise testing / stress echo","Clarifies symptoms and hemodynamic significance when resting findings and functional status disagree"]
      ]))}
      ${section("Reading the echo in a useful order",numbered([
        "Confirm that obstruction is at the valve rather than a flow murmur or annular narrowing alone.",
        "Assess commissural fusion, leaflet mobility, calcification, and the subvalvular apparatus.",
        "Integrate valve area with mean gradient, heart rate, rhythm, and flow state.",
        "Quantify associated MR because more than mild MR may change suitability for balloon commissurotomy.",
        "Assess LA size/thrombus risk, pulmonary pressure, RV function, and TR."
      ]))}
      ${severityCaution()}`},

    "ms-management":{title:"Mitral Stenosis Management",kicker:"Mitral valve · treatment",summary:"Control congestion and tachycardia, prevent embolism when indicated, and select commissurotomy or surgery according to symptoms, anatomy, thrombus, and associated MR.",meta:["Rate matters","VKA in rheumatic MS + AF","Commissurotomy"],body:()=>`
      ${section("Situation-based management",table(["Situation","Management principles"],[
        ["Congestion","Diuretics and sodium moderation; treat infection, anemia, thyrotoxicosis, or other flow-increasing precipitants"],
        ["Tachycardia or AF","Rate control lengthens diastolic filling time; rhythm strategy is individualized"],
        ["Thromboembolic risk","Vitamin K antagonist for rheumatic MS with AF, LA thrombus, or prior embolism; DOACs are not recommended for rheumatic MS with AF"],
        ["Suitable symptomatic rheumatic MS","Percutaneous mitral commissurotomy when anatomy is favorable, there is no LA thrombus, and MR is no more than mild"],
        ["Unsuitable anatomy / associated disease","Surgery—commissurotomy or replacement—when calcification, significant MR, unfavorable subvalvular disease, or another surgical indication is present"],
        ["Asymptomatic significant MS","Selected intervention may be considered with high embolic risk, pulmonary hypertension, pregnancy planning, or symptoms revealed by exercise testing"]
      ]))}
      ${section("Commissurotomy suitability checklist",cards([
        {icon:"✓",title:"Favorable",body:"<p>Rheumatic commissural fusion, mobile leaflets, limited calcification, manageable subvalvular disease, no LA thrombus, and MR no more than mild.</p>"},
        {icon:"×",title:"Unfavorable",body:"<p>Heavy calcification, absent commissural fusion, significant MR, LA thrombus, severe subvalvular distortion, or need for other cardiac surgery.</p>"},
        {icon:"♥",title:"Pregnancy planning",body:"<p>Significant MS may deteriorate because heart rate and blood volume rise. Pre-pregnancy assessment and timely commissurotomy in suitable patients can prevent decompensation.</p>"}
      ]))}
      ${callout("Do not treat the gradient in isolation","Mean gradient varies with heart rate and flow. A rapid AF episode can make a moderate anatomic lesion look hemodynamically worse; stabilize and interpret the complete study.","warning")}`},

    "mitral-regurgitation":{title:"Mitral Regurgitation",kicker:"Mitral valve · mechanism",summary:"Classify MR by mechanism and time course. Chronic primary MR creates LA/LV volume overload; acute severe MR raises LA pressure abruptly and may cause pulmonary edema and shock.",meta:["Primary vs secondary","Acute vs chronic","Volume overload"],body:()=>`
      ${section("Mechanistic classification",table(["Type","Mechanism","Examples"],[
        ["Primary MR","Intrinsic disease of leaflets, chordae, papillary muscles, or annulus","Degenerative prolapse or flail leaflet, rheumatic disease, endocarditis, connective tissue disease"],
        ["Secondary ventricular MR","Leaflets are structurally near-normal but fail to coapt because LV geometry is abnormal","Ischemic or dilated cardiomyopathy with tethering and annular dilatation"],
        ["Secondary atrial MR","Atrial and annular dilatation impair coaptation despite relatively preserved LV geometry","Long-standing AF or atrial cardiomyopathy"],
        ["Acute MR","Sudden loss of competence before LA/LV adaptation","Papillary muscle rupture after MI, chordal rupture, endocarditis, trauma"],
        ["Chronic MR","Progressive regurgitation with compensatory LA and LV dilatation","Degenerative, rheumatic, or functional disease"]
      ]))}
      ${section("Chronic hemodynamics",flow([{title:"Systolic LV → LA flow",body:"Part of total stroke volume is regurgitant"},{title:"LA accommodation",body:"Dilatation limits pressure rise initially"},{title:"Diastolic return to LV",body:"Regurgitant volume re-enters the ventricle"},{title:"High total stroke volume",body:"Forward output may be preserved early"},{title:"LV dilatation/dysfunction",body:"Contractile reserve eventually fails"}]))}
      ${callout("Acute severe MR is different","A noncompliant LA cannot accommodate sudden regurgitant volume. LA pressure rises abruptly, causing pulmonary edema, hypotension, and sometimes cardiogenic shock. The murmur may be short or soft despite severe disease.","danger")}`},

    "mr-exam":{title:"Mitral Regurgitation Examination",kicker:"Mitral valve · bedside",summary:"Distinguish the compensated chronic volume-overload pattern from acute severe MR, where dramatic pulmonary edema may occur without a displaced apex or loud holosystolic murmur.",meta:["Holosystolic","Axillary radiation","Acute can be quiet"],body:()=>`
      ${section("Chronic versus acute severe MR",table(["Feature","Chronic MR","Acute severe MR"],[
        ["Symptoms","Palpitations, exertional dyspnea, fatigue; later orthopnea, edema, AF","Abrupt dyspnea, pulmonary edema, hypotension, shock"],
        ["Apex","Displaced, hyperdynamic, diffuse in important chronic MR","May not be displaced because there has been no time to remodel"],
        ["S1","Often soft","May be soft; signs can be subtle"],
        ["Murmur","Blowing holosystolic murmur at the apex, usually radiating to the axilla","May be early systolic, short, or less intense than expected"],
        ["Additional findings","S3 from increased early diastolic filling; signs of pulmonary hypertension later","S3, crackles, hypoxemia, and shock may dominate"]
      ]))}
      ${section("Radiation can hint at the jet",cards([
        {icon:"→",title:"Axillary radiation",body:"<p>Classically reflects a posteriorly directed jet, often from anterior leaflet pathology.</p>"},
        {icon:"↑",title:"Toward the base",body:"<p>A posterior leaflet lesion may direct the jet anteriorly, making MR audible near the sternum or base.</p>"},
        {icon:"H",title:"Handgrip",body:"<p>Higher afterload usually increases regurgitant flow and murmur intensity.</p>"}
      ]))}
      ${callout("Red flag","New pulmonary edema after MI plus a new systolic murmur or unexplained shock should raise concern for papillary muscle rupture, even if the murmur is not impressive.","danger")}`},

    "mr-investigation":{title:"Mitral Regurgitation Investigation",kicker:"Mitral valve · imaging",summary:"Echo must do more than label MR: define the mechanism, integrate severity, measure consequences, and determine repairability.",meta:["Mechanism","Integrated severity","Repairability"],body:()=>`
      ${section("Four questions for echo",table(["Question","What the study should define"],[
        ["Mechanism","Prolapse, flail segment, restriction, annular dilatation, ischemic tethering, endocarditis, papillary muscle injury"],
        ["Severity","Integrated assessment using vena contracta, effective regurgitant orifice area, regurgitant volume/fraction, pulmonary venous flow, jet features, and chamber remodeling"],
        ["Consequences","LV and LA size, LVEF, pulmonary pressure, RV function, AF, and secondary TR"],
        ["Repairability","Leaflet segments, calcification, chordal anatomy, coaptation length/depth; 3D imaging when intervention is planned"]
      ]))}
      ${section("Why EF can mislead",cards([
        {icon:"60",title:"An EF of 60% may not be normal reserve",body:"<p>In chronic primary MR, the LV ejects into both the high-pressure aorta and the low-pressure LA. A seemingly preserved LVEF can mask declining contractility.</p>"},
        {icon:"LV",title:"Watch end-systolic size",body:"<p>Progressive enlargement despite few symptoms suggests decompensation and can trigger intervention.</p>"},
        {icon:"CMR",title:"Use CMR when echo is discordant",body:"<p>CMR can quantify LV volumes and regurgitant fraction, especially with eccentric or multiple jets.</p>"}
      ]))}
      ${severityCaution()}`},

    "mr-management":{title:"Mitral Regurgitation Management",kicker:"Mitral valve · intervention",summary:"Urgent surgery is often required for acute severe primary MR. Chronic primary MR favors durable repair; secondary MR first requires optimized treatment of the underlying ventricular or atrial disease.",meta:["Repair preferred","Optimize secondary MR","Urgent acute MR"],body:()=>`
      ${section("Scenario-based approach",table(["Scenario","Management principles"],[
        ["Acute severe primary MR","Stabilize oxygenation and perfusion, use afterload reduction when appropriate, treat ischemia or infection, and obtain urgent surgical/Heart Team evaluation"],
        ["Severe chronic primary MR","Durable valve repair is preferred when likely. Intervene for symptoms and before irreversible LV dysfunction using ventricular, rhythm, pulmonary pressure, and repairability triggers"],
        ["Asymptomatic severe primary MR","Expert serial follow-up; intervene when LV function begins to decline, new AF or pulmonary hypertension develops, or a highly durable low-risk repair is expected in selected patients"],
        ["Secondary MR","Optimize guideline-directed HF therapy, revascularization when indicated, and CRT when appropriate; consider transcatheter edge-to-edge repair or surgery in selected persistently symptomatic patients"],
        ["Congestion / AF","Diuretics for congestion; anticoagulation according to AF and valve-specific indications; manage rate or rhythm individually"]
      ]))}
      ${section("Repair, replacement, transcatheter therapy",cards([
        {icon:"R",title:"Repair",body:"<p>Preserves the subvalvular apparatus and avoids prosthesis-related burdens when a durable result is achievable.</p>"},
        {icon:"P",title:"Replacement",body:"<p>Used when anatomy is not durably repairable, the valve is heavily diseased, or associated pathology makes replacement more appropriate.</p>"},
        {icon:"T",title:"Transcatheter edge-to-edge repair",body:"<p>For selected primary or secondary MR based on anatomy, symptoms, ventricular status, procedural risk, and Heart Team assessment.</p>"}
      ]))}
      ${callout("Complications to prevent","AF and embolism, pulmonary hypertension, functional TR, progressive LV dysfunction, infective endocarditis, and sudden collapse from papillary muscle or chordal rupture.","warning")}`},

    mvp:{title:"Mitral Valve Prolapse",kicker:"Mitral valve · click-murmur syndrome",summary:"MVP is systolic displacement of one or both leaflets into the left atrium. Most cases are uncomplicated, but significant MR or arrhythmic features require structured assessment.",meta:["Mid-systolic click","Dynamic timing","Arrhythmic subgroup"],body:()=>`
      ${section("Classic pattern",table(["Domain","Key points"],[
        ["Symptoms","Most patients are asymptomatic; some report atypical chest discomfort, palpitations, dizziness, or anxiety-like symptoms"],
        ["Classic sign","Mid-systolic click from sudden tensing of the prolapsing apparatus, followed by a late systolic murmur when MR is present"],
        ["Standing / Valsalva","Reduced LV volume moves the click earlier and lengthens the murmur"],
        ["Squatting / leg raise","Increased LV volume moves the click later and shortens the murmur"],
        ["Diagnosis","Echo confirms prolapse, defines MR severity, and identifies flail leaflet or high-risk morphology"],
        ["Management","Reassurance when uncomplicated; symptom control when appropriate; manage important MR according to severity and repairability"]
      ]))}
      ${section("Arrhythmic MVP: when reassurance is not enough",cards([
        {icon:"⚡",title:"Clinical red flags",body:"<p>Syncope, documented complex ventricular ectopy, sustained ventricular arrhythmia, or a family history of sudden death.</p>"},
        {icon:"E",title:"Imaging red flags",body:"<p>Severe myxomatous disease, flail leaflet, significant MR, or specialist-defined high-risk structural features.</p>"},
        {icon:"→",title:"Action",body:"<p>Obtain specialist evaluation rather than labeling symptoms as benign solely because MVP is common.</p>"}
      ]))}
      ${callout("Dynamic rule","Less LV volume makes prolapse occur earlier in systole. More LV volume delays leaflet prolapse. This explains the click and murmur changes with standing and squatting.","success")}`},

    "aortic-stenosis":{title:"Aortic Stenosis",kicker:"Aortic valve · mechanism and bedside",summary:"Fixed LV outflow obstruction causes concentric hypertrophy, impaired coronary reserve, and eventually low output and heart failure. The classic syndrome is angina, syncope, and dyspnea.",meta:["Pressure overload","Parvus et tardus","Carotid radiation"],body:()=>`
      ${section("Causes and mechanism",table(["Cause","Typical context"],[
        ["Calcific degenerative","Most common in older adults; progressive leaflet calcification and restriction"],
        ["Bicuspid aortic valve","Earlier stenosis with possible ascending aortic disease; family assessment may be relevant"],
        ["Rheumatic","Commissural fusion, often with mitral disease and mixed AS/AR"],
        ["Subvalvular / supravalvular obstruction","Not true valvular AS but can produce a similar ejection murmur and pressure load"]
      ])+flow([{title:"Fixed obstruction",body:"High LV systolic pressure"},{title:"Concentric hypertrophy",body:"Wall stress is initially normalized"},{title:"Stiff LV",body:"Diastolic filling pressure rises"},{title:"Coronary reserve falls",body:"Demand rises while perfusion reserve declines"},{title:"Decompensation",body:"Low output, pulmonary congestion, LV dysfunction"}]))}
      ${section("Classic clinical syndrome",cards([
        {icon:"A",title:"Exertional angina",body:"<p>Raised LV oxygen demand, reduced coronary reserve, and possible coexisting coronary disease.</p>"},
        {icon:"S",title:"Exertional syncope",body:"<p>Fixed cardiac output cannot rise sufficiently during exercise or peripheral vasodilation.</p>"},
        {icon:"D",title:"Dyspnea / heart failure",body:"<p>Elevated filling pressure and progressive systolic or diastolic dysfunction.</p>"},
        {icon:"P",title:"Parvus et tardus",body:"<p>Slow-rising, low-amplitude carotid pulse in severe high-gradient AS.</p>"}
      ]))}
      ${section("Examination",table(["Finding","Description"],[
        ["Apex","Sustained/heaving impulse from pressure overload; may become displaced with late dilatation"],
        ["Murmur","Harsh crescendo-decrescendo ejection systolic murmur, maximal at the right upper sternal border and radiating to the carotids"],
        ["A2","Soft, delayed, or absent in advanced calcific disease; paradoxical splitting may occur"],
        ["Additional sounds","Ejection click with a mobile congenital valve; S4 from a stiff hypertrophied LV; S3 with failure"],
        ["Severity caveat","A soft murmur does not exclude severe AS in low-flow states"]
      ]))}`},

    "as-severity":{title:"Aortic Stenosis Severity & Low-Flow States",kicker:"Aortic valve · diagnostics",summary:"Severe AS is usually supported by high velocity, high mean gradient, and small valve area—but discordant studies require careful flow, pressure, and measurement analysis.",meta:["Vmax ≥4 m/s","Mean gradient ≥40 mmHg","AVA ≤1.0 cm²"],body:()=>`
      ${section("Typical severe thresholds",table(["Parameter","Typical severe value","Interpretation note"],[
        ["Peak aortic jet velocity","≥4.0 m/s","Flow-dependent; ensure correct Doppler alignment and sample from multiple windows"],
        ["Mean transvalvular gradient","≥40 mmHg","Flow-dependent; interpret with rhythm, blood pressure, and stroke volume"],
        ["Aortic valve area","≤1.0 cm²","Interpret with flow and body size; continuity-equation errors can create discordance"],
        ["Very severe AS","Often Vmax ≥5.0 m/s or mean gradient ≥60 mmHg","One high-risk feature among several; symptoms and ventricular response remain central"]
      ]))}
      ${section("When the numbers disagree",flow([{title:"Recheck quality",body:"Doppler alignment, LVOT diameter, rhythm averaging"},{title:"Check blood pressure",body:"Hypertension alters flow and gradients"},{title:"Measure flow",body:"Stroke-volume index and transvalvular flow rate"},{title:"Assess LVEF",body:"Reduced vs preserved EF low-flow pattern"},{title:"Add testing",body:"Dobutamine stress echo or CT calcium when appropriate"},{title:"Integrate",body:"Symptoms, valve anatomy, LV response, alternative diagnoses"}]))}
      ${section("Low-flow patterns",cards([
        {icon:"L",title:"Classical low-flow, low-gradient",body:"<p>Reduced LVEF produces low forward flow, so gradient may remain below 40 mmHg despite a small calculated valve area. Dobutamine stress echo may distinguish true severe from pseudo-severe obstruction.</p>"},
        {icon:"P",title:"Paradoxical low-flow, low-gradient",body:"<p>Preserved LVEF with small, concentrically remodeled LV and reduced stroke volume. Confirm measurements and consider CT calcium scoring and expert review.</p>"},
        {icon:"N",title:"Normal-flow, low-gradient",body:"<p>Often reflects measurement discordance or nonsevere disease, but requires a systematic review rather than dismissal.</p>"}
      ]))}
      ${severityCaution()}`},

    "as-management":{title:"Aortic Stenosis Intervention",kicker:"Aortic valve · management",summary:"Symptomatic severe AS generally requires valve replacement. TAVI versus SAVR is a lifetime Heart Team decision—not a single age or surgical-risk rule.",meta:["AVR for symptomatic severe AS","TAVI vs SAVR","No drug reverses AS"],body:()=>`
      ${section("Situation-based management",table(["Situation","Approach"],[
        ["Symptomatic severe AS","Aortic valve replacement is indicated unless intervention is futile because of severe comorbidity or limited expected benefit"],
        ["Asymptomatic severe AS","Close surveillance; earlier intervention may be considered with LV systolic dysfunction, abnormal exercise test, very severe stenosis, rapid progression, or other high-risk markers"],
        ["TAVI versus SAVR","Shared Heart Team decision based on age, life expectancy, surgical risk, transfemoral access, valve/aortic-root anatomy, coronary access, durability, concomitant disease, and lifetime valve strategy"],
        ["Medical therapy","No drug reverses fixed severe AS. Treat hypertension carefully, manage congestion, AF, and coronary disease, and avoid unexplained delay in referral"]
      ]))}
      ${section("TAVI vs SAVR: reasoning domains",cards([
        {icon:"A",title:"Anatomy and access",body:"<p>Transfemoral feasibility, bicuspid morphology, annulus, aorta, coronary height/access, calcium distribution, and need for another surgical procedure.</p>"},
        {icon:"L",title:"Lifetime strategy",body:"<p>Expected longevity, prosthesis durability, future coronary access, pacemaker risk, and feasibility of redo or valve-in-valve procedures.</p>"},
        {icon:"P",title:"Patient priorities",body:"<p>Recovery, anticoagulation preferences, frailty, comorbidity, goals of care, and informed choice.</p>"}
      ]))}
      ${callout("High-yield cautions",bullets(["Do not grade AS by murmur intensity alone.","Apparently asymptomatic patients may reveal symptoms or abnormal blood pressure response on supervised exercise testing.","Bicuspid disease requires assessment of the ascending aorta as well as the valve.","LVEF may improve after AVR when afterload mismatch is the dominant mechanism."]),"warning")}`},

    "aortic-regurgitation":{title:"Aortic Regurgitation",kicker:"Aortic valve · mechanism",summary:"Chronic AR causes LV volume overload, dilatation, high total stroke volume, and wide pulse pressure. Acute severe AR rapidly raises LV diastolic pressure and is a surgical emergency.",meta:["Leaflet or aortic-root disease","Volume overload","Acute emergency"],body:()=>`
      ${section("Causes",table(["Mechanism","Examples"],[
        ["Leaflet disease","Bicuspid valve, rheumatic disease, infective endocarditis, fenestration or prolapse, trauma"],
        ["Aortic-root / ascending-aorta disease","Hypertension, Marfan or Loeys-Dietz syndrome, bicuspid aortopathy, inflammatory aortitis, aneurysm"],
        ["Acute aortic catastrophe","Aortic dissection, endocarditis, traumatic cusp disruption"]
      ]))}
      ${section("Chronic hemodynamics",flow([{title:"Diastolic aorta → LV flow",body:"Regurgitant volume enters the LV"},{title:"LV dilatation",body:"Eccentric remodeling accommodates volume"},{title:"High total stroke volume",body:"Systolic pressure and pulse amplitude rise"},{title:"Low aortic diastolic pressure",body:"Wide pulse pressure and reduced coronary perfusion pressure"},{title:"Decompensation",body:"LV dysfunction, congestion, low forward output"}]))}
      ${callout("Acute severe AR is an emergency","A short early-diastolic murmur, tachycardia, pulmonary edema, and shock may occur without classic chronic peripheral signs. The nonadapted LV develops a rapid rise in diastolic pressure, compromising forward output and mitral inflow. Urgent surgical assessment is required.","danger")}
      ${section("Symptoms",cards([
        {icon:"♥",title:"Forceful heartbeat",body:"<p>Awareness of a bounding pulse or prominent pulsation is common in chronic significant AR.</p>"},
        {icon:"D",title:"Dyspnea and fatigue",body:"<p>Progress as LV filling pressure rises and forward reserve declines.</p>"},
        {icon:"A",title:"Angina",body:"<p>May reflect high LV oxygen demand and reduced diastolic coronary perfusion pressure.</p>"}
      ]))}`},

    "ar-signs":{title:"Aortic Regurgitation Pulse & Auscultation",kicker:"Aortic valve · bedside",summary:"The chronic AR examination reflects a large stroke volume and low diastolic pressure, but peripheral signs are supportive—not decisive—and may be absent in acute AR.",meta:["Wide pulse pressure","Early diastolic decrescendo","Austin Flint"],body:()=>`
      ${section("Pulse and peripheral signs",table(["Domain","Findings"],[
        ["Pulse and BP","Wide pulse pressure; bounding or collapsing pulse; pulsus bisferiens may occur in severe AR or mixed AS/AR"],
        ["Head and neck","Visible carotid pulsation; head bobbing (de Musset sign) in marked chronic disease"],
        ["Peripheral signs","Capillary pulsation, femoral pistol-shot sounds, Duroziez murmur, and exaggerated leg-arm systolic pressure difference"],
        ["Apex","Displaced, diffuse, hyperdynamic impulse from LV volume overload"]
      ]))}
      ${section("Auscultation",table(["Sound","Description"],[
        ["Primary AR murmur","High-pitched blowing early diastolic decrescendo murmur, usually best along the left sternal border with the patient sitting forward at end-expiration"],
        ["Flow murmur","Ejection systolic murmur from increased forward stroke volume across the aortic valve"],
        ["Austin Flint murmur","Low-pitched apical mid-diastolic murmur in severe AR caused by interference with mitral inflow; no opening snap"],
        ["S2","May be soft if the valve is diseased; can remain normal when root dilatation is the main mechanism"]
      ]))}
      ${callout("Peripheral signs are supportive, not decisive","Classic eponymous signs are most likely in severe chronic AR with a large stroke volume. Their absence does not exclude important disease, especially in acute AR or when another lesion raises diastolic pressure.","warning")}
      ${section("MS versus Austin Flint",table(["Feature","Mitral stenosis","Austin Flint murmur"],[
        ["Mechanism","Fixed mitral inflow obstruction","Severe AR jet interferes with mitral inflow"],
        ["Opening snap","May be present with mobile rheumatic leaflets","Absent"],
        ["Other clues","Tapping apex, loud S1, LA/pulmonary hypertension pattern","Bounding pulse, wide pulse pressure, primary AR murmur"],
        ["Echo","Organic valve narrowing","Severe AR without fixed rheumatic MS"]
      ]))}`},

    "ar-management":{title:"Aortic Regurgitation Management",kicker:"Aortic valve · intervention",summary:"Treat acute severe AR urgently. In chronic severe AR, intervene for symptoms or objective LV decompensation before irreversible dysfunction; aortic-root decisions add diameter and growth-rate considerations.",meta:["Urgent acute surgery","LV surveillance","Aortic-root strategy"],body:()=>`
      ${section("Investigation",table(["Test","What to assess"],[
        ["TTE/Doppler","Valve morphology, root and ascending aorta, AR severity, LV size and systolic function"],
        ["TEE","Mechanism, endocarditis, dissection, or surgical planning when TTE is insufficient"],
        ["CT or CMR","Aortic dimensions; CMR regurgitant volume/fraction and LV volumes when echo is discordant"],
        ["Serial imaging","Rate of LV dilatation, change in EF, and aortic enlargement"]
      ]))}
      ${section("Management",table(["Scenario","Management principles"],[
        ["Acute severe AR","Urgent surgery after rapid stabilization; treat the cause such as dissection or endocarditis"],
        ["Symptomatic severe chronic AR","Aortic valve surgery is indicated when symptoms are attributable to AR"],
        ["Asymptomatic severe AR","Intervene when LV systolic function declines or LV end-systolic size reaches guideline thresholds; monitor closely before symptoms develop"],
        ["Aortic-root disease","Repair or replacement decisions incorporate aortic diameter, growth rate, genetic syndrome, bicuspid anatomy, family history, and need for valve surgery"],
        ["Medical therapy","Treat hypertension, often with vasodilating agents; diuretics for congestion. Medical therapy does not replace timely surgery in severe disease"]
      ]))}
      ${callout("Acute AR caution","Intra-aortic balloon counterpulsation is generally unsuitable in important AR because diastolic inflation can worsen regurgitant flow. Management belongs with an emergency Heart Team.","danger")}`},

    "aortic-compare":{title:"Aortic Stenosis vs Aortic Regurgitation",kicker:"Aortic valve · rapid comparison",summary:"Use load, pulse, apex, murmur timing, radiation, and symptom mechanism to distinguish the two major aortic valve syndromes.",meta:["Pressure vs volume","Slow vs bounding pulse","Systolic vs diastolic"],body:()=>`
      ${section("Side-by-side",table(["Feature","Aortic stenosis","Aortic regurgitation"],[
        ["Primary load","LV pressure overload","LV volume overload"],
        ["Remodeling","Concentric hypertrophy; stiff LV","Eccentric dilatation; high total stroke volume"],
        ["Apex","Sustained/heaving","Hyperdynamic and displaced"],
        ["Pulse","Slow-rising, low volume","Bounding/collapsing with wide pulse pressure"],
        ["Murmur","Ejection systolic crescendo-decrescendo","Early diastolic decrescendo"],
        ["Best site/radiation","Right upper sternal border → carotids","Left sternal border → toward apex"],
        ["Classic symptoms","Angina, syncope, dyspnea","Palpitations/forceful pulsation, dyspnea, angina"],
        ["Key intervention concept","AVR for symptomatic severe disease and selected high-risk asymptomatic disease","Operate for symptoms or before irreversible LV dysfunction; include aortic-root strategy"]
      ]))}
      ${section("Memory anchors",compareBars([
        {label:"Pressure load",value:95,note:"AS"},{label:"Volume load",value:95,note:"AR"},{label:"Pulse delay",value:90,note:"AS"},{label:"Pulse amplitude",value:95,note:"AR"}
      ]))}
      ${routeLinks([["severity-lab","Practice severity reasoning"],["murmur-lab","Practice murmur identification"]])}`},

    "tricuspid-stenosis":{title:"Tricuspid Stenosis",kicker:"Right-sided valve disease",summary:"TS is uncommon and usually rheumatic. It raises right atrial pressure, limits RV filling, and produces systemic venous congestion with a right-sided diastolic murmur.",meta:["Usually rheumatic","Prominent a waves","Inspiration increases"],body:()=>`
      ${section("Core pattern",table(["Domain","Findings"],[
        ["Causes","Usually rheumatic and often associated with mitral disease; carcinoid, congenital, inflammatory, or infiltrative causes are less common"],
        ["Hemodynamics","Obstruction raises RA pressure, limits RV filling, and reduces forward pulmonary flow"],
        ["Symptoms/signs","Fatigue, abdominal discomfort, edema, ascites, hepatomegaly, elevated JVP with prominent a waves"],
        ["Murmur","Low-pitched mid-diastolic or presystolic murmur at the lower left sternal border, increasing with inspiration"],
        ["Investigation","Echo confirms thickening, doming, gradient, valve area, and associated lesions"],
        ["Treatment","Diuretics for congestion; intervention for severe symptomatic disease, often during surgery for another valve"]
      ]))}
      ${callout("Differentiate from MS","Both are low-pitched diastolic rumbles, but TS is lower sternal, intensifies with inspiration, and is supported by prominent a waves and systemic venous congestion rather than a dominant pulmonary venous syndrome.","success")}`},

    "tricuspid-regurgitation":{title:"Tricuspid Regurgitation",kicker:"Right-sided valve disease",summary:"Most TR is secondary to RV, RA, or annular dilatation. The bedside signature is a lower sternal holosystolic murmur that increases with inspiration, large v waves, and systolic hepatic pulsation.",meta:["Usually secondary","Carvallo sign","Large v waves"],body:()=>`
      ${section("Causes",table(["Type","Examples"],[
        ["Secondary/functional - most common","RV or RA dilatation from pulmonary hypertension, left-sided valve disease, AF, or RV dysfunction"],
        ["Primary","Endocarditis, carcinoid, congenital disease, rheumatic disease, trauma, device-lead injury, or leaflet prolapse"]
      ]))}
      ${section("Hemodynamic chain",flow([{title:"Systolic RV → RA flow",body:"Regurgitant volume enters RA"},{title:"Large v waves",body:"Systolic RA pressure rises"},{title:"Venous/hepatic pulsation",body:"Pressure transmits to neck veins and liver"},{title:"Systemic congestion",body:"Ascites, edema, effusions"},{title:"RV failure + low output",body:"Late decompensation"}]))}
      ${section("Examination",table(["Finding","Description"],[
        ["JVP","Prominent systolic v waves and rapid y descent; neck veins may visibly pulsate"],
        ["Liver","Enlarged, tender, and systolically pulsatile; late cardiac cirrhosis may develop"],
        ["Edema/ascites","Ascites can be prominent; peripheral edema and pleural effusions may occur"],
        ["Murmur","Holosystolic murmur at the lower left sternal border that increases with inspiration—Carvallo sign"],
        ["Cardiac impulse","RV heave and possible systolic thrill; AF is common in advanced disease"]
      ]))}
      ${callout("Carcinoid clue","Flushing and diarrhea together with combined tricuspid and pulmonary valve disease strongly suggest carcinoid heart disease. Left-sided involvement is less common unless there is a right-to-left shunt or overwhelming tumor burden.","warning")}`},

    "right-sided-management":{title:"Right-Sided Valve Evaluation & Management",kicker:"Tricuspid disease",summary:"Define whether disease is primary or secondary, treat the drivers, and consider intervention before severe RV dysfunction or irreversible liver and kidney injury.",meta:["Mechanism first","Treat drivers","Do not wait for end-organ failure"],body:()=>`
      ${section("Practical approach",table(["Step","What to do"],[
        ["Define mechanism","Assess leaflet structure, annulus, RV and RA size, pulmonary pressure, device leads, and left-sided lesions"],
        ["Treat drivers","Manage left-sided valve disease, causes of pulmonary hypertension, AF, and heart failure; use diuretics for congestion"],
        ["Measure consequences","RV size/function, hepatic and renal status, exercise capacity, venous congestion, and rhythm"],
        ["Time intervention","Consider repair or replacement before severe RV dysfunction, advanced pulmonary vascular disease, or irreversible end-organ damage"],
        ["Concomitant surgery","Tricuspid repair is often performed during left-sided valve surgery when TR is significant or the annulus is dilated"],
        ["Transcatheter therapy","An option for selected symptomatic high-risk patients with suitable anatomy in experienced centres"]
      ]))}
      ${section("Why late TR is difficult",cards([
        {icon:"RV",title:"RV reserve can fall silently",body:"<p>Symptoms may be attributed to edema or left-sided disease until RV dysfunction is advanced.</p>"},
        {icon:"L",title:"Congestion injures organs",body:"<p>Persistent venous pressure contributes to hepatic fibrosis, renal dysfunction, gut edema, malnutrition, and frailty.</p>"},
        {icon:"↗",title:"Earlier referral preserves options",body:"<p>Repair is more likely to succeed before severe tethering, massive annular dilatation, or advanced pulmonary vascular disease.</p>"}
      ]))}`},

    "prosthetic-valves":{title:"Prosthetic Valves",kicker:"Valve replacement",summary:"Choose a prosthesis through shared decision-making, then recognize thrombosis, structural degeneration, paravalvular leak, endocarditis, and patient-prosthesis mismatch.",meta:["Mechanical vs bioprosthetic","Lifetime strategy","Dysfunction patterns"],body:()=>`
      ${section("Choosing a prosthesis",table(["Feature","Mechanical valve","Bioprosthetic valve"],[
        ["Durability","Very durable","Limited by structural valve degeneration"],
        ["Anticoagulation","Lifelong vitamin K antagonist","Usually no lifelong VKA unless another indication exists"],
        ["Bleeding burden","Higher because of lifelong anticoagulation","Lower long-term anticoagulation burden"],
        ["Reintervention","Less structural degeneration, but thrombosis or pannus can occur","Valve-in-valve may be possible in selected degeneration"],
        ["Typical fit","Often younger patients who accept anticoagulation and have no contraindication","Often older patients or those in whom lifelong anticoagulation is undesirable"],
        ["Pregnancy implications","Complex maternal-fetal anticoagulation trade-offs","Avoids mechanical-valve thrombosis risk but has limited durability"]
      ]))}
      ${section("Prosthetic dysfunction",table(["Problem","Clues and response"],[
        ["Thrombosis","Rising gradients, restricted leaflet motion, embolism, acute symptoms; urgent imaging and specialist treatment"],
        ["Structural degeneration","Progressive stenosis or regurgitation years after implantation; consider redo surgery or valve-in-valve therapy"],
        ["Paravalvular leak","Regurgitation around the sewing ring, hemolysis, heart failure; evaluate for infection and consider repair or closure"],
        ["Prosthetic endocarditis","Fever, bacteremia, new dysfunction, abscess, embolism; multidisciplinary endocarditis/valve-team management"],
        ["Patient-prosthesis mismatch","Persistently high gradient despite normally functioning prosthesis because effective orifice is too small for body size"]
      ]))}
      ${callout("New symptom + prosthetic valve","Treat new dyspnea, embolism, syncope, fever, hemolysis, or a changed prosthetic sound as a reason for prompt imaging—not routine follow-up.","danger")}`},

    "anticoagulation-ie":{title:"Anticoagulation & Endocarditis Prevention",kicker:"Special management",summary:"Mechanical valves and rheumatic MS with AF require vitamin K antagonist strategies. Endocarditis prophylaxis is restricted to defined high-risk cardiac conditions and relevant procedures.",meta:["VKA for mechanical valves","No DOAC for rheumatic MS + AF","High-risk dental prophylaxis only"],body:()=>`
      ${section("Antithrombotic principles",numbered([
        "Mechanical prosthetic valves require vitamin K antagonist therapy; direct oral anticoagulants are contraindicated.",
        "Rheumatic mitral stenosis with atrial fibrillation is treated with a vitamin K antagonist rather than a DOAC.",
        "For other native valve lesions with AF, anticoagulation is based on thromboembolic risk and guideline-specific considerations.",
        "Early antithrombotic treatment after surgical or transcatheter bioprosthetic implantation depends on valve position, procedure, bleeding risk, rhythm, and local protocol.",
        "Suspected prosthetic thrombosis or embolism requires urgent imaging and specialist management rather than empiric dose changes alone."
      ]))}
      ${section("Infective endocarditis prevention",table(["Recommended emphasis","What it means"],[
        ["Oral and skin hygiene","Regular dental care, prompt treatment of infection, and avoidance of unsterile invasive procedures"],
        ["High-risk prophylaxis only","Antibiotic prophylaxis before relevant dental procedures for selected patients at highest risk of poor IE outcomes"],
        ["High-risk examples","Prosthetic valve or valve-repair material, previous infective endocarditis, certain congenital heart diseases, and selected transplant recipients with valve disease according to guideline definitions"],
        ["Not routine","No routine prophylaxis for uncomplicated native valve disease or isolated MVP"]
      ]))}
      ${callout("Dental procedure concept","The high-risk dental procedures are those involving manipulation of gingival tissue, the periapical region of teeth, or perforation of oral mucosa. Exact antibiotic choice and eligibility must follow current local guidance.","warning")}`},

    "pregnancy-mixed":{title:"Pregnancy, Mixed & Multiple Valve Disease",kicker:"Special situations",summary:"Pregnancy amplifies flow and heart rate, making stenotic lesions—especially MS—harder to tolerate. Mixed disease must be interpreted by its dominant physiology and combined ventricular burden.",meta:["Pre-pregnancy planning","Mechanical-valve anticoagulation","Dominant physiology"],body:()=>`
      ${section("Pregnancy and valve disease",table(["Issue","Key point"],[
        ["Mitral stenosis","Often poorly tolerated because pregnancy increases heart rate and blood volume, raising the transmitral gradient and pulmonary pressure"],
        ["Mechanical valve","Requires expert anticoagulation planning because maternal thrombosis and fetal risks differ among regimens"],
        ["Severe AS or aortopathy","Pre-pregnancy risk assessment is essential; intervention may be needed before conception"],
        ["Regurgitant lesions","Often tolerated better than fixed stenosis when LV function is preserved, but severe disease or ventricular dysfunction raises risk"],
        ["Team care","High-risk patients need coordinated cardiology, maternal-fetal medicine, anesthesia, and cardiac surgery input"]
      ]))}
      ${section("Mixed and multiple disease",cards([
        {icon:"±",title:"Find the dominant lesion",body:"<p>Mixed AS/AR may produce both pressure and volume overload. Do not expect every classic sign to be present.</p>"},
        {icon:"Σ",title:"Add the total burden",body:"<p>Moderate lesions at multiple valves may create severe hemodynamic consequences even when no single measurement reaches a classic severe threshold.</p>"},
        {icon:"↔",title:"One lesion alters another",body:"<p>Severe MR lowers forward flow and can reduce the gradient across AS; severe TR can reduce pulmonary forward flow and mask left-sided findings.</p>"},
        {icon:"H",title:"Heart Team planning",body:"<p>Sequence and choice of interventions depend on symptoms, ventricular function, pulmonary pressure, anatomy, surgical needs, and transcatheter options.</p>"}
      ]))}
      ${severityCaution()}`},

    emergencies:{title:"Valve Emergencies",kicker:"Recognize and escalate",summary:"Acute severe regurgitation, obstructed prostheses, endocarditis complications, and decompensated severe stenosis can deteriorate rapidly and may have deceptively subtle murmurs.",meta:["Acute MR","Acute AR","Prosthetic obstruction"],body:()=>`
      ${section("Emergency patterns",table(["Emergency","Clues","Immediate priorities"],[
        ["Acute severe MR","Abrupt pulmonary edema, hypotension, new systolic murmur after MI or chordal rupture; murmur may be short/soft","Oxygenation and perfusion, afterload reduction when appropriate, urgent echo/TEE, surgical Heart Team"],
        ["Acute severe AR","Pulmonary edema, tachycardia, shock, early diastolic murmur; consider dissection or endocarditis","Rapid echo and aortic imaging when indicated, stabilize, urgent surgery; avoid delay for classic peripheral signs"],
        ["Prosthetic valve thrombosis/obstruction","Sudden dyspnea, embolism, changed mechanical sounds, rising gradient, restricted leaflet motion","Urgent TTE/TEE or CT/fluoroscopy as appropriate and specialist treatment"],
        ["Endocarditis with valve destruction","Fever/bacteremia plus new regurgitation, HF, abscess, conduction block, or emboli","Cultures, antibiotics, urgent endocarditis/valve-team assessment and surgery when indicated"],
        ["Decompensated severe AS","Syncope, pulmonary edema, low output or shock in known/suspected severe AS","Careful stabilization, urgent echo, avoid abrupt hemodynamic changes, specialist valve/shock team"],
        ["Papillary muscle rupture","Acute MR after MI, pulmonary edema, shock; murmur may be unimpressive","Immediate mechanical complication pathway and urgent surgery"]
      ]))}
      ${section("Why a quiet murmur can be dangerous",cards([
        {icon:"↓",title:"Low forward flow",body:"<p>Less flow across severe AS can reduce murmur intensity.</p>"},
        {icon:"=",title:"Rapid pressure equalization",body:"<p>Acute MR may stop producing a long pressure gradient, shortening the murmur.</p>"},
        {icon:"⚠",title:"Look at physiology",body:"<p>Shock, hypoxemia, pulmonary edema, perfusion, pulse pressure, and echo matter more than sound intensity.</p>"}
      ]))}
      ${callout("Educational safety note","This module is for recognition and revision, not a treatment protocol. Unstable patients require emergency local pathways and specialist care.","danger")}`},

    "revision-matrix":{title:"High-Yield Revision Matrix",kicker:"One-page synthesis",summary:"Compare the major lesions by load, pulse or venous waveform, apex, murmur, associated sounds, and intervention concept.",meta:["Exam summary","Murmur locations","Clinical pearls"],body:()=>`
      ${section("Major valve lesions",table(["Lesion","Primary load","Pulse / apex / JVP","Murmur","Key intervention concept"],[
        ["MS","LA pressure overload","Tapping apex; AF common","Apical mid-diastolic rumble + opening snap","Percutaneous commissurotomy when symptomatic and suitable"],
        ["MR","LA/LV volume overload","Hyperdynamic displaced apex","Apical holosystolic murmur → axilla","Durable repair preferred for suitable primary MR"],
        ["AS","LV pressure overload","Parvus et tardus; sustained apex","Ejection systolic → carotids","AVR for symptomatic severe disease and selected high-risk asymptomatic disease"],
        ["AR","LV volume overload","Bounding pulse; hyperdynamic displaced apex","Early diastolic decrescendo at left sternal border","Operate for symptoms or before irreversible LV dysfunction"],
        ["TS","RA pressure overload","Prominent a waves; systemic congestion","Lower sternal diastolic rumble, louder on inspiration","Treat severe symptomatic disease, often with other valve surgery"],
        ["TR","RA/RV volume overload","Large v waves; pulsatile liver","Lower sternal holosystolic murmur, louder on inspiration","Treat drivers and intervene before advanced RV/end-organ damage"]
      ]))}
      ${section("Systolic murmurs by location",table(["Location","Important causes"],[
        ["Apex","MR; transmitted AS; HCM; VSD or TR may be audible depending on anatomy"],
        ["Right upper sternal border","AS, aortic sclerosis, high-flow ejection murmur"],
        ["Left upper sternal border","Pulmonary stenosis, ASD flow murmur, increased pulmonary flow"],
        ["Lower left sternal border","TR, VSD, HCM"],
        ["Back / interscapular","Coarctation and collateral flow"]
      ]))}
      ${section("Diastolic murmurs by location",table(["Location","Important causes"],[
        ["Apex","MS, Austin Flint murmur, increased transmitral flow"],
        ["Left sternal border","AR, pulmonary regurgitation, Graham Steell murmur"],
        ["Lower left sternal border","TS"],
        ["Continuous or mixed","PDA, arteriovenous fistula, venous hum; coarctation collateral murmurs may extend through systole and diastole"]
      ]))}
      ${callout("Six examination pearls",numbered([
        "A diastolic murmur is pathologic until proved otherwise.",
        "A soft murmur does not guarantee mild disease.",
        "Timing and duration often carry more information than loudness.",
        "Use pulse, apex, JVP, S2, clicks, opening snaps, and gallops to support the diagnosis.",
        "When clinical and echo findings disagree, reassess image quality, loading conditions, flow state, and multiple lesions.",
        "Refer severe disease before irreversible ventricular, pulmonary vascular, hepatic, or renal damage."
      ]),"success")}`},

    "hemodynamics-lab":{title:"Hemodynamics Lab",kicker:"Interactive reasoning",summary:"Choose a valve and lesion type to visualize the direction of abnormal flow, the loaded chambers, expected remodeling, and key bedside clues.",meta:["Mechanism simulator","Chamber response","Bedside translation"],body:()=>`
      ${section("Build the lesion",`<div class="tool-panel interactive-only" id="hemodynamics-tool">
        <div class="tool-controls">
          <label class="field"><span>Valve lesion</span><select id="hemo-lesion">${lesionProfiles.map(x=>`<option value="${x.id}">${x.name}</option>`).join("")}</select></label>
          <label class="field"><span>Focus</span><select id="hemo-focus"><option value="sequence">Hemodynamic sequence</option><option value="exam">Examination clues</option><option value="load">Chamber load and remodeling</option></select></label>
        </div><div class="tool-output" id="hemo-output" aria-live="polite"></div>
      </div><noscript><p>This lab requires JavaScript. The static lesion profiles remain available in the revision matrix.</p></noscript>`,"Change the selections and explain the result before reading the generated reasoning." )}
      ${section("Transfer rule",callout("From mechanics to bedside","Ask: where is the abnormal pressure or volume going, which chamber must adapt, and what pulse or venous waveform should result? This reasoning remains useful even when the exact murmur is atypical.","purple"))}`},

    "murmur-lab":{title:"Murmur Decoder",kicker:"Interactive reasoning",summary:"Enter timing, site, radiation, and inspiratory response. The decoder ranks compatible valve lesions and explains the pattern rather than returning a bare label.",meta:["Pattern matching","Ranked differential","Explanations"],body:()=>`
      ${section("Describe the murmur",`<div class="tool-panel interactive-only" id="murmur-tool">
        <div class="tool-controls">
          <label class="field"><span>Timing</span><select id="murmur-timing"><option value="systolic">Systolic</option><option value="diastolic">Diastolic</option><option value="late-systolic">Late systolic / click</option></select></label>
          <label class="field"><span>Maximum site</span><select id="murmur-site"><option value="apex">Apex</option><option value="rusb">Right upper sternal border</option><option value="lsb">Left sternal border</option><option value="llsb">Lower left sternal border</option></select></label>
          <label class="field"><span>Radiation</span><select id="murmur-radiation"><option value="none">Localized / none</option><option value="axilla">Axilla</option><option value="carotids">Carotids</option><option value="apex">Toward apex</option></select></label>
          <label class="field"><span>Inspiration</span><select id="murmur-inspiration"><option value="same">No clear increase</option><option value="increase">Clearly increases</option></select></label>
        </div><div class="tool-output" id="murmur-output" aria-live="polite"></div>
      </div>`,"Use it after describing a real or written murmur in full." )}
      ${callout("Decoder limitation","The tool is a teaching aid, not auscultation software. It does not incorporate age, pulse, clicks, S2, JVP, mixed lesions, flow murmurs, or imaging.","warning")}`},

    "maneuver-lab":{title:"Maneuver Lab",kicker:"Interactive reasoning",summary:"Select a lesion and maneuver to predict whether the murmur becomes louder, softer, earlier, later, longer, or shorter—and why.",meta:["Preload","Afterload","Dynamic timing"],body:()=>`
      ${section("Predict before revealing",`<div class="tool-panel interactive-only" id="maneuver-tool">
        <div class="tool-controls">
          <label class="field"><span>Lesion</span><select id="maneuver-lesion">${lesionProfiles.map(x=>`<option value="${x.id}">${x.name}</option>`).join("")}</select></label>
          <label class="field"><span>Maneuver</span><select id="maneuver-choice">${maneuversData.map(x=>`<option value="${x.id}">${x.name}</option>`).join("")}</select></label>
        </div><div class="tool-output" id="maneuver-output" aria-live="polite"></div>
      </div>`,"State your prediction aloud, then compare it with the explanation." )}
      ${section("Mechanism anchors",cards([
        {icon:"P",title:"Preload down",body:"<p>Standing/Valsalva makes the LV smaller: most flow murmurs soften, HCM intensifies, and MVP occurs earlier.</p>"},
        {icon:"P+",title:"Preload up",body:"<p>Squatting or leg raise increases filling: most flow murmurs intensify, HCM softens, and MVP occurs later.</p>"},
        {icon:"A",title:"Afterload up",body:"<p>Handgrip favors backward flow in MR and AR while reducing the relative intensity of AS.</p>"},
        {icon:"R",title:"Right return up",body:"<p>Inspiration amplifies right-sided murmurs, especially TR and TS.</p>"}
      ]))}`},

    "severity-lab":{title:"Severity Reasoning Lab",kicker:"Interactive reasoning",summary:"Apply classic thresholds to AS and MS, then practice recognizing when regurgitation or discordant data cannot be reduced to one number.",meta:["AS thresholds","MS area","Integrated regurgitation"],body:()=>`
      ${section("Enter measurements",`<div class="tool-panel interactive-only" id="severity-tool">
        <div class="button-row" role="tablist" aria-label="Severity lab lesion"><button class="choice-button active" data-severity-tab="as" type="button">Aortic stenosis</button><button class="choice-button" data-severity-tab="ms" type="button">Mitral stenosis</button><button class="choice-button" data-severity-tab="regurg" type="button">Regurgitation</button></div>
        <div id="severity-controls" class="tool-controls" style="margin-top:1rem"></div><div class="tool-output" id="severity-output" aria-live="polite"></div>
      </div>`,"The result gives a reasoning category, not a treatment order." )}
      ${severityCaution()}`},

    "clinical-cases":{title:"Clinical Cases",kicker:"Case-based revision",summary:"Work through twelve cases spanning murmurs, acute decompensation, intervention timing, prosthetic complications, pregnancy, and mixed lesions.",meta:["12 cases","Progressive disclosure","Model reasoning"],body:()=>`
      ${section("Case navigator",`<div id="case-lab" class="case-shell interactive-only"><div class="case-list" id="case-list"></div><div class="case-card" id="case-card" aria-live="polite"></div></div>`,"Open each reasoning step only after committing to an answer." )}`},

    flashcards:{title:"Flashcards",kicker:"Active recall",summary:"Use sectioned flip cards with keyboard support, category filtering, shuffle, and local “know it / review again” tracking.",meta:["72 cards","Click or press Enter to flip","Progress saved locally"],body:()=>`
      ${section("Sectioned flashcard deck",`<div id="flashcard-app" class="interactive-only">
        <div class="flash-toolbar"><div class="button-row"><label class="field"><span>Category</span><select id="flash-category"></select></label><button class="secondary-button" id="flash-shuffle" type="button">Shuffle</button><button class="secondary-button" id="flash-reset" type="button">Reset ratings</button></div><div><strong id="flash-count"></strong><br><span class="muted small" id="flash-stats"></span></div></div>
        <div class="flash-stage" id="flash-stage"></div>
      </div>`,"The card front asks one focused question; the back gives a compact model answer." )}`},

    quiz:{title:"Scored Quiz",kicker:"Exam-style revision",summary:"Complete 36 single-best-answer questions. Explanations emphasize mechanism and common traps; score and position are saved locally.",meta:["36 questions","Immediate explanations","Restart anytime"],body:()=>`
      ${section("Quiz",`<div id="quiz-app" class="interactive-only"><div class="quiz-toolbar"><div><strong id="quiz-progress"></strong><div class="result-meter"><span id="quiz-meter"></span></div></div><div class="button-row"><button class="secondary-button" id="quiz-restart" type="button">Restart quiz</button></div></div><div id="quiz-stage"></div></div>`,"Answer before opening the explanation; use the wrong options as differential-diagnosis practice." )}`},

    sources:{title:"Sources, Scope & Original PDF",kicker:"Transparency",summary:"The site is an educational synthesis of the supplied reconstructed chapter, with official guideline portals linked for current clinical reference.",meta:["Original PDF embedded","Official references","Educational use"],body:()=>`
      ${section("Original supplied chapter",`<div class="button-row interactive-only" style="margin-bottom:1rem"><a class="primary-button" href="valvular-heart-disease-source.pdf" target="_blank" rel="noopener">Open source PDF</a><a class="secondary-button" href="valvular-heart-disease-source.pdf" download>Save a copy</a></div><object class="pdf-frame" data="valvular-heart-disease-source.pdf" type="application/pdf"><p>Your browser could not embed the PDF. <a href="valvular-heart-disease-source.pdf">Open it directly.</a></p></object>`)}
      ${section("Reference framework",`<div class="source-grid">
        <article class="source-card"><h3>Supplied reconstructed chapter</h3><p>Primary content base for the detailed educational pages, comparisons, and revision tools.</p><a href="valvular-heart-disease-source.pdf" target="_blank" rel="noopener">Open the local PDF</a></article>
        <article class="source-card"><h3>2025 ESC/EACTS valvular heart disease guideline portal</h3><p>Current European guideline resources, Heart Team framework, imaging, intervention, prosthetic valves, and special situations.</p><a href="https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/valvular-heart-disease/" target="_blank" rel="noopener">Open ESC guideline portal</a></article>
        <article class="source-card"><h3>ACC/AHA valvular heart disease guideline hub</h3><p>US guideline, executive summaries, decision tools, and clinical perspectives.</p><a href="https://www.acc.org/guidelines/hubs/valvular-heart-disease" target="_blank" rel="noopener">Open ACC guideline hub</a></article>
        <article class="source-card"><h3>American Heart Association: infective endocarditis</h3><p>Patient and clinician-facing overview of high-risk dental prophylaxis and prevention.</p><a href="https://www.heart.org/en/health-topics/infective-endocarditis" target="_blank" rel="noopener">Open AHA resource</a></article>
      </div>`)}
      ${callout("Scope and safety","This site supports study and structured revision. It does not provide patient-specific diagnosis, drug dosing, procedural eligibility, or emergency management. Current local protocols and specialist judgment take precedence.","warning")}`}
  };

  const cases = [
    {title:"Progressive rheumatic mitral stenosis",tag:"Mitral stenosis",stem:"A 36-year-old woman has progressive exertional dyspnea and palpitations. Pulse is irregular. The apex is tapping. S1 is loud, followed by an opening snap and an apical mid-diastolic rumble.",clues:["Irregular pulse","Opening snap","Apical diastolic rumble","Tapping apex"],question:"Identify the lesion and explain why exercise and rapid AF worsen symptoms.",diagnosis:"Rheumatic mitral stenosis with atrial fibrillation.",reasoning:"The murmur and opening snap identify fixed mitral inflow obstruction. Tachycardia shortens diastole, forcing blood across the narrowed valve in less time and increasing the transmitral gradient and left atrial pressure.",action:"TTE/Doppler to define valve area, gradient, morphology, pulmonary pressure, MR, and RV response; evaluate thromboembolic risk and rate control. If symptomatic severe rheumatic MS with favorable anatomy, no LA thrombus, and no more than mild MR, percutaneous commissurotomy is a key option.",pearl:"Presystolic accentuation disappears in AF because organized atrial contraction is absent."},
    {title:"Acute MR after myocardial infarction",tag:"Mitral regurgitation",stem:"Two days after an inferior myocardial infarction, a 68-year-old man develops abrupt pulmonary edema and hypotension. A new apical systolic murmur is present but is not very loud.",clues:["Recent MI","Abrupt pulmonary edema","Shock","New but soft systolic murmur"],question:"What mechanical complication must be assumed until excluded?",
      diagnosis:"Acute severe mitral regurgitation from papillary muscle rupture or severe papillary muscle dysfunction.",reasoning:"Acute MR enters a noncompliant LA, causing a large pressure rise and pulmonary edema. Rapid LV-LA pressure equalization may shorten and soften the murmur, so intensity does not reflect severity.",action:"Emergency echo/TEE, hemodynamic stabilization, treatment of ischemia, and urgent surgical/Heart Team evaluation.",pearl:"A quiet murmur in shock is not reassuring."},
    {title:"Chronic primary MR approaching decompensation",tag:"Mitral regurgitation",stem:"A 57-year-old patient with known degenerative MR reports only mild fatigue. Echo shows severe eccentric MR, progressive LV enlargement, and an LVEF of 60%.",clues:["Severe primary MR","Few symptoms","Progressive LV enlargement","LVEF 60%"],question:"Why can an LVEF of 60% already be concerning?",
      diagnosis:"Severe chronic primary MR with possible early LV decompensation.",reasoning:"The LV ejects into both the aorta and the low-pressure LA. This unloading can preserve the measured EF despite declining contractile reserve. Progressive end-systolic enlargement and falling EF are intervention triggers.",action:"Expert valve-center assessment for durable repair rather than reassurance based on EF alone.",pearl:"In primary MR, 'normal EF' has a higher expected range than in a normal valve."},
    {title:"Classic severe aortic stenosis",tag:"Aortic stenosis",stem:"A 76-year-old man has exertional chest pressure and one syncopal episode. Carotid pulse is slow-rising and low volume. There is a harsh ejection systolic murmur at the right upper sternal border radiating to both carotids.",clues:["Exertional angina","Syncope","Parvus et tardus","Carotid radiation"],question:"What is the likely lesion and management direction?",
      diagnosis:"Symptomatic severe aortic stenosis until quantified by echo.",reasoning:"The classic symptom triad and examination identify fixed LV outflow obstruction. Symptoms imply a poor natural history without valve replacement when severe AS is confirmed.",action:"Urgent comprehensive echo and Heart Team assessment for AVR, with TAVI versus SAVR chosen by anatomy, access, life expectancy, surgical risk, concomitant disease, and lifetime strategy.",pearl:"No drug reverses fixed severe AS."},
    {title:"Low-flow, low-gradient AS",tag:"Aortic stenosis",stem:"A patient with LVEF 30% has a calculated aortic valve area of 0.8 cm² but a mean gradient of 28 mmHg. The Doppler study is technically acceptable.",clues:["Reduced LVEF","Small valve area","Gradient below 40 mmHg","Possible low flow"],question:"Why are the numbers discordant and what test may help?",
      diagnosis:"Possible classical low-flow, low-gradient AS.",reasoning:"Low stroke volume may fail to generate a high gradient even when the valve is truly severe. Alternatively, the valve may open more with increased flow, indicating pseudo-severe disease.",action:"Confirm stroke volume and measurements; consider dobutamine stress echo and other expert imaging as appropriate.",pearl:"Gradient is flow-dependent."},
    {title:"Chronic aortic regurgitation",tag:"Aortic regurgitation",stem:"A 45-year-old patient reports forceful heartbeats and exertional dyspnea. BP is 164/54 mmHg. The pulse is bounding, the apex is displaced and hyperdynamic, and a high-pitched early diastolic murmur is heard along the left sternal border.",clues:["Wide pulse pressure","Bounding pulse","Hyperdynamic displaced apex","Early diastolic decrescendo"],question:"Explain the hemodynamics behind the pulse findings.",diagnosis:"Chronic significant aortic regurgitation.",reasoning:"Diastolic regurgitation raises LV end-diastolic volume. The dilated LV ejects a high total stroke volume, increasing systolic pressure, while runoff back into the LV lowers aortic diastolic pressure, producing a wide pulse pressure and bounding pulse.",action:"Echo to define mechanism, severity, LV size/function, and aortic-root dimensions; serial monitoring or intervention according to symptoms and LV response.",pearl:"Peripheral signs support severity but do not replace imaging."},
    {title:"Acute AR from dissection",tag:"Aortic regurgitation",stem:"A 59-year-old develops sudden tearing chest pain, hypotension, pulmonary edema, and a short early diastolic murmur. The pulse pressure is not wide.",clues:["Tearing pain","Shock","Pulmonary edema","No chronic peripheral signs"],question:"What diagnosis must be urgently considered?",
      diagnosis:"Acute severe AR due to proximal aortic dissection until excluded.",reasoning:"The LV has no time to dilate, so LV diastolic pressure rises abruptly. Classic chronic wide-pulse-pressure signs may be absent.",action:"Emergency aortic imaging, echo, stabilization, and urgent cardiothoracic surgery pathway.",pearl:"Absence of a bounding pulse does not exclude acute severe AR."},
    {title:"Secondary tricuspid regurgitation",tag:"Tricuspid regurgitation",stem:"A patient with pulmonary hypertension has worsening ascites and edema. JVP shows giant systolic v waves. The liver is pulsatile. A lower left sternal holosystolic murmur becomes louder on inspiration.",clues:["Pulmonary hypertension","Large v waves","Pulsatile liver","Carvallo sign"],question:"Identify the lesion and its likely mechanism.",diagnosis:"Severe secondary tricuspid regurgitation from RV/annular dilatation.",reasoning:"Systolic RV-to-RA flow produces large v waves and transmits pulsation to the liver. Inspiration increases right-heart venous return and regurgitant flow.",action:"Define leaflet/annular anatomy, RV/RA size and function, pulmonary pressure, and left-sided drivers; treat congestion and causes, and assess intervention before advanced RV or end-organ damage.",pearl:"TR is most often secondary rather than primary leaflet disease."},
    {title:"Prosthetic valve obstruction",tag:"Prosthetic valves",stem:"A patient with a mechanical mitral valve develops sudden dyspnea and an embolic event. The usual closing sound is less distinct. Echo shows a new high gradient.",clues:["Mechanical valve","Acute dyspnea","Embolism","Changed prosthetic sound"],question:"What complication is most concerning?",
      diagnosis:"Mechanical prosthetic valve thrombosis or obstructive pannus, with thrombosis especially concerning in the acute setting.",reasoning:"Restricted leaflet motion raises gradients and can cause acute congestion and embolism. The differential and treatment depend on valve position, obstruction, thrombus burden, symptoms, and surgical risk.",action:"Urgent specialist imaging with TTE/TEE and complementary fluoroscopy or CT as appropriate; emergency valve-team management.",pearl:"DOACs are contraindicated for mechanical prosthetic valves."},
    {title:"Dental prophylaxis misconception",tag:"Special issues",stem:"A patient with uncomplicated native mild MR asks for antibiotics before every dental cleaning because of the murmur.",clues:["Native mild MR","No prior IE","No prosthetic material","Routine dental care"],question:"Is routine antibiotic prophylaxis indicated solely because of MR?",
      diagnosis:"No. Native MR alone is not a high-risk indication for routine IE prophylaxis.",reasoning:"Modern prevention emphasizes oral health and restricts prophylaxis to selected high-risk cardiac conditions before relevant dental procedures.",action:"Encourage regular dental care and confirm eligibility only if another high-risk condition is present.",pearl:"Good oral hygiene is more broadly important than indiscriminate antibiotics."},
    {title:"Pregnancy with mitral stenosis",tag:"Pregnancy",stem:"A woman with moderate-to-severe rheumatic MS plans pregnancy. She is currently minimally symptomatic but becomes tachycardic with mild exertion.",clues:["Rheumatic MS","Pregnancy planning","Tachycardia-sensitive lesion","Few resting symptoms"],question:"Why is pre-pregnancy assessment essential?",
      diagnosis:"Significant MS at risk of decompensation during pregnancy.",reasoning:"Pregnancy increases blood volume and heart rate. Higher flow and shorter diastole increase the transmitral gradient and pulmonary pressure.",action:"Pre-pregnancy valve-center and maternal-fetal assessment; quantify severity, exercise response, pulmonary pressure, rhythm, and commissurotomy suitability.",pearl:"Stenotic lesions generally tolerate increased pregnancy flow less well than regurgitant lesions with preserved ventricular function."},
    {title:"Mixed AS and AR",tag:"Mixed disease",stem:"A patient has a harsh systolic murmur to the carotids, an early diastolic murmur, a mildly wide pulse pressure, and a displaced but also sustained apex. Echo reports moderate AS and moderate AR with marked LV remodeling.",clues:["Systolic and diastolic murmurs","Mixed pulse/apex findings","Two moderate lesions","Marked remodeling"],question:"Why can the overall disease be clinically important despite no single 'severe' label?",
      diagnosis:"Hemodynamically significant mixed aortic valve disease.",reasoning:"The LV faces both pressure and volume overload. Combined moderate lesions can create a severe total burden, and each lesion alters the hemodynamic expression of the other.",action:"Expert integrated assessment of symptoms, LV response, flow, aortic anatomy, and intervention timing rather than isolated thresholds.",pearl:"In mixed disease, grade the total physiology, not only each lesion in isolation."}
  ];

  const flashcards = [
    {tag:"Foundations",q:"What is the dominant hemodynamic load in valve stenosis?",a:"Pressure overload upstream from the narrowed valve, producing a pressure gradient and hypertrophy or atrial enlargement."},
    {tag:"Foundations",q:"What is the dominant hemodynamic load in valve regurgitation?",a:"Volume overload of the receiving chamber and usually the ventricle, causing dilatation before later dysfunction."},
    {tag:"Foundations",q:"Why can acute regurgitation be worse than chronic regurgitation of similar volume?",a:"The receiving chamber has not dilated or become compliant, so pressure rises abruptly and causes pulmonary edema, low output, or shock."},
    {tag:"Foundations",q:"Name the seven elements of a structured murmur description.",a:"Timing, maximum site, character/pitch, radiation, intensity/duration, response to maneuvers, and associated findings."},
    {tag:"Foundations",q:"What does stage C valve disease mean?",a:"Severe valve dysfunction without attributable symptoms; ventricular compensation may be preserved or beginning to fail."},
    {tag:"Foundations",q:"What does stage D valve disease mean?",a:"Severe valve dysfunction with symptoms attributable to the lesion."},
    {tag:"Foundations",q:"Which test is first-line for defining valve anatomy and hemodynamics?",a:"Transthoracic echocardiography with Doppler."},
    {tag:"Foundations",q:"When is CMR especially useful in valve disease?",a:"When echo is discordant or inadequate for ventricular volumes and regurgitant fraction, and for tissue or aortic assessment."},
    {tag:"Foundations",q:"Why should one discordant severity number not determine management?",a:"Severity must integrate anatomy, flow, rhythm, loading conditions, chamber response, symptoms, and measurement quality."},

    {tag:"Murmurs & maneuvers",q:"Which murmurs usually become louder with inspiration?",a:"Right-sided murmurs, especially tricuspid regurgitation and tricuspid stenosis."},
    {tag:"Murmurs & maneuvers",q:"What is Carvallo sign?",a:"Inspiratory augmentation of the tricuspid regurgitation murmur."},
    {tag:"Murmurs & maneuvers",q:"What does sustained handgrip usually do to MR and AR?",a:"It increases systemic afterload and usually makes MR and AR louder."},
    {tag:"Murmurs & maneuvers",q:"What does standing or Valsalva do to the MVP click?",a:"It reduces LV volume, so the click occurs earlier and the murmur lengthens."},
    {tag:"Murmurs & maneuvers",q:"What does squatting do to the MVP click and murmur?",a:"It increases LV volume, moving the click later and shortening the murmur."},
    {tag:"Murmurs & maneuvers",q:"What is the best position to hear mitral stenosis?",a:"Left lateral position with the bell lightly at the apex."},
    {tag:"Murmurs & maneuvers",q:"What is the best position to hear aortic regurgitation?",a:"Sitting forward at end-expiration, listening along the left sternal border."},
    {tag:"Murmurs & maneuvers",q:"Why is a diastolic murmur important?",a:"A diastolic murmur is pathologic until proved otherwise."},
    {tag:"Murmurs & maneuvers",q:"Why is murmur loudness an unreliable severity marker?",a:"Low flow or rapid pressure equalization can make severe AS or acute severe MR deceptively quiet."},

    {tag:"Mitral stenosis",q:"What is the classic worldwide cause of true mitral stenosis?",a:"Rheumatic heart disease with commissural fusion."},
    {tag:"Mitral stenosis",q:"What valve area is generally considered clinically significant rheumatic MS?",a:"About 1.5 cm² or less; near or below 1.0 cm² is usually severe."},
    {tag:"Mitral stenosis",q:"State the hemodynamic sequence of mitral stenosis.",a:"Mitral obstruction → raised LA pressure → pulmonary venous congestion → pulmonary hypertension → RV dysfunction and functional TR."},
    {tag:"Mitral stenosis",q:"Why does tachycardia worsen mitral stenosis?",a:"It shortens diastole, increasing the flow rate and gradient across the narrowed valve."},
    {tag:"Mitral stenosis",q:"What causes the opening snap in mitral stenosis?",a:"Abrupt opening and tensing of a still-mobile stenotic mitral valve after A2."},
    {tag:"Mitral stenosis",q:"What does a short A2-opening snap interval suggest?",a:"Higher LA pressure and generally more severe MS, provided the leaflets remain mobile."},
    {tag:"Mitral stenosis",q:"Why does presystolic accentuation disappear in AF?",a:"There is no organized atrial contraction to increase late-diastolic flow."},
    {tag:"Mitral stenosis",q:"When is percutaneous mitral commissurotomy attractive?",a:"Symptomatic rheumatic MS with favorable anatomy, no LA thrombus, and no more than mild MR."},
    {tag:"Mitral stenosis",q:"Which anticoagulant class is used for rheumatic MS with AF?",a:"A vitamin K antagonist; DOACs are not recommended for rheumatic MS with AF."},

    {tag:"Mitral regurgitation",q:"What is primary mitral regurgitation?",a:"MR caused by intrinsic disease of the leaflets, chordae, papillary muscles, or annulus."},
    {tag:"Mitral regurgitation",q:"What is secondary mitral regurgitation?",a:"MR caused by abnormal ventricular or atrial geometry despite near-normal leaflets."},
    {tag:"Mitral regurgitation",q:"What is the classic chronic MR murmur?",a:"A blowing holosystolic murmur at the apex, classically radiating to the axilla."},
    {tag:"Mitral regurgitation",q:"Why may acute severe MR have a short or soft murmur?",a:"LV and LA pressures equalize quickly, shortening the systolic pressure gradient."},
    {tag:"Mitral regurgitation",q:"What are classic causes of acute severe MR?",a:"Papillary muscle rupture after MI, chordal rupture, infective endocarditis, or trauma."},
    {tag:"Mitral regurgitation",q:"Why can LVEF 60% indicate impaired reserve in chronic primary MR?",a:"The LV ejects into a low-pressure LA as well as the aorta, making ejection easier and masking contractile decline."},
    {tag:"Mitral regurgitation",q:"What procedure is preferred for suitable chronic primary MR?",a:"Durable mitral valve repair rather than replacement."},
    {tag:"Mitral regurgitation",q:"What is the first management step for secondary MR?",a:"Optimize the underlying HF/ischemic/rhythm disease, including guideline-directed therapy and CRT or revascularization when appropriate."},
    {tag:"Mitral regurgitation",q:"What is the classic sound of MVP?",a:"A mid-systolic click followed by a late systolic murmur if MR is present."},

    {tag:"Aortic stenosis",q:"What is the classic symptom triad of severe AS?",a:"Exertional angina, syncope, and dyspnea or heart failure."},
    {tag:"Aortic stenosis",q:"What is pulsus parvus et tardus?",a:"A slow-rising, low-amplitude carotid pulse associated with severe high-gradient AS."},
    {tag:"Aortic stenosis",q:"Describe the AS murmur.",a:"Harsh crescendo-decrescendo ejection systolic murmur at the right upper sternal border radiating to the carotids."},
    {tag:"Aortic stenosis",q:"What remodeling does AS cause?",a:"Concentric LV hypertrophy from pressure overload, followed by diastolic dysfunction and eventual decompensation."},
    {tag:"Aortic stenosis",q:"What peak velocity typically supports severe AS?",a:"At least 4.0 m/s."},
    {tag:"Aortic stenosis",q:"What mean gradient typically supports severe AS?",a:"At least 40 mmHg."},
    {tag:"Aortic stenosis",q:"What valve area typically supports severe AS?",a:"1.0 cm² or less, interpreted with body size and flow."},
    {tag:"Aortic stenosis",q:"Why can severe AS have a low gradient?",a:"Low stroke volume may fail to generate a high velocity/gradient despite a severely restricted valve."},
    {tag:"Aortic stenosis",q:"What is the definitive treatment direction for symptomatic severe AS?",a:"Aortic valve replacement unless intervention is futile."},

    {tag:"Aortic regurgitation",q:"Name the two broad mechanisms of chronic AR.",a:"Leaflet disease and aortic-root or ascending-aorta disease."},
    {tag:"Aortic regurgitation",q:"Why does chronic AR produce wide pulse pressure?",a:"High total stroke volume raises systolic pressure while diastolic runoff into the LV lowers diastolic pressure."},
    {tag:"Aortic regurgitation",q:"Describe the primary AR murmur.",a:"High-pitched blowing early diastolic decrescendo murmur along the left sternal border."},
    {tag:"Aortic regurgitation",q:"What is an Austin Flint murmur?",a:"A low-pitched apical mid-diastolic murmur in severe AR caused by interference with mitral inflow, without an opening snap."},
    {tag:"Aortic regurgitation",q:"Why may acute severe AR lack bounding pulses?",a:"There has been no time for LV dilatation and a high total stroke volume; shock may dominate."},
    {tag:"Aortic regurgitation",q:"What are important causes of acute severe AR?",a:"Aortic dissection, infective endocarditis, and traumatic cusp disruption."},
    {tag:"Aortic regurgitation",q:"What are the intervention triggers in chronic severe AR?",a:"Attributable symptoms or objective LV decompensation, with aortic-root criteria added when relevant."},
    {tag:"Aortic regurgitation",q:"Are peripheral eponymous signs required to diagnose severe AR?",a:"No. They are supportive and may be absent, especially in acute AR."},
    {tag:"Aortic regurgitation",q:"What imaging modality can quantify regurgitant fraction when echo is discordant?",a:"Cardiac magnetic resonance."},

    {tag:"Tricuspid disease",q:"What is the most common mechanism of TR?",a:"Secondary/functional TR from RV, RA, or annular dilatation."},
    {tag:"Tricuspid disease",q:"What JVP waveform is typical of severe TR?",a:"Large systolic v waves with a rapid y descent."},
    {tag:"Tricuspid disease",q:"What hepatic sign supports severe TR?",a:"An enlarged, systolically pulsatile liver."},
    {tag:"Tricuspid disease",q:"Describe the TR murmur.",a:"A lower left sternal holosystolic murmur that increases with inspiration."},
    {tag:"Tricuspid disease",q:"What is the usual cause of tricuspid stenosis?",a:"Rheumatic disease, often accompanying mitral stenosis."},
    {tag:"Tricuspid disease",q:"What JVP finding is typical of TS?",a:"Prominent a waves from right atrial contraction against the stenotic valve."},
    {tag:"Tricuspid disease",q:"What combination suggests carcinoid heart disease?",a:"Flushing and diarrhea with combined tricuspid and pulmonary valve disease."},
    {tag:"Tricuspid disease",q:"Why should TR not be left until advanced RV failure?",a:"Late RV dysfunction, pulmonary vascular disease, and hepatic/renal injury may become irreversible and reduce procedural benefit."},
    {tag:"Tricuspid disease",q:"What should be assessed before calling TR primary?",a:"Leaflets, annulus, RV/RA size, pulmonary pressure, device leads, left-sided lesions, AF, and heart failure."},

    {tag:"Prostheses & special",q:"What anticoagulant is required for a mechanical prosthetic valve?",a:"Lifelong vitamin K antagonist therapy."},
    {tag:"Prostheses & special",q:"Are DOACs appropriate for mechanical valves?",a:"No. They are contraindicated."},
    {tag:"Prostheses & special",q:"What clues suggest prosthetic valve thrombosis?",a:"Rising gradient, restricted leaflet motion, embolism, changed prosthetic sounds, or acute symptoms."},
    {tag:"Prostheses & special",q:"What is patient-prosthesis mismatch?",a:"A normally functioning prosthesis whose effective orifice is too small for the patient's body size, causing persistently high gradients."},
    {tag:"Prostheses & special",q:"Who is at highest risk and may receive dental IE prophylaxis?",a:"Selected patients such as those with prosthetic valves/repair material, previous IE, certain CHD, or selected transplant valve disease."},
    {tag:"Prostheses & special",q:"Does uncomplicated native MR require routine IE prophylaxis?",a:"No."},
    {tag:"Prostheses & special",q:"Why is MS often poorly tolerated in pregnancy?",a:"Pregnancy increases heart rate and blood volume, raising transmitral flow and gradient."},
    {tag:"Prostheses & special",q:"What is the key principle in mixed valve disease?",a:"Assess the dominant lesion and the combined hemodynamic/chamber burden rather than isolated thresholds alone."},
    {tag:"Prostheses & special",q:"Name three valve emergencies.",a:"Acute severe MR, acute severe AR, and obstructed/thrombosed prosthetic valve; destructive endocarditis and decompensated severe AS are also emergencies."}
  ];

  const quiz = [
    {q:"Which hemodynamic change most directly characterizes valvular stenosis?",options:["Volume overload of the downstream ventricle","Pressure gradient across the valve","Reduced systemic vascular resistance","Primary pericardial constraint"],answer:1,explanation:"Stenosis obstructs forward flow and creates a pressure gradient. The chamber upstream faces pressure load or enlargement depending on location."},
    {q:"A diastolic murmur should generally be considered:",options:["Physiologic in young adults","Pathologic until proved otherwise","Benign if grade 1/6","Only important if symptomatic"],answer:1,explanation:"Diastolic murmurs are abnormal. Low intensity does not make them benign."},
    {q:"Which maneuver most characteristically increases a tricuspid regurgitation murmur?",options:["Expiration","Inspiration","Valsalva strain","Standing"],answer:1,explanation:"Inspiration increases systemic venous return to the right heart, augmenting TR (Carvallo sign)."},
    {q:"Sustained handgrip usually increases which murmur?",options:["Aortic stenosis","Mitral regurgitation","Hypertrophic cardiomyopathy","Pulmonary stenosis"],answer:1,explanation:"Handgrip raises afterload and tends to increase regurgitant flow in MR and AR."},
    {q:"Standing causes the click of mitral valve prolapse to occur:",options:["Earlier in systole","Later in systole","Only during diastole","At the same time"],answer:0,explanation:"Standing reduces LV volume, so prolapse and chordal tension occur earlier; the murmur lengthens."},
    {q:"Which finding is most characteristic of rheumatic mitral stenosis?",options:["Wide pulse pressure","Opening snap followed by apical diastolic rumble","Holosystolic murmur to the axilla","Ejection click radiating to carotids"],answer:1,explanation:"A mobile stenotic rheumatic mitral valve produces an opening snap and low-pitched apical mid-diastolic rumble."},
    {q:"Why does rapid atrial fibrillation worsen mitral stenosis?",options:["It lengthens diastole","It reduces transmitral flow","It shortens diastole and raises the gradient","It directly ruptures chordae"],answer:2,explanation:"A shorter diastolic filling period requires faster flow through the narrowed valve, increasing gradient and LA pressure."},
    {q:"Presystolic accentuation of the MS murmur is absent in AF because:",options:["A2 is absent","There is no organized atrial contraction","The valve becomes normal","Pulmonary pressure falls"],answer:1,explanation:"Presystolic accentuation depends on atrial contraction, which is absent in AF."},
    {q:"Which condition favors percutaneous mitral commissurotomy?",options:["Heavy calcification and severe MR","LA thrombus","Favorable rheumatic commissural fusion with no more than mild MR","Degenerative annular stenosis without commissural fusion"],answer:2,explanation:"Commissurotomy is best suited to favorable rheumatic anatomy without LA thrombus or significant MR."},
    {q:"For rheumatic MS with AF, the preferred anticoagulant class is:",options:["Aspirin only","Vitamin K antagonist","DOAC in all patients","No anticoagulation"],answer:1,explanation:"Rheumatic MS with AF is treated with a vitamin K antagonist rather than a DOAC."},
    {q:"A patient develops pulmonary edema and shock after MI. The new MR murmur is soft. The best interpretation is:",options:["MR is mild","Soft murmurs exclude rupture","Acute severe MR may be quiet because pressures equalize rapidly","This must be aortic stenosis"],answer:2,explanation:"Acute MR can be short or soft despite catastrophic hemodynamics. Papillary muscle rupture must be excluded urgently."},
    {q:"Which statement best defines secondary MR?",options:["Leaflet infection","Intrinsic chordal degeneration","Failure of near-normal leaflets to coapt because ventricular or atrial geometry is abnormal","Congenital absence of the mitral valve"],answer:2,explanation:"Secondary MR is caused by chamber/annular geometry rather than primary leaflet disease."},
    {q:"In chronic primary MR, an LVEF of 60% may be concerning because:",options:["MR always lowers EF to zero","The LV ejects into a low-pressure LA, masking contractile decline","EF cannot be measured in MR","Only RV function matters"],answer:1,explanation:"The low-pressure regurgitant outlet makes ejection easier, so apparently preserved EF may conceal reduced reserve."},
    {q:"The preferred intervention for suitable severe primary MR is usually:",options:["Durable valve repair","Long-term diuretics alone","Routine balloon commissurotomy","No follow-up"],answer:0,explanation:"Repair is preferred when durable and feasible because it preserves native valve/subvalvular function and avoids prosthesis burdens."},
    {q:"The first major strategy for secondary MR is:",options:["Immediate replacement in every case","Optimize HF, ischemia, rhythm, and CRT/revascularization when appropriate","Antibiotic prophylaxis","Stop all vasodilators"],answer:1,explanation:"Treat the underlying ventricular/atrial disease first; transcatheter or surgical intervention is selected for persistent symptoms and suitable anatomy."},
    {q:"Which pulse finding supports severe high-gradient AS?",options:["Bounding collapsing pulse","Pulsus parvus et tardus","Large v waves","Water-hammer pulse with wide pressure"],answer:1,explanation:"Severe AS delays and reduces the carotid upstroke."},
    {q:"The classic AS murmur is best described as:",options:["Apical mid-diastolic rumble","Right upper sternal ejection systolic murmur radiating to carotids","Left sternal early diastolic murmur","Lower sternal holosystolic murmur increasing with inspiration"],answer:1,explanation:"This is the classic auscultatory pattern of valvular AS."},
    {q:"Which combination typically supports severe AS?",options:["Vmax 2.0 m/s, gradient 10 mmHg","Vmax ≥4.0 m/s, mean gradient ≥40 mmHg, AVA ≤1.0 cm²","AVA 3.0 cm² only","Wide pulse pressure"],answer:1,explanation:"These are common severe thresholds, interpreted in the context of flow, body size, and measurement quality."},
    {q:"A small AVA with low gradient and reduced EF suggests:",options:["No valve disease","Classical low-flow, low-gradient AS requiring further evaluation","Acute MR","Tricuspid stenosis"],answer:1,explanation:"Low flow may conceal a high gradient; dobutamine stress echo can help distinguish true severe from pseudo-severe AS."},
    {q:"The definitive management direction for symptomatic severe AS is:",options:["Valve replacement unless futile","Antibiotics only","Observe for ten years","Handgrip training"],answer:0,explanation:"Symptomatic severe AS generally requires AVR after Heart Team assessment."},
    {q:"Which factor is least appropriate as the sole determinant of TAVI versus SAVR?",options:["Anatomy and access","Life expectancy and lifetime strategy","Patient goals","A single age cutoff without context"],answer:3,explanation:"Selection is individualized across anatomy, access, durability, coronary access, comorbidity, surgical needs, and preferences."},
    {q:"Wide pulse pressure in chronic AR results from:",options:["Low systolic and high diastolic pressure","High total stroke volume plus diastolic runoff into the LV","Only tachycardia","RV outflow obstruction"],answer:1,explanation:"Systolic pressure rises from high total stroke volume while diastolic pressure falls from regurgitant runoff."},
    {q:"The primary AR murmur is:",options:["Early diastolic decrescendo at the left sternal border","Holosystolic at apex to axilla","Mid-diastolic with opening snap","Continuous machinery murmur"],answer:0,explanation:"AR produces a high-pitched early diastolic decrescendo murmur, often best sitting forward at end-expiration."},
    {q:"An Austin Flint murmur is caused by:",options:["True rheumatic MS in every case","Severe AR interfering with mitral inflow","Tricuspid stenosis","Aortic coarctation"],answer:1,explanation:"The AR jet functionally interferes with mitral inflow, creating an apical diastolic rumble without an opening snap."},
    {q:"Which is most concerning for acute severe AR?",options:["Long history of bounding pulse only","Sudden chest pain, shock, pulmonary edema, and a short diastolic murmur","Stable asymptomatic bicuspid valve","Isolated S4"],answer:1,explanation:"Acute AR from dissection or endocarditis can cause rapid hemodynamic collapse and requires urgent surgery."},
    {q:"Peripheral eponymous signs in AR are:",options:["Required to diagnose acute AR","Supportive but not decisive","Always present in mild disease","More reliable than echo"],answer:1,explanation:"They are most likely in severe chronic AR with high stroke volume but can be absent in acute or mixed disease."},
    {q:"Which JVP finding is typical of severe TR?",options:["Absent a waves only","Large systolic v waves","Cannon a waves from AV dissociation only","No venous change"],answer:1,explanation:"Systolic regurgitant flow into the RA produces prominent v waves."},
    {q:"The most common form of TR is:",options:["Primary rheumatic leaflet fusion","Secondary functional TR from chamber/annular dilatation","Congenital absence in all adults","Always carcinoid"],answer:1,explanation:"Most TR is secondary to RV/RA/annular dilatation from pulmonary hypertension, left-sided disease, AF, or RV dysfunction."},
    {q:"A lower sternal diastolic rumble that increases with inspiration suggests:",options:["Mitral stenosis","Tricuspid stenosis","Aortic regurgitation","Aortic stenosis"],answer:1,explanation:"TS is a right-sided diastolic rumble and intensifies with inspiration."},
    {q:"Flushing, diarrhea, and right-sided valve disease suggest:",options:["Carcinoid heart disease","Isolated rheumatic MS","Hypertrophic cardiomyopathy","Pericarditis"],answer:0,explanation:"Carcinoid plaques predominantly affect tricuspid and pulmonary valves."},
    {q:"Which statement about mechanical prosthetic valves is correct?",options:["DOACs are preferred","They require lifelong VKA therapy","They never thrombose","They require no monitoring"],answer:1,explanation:"Mechanical valves require vitamin K antagonist anticoagulation; DOACs are contraindicated."},
    {q:"A new high prosthetic gradient with embolism and restricted leaflet motion suggests:",options:["Normal aging only","Prosthetic thrombosis or obstruction","Mild native MR","Simple anxiety"],answer:1,explanation:"This pattern requires urgent imaging and specialist management."},
    {q:"Routine dental IE prophylaxis is appropriate solely for:",options:["Any murmur","Uncomplicated native MVP","Defined high-risk cardiac conditions before relevant dental procedures","All patients older than 50"],answer:2,explanation:"Prophylaxis is limited to selected high-risk groups; oral hygiene is central for everyone."},
    {q:"Why is pregnancy challenging in significant MS?",options:["Pregnancy lowers heart rate and flow","Increased blood volume and heart rate raise the transmitral gradient","The mitral valve becomes larger","Pulmonary pressure always falls"],answer:1,explanation:"Higher flow plus shorter diastole worsens obstruction and pulmonary pressure."},
    {q:"In mixed AS/AR, management should focus on:",options:["Only the smaller gradient","Only pulse pressure","The combined hemodynamic and chamber burden","Ignoring symptoms"],answer:2,explanation:"Pressure and volume overload coexist; moderate lesions can create severe total physiology."},
    {q:"Which statement best captures the emergency lesson of acute valve disease?",options:["A loud murmur is mandatory","A soft murmur can accompany severe low-flow or rapidly equalizing lesions","Echo is never useful","Chronic peripheral signs must be present"],answer:1,explanation:"Hemodynamic instability matters more than murmur intensity in acute severe regurgitation and low-flow AS."}
  ];

  const labels = Object.fromEntries(navGroups.flatMap(g=>g.items).map(item=>[item.id,item.label]));
  window.VHLabData = {navGroups,clusters,modules,lesionProfiles,maneuversData,cases,flashcards,quiz,labels};
})();
