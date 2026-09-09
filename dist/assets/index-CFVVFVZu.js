(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(){this.mouse={x:0,y:0,targetX:0,targetY:0},this.scrollY=0,this.init()}init(){this.starsLayer=document.querySelector(`.parallax-layer-stars`),this.skylineLayer=document.querySelector(`.parallax-layer-skyline`),this.floatingBursts=document.querySelectorAll(`.floating-comic-burst`),this.heroBgArt=document.querySelector(`.hero-bg-art`),this.heroContent=document.querySelector(`.hero-content-layer`),window.addEventListener(`mousemove`,e=>this.onMouseMove(e),{passive:!0}),window.addEventListener(`scroll`,()=>this.onScroll(),{passive:!0}),this.setupTiltCards(),this.render=this.render.bind(this),requestAnimationFrame(this.render)}onMouseMove(e){let t=window.innerWidth/2,n=window.innerHeight/2;this.mouse.targetX=(e.clientX-t)/t,this.mouse.targetY=(e.clientY-n)/n}onScroll(){this.scrollY=window.scrollY||window.pageYOffset}setupTiltCards(){document.querySelectorAll(`.tilt-card, .slab-card, .comic-release-card, .tournament-card, .staff-card`).forEach(e=>{if(e.dataset.tiltInitialized===`true`)return;if(e.dataset.tiltInitialized=`true`,!e.querySelector(`.tilt-card-glare`)){let t=document.createElement(`div`);t.className=`tilt-card-glare`,e.appendChild(t)}let t=null;e.addEventListener(`mouseenter`,()=>{t=e.getBoundingClientRect(),e.style.transition=`transform 0.08s ease-out, box-shadow 0.2s ease`}),e.addEventListener(`mousemove`,n=>{t||=e.getBoundingClientRect();let r=Math.max(0,Math.min(t.width,n.clientX-t.left)),i=Math.max(0,Math.min(t.height,n.clientY-t.top)),a=t.width/2,o=t.height/2,s=(i-o)/o*-6,c=(r-a)/a*6;e.style.transform=`perspective(1000px) rotateX(${s.toFixed(2)}deg) rotateY(${c.toFixed(2)}deg) translateY(-4px)`;let l=e.querySelector(`.tilt-card-glare`);if(l){let e=r/t.width*100,n=i/t.height*100;l.style.background=`radial-gradient(circle at ${e}% ${n}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,l.style.opacity=`1`}}),e.addEventListener(`mouseleave`,()=>{t=null,e.style.transition=`transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease`,e.style.transform=`perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;let n=e.querySelector(`.tilt-card-glare`);n&&(n.style.opacity=`0`)})})}render(){this.mouse.x+=(this.mouse.targetX-this.mouse.x)*.08,this.mouse.y+=(this.mouse.targetY-this.mouse.y)*.08;let e=this.mouse.x,t=this.mouse.y;if(this.starsLayer){let n=e*-20,r=t*-16;this.starsLayer.style.transform=`translate3d(${n.toFixed(2)}px, ${r.toFixed(2)}px, 0)`}if(this.skylineLayer){let n=e*14,r=t*8;this.skylineLayer.style.transform=`translate3d(${n.toFixed(2)}px, ${r.toFixed(2)}px, 0)`}if(this.floatingBursts&&this.floatingBursts.length>0&&this.floatingBursts.forEach((n,r)=>{let i=12+r*6,a=e*i,o=t*i+Math.sin(Date.now()*.002+r)*6;n.style.transform=`translate3d(${a.toFixed(2)}px, ${o.toFixed(2)}px, 0)`}),this.heroBgArt){let n=e*-24,r=t*-20;this.heroBgArt.style.transform=`scale(1.12) translate3d(${n.toFixed(2)}px, ${r.toFixed(2)}px, 0)`}if(this.heroContent){let n=e*12,r=t*10;this.heroContent.style.transform=`translate3d(${n.toFixed(2)}px, ${r.toFixed(2)}px, 0)`}requestAnimationFrame(this.render)}},t=class{constructor(e){this.parallaxEngine=e,this.pages=[],this.tabs=[],this.currentIndex=0,this.isFlipping=!1,this.flipDuration=800,this.container=document.querySelector(`.comic-book-container`),this.comicBook=document.querySelector(`.comic-book`),this.init()}init(){if(this.pages=Array.from(document.querySelectorAll(`.comic-page`)),this.tabs=Array.from(document.querySelectorAll(`.tab-bookmark`)),this.prevBtn=document.getElementById(`btn-prev-page`),this.nextBtn=document.getElementById(`btn-next-page`),this.pageIndicator=document.getElementById(`page-indicator-text`),this.pages.length===0)return;let e=window.location.hash.replace(`#`,``),t=e.startsWith(`blog/`)?`blog`:e,n=this.pages.findIndex(e=>e.dataset.pageId===t);n===-1&&(n=0),this.showPageInstant(n),this.tabs.forEach((e,t)=>{e.addEventListener(`click`,()=>{t!==this.currentIndex&&this.goToPage(t)})}),this.prevBtn&&this.prevBtn.addEventListener(`click`,()=>this.previousPage()),this.nextBtn&&this.nextBtn.addEventListener(`click`,()=>this.nextPage()),document.querySelectorAll(`.page-curl-right`).forEach(e=>{e.addEventListener(`click`,e=>{e.stopPropagation(),this.nextPage()})}),document.querySelectorAll(`.page-curl-left`).forEach(e=>{e.addEventListener(`click`,e=>{e.stopPropagation(),this.previousPage()})}),window.addEventListener(`keydown`,e=>{[`INPUT`,`TEXTAREA`].includes(document.activeElement.tagName)||(e.key===`ArrowRight`||e.key===`PageDown`?this.nextPage():(e.key===`ArrowLeft`||e.key===`PageUp`)&&this.previousPage())});let r=0,i=0,a=document.querySelector(`.comic-pages-viewport`)||document.body;a.addEventListener(`touchstart`,e=>{r=e.changedTouches[0].screenX,i=e.changedTouches[0].screenY},{passive:!0}),a.addEventListener(`touchend`,e=>{let t=e.changedTouches[0].screenX,n=e.changedTouches[0].screenY,a=t-r,o=n-i;Math.abs(a)>45&&Math.abs(a)>Math.abs(o)*1.2&&(a<0?this.nextPage():this.previousPage())},{passive:!0}),window.addEventListener(`popstate`,()=>{let e=window.location.hash.replace(`#`,``),t=this.pages.findIndex(t=>t.dataset.pageId===e);t!==-1&&t!==this.currentIndex&&this.goToPage(t,!1)});let o=document.getElementById(`mobile-menu-toggle`),s=document.getElementById(`mobile-nav-drawer`);o&&s&&(o.addEventListener(`click`,e=>{e.stopPropagation();let t=s.classList.toggle(`open`);o.classList.toggle(`open`,t),o.setAttribute(`aria-expanded`,t?`true`:`false`)}),document.addEventListener(`click`,e=>{!s.contains(e.target)&&!o.contains(e.target)&&(s.classList.remove(`open`),o.classList.remove(`open`),o.setAttribute(`aria-expanded`,`false`))})),document.querySelectorAll(`.mobile-menu-item`).forEach((e,t)=>{e.addEventListener(`click`,()=>{s&&s.classList.remove(`open`),o&&(o.classList.remove(`open`),o.setAttribute(`aria-expanded`,`false`)),this.goToPage(t)})})}showPageInstant(e){this.currentIndex=e,this.pages.forEach((t,n)=>{t.classList.remove(`active`,`flipping-out-forward`,`flipping-in-forward`,`flipping-out-backward`,`flipping-in-backward`),n===e&&t.classList.add(`active`)}),this.applyProgressiveOffScreenDrift(e),this.updateControls()}applyProgressiveOffScreenDrift(e){if(!this.container||!this.comicBook)return;this.container.style.transform=`none`;let t=e*3,n=(this.pages.length-1-e)*3;this.comicBook.style.boxShadow=`
      0 20px 45px -10px rgba(15, 23, 42, 0.22),
      -${t+4}px 8px 18px rgba(15, 23, 42, 0.15),
      ${n+4}px 8px 18px rgba(15, 23, 42, 0.15),
      0 0 0 1px rgba(15, 23, 42, 0.08)
    `,this.container.style.setProperty(`--page-index`,e)}goToPage(e,t=!0){if(this.isFlipping||e===this.currentIndex||e<0||e>=this.pages.length)return;this.isFlipping=!0;let n=e>this.currentIndex,r=this.pages[this.currentIndex],i=this.pages[e];if(this.pages.forEach(e=>{e.classList.remove(`flipping-out-forward`,`flipping-in-forward`,`flipping-out-backward`,`flipping-in-backward`)}),n?(r.classList.add(`flipping-out-forward`),i.classList.add(`flipping-in-forward`)):(r.classList.add(`flipping-out-backward`),i.classList.add(`flipping-in-backward`)),this.currentIndex=e,this.applyProgressiveOffScreenDrift(e),this.updateControls(),t){let e=i.dataset.pageId;e&&window.history.pushState(null,``,`#${e}`)}setTimeout(()=>{r.classList.remove(`active`,`flipping-out-forward`,`flipping-out-backward`),i.classList.remove(`flipping-in-forward`,`flipping-in-backward`),i.classList.add(`active`),this.isFlipping=!1,window.scrollTo({top:0,behavior:`smooth`}),this.parallaxEngine&&this.parallaxEngine.setupTiltCards()},this.flipDuration)}nextPage(){this.currentIndex<this.pages.length-1&&this.goToPage(this.currentIndex+1)}previousPage(){this.currentIndex>0&&this.goToPage(this.currentIndex-1)}updateControls(){if(this.tabs.forEach((e,t)=>{t===this.currentIndex?e.classList.add(`active`):e.classList.remove(`active`)}),this.prevBtn&&(this.prevBtn.disabled=this.currentIndex===0),this.nextBtn&&(this.nextBtn.disabled=this.currentIndex===this.pages.length-1),this.pageIndicator&&this.pages[this.currentIndex]){let e=this.pages[this.currentIndex].dataset.pageTitle||`Page ${this.currentIndex+1}`;this.pageIndicator.textContent=`PAGE ${this.currentIndex+1} / ${this.pages.length} • ${e.toUpperCase()}`}document.querySelectorAll(`.mobile-menu-item`).forEach((e,t)=>{t===this.currentIndex?e.classList.add(`active`):e.classList.remove(`active`)})}},n=`modulepreload`,r=function(e,t){return new URL(e,t).href},i={},a=function(e,t,a){let o=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function u(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}o=l(t.map(t=>{if(t=r(t,a),t=u(t),t in i)return;i[t]=!0;let o=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let r=e[n];if(r.href===t&&(!o||r.rel===`stylesheet`))return}let s=document.createElement(`link`);if(s.rel=o?`stylesheet`:n,o||(s.as=`script`),s.crossOrigin=``,s.href=t,c&&s.setAttribute(`nonce`,c),document.head.appendChild(s),o)return new Promise((e,n)=>{s.addEventListener(`load`,e),s.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(t=>{for(let e of t||[])e.status===`rejected`&&s(e.reason);return e().catch(s)})},o=async e=>{try{if(typeof window<`u`&&typeof window.confetti==`function`)window.confetti(e);else{let t=await a(()=>import(`https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/+esm`),[],import.meta.url),n=t.default||t;typeof n==`function`&&n(e)}}catch{}},s=class{constructor(){this.storageKey=`comic_pull_box_v2`,this.items=this.loadItems(),this.init()}loadItems(){try{let e=localStorage.getItem(this.storageKey);if(e)return JSON.parse(e)}catch(e){console.warn(`Could not load pull list from localStorage`,e)}return[{id:`nr-1`,title:`Cosmic Crusader #1: Dawn of Eternity`,publisher:`Marvel Comics`,price:4.99,quantity:1,variant:`Foil Virgin Variant`},{id:`nr-2`,title:`Neon Shadows #1: Protocol Omega`,publisher:`Image Comics`,price:4.99,quantity:1,variant:`Regular Cover A`}]}saveItems(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.items))}catch(e){console.warn(`Could not save pull list`,e)}}addItem(e){let t=this.items.find(t=>t.id===e.id||t.title===e.title);t?t.quantity=(t.quantity||1)+1:this.items.push({id:e.id||`custom-`+Date.now(),title:e.title,publisher:e.publisherLabel||e.publisher||`Comic Series`,price:Number(e.price)||4.99,quantity:1,variant:e.variant||`Standard Cover`}),this.saveItems(),this.render(),this.showToast(`Added "${e.title}" to your Pull Box! 📦✨`),o({particleCount:25,spread:45,origin:{y:.8}})}removeItem(e){if(e>=0&&e<this.items.length){let t=this.items.splice(e,1);this.saveItems(),this.render(),t.length>0&&this.showToast(`Removed "${t[0].title}" from Pull Box.`)}}updateQuantity(e,t){this.items[e]&&(this.items[e].quantity=Math.max(1,(this.items[e].quantity||1)+t),this.saveItems(),this.render())}addCustomTitle(e,t=`Ongoing Series`){!e||!e.trim()||this.addItem({id:`custom-`+Date.now(),title:e.trim(),publisher:t.trim()||`Custom Title`,price:4.99,variant:`Standard Ongoing`})}clear(){this.items=[],this.saveItems(),this.render(),this.showToast(`Pull Box cleared.`)}getCalculations(){let e=this.items.reduce((e,t)=>e+(t.quantity||1),0),t=this.items.reduce((e,t)=>e+(t.price||4.99)*(t.quantity||1),0),n=0,r=`Standard Subscriber`;e>=20?(n=20,r=`VIP Collector (20% OFF)`):e>=10?(n=15,r=`Premier Pull (15% OFF)`):e>=5&&(n=10,r=`Fan Favorite (10% OFF)`);let i=n/100*t,a=t-i;return{totalTitles:e,subtotal:t,discountPercent:n,discountAmount:i,finalTotal:a,tierName:r}}showToast(e){let t=document.getElementById(`comic-toast`);t||(t=document.createElement(`div`),t.id=`comic-toast`,t.className=`comic-toast`,document.body.appendChild(t)),t.textContent=e,t.classList.add(`visible`),setTimeout(()=>{t.classList.remove(`visible`)},3e3)}init(){this.container=document.getElementById(`pull-list-items`),this.summaryContainer=document.getElementById(`pull-list-summary`),this.badgeElements=document.querySelectorAll(`.pull-count-badge, #tab-pull-badge`),this.customForm=document.getElementById(`custom-pull-form`),this.customForm&&this.customForm.addEventListener(`submit`,e=>{e.preventDefault();let t=document.getElementById(`custom-title-input`),n=document.getElementById(`custom-publisher-input`);t&&t.value&&(this.addCustomTitle(t.value,n?n.value:`Ongoing`),t.value=``,n&&(n.value=``))}),this.render()}render(){let e=this.items.reduce((e,t)=>e+(t.quantity||1),0);if(this.badgeElements.forEach(t=>{t&&(t.textContent=e,t.style.display=e>0?`inline-flex`:`none`)}),!this.container||!this.summaryContainer)return;this.items.length===0?this.container.innerHTML=`
        <div class="empty-pull-box" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">📦</div>
          <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--text-primary); margin-bottom: 0.5rem;">YOUR PULL BOX IS EMPTY</h4>
          <p style="font-size: 0.9rem; max-width: 320px; margin: 0 auto 1.25rem;">
            Browse the <strong>New Arrivals Radar</strong> or enter custom ongoing titles below to start your subscription!
          </p>
        </div>
      `:(this.container.innerHTML=this.items.map((e,t)=>`
        <div class="pull-item-card" data-index="${t}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem; border-bottom: 1.5px dashed var(--border-subtle); background: var(--bg-card); margin-bottom: 0.4rem; border-radius: 6px;">
          <div style="flex: 1; padding-right: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
              <span class="badge" style="background: #0f172a; color: #fff; font-size: 0.7rem; padding: 0.15rem 0.45rem;">${e.publisher}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${e.variant||`Standard`}</span>
            </div>
            <strong style="color: var(--text-primary); font-size: 0.95rem; display: block; line-height: 1.3;">${e.title}</strong>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--comic-red); font-weight: 700;">$${(e.price||4.99).toFixed(2)}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="display: flex; align-items: center; border: 1.5px solid #0f172a; border-radius: 4px; background: #fff;">
              <button class="pull-qty-btn" data-action="dec" data-index="${t}" style="background: none; border: none; color: #0f172a; cursor: pointer; padding: 0 6px; font-weight: 900;">-</button>
              <span style="font-weight: 800; min-width: 18px; text-align: center; color: #0f172a;">${e.quantity}</span>
              <button class="pull-qty-btn" data-action="inc" data-index="${t}" style="background: none; border: none; color: #0f172a; cursor: pointer; padding: 0 6px; font-weight: 900;">+</button>
            </div>
            <button class="pull-remove-btn" data-index="${t}" style="background: var(--comic-red); border: 1px solid #0f172a; color: #fff; border-radius: 4px; padding: 0.3rem 0.5rem; cursor: pointer; font-size: 0.8rem; font-weight: 700;">✕</button>
          </div>
        </div>
      `).join(``),this.container.querySelectorAll(`.pull-qty-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.dataset.index),n=e.dataset.action;this.updateQuantity(t,n===`inc`?1:-1)})}),this.container.querySelectorAll(`.pull-remove-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.dataset.index);this.removeItem(t)})}));let t=this.getCalculations();this.summaryContainer.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border-bottom: 2px solid #0f172a; padding-bottom: 0.75rem;">
        <h3 class="font-display" style="font-size: 1.4rem; color: #0f172a;">BOX SUMMARY</h3>
        <span class="pull-badge-discount">${t.tierName}</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.95rem; margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Active Pulls:</span>
          <strong style="color: #0f172a;">${t.totalTitles} titles / issues</strong>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Estimated Retail:</span>
          <span>$${t.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--comic-green);">
          <span>Subscriber Savings (${t.discountPercent}%):</span>
          <span>-$${t.discountAmount.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Bag & Board Protection:</span>
          <span style="color: #0f172a; font-weight: 800;">FREE</span>
        </div>
      </div>

      <div style="border-top: 2px solid #0f172a; padding-top: 0.85rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-family: var(--font-display); font-size: 1.2rem; color: #0f172a;">ESTIMATED TOTAL:</span>
        <span class="comic-title-burst" style="font-size: 1.6rem; color: #0f172a;">$${t.finalTotal.toFixed(2)}</span>
      </div>

      <button id="btn-export-pull" class="btn btn-primary" style="width: 100%; margin-bottom: 0.75rem;">
        RESERVE / EXPORT PULL CODE 🚀
      </button>
      <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center;">
        Present at the store counter or email to contact@yourcomicshop.example for instant subscription setup.
      </p>
    `;let n=document.getElementById(`btn-export-pull`);n&&n.addEventListener(`click`,()=>this.showExportModal())}showExportModal(){let e=this.getCalculations(),t=document.getElementById(`generic-modal-backdrop`),n=document.getElementById(`generic-modal-title`),r=document.getElementById(`generic-modal-body`);if(!t||!r)return;let i=`COMIC-PULL-`+Math.random().toString(36).substring(2,8).toUpperCase();n.textContent=`COMIC STORE PULL BOX RESERVATION`,r.innerHTML=`
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div class="sound-burst" style="font-size: 1.1rem; margin-bottom: 0.75rem;">RESERVATION CODE GENERATED</div>
        <div style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 900; background: #0f172a; color: var(--comic-yellow); padding: 0.75rem; border: 2px solid var(--comic-yellow); border-radius: 8px; letter-spacing: 0.15em;">
          ${i}
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
          Bring this code to the store counter or email it to set up your subscription pull box discount!
        </p>
      </div>

      <div style="background: #f8fafc; border: 2px solid #0f172a; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <h4 style="color: #0f172a; font-family: var(--font-display); margin-bottom: 0.5rem;">RESERVED TITLES:</h4>
        <ul style="list-style: square inside; font-size: 0.9rem; color: #334155; line-height: 1.6;">
          ${this.items.map(e=>`<li><strong>${e.title}</strong> (${e.quantity}x) — $${(e.price*e.quantity).toFixed(2)}</li>`).join(``)}
        </ul>
      </div>

      <div style="display: flex; gap: 1rem;">
        <button id="btn-copy-pull-code" class="btn btn-primary" style="flex: 1;">
          📋 COPY RESERVATION SLIP
        </button>
        <button id="btn-close-modal-action" class="btn btn-secondary">
          CLOSE
        </button>
      </div>
    `,t.classList.add(`open`);let a=document.getElementById(`btn-copy-pull-code`);a&&a.addEventListener(`click`,()=>{let t=`COMIC STORE PULL BOX RESERVATION\nCode: ${i}\nItems:\n`+this.items.map(e=>`- ${e.title} (${e.quantity}x)`).join(`
`)+`\nTotal Estimated: $${e.finalTotal.toFixed(2)}`;navigator.clipboard.writeText(t).then(()=>{a.textContent=`COPIED TO CLIPBOARD! ✨`})});let o=document.getElementById(`btn-close-modal-action`);o&&o.addEventListener(`click`,()=>t.classList.remove(`open`))}},c=[{id:`nr-1`,title:`Cosmic Crusader #1: Dawn of Eternity`,publisher:`marvel`,publisherLabel:`Marvel Comics`,writer:`Alex Mercer`,artist:`David Ross`,price:4.99,cover:`./assets/blank_white.png`,badge:`Staff Pick`,description:`An epic cosmic odyssey begins! When an ancient anomaly threatens the galactic rim, the universe's mightiest defender steps forward.`,stock:25,variant:`Foil Virgin Variant`},{id:`nr-2`,title:`Neon Shadows #1: Protocol Omega`,publisher:`image`,publisherLabel:`Image Comics`,writer:`Kairo Vance`,artist:`Elena Vance`,price:4.99,cover:`./assets/blank_white.png`,badge:`Hot Release`,description:`Cyberpunk vigilante noir. In the rain-soaked alleys of a futuristic megacity, a lone cyber-detective uncovers a global conspiracy.`,stock:20,variant:`1:25 Incentive Cover`},{id:`nr-3`,title:`Chrono Knight #1: Masters of the Rift`,publisher:`indie`,publisherLabel:`Indie Spotlight`,writer:`Marcus Stone`,artist:`Sarah Chen`,price:3.99,cover:`./assets/blank_white.png`,badge:`Key Issue`,description:`Time fractures across the multiverse! A warrior armed with temporal armor battles through historical epochs to save reality.`,stock:18,variant:`Artist Edition Variant`},{id:`nr-4`,title:`Shadow Detective: Dark Alley Murders #1`,publisher:`dc`,publisherLabel:`DC Comics`,writer:`Victor Vance`,artist:`Leo Martinez`,price:4.99,cover:`./assets/blank_white.png`,badge:`Top Seller`,description:`A gritty psychological thriller in the heart of the metropolis. When the city sleeps, the detective tracks an elusive underworld mastermind.`,stock:30,variant:`Cardstock Foil Cover`},{id:`nr-5`,title:`Mythic Realm: Book of Prophecies #1`,publisher:`indie`,publisherLabel:`Fantasy Forge`,writer:`Lyra Thorne`,artist:`Gareth Cole`,price:5.99,cover:`./assets/blank_white.png`,badge:`Debut Series`,description:`High fantasy epic filled with ancient dragons, rogue sorcerers, and legendary blades awaiting their rightful wielder.`,stock:15,variant:`Collector Gold Foil`},{id:`nr-6`,title:`Cyber Mecha Strike Zero Vol. 1`,publisher:`manga`,publisherLabel:`Manga Press`,writer:`Kenji Sato`,artist:`Yuki Tanaka`,price:12.99,cover:`./assets/blank_white.png`,badge:`Vol 1 Graphic Novel`,description:`Oversized graphic novel edition collecting the explosive mecha tournament arc with 200+ action-packed illustrated pages.`,stock:12,variant:`First Edition Tankōbon`}],l=[{id:`grail-1`,title:`Cosmic Crusader #1 (Collector Classic)`,grade:`9.8`,gradeType:`CGC Universal Grade`,cert:`CGC #1002948201`,price:2450,publisher:`Vintage Classic`,cover:`./assets/blank_white.png`,notes:`White pages. High grade key issue. Flawless spine and sharp centering.`,signers:`Verified Universal Grade`},{id:`grail-2`,title:`Chrono Knight: Ashcan Edition #1`,grade:`9.9`,gradeType:`CBCS Mint Reserve`,cert:`CBCS #22-839210-001`,price:1750,publisher:`Limited Foil Press`,cover:`./assets/blank_white.png`,notes:`Flawless corners. Limited printing run. Pristine high-gloss foil finish.`,signers:`Certified 1st Print`},{id:`grail-3`,title:`Neon Shadows: Zero Hour Variant #1`,grade:`9.6`,gradeType:`CGC Signature Series`,cert:`CGC #8492019482`,price:890,publisher:`Collector Incentive`,cover:`./assets/blank_white.png`,notes:`Off-White to White Pages. Rare 1:100 retail incentive variant cover.`,signers:`Verified Creator Signature`}],u=[{id:`tcg-pokemon-weekly`,game:`Pokémon TCG`,gameClass:`game-pokemon`,logo:`./assets/logo_pokemon.png`,event:`Weekly Pokémon League & Casual Play`,dayTime:`Fridays: Weekly at 4:00 PM`,entry:`$5.00 entry`,prize:`Booster packs & League Promos`,format:`Standard Constructed & Open Play`,banner:`./assets/blank_white.png`,spotsLeft:16},{id:`tcg-mtg-draft`,game:`Magic: The Gathering`,gameClass:`game-mtg`,logo:`./assets/logo_mtg.png`,event:`Friday Night Magic: Booster Draft`,dayTime:`Fridays: Weekly at 6:30 PM`,entry:`$18.00`,prize:`FNM Promo Packs & Booster Rewards`,format:`Booster Draft (3 Packs) + Swiss`,banner:`./assets/blank_white.png`,spotsLeft:16},{id:`tcg-yugioh-weekly`,game:`Yu-Gi-Oh!`,gameClass:`game-yugioh`,logo:`./assets/logo_yugioh.png`,event:`Yu-Gi-Oh! Local Tournament`,dayTime:`Saturdays: Weekly at 1:00 PM`,entry:`$5.00`,prize:`Official OTS Packs & Store Credit`,format:`Advanced Constructed Swiss`,banner:`./assets/blank_white.png`,spotsLeft:20},{id:`tcg-onepiece-monthly`,game:`One Piece CCG`,gameClass:`game-onepiece`,logo:`./assets/logo_onepiece.png`,event:`One Piece Card Game Tournament`,dayTime:`2nd Saturday of Every Month at 3:00 PM`,entry:`$5.00`,prize:`Bandai Tournament Packs & Winner Cards`,format:`Constructed Swiss`,banner:`./assets/blank_white.png`,spotsLeft:16}],d=[{pageNumber:1,title:`Page 1: The Gateway to Adventure`,narration:`A quiet afternoon in the comic shop... until the pages begin to glow!`,panels:[{caption:`PANEL 1`,dialog:`Look at the comic racks! The multiverse frequency is fluctuating!`,speaker:`Hero`},{caption:`PANEL 2`,dialog:`Grab your dice and your cape! An epic adventure is about to start!`,speaker:`Sidekick`}]},{pageNumber:2,title:`Page 2: The Adventure Unfolds`,narration:`Cosmic energy fills the room as heroes leap from the panels...`,panels:[{caption:`PANEL 3`,dialog:`KA-POW! The portal has opened! Welcome to our comic universe!`,speaker:`Cosmic Knight`},{caption:`PANEL 4`,dialog:`Customize this reader with your own comic pages and illustrations!`,speaker:`Narrator`}]}],f=class{constructor(){this.pages=d,this.currentPageIndex=0,this.isOpen=!1,this.init()}init(){this.modal=document.getElementById(`comic-reader-modal`),this.pageNumberDisplay=document.getElementById(`reader-page-num`),this.pageLeftEl=document.getElementById(`reader-page-left`),this.pageRightEl=document.getElementById(`reader-page-right`),this.btnPrev=document.getElementById(`reader-btn-prev`),this.btnNext=document.getElementById(`reader-btn-next`),this.btnClose=document.getElementById(`reader-btn-close`),this.btnPrev&&this.btnPrev.addEventListener(`click`,()=>this.previousPage()),this.btnNext&&this.btnNext.addEventListener(`click`,()=>this.nextPage()),this.btnClose&&this.btnClose.addEventListener(`click`,()=>this.close()),window.addEventListener(`keydown`,e=>{this.isOpen&&(e.key===`Escape`&&this.close(),e.key===`ArrowRight`&&this.nextPage(),e.key===`ArrowLeft`&&this.previousPage())})}open(e=0){this.isOpen=!0,this.currentPageIndex=e,this.modal&&(this.modal.classList.add(`open`),document.documentElement.classList.add(`modal-open`),document.body.classList.add(`modal-open`)),this.render()}close(){this.isOpen=!1,this.modal&&(this.modal.classList.remove(`open`),document.documentElement.classList.remove(`modal-open`),document.body.classList.remove(`modal-open`))}nextPage(){this.currentPageIndex<this.pages.length-1&&(this.currentPageIndex++,this.render())}previousPage(){this.currentPageIndex>0&&(this.currentPageIndex--,this.render())}render(){let e=this.pages[this.currentPageIndex];e&&(this.pageNumberDisplay&&(this.pageNumberDisplay.textContent=`ISSUE SPREAD ${this.currentPageIndex+1} / ${this.pages.length}`),this.btnPrev&&(this.btnPrev.disabled=this.currentPageIndex===0),this.btnNext&&(this.btnNext.disabled=this.currentPageIndex===this.pages.length-1),this.pageLeftEl&&(this.pageLeftEl.innerHTML=`
        <div class="reader-caption">COMIC SPREAD SAMPLER • ISSUE PREVIEW</div>
        <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: #0f172a; margin-bottom: 0.5rem;">${e.title}</h3>
        <p style="font-family: var(--font-comic); font-style: italic; font-size: 0.95rem; line-height: 1.4; margin-bottom: 1rem; color: #334155;">
          "${e.narration}"
        </p>
        
        <div style="flex: 1; border: 3px solid #0f172a; border-radius: 6px; overflow: hidden; position: relative; background: #0f172a; min-height: 240px; box-shadow: var(--shadow-comic);">
          <img src="./assets/blank_white.png" style="width: 100%; height: 100%; object-fit: cover; background: #ffffff;" alt="Comic Scene Artwork" />
          <div class="sound-burst" style="position: absolute; bottom: 15px; left: 15px; font-size: 1.2rem; transform: rotate(-8deg);">
            CRACKLE!
          </div>
        </div>
      `),this.pageRightEl&&(this.pageRightEl.innerHTML=`
        <div style="display: flex; flex-direction: column; gap: 1rem; height: 100%;">
          ${e.panels.map((e,t)=>`
            <div class="reader-comic-panel" style="flex: 1; min-height: 160px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(135deg, #fff 0%, #f8fafc 100%); position: relative; border-color: #0f172a;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-family: var(--font-display); font-size: 1rem; background: #0f172a; color: var(--comic-yellow); padding: 0.1rem 0.5rem; border-radius: 4px;">${e.caption}</span>
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #64748b; font-weight: 700;">SPEAKER: ${e.speaker}</span>
              </div>
              
              <div style="background: #ffffff; border: 2px solid #0f172a; border-radius: 12px; padding: 0.75rem 1rem; font-family: var(--font-comic); font-weight: 700; font-size: 0.95rem; line-height: 1.3; box-shadow: 2px 2px 0 #0f172a; margin-top: 0.5rem; position: relative; color: #0f172a;">
                "${e.dialog}"
                <div style="position: absolute; bottom: -8px; left: 24px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #0f172a;"></div>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
                <div class="sound-burst ${t%2==0?`red`:`blue`}" style="font-size: 0.95rem;">
                  ${t%2==0?`KA-POW!`:`THWIP!`}
                </div>
              </div>
            </div>
          `).join(``)}
        </div>
      `))}},p=class{constructor(e,t,n){this.pullList=e,this.reader=t,this.pageEngine=n,this.activeFilter=`all`,this.searchQuery=``,this.currentTheme=localStorage.getItem(`comic_theme`)||`light`,this.init()}init(){this.applyTheme(this.currentTheme),this.setupThemeSelector(),this.setupStoreStatus(),this.setupSideSlideshow(),this.setupFCBDCountdown(),this.renderTournaments(),this.renderNewReleases(),this.renderGrailVault(),this.setupModals(),this.setupQuickTriggers()}setupSideSlideshow(){let e=document.getElementById(`side-spotlight-slideshow`);if(!e)return;let t=e.querySelectorAll(`.slideshow-slide`);if(t.length<=1)return;let n=0;setInterval(()=>{t[n].classList.remove(`active`),n=(n+1)%t.length,t[n].classList.add(`active`)},4500)}applyTheme(e){this.currentTheme=e,e===`light`?document.documentElement.removeAttribute(`data-theme`):document.documentElement.setAttribute(`data-theme`,e),localStorage.setItem(`comic_theme`,e),document.querySelectorAll(`.theme-toggle-btn`).forEach(t=>{t.innerHTML=e===`dark`?`☀️`:`🌙`,t.title=e===`dark`?`Switch to Light Mode`:`Switch to Dark Graphic Novel Mode`})}setupThemeSelector(){document.querySelectorAll(`.theme-toggle-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=this.currentTheme===`light`?`dark`:`light`;this.applyTheme(n);let r=n===`dark`?`Dark Graphic Novel Mode ✨`:`Modern Clean Light Mode ✨`;this.showThemeToast(e,r)})})}setupFCBDCountdown(){let e=document.getElementById(`fcbd-days`),t=document.getElementById(`fcbd-hours`),n=document.getElementById(`fcbd-minutes`),r=document.getElementById(`fcbd-seconds`),i=document.getElementById(`fcbd-target-date`);if(!e||!t||!n||!r)return;let a=(()=>{let e=new Date,t=e.getFullYear(),n=e=>{let t=(6-new Date(e,4,1,9,0,0).getDay()+7)%7;return new Date(e,4,1+t,9,0,0)},r=n(t);return e.getTime()>r.getTime()+864e5&&(r=n(t+1)),r})();i&&(i.textContent=`Next FCBD: ${a.toLocaleDateString(`en-US`,{weekday:`short`,month:`short`,day:`numeric`,year:`numeric`})}`);let o=()=>{let o=new Date().getTime(),s=a.getTime()-o;if(s<=0){e.textContent=`00`,t.textContent=`00`,n.textContent=`00`,r.textContent=`00`,i&&(i.textContent=`🎉 FREE COMIC BOOK DAY IS TODAY! 🎉`);return}let c=Math.floor(s/864e5),l=Math.floor(s%864e5/36e5),u=Math.floor(s%36e5/6e4),d=Math.floor(s%6e4/1e3);e.textContent=String(c).padStart(2,`0`),t.textContent=String(l).padStart(2,`0`),n.textContent=String(u).padStart(2,`0`),r.textContent=String(d).padStart(2,`0`)};o(),setInterval(o,1e3)}setupStoreStatus(){let e=document.getElementById(`store-live-status`);if(!e)return;let t=new Date,n=t.getDay(),r=t.getHours(),i=!1;i=n===0?r>=12&&r<18:r>=11&&r<20,e.innerHTML=i?`
        <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981;"></span>
        <strong style="color: var(--comic-green); font-weight: 800;">STORE IS OPEN NOW</strong> • Welcome!
      `:`
        <span style="display: inline-block; width: 10px; height: 10px; background: var(--comic-red); border-radius: 50%;"></span>
        <strong class="store-closed-status">CURRENTLY CLOSED</strong> • Opens 11 AM Tomorrow
      `}renderTournaments(){let e=document.getElementById(`tcg-events-grid`);e&&(e.innerHTML=u.map(e=>`
      <div class="tournament-card tilt-card">
        <div style="display: flex; justify-content: space-between; align-items: center; min-height: 48px;">
          ${e.logo?`
            <img src="${e.logo}" alt="${e.game}" style="max-height: 42px; max-width: 140px; object-fit: contain;" />
          `:`
            <span class="game-icon-pill ${e.gameClass}">
              ⚔️ ${e.game}
            </span>
          `}
          <span style="font-size: 0.78rem; color: var(--comic-yellow); font-weight: 800; background: var(--bg-surface); padding: 0.2rem 0.6rem; border-radius: 4px; border: 1px solid var(--comic-yellow);">
            ${e.game}
          </span>
        </div>

        <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); line-height: 1.3; margin-top: 0.3rem;">
          ${e.event}
        </h4>

        <div style="background: var(--bg-surface-elevated); border: 2px solid var(--border-comic); border-radius: 6px; padding: 0.65rem 0.85rem; font-size: 0.85rem;">
          <div class="event-time-highlight" style="margin-bottom: 0.25rem;">🕒 ${e.dayTime}</div>
          <div style="color: var(--text-secondary); margin-bottom: 0.15rem;">Format: <strong>${e.format}</strong></div>
          <div style="color: var(--text-secondary);">Cost: <strong style="color: var(--text-primary);">${e.entry}</strong></div>
        </div>

        <div class="amber-highlight-box" style="padding: 0.5rem 0.75rem; font-size: 0.82rem; margin-top: auto;">
          <strong class="event-prize-highlight">🏆 PRIZE / REWARDS:</strong>
          <div style="color: var(--text-primary); font-weight: 700; margin-top: 0.15rem;">${e.prize}</div>
        </div>
      </div>
    `).join(``))}renderNewReleases(){let e=document.getElementById(`new-releases-grid`);if(!e)return;e.innerHTML=(this.activeFilter===`all`?c:c.filter(e=>e.publisher.toLowerCase()===this.activeFilter.toLowerCase())).map(e=>`
      <div class="comic-release-card tilt-card" data-comic-id="${e.id}">
        <span class="publisher-tag publisher-${e.publisher}">
          ${e.publisherLabel||e.publisher}
        </span>
        <div class="release-cover-wrap">
          <img src="${e.cover}" alt="${e.title}" loading="lazy" />
        </div>
        <div class="release-body">
          <div>
            <h4 class="release-title">${e.title}</h4>
            <div class="release-creators">By ${e.writer} & ${e.artist}</div>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 0.75rem;">
              ${e.description}
            </p>
          </div>
          <div class="release-footer">
            <span class="release-price">$${e.price.toFixed(2)}</span>
            <button class="btn btn-primary btn-add-pull" data-id="${e.id}" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">
              + PULL BOX
            </button>
          </div>
        </div>
      </div>
    `).join(``),e.querySelectorAll(`.btn-add-pull`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=c.find(t=>t.id===e.dataset.id);n&&this.pullList&&this.pullList.addItem(n)})});let t=document.querySelectorAll(`.releases-filter-btn`);t.forEach(e=>{e.addEventListener(`click`,()=>{t.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),this.activeFilter=e.dataset.filter||`all`,this.renderNewReleases()})})}renderGrailVault(){let e=document.getElementById(`grail-vault-grid`);e&&(e.innerHTML=l.map(e=>`
      <div class="slab-card tilt-card" data-grail-id="${e.id}">
        <div class="slab-header">
          <div class="slab-grade-box">
            <span class="slab-grade-score">${e.grade}</span>
            <span class="slab-grade-type">${e.gradeType}</span>
          </div>
          <span class="slab-cert-badge">${e.cert}</span>
        </div>
        <div class="slab-cover-frame">
          <img src="${e.cover}" alt="${e.title}" class="slab-cover-img" loading="lazy" />
          <div class="slab-hologram"></div>
        </div>
        <div class="slab-info">
          <h4 class="slab-title">${e.title}</h4>
          <div class="slab-meta">
            <span>${e.publisher}</span>
            <span class="slab-price">$${e.price.toLocaleString()}</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.4;">
            ${e.notes}
          </p>
          <div style="margin-top: 0.75rem;">
            <button class="btn btn-outline-comic btn-inquire-grail" data-id="${e.id}" style="width: 100%; font-size: 0.82rem; padding: 0.4rem 0.6rem;">
              💎 INQUIRE / HOLD SLAB
            </button>
          </div>
        </div>
      </div>
    `).join(``),e.querySelectorAll(`.btn-inquire-grail`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=l.find(t=>t.id===e.dataset.id);n&&this.showGrailModal(n)})}))}showGrailModal(e){let t=document.getElementById(`generic-modal-backdrop`),n=document.getElementById(`generic-modal-title`),r=document.getElementById(`generic-modal-body`);if(!t||!r)return;n.textContent=`COLLECTOR SLAB: ${e.title}`,r.innerHTML=`
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center; margin-bottom: 1.5rem;">
        <div style="max-width: 180px; flex-shrink: 0;">
          <img src="${e.cover}" alt="${e.title}" style="width: 100%; border: 2px solid #0f172a; border-radius: 6px;" />
        </div>
        <div style="flex: 1; min-width: 240px;">
          <div class="sound-burst red" style="font-size: 0.85rem; margin-bottom: 0.4rem;">${e.gradeType} • GRADE ${e.grade}</div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem; color: #0f172a;">${e.title}</h3>
          <p style="font-size: 0.9rem; color: #334155; line-height: 1.5; margin-bottom: 0.75rem;">${e.notes}</p>
          <div style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem;">
            $${e.price.toLocaleString()}
          </div>
          <span style="font-size: 0.75rem; color: #64748b; font-family: var(--font-mono);">Certification: ${e.cert}</span>
        </div>
      </div>
      <div style="background: #f1f5f9; border: 1.5px solid #0f172a; border-radius: 6px; padding: 0.85rem; margin-bottom: 1.25rem; font-size: 0.88rem; color: #334155;">
        To place a hold on this vintage graded comic, call our counter at <strong>(555) 123-4567</strong> or email <strong>contact@yourcomicshop.example</strong> referencing <strong>${e.cert}</strong>.
      </div>
      <button id="btn-close-grail-modal" class="btn btn-primary" style="width: 100%;">
        CLOSE WINDOW
      </button>
    `,t.classList.add(`open`);let i=document.getElementById(`btn-close-grail-modal`);i&&i.addEventListener(`click`,()=>t.classList.remove(`open`))}setupModals(){let e=document.getElementById(`generic-modal-backdrop`),t=document.getElementById(`generic-modal-close`);e&&t&&(t.addEventListener(`click`,()=>{e.classList.remove(`open`),document.documentElement.classList.remove(`modal-open`),document.body.classList.remove(`modal-open`)}),e.addEventListener(`click`,t=>{t.target===e&&(e.classList.remove(`open`),document.documentElement.classList.remove(`modal-open`),document.body.classList.remove(`modal-open`))}))}setupQuickTriggers(){let e=document.getElementById(`hero-btn-events`);e&&e.addEventListener(`click`,()=>{let e=this.pageEngine.pages.findIndex(e=>e.getAttribute(`data-page-id`)===`events`);e!==-1&&this.pageEngine.goToPage(e)});let t=document.getElementById(`hero-btn-pull-list`);t&&t.addEventListener(`click`,()=>{let e=this.pageEngine.pages.findIndex(e=>e.getAttribute(`data-page-id`)===`ordering`);e!==-1&&this.pageEngine.goToPage(e)});let n=document.getElementById(`hero-btn-new-releases`);n&&n.addEventListener(`click`,()=>{let e=this.pageEngine.pages.findIndex(e=>e.getAttribute(`data-page-id`)===`new-arrivals`||e.getAttribute(`data-page-id`)===`newreleases`);e!==-1&&this.pageEngine.goToPage(e)})}showThemeToast(e,t){if(!e)return;if(this.themeToastEl&&document.body.contains(this.themeToastEl)){clearTimeout(this.themeToastTimeout),this.themeToastEl.innerHTML=`<span>🎨</span> <span>${t}</span>`,this.themeToastEl.classList.remove(`updating`),this.themeToastEl.offsetWidth,this.themeToastEl.classList.add(`updating`),this.positionThemeToast(e,this.themeToastEl),this.themeToastTimeout=setTimeout(()=>{this.dismissThemeToast()},2200);return}let n=document.createElement(`div`);n.className=`theme-popover-toast`,n.innerHTML=`<span>🎨</span> <span>${t}</span>`,document.body.appendChild(n),this.themeToastEl=n,this.positionThemeToast(e,n),this.themeToastTimeout=setTimeout(()=>{this.dismissThemeToast()},2200)}positionThemeToast(e,t){let n=e.getBoundingClientRect(),r=t.getBoundingClientRect(),i=n.bottom+8,a=n.right-r.width;a<12&&(a=12),a+r.width>window.innerWidth-12&&(a=window.innerWidth-r.width-12),t.style.top=`${i}px`,t.style.left=`${a}px`}dismissThemeToast(){this.themeToastEl&&document.body.contains(this.themeToastEl)&&(this.themeToastEl.style.opacity=`0`,this.themeToastEl.style.transform=`translateY(-6px)`,setTimeout(()=>{this.themeToastEl&&this.themeToastEl.parentNode&&(this.themeToastEl.remove(),this.themeToastEl=null)},250))}showToast(e){let t=document.getElementById(`comic-toast-container`);if(!t)return;let n=document.createElement(`div`);n.className=`comic-toast`,n.innerHTML=`<span>💥</span> <span>${e}</span>`,t.appendChild(n),setTimeout(()=>{n.style.opacity=`0`,n.style.transform=`translateY(-10px)`,n.style.transition=`all 0.3s ease`,setTimeout(()=>n.remove(),300)},3200)}},m=`comic_store_blog_cache_v2`,h=9e5,g=[{id:`post-welcome-to-comic-shop`,slug:`welcome-to-our-comic-book-store`,title:`Welcome to [Your Comic Shop Name] - Your Comic & Gaming Hub!`,publishedDate:new Date().toISOString(),formattedDate:`Today`,author:`Store Team`,categories:[`Announcements`,`Community`,`Welcome`],featuredImage:`./assets/blank_white.png`,excerpt:`Welcome to our store! Explore thousands of new releases, back issues, tabletop gaming events, and our signature subscription pull-box service.`,contentHtml:`
      <div class="blog-notice-box">
        <strong>Store Hours: Monday - Saturday 11:00 AM - 7:00 PM, Sunday 12:00 PM - 5:00 PM!</strong><br>
        Curbside Pick-up & Local Holds Available! Call (555) 123-4567 or email contact@yourcomicshop.example
      </div>
      <p>Welcome to <strong>[Your Comic Shop Name]</strong>! We are dedicated to bringing comic book lovers, collectors, and gamers the finest selection of graphic novels, single issues, variants, and gaming gear.</p>
      <h3>What You'll Find at Our Store:</h3>
      <ul>
        <li><strong>New Comic Book Day Every Wednesday:</strong> Fresh weekly titles from Marvel, DC, Image, Dark Horse, Boom!, Manga, and independent publishers.</li>
        <li><strong>Free Pull-Box Subscriptions:</strong> Never miss an issue! Add your favorite ongoing series and receive exclusive subscriber discounts.</li>
        <li><strong>Card Games & Tabletop Tournaments:</strong> Weekly casual and competitive events for Magic: The Gathering, Pokémon, Yu-Gi-Oh!, and board games.</li>
        <li><strong>Collector's Grail Vault:</strong> High-grade certified comics (CGC/CBCS) and vintage back issues.</li>
      </ul>
      <p>Stop by today, meet fellow fans, and let us know what titles you're excited to read!</p>
    `,originalUrl:`#blog`},{id:`post-new-comics-day-picks`,slug:`new-comic-book-day-featured-titles-staff-picks`,title:`New Comic Book Day: This Week's Featured Titles & Staff Picks`,publishedDate:new Date(Date.now()-1728e5).toISOString(),formattedDate:`2 days ago`,author:`Staff Picks`,categories:[`New Arrivals`,`Staff Picks`,`Comics`],featuredImage:`./assets/blank_white.png`,excerpt:`Check out this week's hottest new comic drops, variant covers, and staff recommendations now in stock on our shelves.`,contentHtml:`
      <p>Every Wednesday is New Comic Book Day! Here are a few must-read series arriving this week:</p>
      <div class="blog-staff-pick">
        <h4>Staff Pick #1: Cosmic Crusader #1 (Marvel)</h4>
        <p>A fresh cosmic jumping-on point featuring stunning artwork and galactic-scale stakes.</p>
      </div>
      <div class="blog-staff-pick">
        <h4>Staff Pick #2: Neon Shadows #1 (Image Comics)</h4>
        <p>A pulse-pounding cyberpunk detective mystery set in a gritty dystopian metropolis.</p>
      </div>
      <div class="blog-staff-pick">
        <h4>Staff Pick #3: Chrono Knight: Masters of the Rift (Indie)</h4>
        <p>Multiverse time-travel action with breathtaking variant covers available at the counter.</p>
      </div>
      <p>Subscribers get guaranteed holds on all requested covers. Add them to your pull box today!</p>
    `,originalUrl:`#blog`},{id:`post-weekend-gaming-schedule`,slug:`weekend-gaming-and-tournament-schedule`,title:`Weekend Gaming Schedule: Friday Night Magic & Pokémon League`,publishedDate:new Date(Date.now()-432e6).toISOString(),formattedDate:`5 days ago`,author:`Tournament Organizer`,categories:[`Events`,`Gaming`,`Tournaments`],featuredImage:`./assets/blank_white.png`,excerpt:`Join our friendly local gaming community this weekend for Magic Booster Drafts, Pokémon League play, and casual tabletop gaming.`,contentHtml:`
      <p>Looking for fun tabletop games in your area? Our play space is open for open gaming and weekly sanctioned tournaments.</p>
      <h3>Weekly Schedule Highlights:</h3>
      <ul>
        <li><strong>Friday 4:00 PM:</strong> Pokémon League (All Ages & Beginners Welcome)</li>
        <li><strong>Friday 6:30 PM:</strong> Friday Night Magic Booster Draft ($18 entry with prize packs)</li>
        <li><strong>Saturday 1:00 PM:</strong> Yu-Gi-Oh! Local Tournament ($5 entry)</li>
        <li><strong>Saturday 3:00 PM:</strong> One Piece CCG Tournament & Board Game Open Play</li>
      </ul>
      <p>Space is limited! Call ahead or visit the counter to reserve your seat.</p>
    `,originalUrl:`#blog`}],_=new class{constructor(){this.posts=[],this.lastFetched=null,this.isFetching=!1}formatDate(e){if(!e)return`Recent`;try{return new Date(e).toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`})}catch{return`Recent`}}createSlug(e,t){return e?e.toLowerCase().replace(/[^\w\s-]/g,``).trim().replace(/[\s_-]+/g,`-`).replace(/^-+|-+$/g,``)||`post-${t}`:`post-${t||Date.now()}`}upgradeBloggerImageUrl(e){if(!e)return`./assets/blank_white.png`;let t=e;return t=t.replace(/\/(s|w|h)\d+[^/]*\//g,`/s1600/`),t=t.replace(/=[swh]\d+[^"'\s&]*/g,`=s1600`),t}extractFeaturedImage(e){let t=e.content?e.content.$t:e.summary?e.summary.$t:``;if(t){let e=t.match(/<a[^>]+href=["']([^"']+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^"']*)?)["']/i);if(e&&e[1])return this.upgradeBloggerImageUrl(e[1]);let n=t.match(/<img[^>]+src=["']([^"']+)["']/i);if(n&&n[1])return this.upgradeBloggerImageUrl(n[1])}return e.media$thumbnail&&e.media$thumbnail.url?this.upgradeBloggerImageUrl(e.media$thumbnail.url):`./assets/blank_white.png`}extractExcerpt(e,t=160){if(!e)return``;let n=document.createElement(`div`);n.innerHTML=e,n.querySelectorAll(`script, style`).forEach(e=>e.remove());let r=n.textContent||n.innerText||``;return r=r.replace(/\s+/g,` `).trim(),r.length>t?r.substring(0,t).trim()+`...`:r}sanitizeContentHtml(e){if(!e)return``;let t=document.createElement(`div`);return t.innerHTML=e,t.querySelectorAll(`script, iframe, object, embed`).forEach(e=>e.remove()),t.querySelectorAll(`img`).forEach(e=>{e.setAttribute(`loading`,`lazy`),e.classList.add(`blog-post-inline-img`),e.removeAttribute(`width`),e.removeAttribute(`height`)}),t.querySelectorAll(`a`).forEach(e=>{e.setAttribute(`target`,`_blank`),e.setAttribute(`rel`,`noopener noreferrer`)}),t.innerHTML}parseBloggerEntry(e){let t=e.id?e.id.$t:`post-${Math.random().toString(36).substring(2,9)}`,n=t.split(`post-`)[1]||t.replace(/[^a-zA-Z0-9]/g,`_`),r=e.title?e.title.$t:`Untitled Post`,i=e.published?e.published.$t:new Date().toISOString(),a=e.updated?e.updated.$t:i,o=e.author&&e.author[0]&&e.author[0].name?e.author[0].name.$t:`Store Staff`,s=e.category?e.category.map(e=>e.term).filter(Boolean):[`Store News`],c=`#blog`;if(e.link&&Array.isArray(e.link)){let t=e.link.find(e=>e.rel===`alternate`);t&&t.href&&(c=t.href)}let l=e.content?e.content.$t:e.summary?e.summary.$t:``,u=this.sanitizeContentHtml(l),d=this.extractFeaturedImage(e),f=this.extractExcerpt(l,160);return{id:n,slug:this.createSlug(r,n),title:r,publishedDate:i,updatedDate:a,formattedDate:this.formatDate(i),author:o,categories:s,featuredImage:d,excerpt:f,contentHtml:u,originalUrl:c}}getCachedPosts(){try{let e=localStorage.getItem(m);if(!e)return null;let t=JSON.parse(e);if(t&&t.timestamp&&Date.now()-t.timestamp<h&&Array.isArray(t.posts)&&t.posts.length>0)return this.lastFetched=new Date(t.timestamp),t.posts}catch(e){console.warn(`Error reading blog cache:`,e)}return null}setCachedPosts(e){try{let t={timestamp:Date.now(),posts:e};localStorage.setItem(m,JSON.stringify(t)),this.lastFetched=new Date}catch(e){console.warn(`Error writing blog cache:`,e)}}async fetchLiveFeed(){return null}async getPosts(e=!1){if(!e){let e=this.getCachedPosts();if(e)return this.posts=e,this.posts}return this.isFetching=!0,this.isFetching=!1,this.posts=g,this.posts}getPostBySlugOrId(e){return e&&this.posts.find(t=>t.slug===e||t.id===e||t.id.includes(e)||e.includes(t.slug))||null}getPostNeighbors(e){let t=this.posts.findIndex(t=>t.id===e.id||t.slug===e.slug);return t===-1?{prev:null,next:null}:{prev:t>0?this.posts[t-1]:null,next:t<this.posts.length-1?this.posts[t+1]:null}}getArchiveTimeline(){let e={};return this.posts.forEach(t=>{let n=new Date(t.publishedDate),r=isNaN(n.getFullYear())?`Recent`:n.getFullYear().toString(),i=isNaN(n.getMonth())?`General`:n.toLocaleString(`en-US`,{month:`long`});e[r]||(e[r]={year:r,count:0,months:{}}),e[r].count++,e[r].months[i]||(e[r].months[i]={month:i,count:0,posts:[]}),e[r].months[i].count++,e[r].months[i].posts.push(t)}),e}getAllCategories(){let e=new Set;return this.posts.forEach(t=>{Array.isArray(t.categories)&&t.categories.forEach(t=>e.add(t))}),Array.from(e).sort()}},v=class{constructor(e){this.pageEngine=e,this.activeCategory=`all`,this.searchQuery=``,this.currentPost=null,this.init()}async init(){this.setupListeners(),await this.loadAndRender(),this.handleInitialRoute()}setupListeners(){let e=document.getElementById(`btn-refresh-blog`);e&&e.addEventListener(`click`,async()=>{e.disabled=!0,e.innerHTML=`<span>⏳</span> Reloading Blog...`;try{await _.getPosts(!0),await this.loadAndRender(),this.showToast(`Blog feed reloaded! 📰✨`)}catch(e){console.error(e),this.showToast(`Could not reload feed. Displaying cached posts.`)}finally{e.disabled=!1,e.innerHTML=`<span>🔄</span> RELOAD BLOG`}});let t=document.getElementById(`blog-search-input`);t&&t.addEventListener(`input`,e=>{this.searchQuery=e.target.value.toLowerCase().trim(),this.renderBlogPageGrid()});let n=document.getElementById(`blog-reader-close`),r=document.getElementById(`blog-reader-modal`);n&&r&&(n.addEventListener(`click`,()=>this.closeArticle()),r.addEventListener(`click`,e=>{e.target===r&&this.closeArticle()}));let i=document.getElementById(`blog-reader-prev`),a=document.getElementById(`blog-reader-next`);i&&i.addEventListener(`click`,()=>{if(this.currentPost){let{prev:e}=_.getPostNeighbors(this.currentPost);e&&this.openArticle(e)}}),a&&a.addEventListener(`click`,()=>{if(this.currentPost){let{next:e}=_.getPostNeighbors(this.currentPost);e&&this.openArticle(e)}});let o=document.getElementById(`blog-reader-share`);o&&o.addEventListener(`click`,()=>{if(this.currentPost){let e=`${window.location.origin}${window.location.pathname}#blog/${this.currentPost.slug}`;navigator.clipboard.writeText(e).then(()=>{this.showToast(`Article link copied to clipboard! 📋`)}).catch(()=>{this.showToast(`Link: `+e)})}}),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&r&&r.classList.contains(`open`)&&this.closeArticle()}),window.addEventListener(`hashchange`,()=>{this.handleRoute(window.location.hash)}),this.setupArchiveListeners()}setupArchiveListeners(){document.querySelectorAll(`.btn-open-blog-archive`).forEach(e=>{e.addEventListener(`click`,e=>{e.preventDefault(),this.openArchiveModal()})});let e=document.getElementById(`blog-archive-close`),t=document.getElementById(`blog-archive-modal`);e&&t&&(e.addEventListener(`click`,()=>this.closeArchiveModal()),t.addEventListener(`click`,e=>{e.target===t&&this.closeArchiveModal()})),document.querySelectorAll(`.btn-load-more-blog`).forEach(e=>{e.addEventListener(`click`,async()=>{e.disabled=!0;let t=e.innerHTML;e.innerHTML=`<span>⏳</span> Loading More Dispatches...`;try{let e=await _.fetchMoreArchivePosts();e&&e.length>0?(this.showToast(`Loaded ${e.length} older posts from the Blogger vault! 📚`),this.renderCategoryChips(_.posts),this.renderBlogPageGrid(_.posts),this.renderArchiveModalContent()):this.showToast(`All available posts are currently loaded.`)}catch(e){console.error(e),this.showToast(`Could not fetch additional posts at this time.`)}finally{e.disabled=!1,e.innerHTML=t}})})}handleInitialRoute(){this.handleRoute(window.location.hash)}handleRoute(e){if(!e)return;let t=e.replace(`#`,``);if(t.startsWith(`blog/`)){let e=t.replace(`blog/`,``),n=_.getPostBySlugOrId(e);n&&this.openArticle(n,!1)}else if(t===`blog`){let e=Array.from(document.querySelectorAll(`.comic-page`)).findIndex(e=>e.dataset.pageId===`blog`);e!==-1&&this.pageEngine&&this.pageEngine.goToPage(e,!1)}}async loadAndRender(){let e=await _.getPosts();this.renderHomeBlogSection(e.slice(0,4)),this.renderCategoryChips(e),this.renderBlogPageGrid(e),this.updateLastUpdatedStatus()}updateLastUpdatedStatus(){let e=document.getElementById(`blog-last-synced`);e&&(e.textContent=_.lastFetched?`Synced with Blogger today at ${_.lastFetched.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})}`:`Synced with Blogger`)}renderHomeBlogSection(e){let t=document.getElementById(`home-blog-cards-grid`);if(t){if(!e||e.length===0){t.innerHTML=`
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: var(--bg-surface); border: 2px dashed var(--border-subtle); border-radius: 8px;">
          <p style="color: var(--text-secondary);">Loading latest dispatches from The Doctor Knows blog...</p>
        </div>
      `;return}t.innerHTML=e.map(e=>`
      <article class="blog-card tilt-card" data-post-id="${e.id}">
        <div class="blog-card-img-wrap">
          <img src="${e.featuredImage}" alt="${e.title}" loading="lazy" class="blog-card-img" />
          <span class="blog-card-date-badge">📅 ${e.formattedDate}</span>
          ${e.categories.length>0?`
            <span class="blog-card-cat-badge">${e.categories[0]}</span>
          `:``}
        </div>

        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="blog-author-tag">✍️ ${e.author}</span>
          </div>

          <h3 class="blog-card-title">${e.title}</h3>

          <p class="blog-card-excerpt">${e.excerpt}</p>

          <div class="blog-card-footer">
            <button class="btn btn-primary btn-read-post" data-slug="${e.slug}" style="width: 100%; font-size: 0.85rem; padding: 0.45rem 0.85rem;">
              READ ARTICLE ➔
            </button>
          </div>
        </div>
      </article>
    `).join(``),t.querySelectorAll(`.btn-read-post`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.dataset.slug,r=_.getPostBySlugOrId(n);r&&this.openArticle(r)})}),t.querySelectorAll(`.blog-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.postId,n=_.getPostBySlugOrId(t);n&&this.openArticle(n)})})}}renderCategoryChips(e){let t=document.getElementById(`blog-category-chips`);if(!t)return;let n=new Map;e.forEach(e=>{e.categories.forEach(e=>{n.set(e,(n.get(e)||0)+1)})});let r=Array.from(n.entries()).sort((e,t)=>t[1]-e[1]).slice(0,7).map(e=>e[0]),i=`<button class="filter-chip ${this.activeCategory===`all`?`active`:``}" data-cat="all">All Posts (${e.length})</button>`;r.forEach(e=>{i+=`<button class="filter-chip ${this.activeCategory===e?`active`:``}" data-cat="${e}">${e} (${n.get(e)})</button>`}),t.innerHTML=i,t.querySelectorAll(`.filter-chip`).forEach(e=>{e.addEventListener(`click`,()=>{t.querySelectorAll(`.filter-chip`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),this.activeCategory=e.dataset.cat,this.renderBlogPageGrid()})})}renderBlogPageGrid(e){let t=e||_.posts,n=document.getElementById(`blog-posts-page-grid`);if(!n)return;let r=t.filter(e=>{let t=this.activeCategory===`all`||e.categories.includes(this.activeCategory),n=!this.searchQuery||e.title.toLowerCase().includes(this.searchQuery)||e.excerpt.toLowerCase().includes(this.searchQuery)||e.author.toLowerCase().includes(this.searchQuery)||e.categories.some(e=>e.toLowerCase().includes(this.searchQuery));return t&&n});if(r.length===0){n.innerHTML=`
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-surface); border: 2px dashed var(--border-subtle); border-radius: 10px;">
          <h3 class="font-display" style="font-size: 1.5rem; color: #0f172a;">NO ARTICLES FOUND</h3>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">No posts matched category "${this.activeCategory}" or query "${this.searchQuery}".</p>
        </div>
      `;return}n.innerHTML=r.map(e=>`
      <article class="blog-card tilt-card" data-post-id="${e.id}">
        <div class="blog-card-img-wrap">
          <img src="${e.featuredImage}" alt="${e.title}" loading="lazy" class="blog-card-img" />
          <span class="blog-card-date-badge">📅 ${e.formattedDate}</span>
          ${e.categories.length>0?`
            <span class="blog-card-cat-badge">${e.categories[0]}</span>
          `:``}
        </div>

        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="blog-author-tag">✍️ ${e.author}</span>
          </div>

          <h3 class="blog-card-title">${e.title}</h3>

          <p class="blog-card-excerpt">${e.excerpt}</p>

          <div class="blog-card-tags">
            ${e.categories.slice(0,3).map(e=>`<span class="blog-mini-tag">#${e}</span>`).join(``)}
          </div>

          <div class="blog-card-footer">
            <button class="btn btn-primary btn-read-post" data-slug="${e.slug}" style="width: 100%; font-size: 0.85rem; padding: 0.45rem 0.85rem;">
              READ ARTICLE ➔
            </button>
          </div>
        </div>
      </article>
    `).join(``),n.querySelectorAll(`.btn-read-post`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.dataset.slug,r=_.getPostBySlugOrId(n);r&&this.openArticle(r)})}),n.querySelectorAll(`.blog-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.postId,n=_.getPostBySlugOrId(t);n&&this.openArticle(n)})})}openArticle(e,t=!0){this.currentPost=e;let n=document.getElementById(`blog-reader-modal`),r=document.getElementById(`blog-reader-article-wrap`),i=document.getElementById(`blog-reader-prev`),a=document.getElementById(`blog-reader-next`);if(!n||!r)return;let{prev:o,next:s}=_.getPostNeighbors(e);i&&(i.disabled=!o,i.title=o?`Previous: ${o.title}`:`No previous article`),a&&(a.disabled=!s,a.title=s?`Next: ${s.title}`:`No next article`),r.innerHTML=`
      <div class="blog-article-header">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
          ${e.categories.map(e=>`<span class="blog-card-cat-badge" style="position: static;">🏷️ ${e}</span>`).join(``)}
        </div>
        <h1 class="comic-title-burst" style="font-size: clamp(1.8rem, 3.5vw, 2.6rem); color: #0f172a; line-height: 1.25; margin-bottom: 0.85rem; text-shadow: none;">
          ${e.title}
        </h1>
        <div class="blog-article-meta-row">
          <span>📅 Published: <strong>${e.formattedDate}</strong></span>
          <span>•</span>
          <span>✍️ Author: <strong>${e.author}</strong></span>
          <span>•</span>
          <span>🏛️ Store Announcements</span>
        </div>
      </div>

      ${e.featuredImage?`
        <div class="blog-article-featured-img-wrap">
          <img src="${e.featuredImage}" alt="${e.title}" class="blog-article-featured-img" />
        </div>
      `:``}

      <div class="blog-article-content-body">
        ${e.contentHtml}
      </div>

      <div class="blog-article-bottom-bar">
        <div>
          <a href="${e.originalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-comic" style="font-size: 0.85rem;">
            🔗 View on Original Blogger ↗
          </a>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary" onclick="document.getElementById('blog-reader-close').click();">
            ← Back to Store
          </button>
        </div>
      </div>
    `,n.classList.add(`open`),n.setAttribute(`aria-hidden`,`false`),document.documentElement.classList.add(`modal-open`),document.body.classList.add(`modal-open`);let c=document.querySelector(`.blog-reader-scrollable`);c&&(c.scrollTop=0),t&&window.history.pushState(null,``,`#blog/${e.slug}`)}closeArticle(){let e=document.getElementById(`blog-reader-modal`);e&&(e.classList.remove(`open`),e.setAttribute(`aria-hidden`,`true`),document.documentElement.classList.remove(`modal-open`),document.body.classList.remove(`modal-open`),window.location.hash.startsWith(`#blog/`)&&window.history.pushState(null,``,`#home`))}openArchiveModal(){let e=document.getElementById(`blog-archive-modal`);if(!e)return;this.renderArchiveModalContent(),e.classList.add(`open`),e.setAttribute(`aria-hidden`,`false`),document.documentElement.classList.add(`modal-open`),document.body.classList.add(`modal-open`);let t=e.querySelector(`.blog-reader-scrollable`);t&&(t.scrollTop=0)}closeArchiveModal(){let e=document.getElementById(`blog-archive-modal`);e&&(e.classList.remove(`open`),e.setAttribute(`aria-hidden`,`true`),document.documentElement.classList.remove(`modal-open`),document.body.classList.remove(`modal-open`))}renderArchiveModalContent(){let e=document.getElementById(`blog-archive-timeline-content`);if(!e)return;let t=_.getArchiveTimeline(),n=Object.keys(t).sort((e,t)=>t-e);if(n.length===0){e.innerHTML=`
        <div style="text-align: center; padding: 2rem;">
          <p style="color: var(--text-secondary);">No archive dispatches loaded yet.</p>
        </div>
      `;return}let r=`
      <div class="archive-vault-intro">
        <div class="sound-burst" style="font-size: 0.85rem; margin-bottom: 0.4rem;">🏛️ HISTORICAL CHRONICLES</div>
        <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: #0f172a; margin-bottom: 0.4rem;">
          COMIC STORE BLOG ARCHIVE VAULT
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
          Browse our complete chronology of weekly comic arrivals, staff recommendations, tournament standings, and vintage grail features.
        </p>
      </div>

      <div class="archive-years-list">
    `;n.forEach((e,n)=>{let i=t[e],a=Object.keys(i.months);r+=`
        <div class="archive-year-accordion ${n===0?`open`:``}">
          <div class="archive-year-header" data-year="${e}">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="archive-year-badge">${e}</span>
              <strong style="font-size: 1.05rem; color: var(--text-primary);">Announcements & Dispatches</strong>
            </div>
            <span class="archive-count-pill">${i.count} Posts</span>
          </div>

          <div class="archive-year-body">
      `,a.forEach(t=>{let n=i.months[t];r+=`
          <div class="archive-month-group">
            <h5 class="archive-month-title">📅 ${t} ${e} (${n.count})</h5>
            <ul class="archive-posts-list">
              ${n.posts.map(e=>`
                <li>
                  <a href="#blog/${e.slug}" class="archive-post-link" data-slug="${e.slug}">
                    <span class="archive-link-date">${e.formattedDate}</span>
                    <strong class="archive-link-title">${e.title}</strong>
                  </a>
                </li>
              `).join(``)}
            </ul>
          </div>
        `}),r+=`
          </div>
        </div>
      `}),r+=`
      </div>

      <div class="archive-vault-footer">
        <button class="btn btn-primary btn-load-more-blog" style="font-size: 0.88rem;">
          📥 Load Older Archive Batches
        </button>
      </div>
    `,e.innerHTML=r,e.querySelectorAll(`.archive-year-header`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`.archive-year-accordion`);t&&t.classList.toggle(`open`)})}),e.querySelectorAll(`.archive-post-link`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault();let n=e.dataset.slug,r=_.getPostBySlugOrId(n);r&&(this.closeArchiveModal(),this.openArticle(r))})}),e.querySelectorAll(`.btn-load-more-blog`).forEach(e=>{e.addEventListener(`click`,async()=>{e.disabled=!0,e.innerHTML=`<span>⏳</span> Loading Archive Posts...`;try{let e=await _.fetchMoreArchivePosts();e&&e.length>0?(this.showToast(`Loaded ${e.length} historical posts into archive! 📚`),this.renderArchiveModalContent(),this.renderBlogPageGrid(_.posts),this.renderCategoryChips(_.posts)):this.showToast(`All available historical posts are loaded.`)}catch(e){console.error(e)}finally{e.disabled=!1,e.innerHTML=`📥 Load Older Archive Batches`}})})}showToast(e){let t=document.getElementById(`comic-toast-container`);if(!t)return;let n=document.createElement(`div`);n.className=`comic-toast`,n.innerHTML=`<span>📰</span> <span>${e}</span>`,t.appendChild(n),setTimeout(()=>{n.style.opacity=`0`,n.style.transform=`translateY(-10px)`,n.style.transition=`all 0.3s ease`,setTimeout(()=>n.remove(),300)},3200)}},y=()=>{try{let n=new t(new e);new p(new s,new f,n),new v(n),console.log(`💥 Comic Book Store Template Initialized Successfully!`)}catch(e){console.error(`Error initializing Comic Book Store application:`,e)}};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,y):y();