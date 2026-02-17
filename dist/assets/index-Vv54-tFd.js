import{b as fe,T as O,M as J}from"./bootstrap.esm-CgEsG6e6.js";const{createClient:ee}=window.supabase||{},ye="https://nawvhznauxovsfjgawti.supabase.co",ve="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hd3Zoem5hdXhvdnNmamdhd3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzkwMTEsImV4cCI6MjA2NzExNTAxMX0.wk5vBEU5M0-BcWOngJSVrIVKwJeDP6jaBSNo02n0v6c",ce=ee?ee(ye,ve):null,be=()=>!!ce,we={};function Ee(e){const t=Array.isArray(e.images)?e.images:[],a=t[0]||"N/A",n=e.price!=null?String(e.price):"N/A",o=e.year!=null?String(e.year):"N/A",i=e.updated?new Date(e.updated).getTime():0,s=e.updated_at?new Date(e.updated_at).getTime():0,l=s>=i&&s>0?e.updated_at:e.updated,r=l?new Date(l).toISOString().replace("T"," ").slice(0,19):"N/A";return{imageUrl:a,title:e.title||"N/A",webURL:e.link||"N/A",stockNumber:e.stocknumber||"N/A",vin:e.vin||"N/A",price:n,webPrice:typeof numeral<"u"?numeral(n).format("$0,0.00"):n,manufacturer:e.manufacturer||"N/A",year:o,modelName:e.model_name||"N/A",modelType:e.model_type||"N/A",modelCode:"N/A",color:e.color||"N/A",usage:e.usage||"N/A",updated:r,imageElements:t.length}}async function ke(){if(!be())return null;const e=we?.VITE_SUPABASE_INVENTORY_TABLE||"next_universal_unit_inventory";try{const{data:t,error:a}=await ce.from(e).select("*").order("updated",{ascending:!1});return a?(console.error("Supabase fetch error:",a),null):(t||[]).map(Ee)}catch(t){return console.error("Supabase fetch exception:",t),null}}window.bootstrap=fe;const m={table:null,tableBody:null,filters:{},pagination:{pageSizeSelect:null,prevPageBtn:null,nextPageBtn:null,pageInfo:null},refreshFilters(){this.filters={search:f("search"),year:f("year"),manufacturer:f("manufacturer"),model:f("model"),type:f("type"),usage:f("usage"),updated:f("updated"),updatedEnd:f("updatedEnd"),photos:f("photos")}},init(){this.table=document.getElementById("vehiclesTable"),this.tableBody=this.table?.getElementsByTagName("tbody")[0],this.refreshFilters(),this.pagination={pageSizeSelect:document.getElementById("pageSizeSelect"),prevPageBtn:document.getElementById("prevPage"),nextPageBtn:document.getElementById("nextPage"),pageInfo:document.getElementById("pageInfo")}}};let h={vehiclesCache:null,vehiclesCacheTimestamp:null,vehiclesCacheSupabase:null,vehiclesCacheSupabaseTimestamp:null,tablePagination:null};const c={allItems:[],filteredItems:[],currentItems:[],pagination:{currentPage:1,pageSize:25,totalPages:1},sort:{column:null,direction:"asc"},savedFilters:{},currentKeyTagData:null,saveState(){const e={};["search","year","manufacturer","model","type","usage","photos","updated","updatedEnd"].forEach(a=>{const n=f(a);n&&(e[a]=n.value||"")});const t={currentPage:this.pagination.currentPage,pageSize:this.pagination.pageSize,filters:e};try{V().available?localStorage.setItem("tablePagination",JSON.stringify(t)):h.tablePagination=t}catch{h.tablePagination=t}},loadState(){try{let e;if(V().available){const t=localStorage.getItem("tablePagination");t&&(e=JSON.parse(t))}else h.tablePagination&&(e=h.tablePagination);e&&(this.pagination.currentPage=e.currentPage||1,this.pagination.pageSize=e.pageSize||25,this.savedFilters=e.filters||{})}catch(e){console.error("Error loading saved state:",e)}}};function Ie(e){const t=document.getElementById("keytagStockList");if(!t)return;const a=[...new Set((e||[]).map(n=>n.stockNumber).filter(Boolean))].sort().slice(0,10);t.innerHTML=a.map(n=>`<option value="${n}">`).join("")}function Se(){const e=c.savedFilters;!e||Object.keys(e).length===0||(["year","manufacturer"].forEach(t=>{const a=e[t];a!=null&&B(t).forEach(n=>{Array.from(n.options).some(o=>o.value===a)&&(n.value=a)})}),K(),["search","model","type","usage","photos","updated","updatedEnd"].forEach(t=>{const a=e[t];a!=null&&B(t).forEach(n=>{n.tagName==="SELECT"&&!Array.from(n.options).some(o=>o.value===a)||(n.value=a)})}))}function te(){["search","year","manufacturer","model","type","usage","photos","updated","updatedEnd"].forEach(e=>{B(e).forEach(t=>{t.value=""})}),K(),L(),C()}function re(){return window.matchMedia("(min-width: 992px)").matches?"desktop":"mobile"}function B(e){return Array.from(document.querySelectorAll(`[data-filter="${e}"]`))}function f(e){const t=re();return document.querySelector(`[data-filter-group="${t}"] [data-filter="${e}"]`)}function ie(){const e=localStorage.getItem("hiddenColumns");if(!e)return new Set;try{const t=JSON.parse(e);return new Set(Array.isArray(t)?t:[])}catch(t){return console.warn("Invalid hiddenColumns storage:",t),new Set}}function Te(e){localStorage.setItem("hiddenColumns",JSON.stringify([...e]))}function Be(e){document.querySelectorAll(".column-toggle").forEach(t=>{t.checked=!e.has(t.value)})}function Y(){const e=ie();document.querySelectorAll("[data-column]").forEach(t=>{const a=t.dataset.column;t.classList.toggle("column-hidden",e.has(a))}),Be(e)}function Ce(){document.querySelectorAll(".column-toggle").forEach(e=>{e.addEventListener("change",()=>{const t=ie();e.checked?t.delete(e.value):t.add(e.value),Te(t),Y()})}),Y()}function K(){const e=B("model");if(!e.length)return;const t=new Set;c.allItems.forEach(n=>{n.modelName&&n.modelName!=="N/A"&&t.add(n.modelName)});const a=[...t].sort();e.forEach(n=>{const o=n.value;for(;n.options.length>2;)n.remove(2);a.forEach(i=>{const s=document.createElement("option");s.value=i,s.textContent=i,n.appendChild(s)}),n.value=a.includes(o)?o:""})}function ae(){const e=re(),t=e==="desktop"?"mobile":"desktop";document.querySelectorAll(`[data-filter-group="${e}"] [data-filter]`).forEach(a=>{a.disabled=!1}),document.querySelectorAll(`[data-filter-group="${t}"] [data-filter]`).forEach(a=>{a.disabled=!0})}function M(e){if(!e||e==="N/A")return null;const t=moment(e);return t.isValid()?t.isAfter(moment())?moment():t:null}function xe(e){const t=B("manufacturer");t.length&&(e.sort(),t.forEach(a=>{for(;a.options.length>2;)a.remove(2);e.forEach(n=>{const o=document.createElement("option");o.value=n,o.textContent=n,a.appendChild(o)})}))}function Le(e){const t=B("year");t.length&&(e.sort((a,n)=>n-a),t.forEach(a=>{for(;a.options.length>2;)a.remove(2);e.forEach(n=>{const o=document.createElement("option");o.value=n,o.textContent=n,a.appendChild(o)})}))}function Me(e){const t=B("type");t.length&&(e.sort(),t.forEach(a=>{for(;a.options.length>2;)a.remove(2);e.forEach(n=>{const o=document.createElement("option");o.value=n,o.textContent=n,a.appendChild(o)})}))}function Ne(e){{L();return}}function L(){const e=document.getElementById("custom-suggestions");e&&(e.style.display="none")}document.addEventListener("DOMContentLoaded",async()=>{moment.updateLocale("en",{relativeTime:{future:"in %s",past:"%s ago",s:"%d sec.",ss:"%d sec.",m:"1 min.",mm:"%d min.",h:"1 hr.",hh:"%d hrs.",d:"1 day",dd:"%d days",M:"1 month",MM:"%d months",y:"1 year",yy:"%d years"}}),m.init(),ae(),Ce();const e=at(),t=V();console.log(`Browser info: ${navigator.userAgent}`),console.log(`Storage status: ${JSON.stringify(t)}`),console.log(`Network status: ${JSON.stringify(e)}`);const a=localStorage.getItem("theme");a&&(document.body.setAttribute("data-bs-theme",a),ue(a));const n=document.getElementById("verticalKeyTagSwitch"),o=localStorage.getItem("verticalKeyTagState");o&&n&&(n.checked=o==="true",j()),B("search").forEach(l=>{if(l&&!l.closest(".search-container")){const r=document.createElement("div");r.className="search-container",l.parentNode.insertBefore(r,l),r.appendChild(l)}}),document.addEventListener("click",Ae);const i=B("search"),s=ne(l=>{Pe()},250);i.forEach(l=>{l.classList.add("search-with-suggestions"),l.addEventListener("input",r=>{s(r.target.value)}),l.addEventListener("paste",()=>{setTimeout(()=>{L(),C()},0)}),l.addEventListener("keydown",r=>{const u=document.getElementById("custom-suggestions");if(r.key==="Tab"){L(),C();return}if(r.key==="Enter"){r.preventDefault();const v=u?.querySelector(".suggestion-item.highlighted");v&&(l.value=v.textContent),L(),C();return}if(r.key==="Escape"){L();return}if(!u||u.style.display==="none")return;const p=u.querySelectorAll(".suggestion-item");if(p.length===0)return;const d=u.querySelector(".suggestion-item.highlighted");let g=-1;d&&(g=Array.from(p).indexOf(d)),r.key==="ArrowDown"?(r.preventDefault(),g<p.length-1&&(d&&d.classList.remove("highlighted"),p[g+1].classList.add("highlighted"),p[g+1].scrollIntoView({block:"nearest"}))):r.key==="ArrowUp"&&(r.preventDefault(),g>0&&(d&&d.classList.remove("highlighted"),p[g-1].classList.add("highlighted"),p[g-1].scrollIntoView({block:"nearest"})))})}),document.addEventListener("click",l=>{!l.target.closest('[data-filter="search"]')&&!l.target.closest("#custom-suggestions")&&L()}),document.querySelectorAll("[data-filter]").forEach(l=>{l.dataset.filter!=="search"&&l.addEventListener("change",()=>{(l.dataset.filter==="year"||l.dataset.filter==="manufacturer")&&K(),C()})}),document.getElementById("clearFiltersBtn")?.addEventListener("click",te),document.getElementById("clearFiltersBtnMobile")?.addEventListener("click",te),c.loadState(),await de(),Fe(),window.addEventListener("resize",ne(()=>{ae(),K();const l=document.getElementById("custom-suggestions");l&&l.style.display!=="none"&&f("search")&&setTimeout(()=>{l.style.display="none",setTimeout(()=>{l.style.display="block"},10)},150)},250))});function Ae(e){const t=e.target;if(t.closest("#keytagModalButton")){const a=t.closest("#keytagModalButton").dataset.bsStocknumber;a&&(document.getElementById("keytagModalLabel").innerHTML=a,U(a))}t.closest("#printTag")&&window.print(),t.closest("#toggleThemeButton")&&Ue(),t.closest("#forceRefreshBtn")&&ze()}function Pe(e){C(),Ne()}function De(e=10){if(!m.tableBody)return;for(;m.tableBody.firstChild;)m.tableBody.removeChild(m.tableBody.firstChild);const t=document.createDocumentFragment();for(let a=0;a<e;a++){const n=document.createElement("tr"),o=document.createElement("tr");n.className="placeholder-wave",o.className="placeholder-wave",n.innerHTML=`
    <td class="placeholder-wave"><span class="placeholder col-6 ms-2"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-4"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-8"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-4"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-8"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-4"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-8"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-4"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-8"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-4"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-10"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-6"></span></td>
    <td class="placeholder-wave">
		<span class="placeholder col-1"></span>
		<span class="placeholder col-2"></span>
		<span class="placeholder col-2"></span>
		<span class="placeholder col-2"></span>
		<span class="placeholder col-2"></span>
	</td>
    `,o.innerHTML=`
    <td class="placeholder-wave"><span class="placeholder col-8 ms-2"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-8"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-10"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-8"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-10"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-8"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-10"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-8"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-10"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-8"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-7"></span></td>
    <td class="placeholder-wave"><span class="placeholder col-9"></span></td>
    <td class="placeholder-wave">
		<span class="placeholder col-2"></span>
		<span class="placeholder col-2"></span>
		<span class="placeholder col-2"></span>
		<span class="placeholder col-2"></span>
		<span class="placeholder col-2"></span>
	</td>
    `,t.appendChild(n),t.appendChild(o)}m.tableBody.appendChild(t)}function ne(e,t){let a;return function(...o){const i=()=>{clearTimeout(a),e(...o)};clearTimeout(a),a=setTimeout(i,t)}}function $e(e){const t=new URL(e);return t.searchParams.set("t",Date.now().toString()),t.toString()}async function ze(){console.log("Force refresh - clearing cache...");const e=document.getElementById("forceRefreshBtn"),t=e?.innerHTML;e&&(e.disabled=!0,e.innerHTML='<i class="bi bi-arrow-clockwise h6 my-1 spin"></i> <span class="mx-1 pe-2 fw-normal">Loading...</span>');try{localStorage.removeItem("vehiclesCache"),localStorage.removeItem("vehiclesCacheTimestamp"),localStorage.removeItem("vehiclesCacheSupabase"),localStorage.removeItem("vehiclesCacheSupabaseTimestamp")}catch{console.log("Could not clear localStorage cache")}h.vehiclesCache=null,h.vehiclesCacheTimestamp=null,h.vehiclesCacheSupabase=null,h.vehiclesCacheSupabaseTimestamp=null,await de(),e&&(e.disabled=!1,e.innerHTML=t)}async function de(){const e=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);console.log(`Device info - Mobile: ${e}, UserAgent: ${navigator.userAgent}`);const t=V(),a=!t.available||t.quotaExceeded,n=900*1e3,o=a?h.vehiclesCacheSupabase:JSON.parse(localStorage.getItem("vehiclesCacheSupabase")||"null"),i=a?h.vehiclesCacheSupabaseTimestamp:parseInt(localStorage.getItem("vehiclesCacheSupabaseTimestamp")||"0",10);if(o&&i&&Date.now()-i<n){console.log("Using cached Supabase data..."),await Z(o);return}De();const s=await ke();if(s&&s.length>0){console.log(`Loaded ${s.length} vehicles from Supabase`);try{const l=JSON.stringify(s);a||l.length>2*1024*1024?(h.vehiclesCacheSupabase=s,h.vehiclesCacheSupabaseTimestamp=Date.now()):(localStorage.setItem("vehiclesCacheSupabase",l),localStorage.setItem("vehiclesCacheSupabaseTimestamp",String(Date.now())))}catch{h.vehiclesCacheSupabase=s,h.vehiclesCacheSupabaseTimestamp=Date.now()}await Z(s);return}await Oe(a,n,e)}async function Oe(e,t,a){try{let n=e?h.vehiclesCache:localStorage.getItem("vehiclesCache");const o=e?h.vehiclesCacheTimestamp:parseInt(localStorage.getItem("vehiclesCacheTimestamp")||"0",10);if(n&&o&&Date.now()-o<t){console.log("Using cached XML data...");const y=new DOMParser().parseFromString(n,"text/xml");if(!y.querySelector("parsererror")){await q(y);return}}console.log("Fetching fresh XML data...");const i=a?6e4:3e4,s=new AbortController,l=setTimeout(()=>s.abort(),i),r=$e("https://www.flatoutmotorcycles.com/unitinventory_univ.xml"),u=await fetch(r,{signal:s.signal,mode:"cors",headers:{Accept:"application/xml, text/xml"},cache:"no-store"});if(clearTimeout(l),!u.ok)throw new Error(`Network response error: ${u.status}`);const p=await u.text();if(p.length<100)throw new Error("Response too short");const g=new DOMParser().parseFromString(p,"text/xml");if(g.querySelector("parsererror"))throw new Error("XML parsing failed");const v=e||p.length>2*1024*1024;try{v?(h.vehiclesCache=p,h.vehiclesCacheTimestamp=Date.now()):(localStorage.setItem("vehiclesCache",p),localStorage.setItem("vehiclesCacheTimestamp",String(Date.now())))}catch{h.vehiclesCache=p,h.vehiclesCacheTimestamp=Date.now()}await q(g)}catch(n){console.error("Error fetching XML:",n);const o=e?h.vehiclesCache:localStorage.getItem("vehiclesCache");if(o)try{const i=new DOMParser().parseFromString(o,"text/xml");if(!i.querySelector("parsererror")){await q(i);return}}catch{}Ke("Could not load vehicle data. Please try again later.")}}function Ke(e){if(!m.tableBody)return;for(;m.tableBody.firstChild;)m.tableBody.removeChild(m.tableBody.firstChild);const t=document.createElement("tr");t.innerHTML=`
    <td colspan="13" class="text-center p-5">
      <div class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        ${e}
      </div>
      <button class="btn btn-outline-primary mt-3" onclick="location.reload()">
        <i class="bi bi-arrow-clockwise me-2"></i>Refresh
      </button>
    </td>
  `,m.tableBody.appendChild(t)}async function Z(e){if(!m.tableBody)return;for(;m.tableBody.firstChild;)m.tableBody.removeChild(m.tableBody.firstChild);c.allItems=e,c.filteredItems=[...c.allItems];const t=new Set,a=new Set,n=new Set;e.forEach(o=>{o.manufacturer&&o.manufacturer!=="N/A"&&t.add(o.manufacturer),o.year&&o.year!=="N/A"&&a.add(o.year),o.modelType&&o.modelType!=="N/A"&&n.add(o.modelType)}),xe([...t]),Le([...a]),Me([...n]),K(),Ie(e),c.loadState(),Se(),Qe(),C(),document.querySelectorAll(".placeholder-wave").forEach(o=>{o.classList.remove("placeholder-wave")})}async function q(e){const t=e.getElementsByTagName("item");if(!m.tableBody)return;const a=Array.from(t);a.sort((s,l)=>{const r=s.getElementsByTagName("updated")[0]?.textContent||"",u=l.getElementsByTagName("updated")[0]?.textContent||"",p=M(r);return M(u)-p});const n=new Set,o=new Set,i=new Set;c.allItems=a.map(s=>{const l=s.getElementsByTagName("images")[0]?.getElementsByTagName("imageurl")[0]?.textContent||"N/A",r=s.getElementsByTagName("title")[0]?.textContent||"N/A",u=s.getElementsByTagName("link")[0]?.textContent||"N/A",p=s.getElementsByTagName("stocknumber")[0]?.textContent||"N/A",d=s.getElementsByTagName("vin")[0]?.textContent||"N/A",g=s.getElementsByTagName("price")[0]?.textContent||"N/A",v=numeral(g).format("$0,0.00"),b=s.getElementsByTagName("manufacturer")[0]?.textContent||"N/A",y=s.getElementsByTagName("year")[0]?.textContent||"N/A",I=s.getElementsByTagName("model_name")[0]?.textContent||"N/A",w=s.getElementsByTagName("model_type")[0]?.textContent||"N/A",S=s.getElementsByTagName("model_code")[0]?.textContent||"N/A",D=s.getElementsByTagName("color")[0]?.textContent||"N/A",$=s.getElementsByTagName("usage")[0]?.textContent||"N/A",N=s.getElementsByTagName("updated")[0]?.textContent||"N/A",A=s.getElementsByTagName("imageurl").length;return b&&b!=="N/A"&&n.add(b),y&&y!=="N/A"&&o.add(y),w&&w!=="N/A"&&i.add(w),{imageUrl:l,title:r,webURL:u,stockNumber:p,vin:d,price:g,webPrice:v,manufacturer:b,year:y,modelName:I,modelType:w,modelCode:S,color:D,usage:$,updated:N,imageElements:A}}),await Z(c.allItems)}function Fe(){document.querySelectorAll("#vehiclesTable th").forEach(a=>{a.addEventListener("click",()=>je(a)),a.textContent.trim().toLowerCase().includes("updated")&&a.classList.add("sort-desc")}),document.querySelectorAll(".badge[data-bs-toggle='tooltip']").forEach(a=>{new O(a)}),C(),c.sort={column:"updated",direction:"desc"},ge(),P()}function C(){const e=f("search")?.value.toUpperCase()||"",t=f("year")?.value.toUpperCase()||"",a=f("manufacturer")?.value.toUpperCase()||"",n=f("model")?.value.toUpperCase()||"",o=f("type")?.value.toUpperCase()||"",i=f("usage")?.value.toUpperCase()||"",s=f("photos")?.value.toUpperCase()||"",l=f("updated")?.value||"",r=f("updatedEnd")?.value||"",u=e.split(/\s+/).filter(d=>d.length>0),p={manufacturer:a,model:n,type:o,usage:i,year:t,photos:s,updated:l,updatedEnd:r};c.filteredItems=c.allItems.filter(d=>{const g=`${d.stockNumber} ${d.vin} ${d.usage} ${d.year} ${d.manufacturer} ${d.modelName} ${d.modelType} ${d.color}`.toUpperCase(),v=u.length===0||u.every(y=>g.includes(y)),b=Object.entries(p).every(([y,I])=>{if(!I&&y!=="updated"||!I&&y==="updated"&&!p.updatedEnd)return!0;let w="";switch(y){case"manufacturer":w=d.manufacturer||"";break;case"year":w=d.year||"";break;case"type":w=d.modelType||"";break;case"usage":w=d.usage||"";break;case"model":w=d.modelName||"";break;case"photos":{const S=Number(d.imageElements)>10;return I==="INHOUSE"?S:I==="STOCK"?!S:!0}case"updated":{const S=moment(d.updated).startOf("day"),D=I?moment(I).startOf("day"):null,$=p.updatedEnd?moment(p.updatedEnd).startOf("day"):null,N=D?.isValid(),A=$?.isValid();return S.isValid()?!N&&!A?!0:N&&A?S.isBetween(D,$,"day","[]"):N?S.isSameOrAfter(D,"day"):A?S.isSameOrBefore($,"day"):!0:!N&&!A}case"updatedEnd":return!0;default:w=""}return w.toUpperCase().includes(I)});return v&&b}),c.sort.column&&(c.sort.column=null,c.sort.direction="asc",document.querySelectorAll("#vehiclesTable th").forEach(d=>{d.classList.remove("sort-asc","sort-desc")})),c.pagination.currentPage=1,P(),c.saveState()}function Ue(){const e=document.body,t=e.getAttribute("data-bs-theme"),a=t==="dark"?"light":"dark";console.log(`Current theme: ${t}, New theme: ${a}`),e.setAttribute("data-bs-theme",a);const n=document.getElementById("logo");n&&(n.src=a==="dark"?"./img/fom-app-logo-01.svg":"./img/fom-app-logo-02.svg"),ue(a),localStorage.setItem("theme",a)}function ue(e){const t=document.getElementById("toggleThemeButton")?.querySelector("i");t&&(console.log(`Updating theme icon for theme: ${e}`),e==="dark"?(t.classList.remove("bi-brightness-high"),t.classList.add("bi-moon-stars")):(t.classList.remove("bi-moon-stars"),t.classList.add("bi-brightness-high")))}function He(){if(!c.allItems||!c.allItems.length)return;const e=document.getElementById("rowCountDisplay");if(e){const t=c.allItems.length,a=c.filteredItems.length,n=c.currentItems.length;a===t?e.innerHTML=`${n} of ${t}`:e.innerHTML=`${n} of ${a} filtered (${t} total)`}}document.addEventListener("DOMContentLoaded",()=>{document.addEventListener("click",function(l){if(l.target.closest("#keytagModalButton")){const u=l.target.closest("#keytagModalButton").getAttribute("data-bs-stocknumber");if(u){const p=document.getElementById("keytagModalLabel");p&&(p.textContent=u);const d=document.getElementById("verticalKeyTagSwitch"),g=localStorage.getItem("verticalKeyTagState");d&&(d.checked=g==="true",j());const v=document.getElementById("zebraPrinterIp");v&&(v.value=localStorage.getItem(pe)||"192.168.1.74");const b=document.getElementById("zebraEndpoint");b&&(b.value=localStorage.getItem(me)||"")}else console.error("Stock number not found!")}l.target.closest("#printKeyTagBtn")&&We(),l.target.closest("#printZebraKeyTagBtn")&&Ve(),l.target.closest("#previewZebraLabelaryBtn")&&_e(),l.target.closest("#printTag")&&window.print()});const e=document.getElementById("verticalKeyTagSwitch");e&&e.addEventListener("change",j);const t=document.getElementById("keytagModal");t&&t.addEventListener("shown.bs.modal",()=>{const l=document.getElementById("keytagModalLabel")?.textContent?.trim();l&&l!=="Stock Number"&&l!=="Custom Tag"&&U(l)});const a=document.getElementById("zebraPrintCollapse"),n=document.getElementById("zebraToggleIcon");a&&n&&(a.addEventListener("show.bs.collapse",()=>{n.classList.remove("bi-chevron-down"),n.classList.add("bi-chevron-up")}),a.addEventListener("hide.bs.collapse",()=>{n.classList.remove("bi-chevron-up"),n.classList.add("bi-chevron-down")})),document.getElementById("keytagSearchBtn")?.addEventListener("click",()=>{const l=document.getElementById("keytagSearchInput")?.value?.trim();l&&U(l)}),document.getElementById("keytagSearchInput")?.addEventListener("keydown",l=>{if(l.key==="Enter"){l.preventDefault();const r=document.getElementById("keytagSearchInput")?.value?.trim();r&&U(r)}});const o=["keytagUsage","keytagStock","keytagYear","keytagManufacturer","keytagModel","keytagCode","keytagColor","keytagVin"],i=()=>({Usage:document.getElementById("keytagUsage")?.value||"",StockNumber:document.getElementById("keytagStock")?.value?.trim()||"",ModelYear:document.getElementById("keytagYear")?.value?.trim()||"",Manufacturer:document.getElementById("keytagManufacturer")?.value?.trim()||"",ModelName:document.getElementById("keytagModel")?.value?.trim()||"",ModelCode:document.getElementById("keytagCode")?.value?.trim()||"",Color:document.getElementById("keytagColor")?.value?.trim()||"",VIN:document.getElementById("keytagVin")?.value?.trim()||""}),s=()=>H(i());o.forEach(l=>{const r=document.getElementById(l);r&&r.addEventListener("input",s),r&&r.addEventListener("change",s)}),document.getElementById("keytagCustomForm")?.addEventListener("show.bs.collapse",()=>{o.forEach(l=>{const r=document.getElementById(l);r&&(r.value="")}),H({})}),document.getElementById("keytagApplyCustomBtn")?.addEventListener("click",()=>{o.forEach(l=>{const r=document.getElementById(l);r&&(r.value="")}),H({})})});document.addEventListener("DOMContentLoaded",()=>{Je()});function U(e){const t=document.getElementById("keytagMessage"),a=document.getElementById("keytagHorizontal"),n=document.getElementById("keytagVertical");t&&(t.innerHTML="");const o=c.allItems.find(s=>(s.stockNumber||"").toUpperCase()===e.toUpperCase());if(!o){c.currentKeyTagData=null,window.KeyTagComponent&&(window.KeyTagComponent.clear(a,"horizontal"),window.KeyTagComponent.clear(n,"vertical")),t&&(t.innerHTML='<div class="text-warning"><i class="bi bi-exclamation-triangle me-2"></i>Stock number not found in inventory.</div>');return}const i={StockNumber:o.stockNumber||"",Usage:o.usage||"",ModelYear:o.year||"",Manufacturer:o.manufacturer||"",ModelName:o.modelName||"",ModelCode:o.modelCode||"",Color:o.color||"",VIN:o.vin||""};H(i)}function H(e){const t={StockNumber:e?.StockNumber||"",Usage:e?.Usage||"",ModelYear:e?.ModelYear||"",Manufacturer:e?.Manufacturer||"",ModelName:e?.ModelName||"",ModelCode:e?.ModelCode||"",Color:e?.Color||"",VIN:e?.VIN||""},a=Object.values(t).every(l=>!l);c.currentKeyTagData=a?null:t;const n=document.getElementById("keytagModalLabel");n&&(n.textContent=t.StockNumber||"Custom Tag");const o=document.getElementById("keytagHorizontal"),i=document.getElementById("keytagVertical");window.KeyTagComponent&&(a?(window.KeyTagComponent.clear(o,"horizontal"),window.KeyTagComponent.clear(i,"vertical")):(window.KeyTagComponent.render(t,o),window.KeyTagComponent.renderVertical(t,i)));const s=document.getElementById("keytagMessage");s&&(s.innerHTML="")}function j(){const e=document.getElementById("keytagVertical"),t=document.getElementById("verticalKeyTagSwitch");!e||!t||(localStorage.setItem("verticalKeyTagState",t.checked),t.checked?e.classList.remove("d-none"):e.classList.add("d-none"))}function We(){const e=document.getElementById("verticalKeyTagSwitch")?.checked||!1;window.KeyTagComponent&&window.KeyTagComponent.print("#keytagHorizontal","#keytagVertical",e)}const pe="zebraPrinterIp",me="zebraEndpoint";async function Ve(){const e=document.getElementById("zebraPrinterIp"),t=document.getElementById("keytagMessage"),a=document.getElementById("keytagModalLabel");if(!e||!a)return;const n=e.value.trim();if(!n){t&&(t.innerHTML='<div class="text-warning"><i class="bi bi-exclamation-triangle me-2"></i>Enter Zebra printer IP address.</div>');return}const o=c.currentKeyTagData;if(!o||!window.KeyTagComponent){t&&(t.innerHTML='<div class="text-warning"><i class="bi bi-exclamation-triangle me-2"></i>Load a key tag first (search or create custom).</div>');return}const i=window.KeyTagComponent.toZpl(o),l=document.getElementById("zebraEndpoint")?.value?.trim()||"",r=l||"/api/zebra-print";try{t&&(t.innerHTML='<div class="text-secondary"><i class="bi bi-hourglass me-2"></i>Sending to printer…</div>'),localStorage.setItem(pe,n),l&&localStorage.setItem(me,l);const u=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({printerIp:n,port:9100,zpl:i})}),p=await u.json().catch(()=>({}));if(u.ok&&p.ok)t&&(t.innerHTML='<div class="text-success"><i class="bi bi-check-circle me-2"></i>Sent to Zebra.</div>');else{const d=p.error||(u.status===502?"Printer unreachable. Check IP and that this computer is on the same network (192.168.1.x).":u.statusText)||"Print failed";t&&(t.innerHTML=`<div class="text-danger"><i class="bi bi-x-circle me-2"></i>${d}.</div>`)}}catch(u){t&&(t.innerHTML=`<div class="text-danger"><i class="bi bi-x-circle me-2"></i>${u.message||"Network error"}.</div>`)}}const qe="https://api.labelary.com/v1/printers/8dpmm/labels/1.5x2/0/";function _e(){const e=document.getElementById("keytagMessage"),t=c.currentKeyTagData;if(!t||!window.KeyTagComponent){e&&(e.innerHTML='<div class="text-warning"><i class="bi bi-exclamation-triangle me-2"></i>Load a key tag first (search or create custom).</div>');return}const a=window.KeyTagComponent.toZpl(t);window.open(qe+encodeURIComponent(a),"_blank","noopener")}function Ye(e){const t=typeof e=="string"&&e&&!e.startsWith("${")?e:F()[0]||"",a=document.getElementById("keytagModalLabel");a&&(a.textContent=t||"Stock Number");const n=document.getElementById("keytagModal");n&&new J(n).show()}window.openKeyTagModal=Ye;function Ze(e){const t=document.getElementById("hangTagsIframe");t&&(t.src=`./hang-tags/?search=${encodeURIComponent(e||"")}`);const a=document.getElementById("hangTagsModal");a&&new J(a).show()}window.openHangTagsModal=Ze;function je(e){if(e.hasAttribute("data-no-sort"))return;const t=Array.from(e.parentElement.children).indexOf(e),n={2:"stockNumber",3:"usage",4:"year",5:"manufacturer",6:"modelName",7:"modelType",8:"color",9:"webPrice",10:"imageElements",11:"updated"}[t];if(!n)return;const i=c.sort.column===n&&c.sort.direction==="asc"?"desc":"asc";c.sort.column=n,c.sort.direction=i,e.parentElement.querySelectorAll("th").forEach(s=>{s.classList.remove("sort-asc","sort-desc")}),e.classList.add(i==="asc"?"sort-asc":"sort-desc"),ge(),c.pagination.currentPage=1,P()}function ge(){const{column:e,direction:t}=c.sort;if(!e)return;const n=t==="asc"?1:-1,i=["year","webPrice","imageElements"].includes(e),s=e==="updated",l=c.filteredItems.map(r=>{let u;const p=r[e]??"";if(i)u=parseFloat(String(p).replace(/[^0-9.-]+/g,""))||0;else if(s){const d=M(p),g=d&&d.isValid()?d.valueOf():0;u=Number.isFinite(g)?g:0}else u=String(p).toLowerCase();return{sortKey:u,item:r}});l.sort((r,u)=>typeof r.sortKey=="number"&&typeof u.sortKey=="number"?(r.sortKey-u.sortKey)*n:String(r.sortKey).localeCompare(String(u.sortKey))*n),c.filteredItems=l.map(r=>r.item)}function Re(e,t=100,a=66){return!e||e==="N/A"?e:`https://cdnmedia.endeavorsuite.com/images/ThumbGenerator/Thumb.aspx?img=${encodeURIComponent(e)}&mw=${t}&mh=${a}&f=1`}function Ge(){document.querySelectorAll(".btn-icon[data-bs-toggle='tooltip']").forEach(t=>{const a=new O(t,{trigger:"hover focus",placement:"top",customClass:"clipboard-tooltip",popperConfig(n){return{...n,modifiers:[...n.modifiers,{name:"offset",options:{offset:[0,8]}}]}}});t.addEventListener("click",()=>{a.setContent({".tooltip-inner":"Copied!"}),setTimeout(()=>{a.setContent({".tooltip-inner":"Copy to clipboard"})},2e3)})})}function Je(){["keytagModal","hangTagsModal","overlayModal","newOverlayModal","serviceCalendarModal","roTagModal","textMessageModal"].forEach(t=>{const a=document.getElementById(t);a&&a.addEventListener("hidden.bs.modal",()=>{document.activeElement&&typeof document.activeElement.blur=="function"&&document.activeElement.blur()})})}function Xe(){document.querySelectorAll(".text-tooltip[data-bs-toggle='tooltip']").forEach(t=>{const a=O.getInstance(t);a&&a.dispose(),new O(t)})}function Qe(){if(m.pagination.pageSizeSelect){const e=c.pagination.pageSize===1/0?"all":c.pagination.pageSize.toString(),t=Array.from(m.pagination.pageSizeSelect.options).find(a=>a.value===e);t&&(t.selected=!0),m.pagination.pageSizeSelect.addEventListener("change",function(){const a=this.value==="all"?1/0:parseInt(this.value,10);c.pagination.pageSize=a,c.pagination.currentPage=1,c.saveState(),P()})}m.pagination.prevPageBtn&&m.pagination.prevPageBtn.addEventListener("click",function(){c.pagination.currentPage>1&&(c.pagination.currentPage--,c.saveState(),P())}),m.pagination.nextPageBtn&&m.pagination.nextPageBtn.addEventListener("click",function(){c.pagination.currentPage<c.pagination.totalPages&&(c.pagination.currentPage++,c.saveState(),P())})}function P(){const{currentPage:e,pageSize:t}=c.pagination;c.pagination.totalPages=t===1/0?1:Math.ceil(c.filteredItems.length/t),e>c.pagination.totalPages&&(c.pagination.currentPage=c.pagination.totalPages||1);const a=t===1/0?0:(c.pagination.currentPage-1)*t,n=t===1/0?c.filteredItems.length:a+t;c.currentItems=c.filteredItems.slice(a,n),tt(),et()}function et(){m.pagination.pageInfo&&(m.pagination.pageInfo.textContent=`Page ${c.pagination.currentPage} of ${c.pagination.totalPages}`),m.pagination.prevPageBtn&&(m.pagination.prevPageBtn.disabled=c.pagination.currentPage<=1,m.pagination.prevPageBtn.classList.toggle("disabled",c.pagination.currentPage<=1)),m.pagination.nextPageBtn&&(m.pagination.nextPageBtn.disabled=c.pagination.currentPage>=c.pagination.totalPages,m.pagination.nextPageBtn.classList.toggle("disabled",c.pagination.currentPage>=c.pagination.totalPages))}function tt(){if(!m.tableBody)return;for(;m.tableBody.firstChild;)m.tableBody.removeChild(m.tableBody.firstChild);const e=document.createDocumentFragment();c.currentItems.forEach(a=>{const n=a.imageUrl,o=a.title,i=a.webURL,s=a.stockNumber,l=a.vin,r=a.webPrice,u=a.manufacturer,p=a.year,d=a.modelName,g=a.modelType,v=a.color,b=a.usage,y=a.updated,I=a.imageElements,w=document.createElement("tr");w.innerHTML=`
      <td data-column="select" class="text-center" style="max-width: 25px !important;" nowrap>
        <input type="checkbox" class="form-check-input p-2 m-0 tv-grid-select" data-stock="${s}" title="Select for TV Grid">
      </td>
      <td data-cell="image" data-column="image" class="text-center" nowrap>
        <a href="${i}" target="_blank">
          <div class="table-image-container">
          ${n!=="N/A"?`<img src="${Re(n,100,66)}" alt="${o}" width="100" height="66" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='./img/noimage.png';" />`:'<img src="./img/noimage.png" alt="No image" width="100" height="66" />'}
          </div>
          </a>
      </td>
	  <td nowrap>
		<div class="input-group input-group-sm flex-nowrap" style="width: 235px;">
		  <input type="text" class="form-control d-block" style="font-size: 13px !important;" name="stockNumber" value="${s}" placeholder="Stock Number" title="${s}" aria-label="stock number" aria-describedby="btnGroupAddon">
		  <div class="input-group-text" id="btnGroupAddon">
			<button type="button" 
			  class="btn-icon" 
			  data-bs-toggle="tooltip"
			  data-bs-placement="top"
			  data-bs-title="Copy to clipboard"
			  onclick="navigator.clipboard.writeText('${s}')">
			  <i class="bi bi-clipboard"></i>
			</button>
		  </div>
		</div>
	  </td>
      <td class="text-center" data-column="usage" nowrap><span class="badge ${b==="New"?"text-bg-success":"text-bg-secondary"}">${b}</span></td>
      <td class="text-center" nowrap>
        <span class="badge text-bg-dark border">${p}</span>
      </td>
      <td class="text-truncate" style="max-width: 150px;" nowrap>${u}</td>
      <td class="model-cell" nowrap>
        <span class="model-text text-tooltip" title="${d}" data-bs-toggle="tooltip" data-bs-placement="top">${d}</span>
        <span class="visually-hidden">
        ${s} ${l} ${b} ${p} ${u} ${d} ${g} ${v} ${moment(y).format("YYYY-MM-DD")}
        </span>
      </td>
      <td data-column="type"><span class="column-type text-tooltip" title="${g}" data-bs-toggle="tooltip" data-bs-placement="top">${g}</span></td>
      <td class="color-cell" data-column="color"><span class="column-color text-tooltip" title="${v}" data-bs-toggle="tooltip" data-bs-placement="top">${v}</span></td>
      <td data-column="price" class="text-center" nowrap>
        <span class="badge text-bg-success h5 fw-bold price-badge">${r}</span>
      </td>
      

      <td class="text-center" data-column="photos" nowrap>
		${parseInt(I)>10?'<span class="photos-status text-tooltip" title="In-House Photos Done" data-bs-toggle="tooltip" data-bs-placement="top"><i class="bi bi-camera2 text-warning"></i><span class="visually-hidden" style="font-size: 10px;">FOM PHOTOS</span></span>':'<span class="photos-status text-tooltip" title="Awaiting Photo Shoot" data-bs-toggle="tooltip" data-bs-placement="top"><i class="bi bi-camera2 text-secondary"></i><span class="visually-hidden" style="font-size: 10px;">STOCK PHOTOS</span></span>'}
      </td>

	  <td data-column="updated" class="text-center" nowrap>
        	<span class="badge text-secondary p-2 fw-semibold border updated-badge"
              title="${M(y)?.format("MM-DD-YYYY")??"N/A"}"
              data-bs-toggle="tooltip"
              data-bs-placement="top">
            	${M(y)?.fromNow()??"N/A"}
            </span>
          <span class="small text-muted d-none">${M(y)?.format("MM-DD-YYYY")??"N/A"}</span>
        <span class="visually-hidden">${M(y)?.format("YYYY-MM-DD")??"N/A"}</span>
      </td>


      <td class="text-center nowrap action-cell p-1">
		<div class="action-button-group btn-group btn-group-sm rounded-5" role="group" aria-label="Button group with nested dropdown">
				<button type="button" id="keytagModalButton" class="btn btn-danger" title="Key Tag" data-bs-toggle="modal" data-bs-target="#keytagModal" data-bs-stocknumber="${s}">
					<i class="bi bi-phone rotated-label mx-1"></i>
					<span class="action-button-label px-2 visually-hidden">KEY TAG</span>
				</button>
				<button type="button" id="hangTagModalButton" class="btn btn-danger px-2" onclick="openHangTagsModal('${s}')">
					<i class="bi bi-tags mx-1"></i>
					<span class="action-button-label px-2 visually-hidden">Hang TAG</span>
				</button>
				<button type="button" id="quotePageButtom" class="btn btn-danger" title="Create Quote Image for texting" onclick="window.location.href = 'quote/?search=${s}'">
					<i class="bi bi-card-heading mx-1"></i>
					<span class="action-button-label px-2 visually-hidden">Quote</span>
				</button>
				<button 
					type="button"
					class="btn btn-danger"
					title="Goto TV Display Launcher"
					onclick="openTvWorkspaceModal('${s}')">
					<i class="bi bi-tv dropdown-icon mx-1"></i>
					<span class="action-button-label px-2 visually-hidden">TV Display</span>
				</button>

			<div class="btn-group" role="group">
				<button type="button" class="btn btn-danger dropdown-toggle no-caret" data-bs-toggle="dropdown" data-bs-boundary="viewport" data-bs-popper-config='{"strategy":"fixed"}' aria-expanded="false">
				</button>
				<ul class="dropdown-menu small text-capitalize text-start overflow-hidden dropdown-menu-end">

					<li class="small">
						<a href="javascript:void(0);" type="button" id="keytagModalButton" class="dropdown-item pe-5" title="Print Key Tags" data-bs-toggle="modal" data-bs-target="#keytagModal" data-bs-stocknumber="${s}">
							<i class="bi bi-tag dropdown-icon small me-2"></i>
							Print Key Tags
						</a>
					</li>


					<li class="small">
						<a href="javascript:void(0);" class="dropdown-item pe-5" title="Print Hang Tags" onclick="openHangTagsModal('${s}')">
							<i class="bi bi-tags dropdown-icon small me-2"></i>
							Print Hang Tags
						</a>
					</li>

					<li><hr class="dropdown-divider m-0"></li>

					<li class="small">
						<a href="javascript:void(0);" class="dropdown-item pe-5" title="Create Quote Image for texting" onclick="window.location.href = 'quote/?search=${s}'">
							<i class="bi bi-card-image dropdown-icon small me-2"></i>
							Create Quote for SMS
						</a>
					</li>


					<li class="small d-none">
						<a class="dropdown-item pe-5" href="javascript:void(0);" onclick="openOverlayModal('${s}')">
							<i class="bi bi-card-image dropdown-icon small me-2"></i>
							Build a Quote
						</a>
					</li>
					
					

					<li class="d-none">
						<a class="dropdown-item pe-5" href="javascript:void(0);" onclick="openQuoteModal('${s}')">
						<i class="bi bi-card-heading dropdown-icon small me-1"></i>
						Print Quote</a>
					</li>

					<li class="small">
						<a class="dropdown-item pe-5" href="javascript:void(0);" onclick="window.location.href = 'print/?s=${s}'">
						<i class="bi bi-card-heading dropdown-icon small me-2"></i>
						Generate PDF Brochure</a>
					</li>
					
					<li><hr class="dropdown-divider m-0"></li>
					<li class="small">
						<a class="dropdown-item pe-5" href="javascript:void(0);" title="Vehicle Details" onclick="window.location.href = 'details/?s=${s}'">
						<i class="bi bi-card-heading dropdown-icon small me-2"></i>
						Vehicle Details</a>
					</li>
					
					<li><hr class="dropdown-divider m-0"></li>

						<li class="small">
							<a 
							href="javascript:void(0);" 
							type="button"
							class="dropdown-item pe-5"
							title="Goto TV Display Launcher"
							onclick="openTvWorkspaceModal('${s}')">
							<i class="bi bi-tv dropdown-icon small me-2"></i>TV Display</a>
						</li>
				</ul>
			</div>
		</div>
	

        <div class="button-group d-none" role="group" aria-label="Vehicles">
        	<!-- Dropdown for creating keytags, hang tags, quotes, tv displays -->
			<div class="dropdown d-inline-block">
				<button class="btn btn-dark btn-sm rounded-pill px-3 d-flex align-items-center dropdown-toggle mx-1 no-caret" type="button" data-bs-toggle="dropdown" data-bs-boundary="viewport" data-bs-popper-config='{"strategy":"fixed"}' aria-expanded="false">
					<i class="bi bi-card-image ms-1 me-2"></i> <i class="bi bi-card-heading mx-1"></i> <i class="bi bi-tv mx-1"></i> 
				</button>
			</div>
		

				<!-- hidden buttons for now -->          
				<div class="d-none">
				<button type="button" id="keytagModalButton" class="btn btn-danger action-button mx-1" title="Print Key Tag" data-bs-toggle="modal" data-bs-target="#keytagModal" data-bs-stocknumber="${s}">
					<i class="bi bi-tag"></i>
					<span style="font-size:10px; text-transform:uppercase;">Key Tags</span>
				</button>

				<button type="button" class="btn btn-danger action-button mx-1" title="Print Hang Tags" data-bs-toggle="modal" data-bs-target="#hangTagsModal" data-bs-stocknumber="${s}" onclick="openHangTagsModal('${s}')">
					<i class="bi bi-tags"></i>
					<span style="font-size:10px; margin-top:-10px; padding:0; text-transform:uppercase;">Hang Tags</span>
				</button>
				
				<btn
					href="javascript:void(0);" 
					type="button" 
					class="btn btn-danger action-button mx-1"
					title="Quote this vehicle"
					onclick="window.location.href = 'quote/?search=${s}'"
				>
					<i class="bi bi-card-heading"></i>
					<span style="font-size:10px; text-transform:uppercase;">Quote</span>
				</btn>

				<btn
					href="javascript:void(0);" 
					type="button"
					class="d-none btn btn-danger action-button mx-1"
					title="Goto TV Display Launcher"
					onclick="window.location.href = 'tv/?stockInput=${s}'"
				>
					<i class="bi bi-tv"></i>
					<span style="font-size:10px; text-transform:uppercase;">TV DISPLAY</span>
				</btn>

				<btn
					href="javascript:void(0);" 
					type="button" 
					class="btn btn-danger action-button mx-1"
					style="display: none;"
					title="Pricing"
					data-bs-toggle="modal"
					data-bs-target="#pricingModal"
					onclick="openNewOverlayModal('${s}')"
				>
					<i class="bi bi-card-heading"></i>
					<span style="font-size:10px; text-transform:uppercase;">Overlay</span>
				</btn>
			</div>

        </div>  
      </td>`,e.appendChild(w)}),m.tableBody.appendChild(e),Y(),Ge(),Xe(),document.querySelectorAll(".badge[data-bs-toggle='tooltip']").forEach(a=>{new O(a)}),He()}function V(){try{const e="__storage_test__";localStorage.setItem(e,e),localStorage.removeItem(e);let t=0;try{for(let i=0;i<localStorage.length;i++){const s=localStorage.key(i),l=localStorage.getItem(s);t+=s.length+l.length}const a="a".repeat(1024);let n=0;const o="__space_test__";for(;n<5;)localStorage.setItem(`${o}${n}`,a),n++;for(let i=0;i<n;i++)localStorage.removeItem(`${o}${i}`);return console.log(`LocalStorage: Approximately ${Math.round(t/1024)}KB in use`),{available:!0,quotaExceeded:!1}}catch{return console.warn("LocalStorage quota may be limited - will use memory fallbacks if needed"),{available:!0,quotaExceeded:!0}}}catch(e){return console.error("LocalStorage not available",e),{available:!1,quotaExceeded:!1}}}function at(){const e=()=>{const a=navigator.connection||navigator.mozConnection||navigator.webkitConnection,n={online:navigator.onLine};return a&&(n.type=a.type,n.effectiveType=a.effectiveType,n.downlinkMax=a.downlinkMax,n.downlink=a.downlink,n.rtt=a.rtt,n.saveData=a.saveData),console.log("Network status:",n),n},t=e();return window.addEventListener("online",()=>{console.log("Network came online"),e()}),window.addEventListener("offline",()=>{console.log("Network went offline"),e()}),navigator.connection&&navigator.connection.addEventListener&&navigator.connection.addEventListener("change",e),t}let _=null,R=1;function k(){return{modal:document.getElementById("tvWorkspaceModal"),layoutOptions:Array.from(document.querySelectorAll("input[name='tvLayoutOption']")),stockInput:document.getElementById("tvWorkspaceStockInput"),stockHelp:document.getElementById("tvWorkspaceStockHelp"),useSelectedBtn:document.getElementById("tvUseSelectedBtn"),singleOptions:document.getElementById("tvWorkspaceSingleOptions"),themeSelect:document.getElementById("tvWorkspaceThemeSelect"),noteInput:document.getElementById("tvWorkspaceNoteInput"),swatchInput:document.getElementById("tvWorkspaceSwatchInput"),accent1Input:document.getElementById("tvWorkspaceAccent1Input"),accent2Input:document.getElementById("tvWorkspaceAccent2Input"),slideStartInput:document.getElementById("tvWorkspaceSlideStartInput"),slideEndInput:document.getElementById("tvWorkspaceSlideEndInput"),urlOutput:document.getElementById("tvWorkspaceUrlOutput"),previewShell:document.getElementById("tvWorkspacePreviewShell"),previewZoomable:document.getElementById("tvWorkspacePreviewZoomable"),previewFrame:document.getElementById("tvWorkspacePreviewFrame"),previewLoading:document.getElementById("tvWorkspacePreviewLoading"),previewBtn:document.getElementById("tvWorkspacePreviewBtn"),zoomOutBtn:document.getElementById("tvWorkspaceZoomOutBtn"),zoomFitBtn:document.getElementById("tvWorkspaceZoomFitBtn"),zoomInBtn:document.getElementById("tvWorkspaceZoomInBtn"),copyBtn:document.getElementById("tvWorkspaceCopyUrlBtn"),copyFooterBtn:document.getElementById("tvWorkspaceCopyUrlFooterBtn"),openBtn:document.getElementById("tvWorkspaceOpenLinkBtn")}}function X(){const t=Q()==="portrait";return{width:t?1080:1920,height:t?1920:1080,portrait:t}}function nt(){const e=k();if(!e.previewZoomable)return;const{portrait:t}=X();e.previewZoomable.classList.toggle("tv-workspace-preview-portrait",t)}function T(e){const t=k();if(!t.previewZoomable)return;const{width:a,height:n}=X(),o=Math.max(.15,Math.min(1.75,e));R=o,t.previewZoomable.style.width=`${a}px`,t.previewZoomable.style.height=`${n}px`,window.CSS?.supports?.("zoom: 1")?(t.previewZoomable.style.zoom=o,t.previewZoomable.style.transform=""):(t.previewZoomable.style.zoom="",t.previewZoomable.style.transform=`scale(${o})`)}function x(){const e=k();if(!e.previewShell)return 1;const{width:t,height:a}=X(),n=Math.max(200,e.previewShell.clientWidth-24),o=Math.max(200,e.previewShell.clientHeight-24),i=Math.min(n/t,o/a);return Math.max(.15,Math.min(1.75,i))}function Q(){return document.querySelector("input[name='tvLayoutOption']:checked")?.value||"portrait"}function W(e){const t=document.querySelector(`input[name='tvLayoutOption'][value='${e}']`);t&&(t.checked=!0)}function G(e=!1){const t=k(),a=new URL("tv/display/",window.location.href),n=Q(),o=(t.stockInput?.value||"").trim(),i=t.themeSelect?.value||"dark";if(a.searchParams.set("layout",n),a.searchParams.set("theme",i),n==="grid"){const s=o.split(",").map(l=>l.trim().toUpperCase()).filter(Boolean).slice(0,10);s.length&&a.searchParams.set("s",s.join(","))}else{const s=o.split(",")[0]?.trim().toUpperCase()||"";s&&a.searchParams.set("s",s);const l=(t.noteInput?.value||"").trim(),r=(t.swatchInput?.value||"").trim(),u=(t.accent1Input?.value||"").trim(),p=(t.accent2Input?.value||"").trim(),d=Number.parseInt(t.slideStartInput?.value,10),g=Number.parseInt(t.slideEndInput?.value,10);l&&a.searchParams.set("note",l),r&&a.searchParams.set("swatch",r),u&&a.searchParams.set("accent1",u),p&&a.searchParams.set("accent2",p),Number.isFinite(d)&&a.searchParams.set("slideStart",d),Number.isFinite(g)&&a.searchParams.set("slideEnd",g)}return e&&a.searchParams.set("preview","1"),a.toString()}function z(){const e=k(),a=Q()==="grid";e.singleOptions&&(e.singleOptions.style.display=a?"none":""),e.stockHelp&&(e.stockHelp.textContent=a?"Enter up to 10 stock numbers, comma-separated.":"Single stock number for portrait/landscape."),e.stockInput&&(e.stockInput.placeholder=a?"STOCK1, STOCK2, STOCK3 ...":"Enter stock number..."),nt()}function E(e=!1){const t=k(),a=G(!1);t.urlOutput&&(t.urlOutput.value=a),e&&t.previewFrame&&(t.previewLoading&&t.previewLoading.classList.remove("hidden"),t.previewFrame.src=G(!0))}async function oe(){const t=k().urlOutput?.value?.trim();if(t)try{await navigator.clipboard.writeText(t)}catch(a){console.error("Failed to copy TV URL:",a)}}function ot(){const t=k().urlOutput?.value?.trim()||G(!1);t&&window.open(t,"_blank","noopener,noreferrer")}function st(){const e=k(),t=F().slice(0,10);return t.length?(e.stockInput&&(e.stockInput.value=t.join(",")),t.length>1&&W("grid"),z(),E(!0),t):[]}function he(e){const t=k();if(!t.modal||!window.bootstrap?.Modal)return;_||(_=new J(t.modal));const a=document.body.getAttribute("data-bs-theme")||"dark";if(t.themeSelect&&(t.themeSelect.value=a==="light"?"light":"dark"),Array.isArray(e))t.stockInput&&(t.stockInput.value=e.slice(0,10).join(",")),W(e.length>1?"grid":"portrait");else if(typeof e=="string"&&e.trim())t.stockInput&&(t.stockInput.value=e.trim().toUpperCase()),W("portrait");else if(!t.stockInput?.value){const n=F();n.length&&(t.stockInput.value=n.slice(0,10).join(","),W(n.length>1?"grid":"portrait"))}z(),E(!0),T(x()),_.show()}window.openTvWorkspaceModal=he;function F(){const e=document.querySelectorAll(".tv-grid-select:checked");return Array.from(e).map(t=>t.dataset.stock).filter(Boolean)}function se(){const e=F(),t=document.getElementById("sendToTvGridBtn"),a=document.getElementById("selectedCount");t&&(t.disabled=e.length===0),a&&(a.textContent=e.length)}function lt(){const e=F();e.length!==0&&he(e.slice(0,10))}function le(){const e=k();e.layoutOptions.length&&e.layoutOptions.forEach(n=>{n.addEventListener("change",()=>{z(),E(!0),T(x())})}),e.modal&&(e.modal.addEventListener("shown.bs.modal",()=>{z(),E(!0),T(x())}),e.modal.addEventListener("hidden.bs.modal",()=>{e.previewFrame&&(e.previewFrame.src=""),e.previewLoading&&e.previewLoading.classList.add("hidden")})),e.previewFrame&&e.previewFrame.addEventListener("load",()=>{const n=k();n.previewLoading&&n.previewLoading.classList.add("hidden")}),e.stockInput&&e.stockInput.addEventListener("input",()=>E(!1)),e.noteInput&&e.noteInput.addEventListener("input",()=>E(!1)),e.swatchInput&&e.swatchInput.addEventListener("input",()=>E(!1)),e.accent1Input&&e.accent1Input.addEventListener("input",()=>E(!1)),e.accent2Input&&e.accent2Input.addEventListener("input",()=>E(!1)),e.slideStartInput&&e.slideStartInput.addEventListener("input",()=>E(!1)),e.slideEndInput&&e.slideEndInput.addEventListener("input",()=>E(!1)),e.themeSelect&&e.themeSelect.addEventListener("change",()=>E(!0)),e.previewBtn&&e.previewBtn.addEventListener("click",()=>{E(!0),T(x())}),e.zoomInBtn&&e.zoomInBtn.addEventListener("click",()=>T(R+.1)),e.zoomOutBtn&&e.zoomOutBtn.addEventListener("click",()=>T(R-.1)),e.zoomFitBtn&&e.zoomFitBtn.addEventListener("click",()=>T(x())),e.copyBtn&&e.copyBtn.addEventListener("click",oe),e.copyFooterBtn&&e.copyFooterBtn.addEventListener("click",oe),e.openBtn&&e.openBtn.addEventListener("click",ot),e.useSelectedBtn&&e.useSelectedBtn.addEventListener("click",st),window.addEventListener("resize",()=>{e.modal?.classList.contains("show")&&T(x())});const t=document.getElementById("selectAllCheckbox");t&&t.addEventListener("change",n=>{document.querySelectorAll(".tv-grid-select").forEach(i=>i.checked=n.target.checked),se()}),document.addEventListener("change",n=>{if(n.target.classList.contains("tv-grid-select")){se();const o=document.querySelectorAll(".tv-grid-select"),i=document.querySelectorAll(".tv-grid-select:checked");t&&(t.checked=o.length===i.length,t.indeterminate=i.length>0&&i.length<o.length)}});const a=document.getElementById("sendToTvGridBtn");a&&a.addEventListener("click",lt),z(),E(!1),T(x())}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",le):le();
