/**
 * Comic Book Store Template - Pull-Box / Comic Subscription Manager
 * Handles local storage state, dynamic tiered discounts, custom title entries, and reservation export.
 */

// Optional confetti helper using CDN or window global
const triggerConfetti = async (opts) => {
  try {
    if (typeof window !== 'undefined' && typeof window.confetti === 'function') {
      window.confetti(opts);
    } else {
      const mod = await import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/+esm');
      const fire = mod.default || mod;
      if (typeof fire === 'function') fire(opts);
    }
  } catch (e) {
    // Non-blocking fallback
  }
};

export class PullListManager {
  constructor() {
    this.storageKey = 'comic_pull_box_v2';
    this.items = this.loadItems();
    this.init();
  }

  loadItems() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Could not load pull list from localStorage', e);
    }
    // Default starter items
    return [
      {
        id: 'nr-1',
        title: 'Cosmic Crusader #1: Dawn of Eternity',
        publisher: 'Marvel Comics',
        price: 4.99,
        quantity: 1,
        variant: 'Foil Virgin Variant'
      },
      {
        id: 'nr-2',
        title: 'Neon Shadows #1: Protocol Omega',
        publisher: 'Image Comics',
        price: 4.99,
        quantity: 1,
        variant: 'Regular Cover A'
      }
    ];
  }

  saveItems() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Could not save pull list', e);
    }
  }

  addItem(comic) {
    const existing = this.items.find(item => item.id === comic.id || item.title === comic.title);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      this.items.push({
        id: comic.id || 'custom-' + Date.now(),
        title: comic.title,
        publisher: comic.publisherLabel || comic.publisher || 'Comic Series',
        price: Number(comic.price) || 4.99,
        quantity: 1,
        variant: comic.variant || 'Standard Cover'
      });
    }
    this.saveItems();
    this.render();
    this.showToast(`Added "${comic.title}" to your Pull Box! 📦✨`);
    
    // Play celebratory micro-confetti
    triggerConfetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 }
    });
  }

  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      const removed = this.items.splice(index, 1);
      this.saveItems();
      this.render();
      if (removed.length > 0) {
        this.showToast(`Removed "${removed[0].title}" from Pull Box.`);
      }
    }
  }

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity = Math.max(1, (this.items[index].quantity || 1) + delta);
      this.saveItems();
      this.render();
    }
  }

  addCustomTitle(title, publisher = 'Ongoing Series') {
    if (!title || !title.trim()) return;
    this.addItem({
      id: 'custom-' + Date.now(),
      title: title.trim(),
      publisher: publisher.trim() || 'Custom Title',
      price: 4.99,
      variant: 'Standard Ongoing'
    });
  }

  clear() {
    this.items = [];
    this.saveItems();
    this.render();
    this.showToast('Pull Box cleared.');
  }

  getCalculations() {
    const totalTitles = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const subtotal = this.items.reduce((sum, item) => sum + ((item.price || 4.99) * (item.quantity || 1)), 0);

    // Tiered Discount Structure:
    // 5-9 titles: 10% discount
    // 10-19 titles: 15% discount
    // 20+ titles: 20% discount
    let discountPercent = 0;
    let tierName = "Standard Subscriber";

    if (totalTitles >= 20) {
      discountPercent = 20;
      tierName = "VIP Collector (20% OFF)";
    } else if (totalTitles >= 10) {
      discountPercent = 15;
      tierName = "Premier Pull (15% OFF)";
    } else if (totalTitles >= 5) {
      discountPercent = 10;
      tierName = "Fan Favorite (10% OFF)";
    }

    const discountAmount = subtotal * (discountPercent / 100);
    const finalTotal = subtotal - discountAmount;

    return {
      totalTitles,
      subtotal,
      discountPercent,
      discountAmount,
      finalTotal,
      tierName
    };
  }

  showToast(message) {
    let toast = document.getElementById('comic-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'comic-toast';
      toast.className = 'comic-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
  }

  init() {
    this.container = document.getElementById('pull-list-items');
    this.summaryContainer = document.getElementById('pull-list-summary');
    this.badgeElements = document.querySelectorAll('.pull-count-badge, #tab-pull-badge');
    this.customForm = document.getElementById('custom-pull-form');

    if (this.customForm) {
      this.customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputTitle = document.getElementById('custom-title-input');
        const inputPublisher = document.getElementById('custom-publisher-input');
        if (inputTitle && inputTitle.value) {
          this.addCustomTitle(inputTitle.value, inputPublisher ? inputPublisher.value : 'Ongoing');
          inputTitle.value = '';
          if (inputPublisher) inputPublisher.value = '';
        }
      });
    }

    this.render();
  }

  render() {
    // Update count badges
    const totalTitles = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.badgeElements.forEach(badge => {
      if (badge) {
        badge.textContent = totalTitles;
        badge.style.display = totalTitles > 0 ? 'inline-flex' : 'none';
      }
    });

    if (!this.container || !this.summaryContainer) return;

    if (this.items.length === 0) {
      this.container.innerHTML = `
        <div class="empty-pull-box" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">📦</div>
          <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: var(--text-primary); margin-bottom: 0.5rem;">YOUR PULL BOX IS EMPTY</h4>
          <p style="font-size: 0.9rem; max-width: 320px; margin: 0 auto 1.25rem;">
            Browse the <strong>New Arrivals Radar</strong> or enter custom ongoing titles below to start your subscription!
          </p>
        </div>
      `;
    } else {
      this.container.innerHTML = this.items.map((item, index) => `
        <div class="pull-item-card" data-index="${index}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem; border-bottom: 1.5px dashed var(--border-subtle); background: var(--bg-card); margin-bottom: 0.4rem; border-radius: 6px;">
          <div style="flex: 1; padding-right: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
              <span class="badge" style="background: #0f172a; color: #fff; font-size: 0.7rem; padding: 0.15rem 0.45rem;">${item.publisher}</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${item.variant || 'Standard'}</span>
            </div>
            <strong style="color: var(--text-primary); font-size: 0.95rem; display: block; line-height: 1.3;">${item.title}</strong>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--comic-red); font-weight: 700;">$${(item.price || 4.99).toFixed(2)}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="display: flex; align-items: center; border: 1.5px solid #0f172a; border-radius: 4px; background: #fff;">
              <button class="pull-qty-btn" data-action="dec" data-index="${index}" style="background: none; border: none; color: #0f172a; cursor: pointer; padding: 0 6px; font-weight: 900;">-</button>
              <span style="font-weight: 800; min-width: 18px; text-align: center; color: #0f172a;">${item.quantity}</span>
              <button class="pull-qty-btn" data-action="inc" data-index="${index}" style="background: none; border: none; color: #0f172a; cursor: pointer; padding: 0 6px; font-weight: 900;">+</button>
            </div>
            <button class="pull-remove-btn" data-index="${index}" style="background: var(--comic-red); border: 1px solid #0f172a; color: #fff; border-radius: 4px; padding: 0.3rem 0.5rem; cursor: pointer; font-size: 0.8rem; font-weight: 700;">✕</button>
          </div>
        </div>
      `).join('');

      // Attach quantity / remove events
      this.container.querySelectorAll('.pull-qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          const action = btn.dataset.action;
          this.updateQuantity(idx, action === 'inc' ? 1 : -1);
        });
      });

      this.container.querySelectorAll('.pull-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          this.removeItem(idx);
        });
      });
    }

    // Render Summary
    const calc = this.getCalculations();
    this.summaryContainer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border-bottom: 2px solid #0f172a; padding-bottom: 0.75rem;">
        <h3 class="font-display" style="font-size: 1.4rem; color: #0f172a;">BOX SUMMARY</h3>
        <span class="pull-badge-discount">${calc.tierName}</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.95rem; margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Active Pulls:</span>
          <strong style="color: #0f172a;">${calc.totalTitles} titles / issues</strong>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Estimated Retail:</span>
          <span>$${calc.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--comic-green);">
          <span>Subscriber Savings (${calc.discountPercent}%):</span>
          <span>-$${calc.discountAmount.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Bag & Board Protection:</span>
          <span style="color: #0f172a; font-weight: 800;">FREE</span>
        </div>
      </div>

      <div style="border-top: 2px solid #0f172a; padding-top: 0.85rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: baseline;">
        <span style="font-family: var(--font-display); font-size: 1.2rem; color: #0f172a;">ESTIMATED TOTAL:</span>
        <span class="comic-title-burst" style="font-size: 1.6rem; color: #0f172a;">$${calc.finalTotal.toFixed(2)}</span>
      </div>

      <button id="btn-export-pull" class="btn btn-primary" style="width: 100%; margin-bottom: 0.75rem;">
        RESERVE / EXPORT PULL CODE 🚀
      </button>
      <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center;">
        Present at the store counter or email to contact@yourcomicshop.example for instant subscription setup.
      </p>
    `;

    const exportBtn = document.getElementById('btn-export-pull');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.showExportModal());
    }
  }

  showExportModal() {
    const calc = this.getCalculations();
    const modalBackdrop = document.getElementById('generic-modal-backdrop');
    const modalTitle = document.getElementById('generic-modal-title');
    const modalBody = document.getElementById('generic-modal-body');

    if (!modalBackdrop || !modalBody) return;

    const pullCode = 'COMIC-PULL-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    modalTitle.textContent = "COMIC STORE PULL BOX RESERVATION";
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div class="sound-burst" style="font-size: 1.1rem; margin-bottom: 0.75rem;">RESERVATION CODE GENERATED</div>
        <div style="font-family: var(--font-mono); font-size: 1.8rem; font-weight: 900; background: #0f172a; color: var(--comic-yellow); padding: 0.75rem; border: 2px solid var(--comic-yellow); border-radius: 8px; letter-spacing: 0.15em;">
          ${pullCode}
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
          Bring this code to the store counter or email it to set up your subscription pull box discount!
        </p>
      </div>

      <div style="background: #f8fafc; border: 2px solid #0f172a; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <h4 style="color: #0f172a; font-family: var(--font-display); margin-bottom: 0.5rem;">RESERVED TITLES:</h4>
        <ul style="list-style: square inside; font-size: 0.9rem; color: #334155; line-height: 1.6;">
          ${this.items.map(item => `<li><strong>${item.title}</strong> (${item.quantity}x) — $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
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
    `;

    modalBackdrop.classList.add('open');

    const copyBtn = document.getElementById('btn-copy-pull-code');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const textToCopy = `COMIC STORE PULL BOX RESERVATION\nCode: ${pullCode}\nItems:\n` + 
          this.items.map(i => `- ${i.title} (${i.quantity}x)`).join('\n') + 
          `\nTotal Estimated: $${calc.finalTotal.toFixed(2)}`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          copyBtn.textContent = 'COPIED TO CLIPBOARD! ✨';
        });
      });
    }

    const closeBtn = document.getElementById('btn-close-modal-action');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
    }
  }
}
