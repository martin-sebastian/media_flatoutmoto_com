import"./bootstrap.esm-CgEsG6e6.js";/* empty css              */import"./bootstrap-init-CxX6viQq.js";/* empty css           */const ee="https://newportal.flatoutmotorcycles.com/portal/public/api/majorunit/stocknumber/";let x={apr:4.99,down_payment_percent:0,term_months:240,sales_tax_rate:.07};async function te(){const e="https://nawvhznauxovsfjgawti.supabase.co",t="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hd3Zoem5hdXhvdnNmamdhd3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzkwMTEsImV4cCI6MjA2NzExNTAxMX0.wk5vBEU5M0-BcWOngJSVrIVKwJeDP6jaBSNo02n0v6c";try{const o=await fetch(`${e}/rest/v1/tv_display_settings?select=setting_key,setting_value`,{headers:{apikey:t,Authorization:`Bearer ${t}`}});if(!o.ok)return;const s=await o.json(),a={};for(const n of s)a[n.setting_key]=Number(n.setting_value);x={...x,...a},x.salesTaxRate=(a.sales_tax_rate??7)/100,x.apr=a.apr??x.apr,x.termMonths=a.term_months??x.term_months,x.downPaymentPercent=a.down_payment_percent??x.down_payment_percent,console.log("[TV Settings] Loaded from Supabase:",x)}catch(o){console.warn("[TV Settings] Using defaults — fetch failed:",o.message)}}const c=document.getElementById("displayRoot");let F=1;function se(){const e=window.CONFIG||{},t=new URLSearchParams(window.location.search),o=e.slides||t.get("slides")||"",s=Array.isArray(o)?o:o.split("|").map(r=>decodeURIComponent(r)).filter(Boolean),a=(e.stockNumber||t.get("s")||t.get("search")||"").trim(),n=a.includes(",")?a.split(",").map(r=>r.trim()).filter(Boolean):[a].filter(Boolean);return{layout:e.layout||t.get("layout")||"portrait",stockNumber:n[0]||"",stockNumbers:n,imageUrl:(e.imageUrl||t.get("img")||"").trim(),note:(e.note||t.get("note")||"").trim(),swatch:(e.swatch||t.get("swatch")||"").trim(),accent1:(e.accent1||t.get("accent1")||"").trim(),accent2:(e.accent2||t.get("accent2")||"").trim(),slides:s,theme:(e.theme||t.get("theme")||localStorage.getItem("theme")||"dark").trim(),slideStart:Number.parseInt(e.slideStart||t.get("slideStart")||"1",10),slideEnd:Number.parseInt(e.slideEnd||t.get("slideEnd")||"6",10),preview:e.preview||["1","true","yes"].includes((t.get("preview")||"").toLowerCase())}}function z(e){return(e||"").trim().toUpperCase()}function V(e){if(!c)return;const t=e!=="landscape"&&e!=="grid",o=t?1080:1920,s=t?1920:1080,a=20,n=window.innerWidth-a*2,r=window.innerHeight-a*2,i=Math.min(n/o,r/s);F=Number.isFinite(i)?Math.max(.05,Math.min(1,i)):1,document.body.style.cssText="",c.style.cssText="",document.body.style.width=`${o}px`,document.body.style.height=`${s}px`,document.body.style.overflow="hidden",document.body.style.margin="0",document.body.style.padding="0",document.body.style.background="#000",c.style.width=`${o}px`,c.style.height=`${s}px`,c.style.minHeight=`${s}px`,c.style.maxHeight=`${s}px`,c.style.overflow="hidden",c.style.position="fixed",c.style.top="0",c.style.left="0",c.style.transformOrigin="top left",c.style.transform=`scale(${F})`;const l=o*F,d=s*F,b=Math.max(0,(window.innerWidth-l)/2),u=Math.max(0,(window.innerHeight-d)/2);c.style.transform=`translate(${b}px, ${u}px) scale(${F})`}function ne(e){if(!c)return;const t=e!=="landscape"&&e!=="grid",o=t?1080:1920,s=t?1920:1080;document.body.style.width=`${o}px`,document.body.style.height=`${s}px`,document.body.style.overflow="hidden",document.body.style.margin="0",document.body.style.padding="0",document.body.style.background="#0f1115",c.style.width=`${o}px`,c.style.height=`${s}px`,c.style.minHeight=`${s}px`,c.style.overflow="hidden",c.style.background="#0f1115"}function j(e){c.innerHTML=e}async function oe(){try{const e=await fetch("../selected-images.json",{cache:"no-cache"});return e.ok?e.json():{}}catch(e){return console.error("Selected images load failed:",e),{}}}function ae(e,t){if(!e||!t)return{images:[],text:""};const o=e[t],s=e[t.toUpperCase()],a=e[t.toLowerCase()],n=o||s||a||{};return{images:Array.isArray(n.images)?n.images.filter(Boolean):[],text:typeof n.text=="string"?n.text:""}}function v(e){const t=Number(e);return Number.isFinite(t)?new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(t):"N/A"}function re(e,t,o){const s=Number(e),a=Number(o),n=Number(t)/100/12;return!Number.isFinite(s)||!Number.isFinite(a)||a<=0?0:!Number.isFinite(n)||n<=0?s/a:s*n/(1-Math.pow(1+n,-a))}function k(e){return typeof e=="string"?e.trim():""}function A(){return(document.body.getAttribute("data-bs-theme")||"dark").toLowerCase()==="light"?"../../img/fom-app-logo-02.svg":"../../img/fom-app-logo-01.svg"}function ie(e){if(!e)return"";try{const t=new URL(e);return t.origin+t.pathname.replace(/\/$/,"").toLowerCase()}catch{return e.split("?")[0].replace(/\/$/,"").toLowerCase()}}function le(e){const t=new Set;return e.filter(o=>{const s=ie(o);return t.has(s)?!1:(t.add(s),!0)})}function J(e,t){const o=(t||[]).filter(Boolean),s=(e||[]).sort((n,r)=>(n.Order||0)-(r.Order||0)).map(n=>k(n.ImgURL)).filter(Boolean);return(o.length?o:le(s)).map(n=>({type:"image",src:n,caption:""}))}function W(e){const o=(e||[]).find(s=>Number(s.Platform)===0)?.URL||"";return!o||o.includes("/")||o.includes(".")?'<div class="tv-video-frame"><img src="../../img/fallback.jpg" alt="Flatout Motorsports" class="object-fit-cover w-100 h-100" /></div>':`<div class="tv-video-frame"><iframe src="https://www.youtube.com/embed/${o}?autoplay=1&loop=1&playlist=${o}&mute=1" allowfullscreen></iframe></div>`}function Q(e,t,o,s){if(!t.length)return'<div class="tv-carousel"><img src="../../img/fallback.jpg" class="d-block w-100 tv-hero object-fit-cover" alt="Flatout Motorsports" /></div>';const a=Number.isFinite(o)?o:2,n=Number.isFinite(s)?s:6,r=Math.max(1,a),i=Math.max(r,n),l=t.slice(r-1,i),d=l.map((u,m)=>`
        <button type="button" data-bs-target="#${e}" data-bs-slide-to="${m}" ${m===0?'class="active" aria-current="true"':""} aria-label="Slide ${m+1}"></button>
      `).join(""),b=l.map((u,m)=>`
        <div class="carousel-item ${m===0?"active":""}">
          <img src="${u.src}" class="d-block w-100 tv-hero" alt="Vehicle image" />
        </div>
      `).join("");return`
    <div id="${e}" class="carousel slide carousel-fade tv-carousel" data-bs-ride="carousel" data-bs-interval="7000" data-bs-pause="false" data-bs-wrap="true">
      <div class="carousel-indicators">
        ${d}
      </div>
      <div class="carousel-inner">
        ${b}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#${e}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${e}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `}function X(){!window.bootstrap||!window.bootstrap.Carousel||document.querySelectorAll(".tv-carousel").forEach(e=>{new bootstrap.Carousel(e,{interval:7e3,pause:!1,ride:"carousel",wrap:!0})})}function E(e){const t=(e||"").toLowerCase();return t.includes("color")||t.includes("mint")||t.includes("paint")}function ce(e,t,o,s){const a=(e||[]).filter(n=>n&&n.Included===!0).filter(n=>k(n.Description)||k(n.ImageDescription)||k(n.ImgURL)).filter(n=>{const r=k(n.Description),i=k(n.ImageDescription);return!E(r)&&!E(i)}).slice(0,3).map(n=>{const r=k(n.Description)||"Feature",i=k(n.ImageDescription),l=k(n.ImgURL);return`
        <div class="tv-feature-row">
          ${l?`<img src="${l}" class="tv-feature-thumb" alt="${r}" />`:'<div class="tv-feature-thumb-icon"><i class="bi bi-check-circle"></i></div>'}
          <div class="tv-feature-text">
            <div class="fw-semibold">${r}</div>
            ${i?`<div class="text-secondary small">${i}</div>`:""}
          </div>
        </div>
      `}).join("");return a?`<div class="tv-feature-list">${a}</div>`:""}function L(e,t=!1){const o=t?"fw-semibold":"";return(e||[]).filter(s=>k(s.Description)).map(s=>`<li class="list-group-item d-flex justify-content-between align-items-center py-1 px-2 lh-sm ${o}" style="font-size: 1rem;">
          <span>${k(s.Description)}</span>
          <span class="ms-2">${v(s.Amount)}</span>
        </li>`).join("")}async function O(e){if(!e)return null;try{const t=`_t=${Date.now()}`,o=`${ee}${encodeURIComponent(e)}?${t}`,s=await fetch(o,{cache:"no-cache"});return s.ok?s.json():null}catch(t){return console.error("Portal API error:",t),null}}function H(e){if(!e)return null;const t=[e.ModelYear,e.Manufacturer,e.ModelName,e.ModelType].filter(Boolean).join(" "),o=(e.Images||[]).sort((s,a)=>(s.Order||0)-(a.Order||0)).map(s=>s.ImgURL).filter(Boolean);return{stockNumber:e.StockNumber||"",title:t,year:e.ModelYear||"",manufacturer:e.Manufacturer||"",modelName:e.ModelName||"",modelType:e.ModelType||"",category:e.Category||e.ModelType||"",usage:e.Usage||"",price:e.SalePrice||e.MSRPUnit||e.MSRP||0,images:o,webURL:e.WebURL||e.DetailUrl||"",vin:e.VIN||""}}function q(e){if(!window.QRCode)return;const t=document.getElementById("qrCode");if(!t)return;const o=e&&e!=="N/A"?e:window.location.href;t.innerHTML="",new QRCode(t,{text:o,width:120,height:120,correctLevel:QRCode.CorrectLevel.M})}function Z(e,t=0){if(!e)return null;const o=Number(e.MSRPUnit||e.MSRP||t)||0,s=e.DiscountItems||[],a=e.MfgRebatesFrontEnd||e.MatItems||[],n=e.OTDItems||[],r=s.reduce((p,w)=>p+(Number(w.Amount)||0),0),i=a.reduce((p,w)=>p+(Number(w.Amount)||0),0),l=Math.abs(r+i),d=o+r+i,b=16,u=[],m=[];for(const p of n)p.Flag!==b&&(/title/i.test(p.Description)?m.push(p):u.push(p));const f=u.reduce((p,w)=>p+(Number(w.Amount)||0),0),g=m.reduce((p,w)=>p+(Number(w.Amount)||0),0),y=d+f,$=Math.round(y*x.salesTaxRate*100)/100,M=y+$+g,h=re(M,x.apr,x.termMonths);return{msrp:o,discountsTotal:r,rebatesTotal:i,savings:l,salePrice:d,taxableFees:u,taxableFeesTotal:f,nonTaxableFees:m,nonTaxableFeesTotal:g,beforeTax:y,salesTax:$,totalPrice:M,monthlyPayment:h,discounts:s,rebates:a}}function G(e,t,o,s,a){const n=Z(t,e?.price),r=n?.msrp||Number(t?.MSRPUnit||t?.MSRP)||0,i=n?.salePrice||r,l=i<r,d=n?.totalPrice||0,b=n?.monthlyPayment||0,u=n?.savings||0,m=t?.Color||"",f=o||"#4bd2b1",g=s||"#1f6feb",y=a||"#f97316",$=t?.Phone||"",M=t?.StandardFeatures||t?.B50StandardFeatures||t?.standardFeatures||"",h=n?[{Description:`Sales Tax (${(x.salesTaxRate*100).toFixed(0)}%)`,Amount:n.salesTax}]:[];return{msrpValue:r,salePrice:i,hasDiscount:l,savings:u,totalValue:d,monthlyPayment:b,beforeTax:n?.beforeTax||0,colorName:m,swatch:f,accent1:g,accent2:y,phone:$,standardFeatures:M,featureMarkup:ce(t?.AccessoryItems||t?.MUItems),taxableFeesMarkup:L(n?.taxableFees||[]),nonTaxableFeesMarkup:L(n?.nonTaxableFees||[]),taxMarkup:L(h),rebatesMarkup:L(n?.rebates||[],!0),discountMarkup:L(n?.discounts||[],!0)}}function de(e,t,o){const{msrpValue:s,salePrice:a,hasDiscount:n,totalValue:r,monthlyPayment:i,colorName:l,swatch:d,accent1:b,accent2:u,phone:m,standardFeatures:f,featureMarkup:g,taxableFeesMarkup:y,nonTaxableFeesMarkup:$,taxMarkup:M,rebatesMarkup:h,discountMarkup:p}=t,C=(e.usage||"").toLowerCase()==="new"&&n&&s?`<div class="text-secondary h6 small mb-0 text-decoration-line-through">MSRP ${v(s)}</div>
       <div class="h1 mb-0 fw-black">${v(a)}</div>`:`<div class="h1 mb-0 fw-black">${v(a)}</div>`,N=s?`<li class="list-group-item d-flex justify-content-between align-items-center py-1 px-2" style="font-size: 0.95rem;"><span>MSRP</span><span class="ms-2">${v(s)}</span></li>`:"",I=`<li class="list-group-item d-flex justify-content-between align-items-center py-0 px-2 fw-semibold border-top" style="font-size: 0.95rem;"><span>Sub Total</span><span class="ms-2">${v(a)}</span></li>`,S=`
    <ul class="list-group list-group-flush tv-line-items-scroll">
      ${N}
      ${h}
      ${p}
      ${I}
      ${y}
      ${M}
      ${$}
      ${r?`<li class="list-group-item d-flex justify-content-between align-items-center py-0 px-2 fw-semibold fs-5 text-danger border-top"><span>Total</span><span class="ms-2">${v(r)}</span></li>`:""}
    </ul>`;return`
  <div class="badge fs-5 bg-dark rounded-pill" style="position: absolute; top: 20px; left: 25px; z-index: 1;">${e.usage||"N/A"}</div>
  <div class="badge fs-5 bg-danger rounded-pill" style="position: absolute; top: 20px; left: 120px; z-index: 1;">${e.stockNumber||"N/A"}</div>
  <div class="badge fs-1 fw-black bg-warning text-dark rounded-pill" style="position: absolute; top: 20px; right: 20px; z-index: 1;">${o?`<div class="text-black text-end">${o}</div>`:""}</div>
  <div id="qrCode" class="position-absolute" style="top: 580px; left: 25px; z-index: 1;"></div>
    <div class="tv-middle-grid">
      <!-- Left: Show Special + pricing + line items -->
      <div class="card tv-box px-4 py-2 d-flex flex-column overflow-hidden">
        <div>
          <h2 class="text-uppercase text-danger mb-0 h2 fw-black">Boat Show Price</h2>
          <h5 class="d-none text-secondary text-uppercase mb-0 fw-semibold"><span class="d-none badge bg-success p-1 me-2">${e.usage||"N/A"}</span>${e.title||""}</h5>
          ${l?`
            <div class="d-none justify-content-between align-items-start gap-2 mt-2">
              <span class="text-secondary small">${l}</span>
              <div class="d-flex align-items-center gap-2">
                <span class="tv-color-dot tv-color-dot-lg" style="background-color: ${d};"></span>
                <span class="tv-color-dot tv-color-dot-lg" style="background-color: ${b};"></span>
                <span class="tv-color-dot tv-color-dot-lg" style="background-color: ${u};"></span>
              </div>
            </div>
          `:""}
        </div>
        <div class="flex-grow-1"></div>
        <div class="card px-4 py-2 d-flex flex-column align-items-center">
          ${C}
          <div class="d-flex align-items-baseline mt-0 mb-0 p-0 fw-semibold text-danger fs-6">
            <span class="me-2 text-secondary">Est. payment</span>
            <span class="tv-payment-amount fs-5">${v(i)}</span>
            <span class="me-2 text-secondary">/mo</span>
          </div>
        </div>
        <div class="flex-grow-1"></div>
        ${S}
      </div>

      <!-- Right: Features + contact/QR -->
      <div class="card tv-box p-3 d-flex flex-column">
        <div class="flex-grow-1 overflow-hidden">
          ${f?`<div class="tv-standard-features tv-line-items-scroll text-default mb-0">${f}</div>`:""}
          
          ${g?`<div class="mt-2">${g}</div>`:""}
        </div>
        <hr class="my-2 opacity-25" />
        <div class="d-flex align-items-center justify-content-around">
          
          <div class="d-flex flex-column justify-content-center align-items-center">
            <img src="${A()}" alt="Logo" width="260" height="60" />
            ${m?`<div class="d-none mt-3 h2 fw-semibold text-secondary text-center">${m}</div>`:""}
          </div>
        </div>
      </div>
    </div>
  `}function ue(e,t,o,s,a,n,r,i,l,d){const b=J(s?.Images,a),u=Q("tvCarouselPortrait",b,n,r),m=W(s?.Videos),f=G(e,s,i,l,d),g=de(e,f,o);j(`
    <div class="tv-layout-portrait mx-auto">
      <div class="tv-skeleton mx-auto">
        <div class="tv-region-carousel">
          ${u}
        </div>
        <div class="tv-region-middle">
          ${g}
        </div>
        <div class="tv-region-video">
          ${m}
        </div>
      </div>
    </div>
  `),q(e.webURL),X()}function me(e,t,o,s,a,n,r,i,l,d){const b=J(s?.Images,a),u=Q("tvCarouselLandscape",b,n,r),m=W(s?.Videos),f=G(e,s,i,l,d),{msrpValue:g,salePrice:y,hasDiscount:$,totalValue:M,monthlyPayment:h,colorName:p,swatch:w,accent1:T,accent2:C,phone:N,standardFeatures:I,featureMarkup:S,taxableFeesMarkup:_,nonTaxableFeesMarkup:U,taxMarkup:P,rebatesMarkup:Y,discountMarkup:K}=f,B=(e.usage||"").toLowerCase()==="new"&&$,D=`
    <ul class="list-group list-group-flush tv-line-items-scroll">
      ${B?`<li class="list-group-item d-flex justify-content-between align-items-center py-1 px-2 small text-secondary" style="font-size: 1rem;"><span>MSRP</span><span class="ms-2">${v(g)}</span></li>
       <li class="list-group-item d-flex justify-content-between align-items-center py-1 px-2 small" style="font-size: 1rem;"><span class="text-secondary">Sub Total</span><span class="ms-2 fw-semibold">${v(y)}</span></li>`:`<li class="list-group-item d-flex justify-content-between align-items-center py-1 px-2 small" style="font-size: 1rem;"><span class="text-secondary">Sub Total</span><span class="ms-2 fw-semibold">${v(y)}</span></li>`}
      ${Y}
      ${K}
      ${_}
      ${P}
      ${U}
      ${M?`<li class="list-group-item d-flex justify-content-between align-items-center py-1 px-2 fw-bold border-top border-secondary border-opacity-25"><span>Total</span><span class="ms-2">${v(M)}</span></li>`:""}
    </ul>`;j(`
    <div class="tv-layout-landscape mx-auto">
      <div class="tv-landscape-skeleton">
        <!-- Top-left: Carousel -->
        <div class="tv-region-carousel">
          ${u}
        </div>
        
        <!-- Top-right: Combined pricing + line items -->
        <div class="tv-region-right-info">
          <div class="tv-box p-3 d-flex flex-column overflow-hidden">
            <div class="h2 text-danger fw-bolder text-uppercase mb-2">Boat Show Price</div>
            <div class="d-flex align-items-center gap-2 mb-1"> 
              <span class="badge bg-danger">${e.usage||"N/A"}</span>
              <span class="text-secondary text-uppercase fw-semibold small">${e.title||""}</span>
            </div>
            <div class="text-secondary small">${e.stockNumber||""}</div>
            ${p?`
              <div class="d-flex align-items-center gap-2 mt-1">
                <span class="text-secondary small">${p}</span>
                <div class="d-flex align-items-center gap-2">
                  <span class="tv-color-dot tv-color-dot-lg" style="background-color: ${w};"></span>
                  <span class="tv-color-dot tv-color-dot-lg" style="background-color: ${T};"></span>
                  <span class="tv-color-dot tv-color-dot-lg" style="background-color: ${C};"></span>
                </div>
              </div>
            `:""}
            <div class="flex-grow-1"></div>
            <div class="d-flex flex-column align-items-end">
              ${B?`<div class="text-secondary small text-decoration-line-through">MSRP ${v(g)}</div>
                   <div class="display-6 fw-bold text-light">${v(y)}</div>`:`<div class="text-secondary small">Price</div>
                   <div class="display-6 fw-bold text-light">${v(y)}</div>`}
              <div class="d-flex align-items-baseline fw-semibold text-danger fs-5">
                <span class="me-2">Est. payment</span><span class="tv-payment-amount fs-3">${v(h)}/mo</span>
              </div>
            </div>
            <hr class="my-2 opacity-25" />
            ${D}
          </div>
        </div>
        
        <!-- Bottom-left: Combined features + contact -->
        <div class="tv-region-left-info">
          <div class="tv-box p-3 d-flex flex-column">
            ${I?`<div class="tv-standard-features tv-line-items-scroll mb-2">${I}</div>`:""}
            ${o?`<div class="mb-2">${o}</div>`:""}
            ${S?`<div class="flex-grow-1 overflow-hidden">${S}</div>`:""}
            <div class="flex-grow-1"></div>
            <hr class="my-2 opacity-25" />
            <div class="d-flex align-items-center justify-content-around">
              <div id="qrCode" class="tv-qr"></div>
              <div class="d-flex flex-column justify-content-center align-items-center">
                <img src="${A()}" alt="Logo" width="180" height="27" />
                ${N?`<div class="mt-2 text-secondary small">${N}</div>`:""}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom-right: Video -->
        <div class="tv-region-video">
          ${m}
        </div>
      </div>
    </div>
  `),q(e.webURL),X()}function pe(e,t){const o=e.images[0]||"../../img/fallback.jpg",s=Z(t,e?.price),a=s?.msrp||Number(t?.MSRPUnit||t?.MSRP)||0,n=s?.salePrice||a,r=n<a,l=(e.usage||"").toLowerCase()==="new"&&r,d=s?.savings||0;return`
    <div class="tv-grid-card">
      <div class="tv-grid-card-image">
        <img src="${o}" alt="${e.title||"Vehicle"}" />
      </div>
      <div class="tv-grid-card-info">
        <div class="tv-grid-card-title">${e.year||""} ${e.manufacturer||""}</div>
        <div class="tv-grid-card-model">${e.modelName||""}</div>
        <div class="tv-grid-card-stock">${e.stockNumber||""}</div>
        <div class="tv-grid-card-pricing">
          ${l?`<div class="tv-grid-card-row"><span>MSRP</span><span class="tv-grid-card-msrp">${v(a)}</span></div>
               <div class="tv-grid-card-row"><span>Sale</span><span class="tv-grid-card-price">${v(n)}</span></div>`:`<div class="tv-grid-card-row"><span>Price</span><span class="tv-grid-card-price">${v(n||a)}</span></div>`}
          ${d>0?`<div class="tv-grid-card-row tv-grid-card-savings"><span>Savings</span><span>-${v(d)}</span></div>`:""}
        </div>
      </div>
    </div>
  `}function ve(e){const t=e.map(({data:o,apiData:s})=>pe(o,s)).join("");j(`
    <div class="tv-layout-grid">
      <div class="tv-grid-header">
        <img src="${A()}" alt="Flatout Motorsports" class="tv-grid-logo" />
      </div>
      <div class="tv-grid-container">
        ${t}
      </div>
    </div>
  `)}function R(e){c.innerHTML=`<div class="text-center text-secondary">${e}</div>`}async function ge(){await te();const{layout:e,stockNumber:t,stockNumbers:o,imageUrl:s,note:a,slideStart:n,slideEnd:r,swatch:i,accent1:l,accent2:d,theme:b,slides:u,preview:m}=se();document.body.setAttribute("data-bs-theme",b||"dark"),m?(V(e),window.addEventListener("resize",()=>V(e))):ne(e);try{if(e==="grid"){if(!o.length){R("Provide stock numbers for grid display (comma-separated).");return}const U=(await Promise.all(o.slice(0,10).map(P=>O(z(P))))).filter(P=>P).map(P=>({data:H(P),apiData:P}));if(!U.length){R("No vehicles found. Check stock numbers.");return}ve(U);return}if(!t){R("Provide a stock number to display.");return}const f=z(t),[g,y]=await Promise.all([O(f),oe()]);if(!g){R("Vehicle not found. Check the stock number.");return}const $=H(g),M=ae(y,f),h=u&&u.length?u:M.images,p=h.length?1:n,w=h.length?h.length:r,T=s||h[0]||$.images[0]||"",C=a||M.text||"",N=i||"",I=l||"",S=d||"";e==="landscape"?me($,T,C,g,h,p,w,N,I,S):ue($,T,C,g,h,p,w,N,I,S)}catch(f){console.error("Display error:",f),R("Failed to load display data.")}}ge();
