"use strict";
const $=id=>document.getElementById(id);
const featured=["南京大学","安徽大学","合肥工业大学","南京师范大学","杭州电子科技大学","安徽师范大学"];
const provinces=[...new Set(schools.map(s=>s.province))].sort();
const bProvinces=new Set(["内蒙古","广西","海南","贵州","云南","西藏","甘肃","青海","宁夏","新疆"]);
const zoneOf=province=>bProvinces.has(province)?"B":"A";
let zone="";
let shown=12;
for(const p of provinces) $("province-filter").add(new Option(p,p));
const currentYear=new Date().getFullYear();
for(let y=currentYear+1;y>=currentYear-2;y--) $("year").add(new Option(String(y),String(y)));
$("year").value=String(currentYear);
function safeUrl(raw){try{const u=new URL(raw);return ["https:","http:"].includes(u.protocol)?u.href:null;}catch{return null;}}
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
for(const [value,label] of [[schools.length,"收录招生单位"],[schools.filter(s=>safeUrl(s.url)).length,"已收录官网入口"],[provinces.length,"覆盖省级地区"]]){const n=node("div");n.append(node("strong","",String(value)),node("span","",label));$("stats").append(n);}
function reset(){ zone=""; $("school-search").value="";$("province-filter").value="";$("level-filter").value="";shown=12;render(); }
function render(){
 const q=$("school-search").value.trim().toLowerCase(),p=$("province-filter").value,l=$("level-filter").value;
 document.querySelectorAll("[data-zone]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.zone===zone)));
 const filtered=schools.filter(s=>(!zone||zoneOf(s.province)===zone)&&(!p||s.province===p)&&(!l||(l==="普通"?s.level==="普通":s.tags.split(",").includes(l)))&&(!q||`${s.name} ${s.code} ${s.province} ${s.city}`.toLowerCase().includes(q)));
 const searching=Boolean(q||p||l||zone);
 const visible=searching?filtered.slice(0,shown):featured.map(n=>schools.find(s=>s.name===n)).filter(Boolean);
 $("heading").textContent=searching?"搜索结果":"推荐探索";$("count").textContent=searching?`找到 ${filtered.length} 所院校`:"从这里开始，探索更多选择";$("results").replaceChildren();$("clear").hidden=!q;
 for(const s of visible){const c=node("article","school-card"),top=node("div","card-top"),info=node("div");info.append(node("h3","",s.name),node("span","location",`${s.province} · ${s.city}`));top.append(node("span","monogram",s.name.slice(0,1)),info);c.append(top);
 const tags=node("div","school-tags");tags.append(node("span","tag zone-tag",`${zoneOf(s.province)}区`));for(const t of s.tags.split(",").filter(Boolean).slice(0,4))tags.append(node("span",`tag ${t==="985"||t==="211"?"blue-tag":""}`,t));c.append(tags);
 const quota=s.transfer2026,meta=node("div","school-meta");
 meta.append(node("span","school-code",`院校代码 ${s.code}`));
 const toggle=node("button","transfer-toggle","一键直达调剂信息");toggle.type="button";toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-controls",`transfer-${s.code}`);meta.append(toggle);c.append(meta);
 const panel=node("section","transfer-panel");panel.id=`transfer-${s.code}`;panel.hidden=true;panel.setAttribute("aria-label",`${s.name}调剂信息`);
 const panelHead=node("div","transfer-head"),titles=node("div");titles.append(node("h3","",`${s.name} · 2026调剂信息`),node("p","",quota?`已收录 ${quota.sources.length} 则官方公告 · 核查于 ${quota.checkedAt}`:"本站尚未收录该校官方公告，不代表该校没有发布调剂信息。"));
 const close=node("button","transfer-close","收起信息");close.type="button";panelHead.append(titles,close);panel.append(panelHead);
 if(quota){panel.append(node("p","transfer-caveat",quota.note+" 以下为2026年历史公告，非当前剩余名额。"));const waterfall=node("div","announcement-waterfall");quota.sources.forEach((source,index)=>{const href=safeUrl(source.url);if(!href)return;const card=node("article","announcement-card");card.append(node("span","announcement-label","官方公告 · 2026"),node("h4","",source.title),node("p","announcement-date",source.publishedAt?`发布于 ${source.publishedAt}`:"原文发布日期待核实"));
 const rows=quota.rows.filter(r=>r.sourceIndex===index);for(const r of rows){const item=node("div","announcement-major");item.append(node("strong","",`${r.major} · ${r.seats}人`),node("span","",`${r.college} / ${r.code} / ${r.mode}`));card.append(item);}
 if(!rows.length)card.append(node("p","announcement-excerpt",source.title.includes("专项")?"专项调剂公告，适用条件请阅读原文。":"已收录官方公告入口，具体专业、要求与人数请查看原文。"));
 const link=node("a","announcement-link","查看学校公告原文");link.href=href;link.target="_blank";link.rel="noopener noreferrer";link.setAttribute("aria-label",`${s.name} ${source.title}（新窗口打开）`);card.append(link);waterfall.append(card);});panel.append(waterfall);
 }else{const empty=node("div","announcement-empty");empty.append(node("p","","尚无已核实公告可展开。可先前往研招官网，或检索该校2026年官方调剂通知。"));const url=safeUrl(s.url);if(url){const search=node("a","announcement-link","检索学校官方调剂信息");search.href=`https://www.baidu.com/s?wd=${encodeURIComponent(`site:${new URL(url).hostname} ${s.name} 2026 调剂`)}`;search.target="_blank";search.rel="noopener noreferrer";empty.append(search);}panel.append(empty);}
 const setOpen=open=>{panel.hidden=!open;toggle.setAttribute("aria-expanded",String(open));};toggle.addEventListener("click",()=>{const open=panel.hidden;document.querySelectorAll(".transfer-panel").forEach(p=>p.hidden=true);document.querySelectorAll(".transfer-toggle").forEach(b=>b.setAttribute("aria-expanded","false"));setOpen(open);});close.addEventListener("click",()=>{setOpen(false);toggle.focus();});

 const actions=node("div","card-actions"),url=safeUrl(s.url);
 if(url){for(const [label,href,cls] of [["研招官网",url,"primary-action"],["调剂公告搜索",`https://www.baidu.com/s?wd=${encodeURIComponent(`site:${new URL(url).hostname} ${s.name} ${$("year").value} 调剂`)}`,"secondary-action"]]){const a=node("a",cls,label);a.href=href;a.target="_blank";a.rel="noopener noreferrer";a.setAttribute("aria-label",`${s.name} ${label}（新窗口打开）`);actions.append(a);}}else actions.append(node("span","missing-link","官网入口待补充"));c.append(actions);$("results").append(c,panel);}
 if(!visible.length){const empty=node("div","empty-state");empty.append(node("h3","","暂未找到匹配的院校"),node("p","","试试学校全称、院校代码，或放宽筛选条件。"));const b=node("button","","重置搜索");b.addEventListener("click",()=>{reset();$("school-search").focus();});empty.append(b);$("results").append(empty);}
 $("more").hidden=!searching||visible.length>=filtered.length;$("limit").textContent=searching&&filtered.length?`已展示 ${visible.length} / ${filtered.length} 所`:"";
}
for(const id of ["school-search","province-filter","level-filter"]){$(id).addEventListener(id==="school-search"?"input":"change",()=>{shown=12;render();});}
document.querySelectorAll("[data-zone]").forEach(b=>b.addEventListener("click",()=>{zone=b.dataset.zone;shown=12;render();}));
$("year").addEventListener("change",render);$("clear").addEventListener("click",()=>{$("school-search").value="";shown=12;render();$("school-search").focus();});$("reset").addEventListener("click",reset);$("more").addEventListener("click",()=>{shown+=12;render();});$("search-form").addEventListener("submit",e=>{e.preventDefault();render();$("heading").scrollIntoView({block:"nearest"});});document.querySelectorAll("[data-query]").forEach(b=>b.addEventListener("click",()=>{$("school-search").value=b.dataset.query;shown=12;render();}));render();
