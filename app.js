const KEY_P='medidrone_pharmacies_v1', KEY_R='medidrone_requests_v1';
const seedPharmacies=[
 {id:'PH-001',name:'Aarogyam Medicals',area:'Narhe, Pune',phone:'+91 90000 11111',hours:'08:00–22:00',medicines:['Paracetamol','ORS','Salbutamol','Amoxicillin'],verified:true},
 {id:'PH-002',name:'CityCare Pharmacy',area:'Katraj, Pune',phone:'+91 90000 22222',hours:'24 hours',medicines:['Paracetamol','ORS','Insulin','Epinephrine'],verified:true},
 {id:'PH-003',name:'Lifeline Medicos',area:'Dhayari, Pune',phone:'+91 90000 33333',hours:'07:00–23:00',medicines:['Paracetamol','ORS','Salbutamol','Antiseptic'],verified:true}
];
const seedRequests=[{id:'MD-7K2P9',name:'Demo Clinic',phone:'+91 90000 00000',location:'Narhe, Pune',medicine:'ORS',qty:2,urgency:'Urgent',notes:'Prototype demo request',status:'Matching pharmacy',created:new Date().toLocaleString()}];

function load(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function pharmacies(){return load(KEY_P,seedPharmacies)}
function requests(){return load(KEY_R,seedRequests)}
function scrollToId(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800)}
function normalize(s){return s.toLowerCase().trim()}
function distanceScore(a,b){a=normalize(a);b=normalize(b);if(a===b)return 0;if(a.includes(b)||b.includes(a))return 1;const wa=a.split(/[,\s]+/),wb=b.split(/[,\s]+/);return wa.filter(x=>x.length>2&&wb.includes(x)).length?2:10}

function renderPharmacies(filter=''){
 const list=document.getElementById('pharmacyList'), q=normalize(filter);
 const data=pharmacies().filter(p=>!q||normalize(p.name+' '+p.area+' '+p.medicines.join(' ')).includes(q));
 document.getElementById('statPharmacies').textContent=pharmacies().length;
 document.getElementById('statAvailable').textContent=pharmacies().reduce((n,p)=>n+p.medicines.length,0);
 list.innerHTML=data.length?data.map(p=>`<article><span class="badge">✓ ${p.verified?'Registered':'Pending'}</span><h3>${escapeHtml(p.name)}</h3><p>📍 ${escapeHtml(p.area)}<br>☎ ${escapeHtml(p.phone)}<br>🕒 ${escapeHtml(p.hours)}</p><div class="medicine-list"><b>Medicine records</b><br>${p.medicines.map(escapeHtml).join(' • ')}</div><button class="secondary" onclick="selectPharmacy('${p.id}')">Use for demo request</button></article>`).join(''):'<div class="panel">No matching pharmacies found.</div>';
}
function renderRequests(){
 const el=document.getElementById('requestList'), data=requests();
 el.innerHTML=data.length?data.map(r=>`<div class="request-item"><b>${escapeHtml(r.id)} • ${escapeHtml(r.medicine)} × ${r.qty}</b><small>${escapeHtml(r.location)} • ${escapeHtml(r.urgency)} • ${escapeHtml(r.status)}</small></div>`).join(''):'<p style="color:var(--muted)">No requests.</p>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function makeId(){return 'MD-'+Math.random().toString(36).slice(2,7).toUpperCase()}
function selectPharmacy(id){const p=pharmacies().find(x=>x.id===id);if(p){document.getElementById('reqLocation').value=p.area;scrollToId('request');toast('Selected '+p.name+' as the demo area.')}}

document.getElementById('pharmacySearch').addEventListener('input',e=>renderPharmacies(e.target.value));
document.getElementById('pharmacyForm').addEventListener('submit',e=>{
 e.preventDefault();
 const p={id:'PH-'+Date.now().toString().slice(-5),name:phName.value,area:phArea.value,phone:phPhone.value,hours:phHours.value,medicines:phMedicines.value.split(',').map(x=>x.trim()).filter(Boolean),verified:false};
 save(KEY_P,[...pharmacies(),p]);e.target.reset();renderPharmacies();toast('Pharmacy added to this browser prototype.');scrollToId('pharmacies');
});
document.getElementById('requestForm').addEventListener('submit',e=>{
 e.preventDefault();
 const r={id:makeId(),name:reqName.value,phone:reqPhone.value,location:reqLocation.value,medicine:reqMedicine.value,qty:reqQty.value,urgency:reqUrgency.value,notes:reqNotes.value,status:'Finding nearest pharmacy',created:new Date().toLocaleString()};
 const ps=pharmacies().filter(p=>p.medicines.some(m=>normalize(m)===normalize(r.medicine)));
 const nearest=ps.sort((a,b)=>distanceScore(a.area,r.location)-distanceScore(b.area,r.location))[0];
 if(nearest) r.status=`Matched: ${nearest.name}`; else r.status='No matching medicine record found';
 save(KEY_R,[r,...requests()]);
 document.getElementById('requestResult').classList.remove('hidden');
 document.getElementById('requestResult').innerHTML=`<b>Request created: ${r.id}</b><br>${nearest?`Nearest matching pharmacy: <strong>${escapeHtml(nearest.name)}</strong> (${escapeHtml(nearest.area)}).`:'No registered pharmacy currently lists this medicine.'}<br><small>Prototype only — pharmacist/clinical verification is required before any real fulfillment.</small>`;
 renderRequests();toast('Emergency request created.');scrollToId('dashboard');
});
let missionTimer=null;
document.getElementById('missionBtn').addEventListener('click',()=>{
 const latest=requests()[0], btn=document.getElementById('missionBtn'); if(!latest)return;
 btn.disabled=true;let n=0;document.getElementById('missionTitle').textContent='Drone mission simulation';document.getElementById('missionText').textContent=`Routing request ${latest.id} through pickup → destination`;
 clearInterval(missionTimer);missionTimer=setInterval(()=>{n+=5;document.getElementById('missionProgress').style.width=n+'%';if(n>=100){clearInterval(missionTimer);document.getElementById('missionTitle').textContent='Mission complete';document.getElementById('missionText').textContent='Simulation delivered the package to the destination.';btn.textContent='Simulation complete';}},250);
});
function updateMissionButton(){const b=document.getElementById('missionBtn');b.disabled=!requests().length;b.textContent=requests().length?'Start simulation':'Start simulation'}
function resetDemo(){localStorage.removeItem(KEY_P);localStorage.removeItem(KEY_R);renderPharmacies();renderRequests();updateMissionButton();toast('Demo data reset.')}
renderPharmacies();renderRequests();updateMissionButton();
