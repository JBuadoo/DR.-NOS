/**
 * Dr. No's Comics & Games - Blog UI & Article Reader Manager
 * Controls homepage "From the Blog" cards, dedicated Blog issue page, and native article reader view.
 */

import { blogService } from './blogService.js';

export class BlogUI {
  constructor(pageEngine) {
    this.pageEngine = pageEngine;
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.currentPost = null;

    this.init();
  }

  async init() {
    this.setupListeners();
    await this.loadAndRender();
    this.handleInitialRoute();
  }

  setupListeners() {
    // Refresh blog feed button
    const refreshBtn = document.getElementById('btn-refresh-blog');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span>⏳</span> Reloading Blog...';
        try {
          await blogService.getPosts(true);
          await this.loadAndRender();
          this.showToast('Blog feed reloaded! 📰✨');
        } catch (e) {
          console.error(e);
          this.showToast('Could not reload feed. Displaying cached posts.');
        } finally {
          refreshBtn.disabled = false;
          refreshBtn.innerHTML = '<span>🔄</span> RELOAD BLOG';
        }
      });
    }

    // Blog search input
    const searchInput = document.getElementById('blog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderBlogPageGrid();
      });
    }

    // Article Reader Modal Close Buttons
    const closeBtn = document.getElementById('blog-reader-close');
    const backdrop = document.getElementById('blog-reader-modal');
    if (closeBtn && backdrop) {
      closeBtn.addEventListener('click', () => this.closeArticle());
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeArticle();
      });
    }

    // Article Reader Prev/Next navigation
    const prevBtn = document.getElementById('blog-reader-prev');
    const nextBtn = document.getElementById('blog-reader-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentPost) {
          const { prev } = blogService.getPostNeighbors(this.currentPost);
          if (prev) this.openArticle(prev);
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentPost) {
          const { next } = blogService.getPostNeighbors(this.currentPost);
          if (next) this.openArticle(next);
        }
      });
    }

    // Article Share / Copy Link
    const shareBtn = document.getElementById('blog-reader-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (this.currentPost) {
          const url = `${window.location.origin}${window.location.pathname}#blog/${this.currentPost.slug}`;
          navigator.clipboard.writeText(url).then(() => {
            this.showToast('Article link copied to clipboard! 📋');
          }).catch(() => {
            this.showToast('Link: ' + url);
          });
        }
      });
    }

    // Keyboard ESC to close article modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
        this.closeArticle();
      }
    });

    // Handle hash change for blog routing
    window.addEventListener('hashchange', () => {
      this.handleRoute(window.location.hash);
    });

    this.setupArchiveListeners();
  }

  setupArchiveListeners() {
    // Open Archive Buttons (from homepage or blog page)
    document.querySelectorAll('.btn-open-blog-archive').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openArchiveModal();
      });
    });

    // Close Archive Modal Button
    const closeBtn = document.getElementById('blog-archive-close');
    const backdrop = document.getElementById('blog-archive-modal');
    if (closeBtn && backdrop) {
      closeBtn.addEventListener('click', () => this.closeArchiveModal());
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeArchiveModal();
      });
    }

    // Load More Archive Posts Button (on blog page or in archive modal)
    const loadMoreBtns = document.querySelectorAll('.btn-load-more-blog');
    loadMoreBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>⏳</span> Loading More Dispatches...';

        try {
          const newPosts = await blogService.fetchMoreArchivePosts();
          if (newPosts && newPosts.length > 0) {
            this.showToast(`Loaded ${newPosts.length} older posts from the Blogger vault! 📚`);
            this.renderCategoryChips(blogService.posts);
            this.renderBlogPageGrid(blogService.posts);
            this.renderArchiveModalContent();
          } else {
            this.showToast('All available posts are currently loaded.');
          }
        } catch (err) {
          console.error(err);
          this.showToast('Could not fetch additional posts at this time.');
        } finally {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      });
    });
  }

  handleInitialRoute() {
    this.handleRoute(window.location.hash);
  }

  handleRoute(hash) {
    if (!hash) return;
    const cleanHash = hash.replace('#', '');
    if (cleanHash.startsWith('blog/')) {
      const slug = cleanHash.replace('blog/', '');
      const post = blogService.getPostBySlugOrId(slug);
      if (post) {
        this.openArticle(post, false);
      }
    } else if (cleanHash === 'blog') {
      // Find index of blog page and navigate
      const pages = Array.from(document.querySelectorAll('.comic-page'));
      const blogIdx = pages.findIndex(p => p.dataset.pageId === 'blog');
      if (blogIdx !== -1 && this.pageEngine) {
        this.pageEngine.goToPage(blogIdx, false);
      }
    }
  }

  async loadAndRender() {
    const posts = await blogService.getPosts();
    this.renderHomeBlogSection(posts.slice(0, 4));
    this.renderCategoryChips(posts);
    this.renderBlogPageGrid(posts);
    this.updateLastUpdatedStatus();
  }

  updateLastUpdatedStatus() {
    const statusEl = document.getElementById('blog-last-synced');
    if (statusEl) {
      if (blogService.lastFetched) {
        const timeStr = blogService.lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        statusEl.textContent = `Synced with Blogger today at ${timeStr}`;
      } else {
        statusEl.textContent = 'Synced with Blogger';
      }
    }
  }

  /**
   * Render 3-4 cards on the Homepage "From the Blog" spotlight
   */
  renderHomeBlogSection(posts) {
    const container = document.getElementById('home-blog-cards-grid');
    if (!container) return;

    if (!posts || posts.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: var(--bg-surface); border: 2px dashed var(--border-subtle); border-radius: 8px;">
          <p style="color: var(--text-secondary);">Loading latest dispatches from The Doctor Knows blog...</p>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => `
      <article class="blog-card tilt-card" data-post-id="${post.id}">
        <div class="blog-card-img-wrap">
          <img src="${post.featuredImage}" alt="${post.title}" loading="lazy" class="blog-card-img" />
          <span class="blog-card-date-badge">📅 ${post.formattedDate}</span>
          ${post.categories.length > 0 ? `
            <span class="blog-card-cat-badge">${post.categories[0]}</span>
          ` : ''}
        </div>

        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="blog-author-tag">✍️ ${post.author}</span>
          </div>

          <h3 class="blog-card-title">${post.title}</h3>

          <p class="blog-card-excerpt">${post.excerpt}</p>

          <div class="blog-card-footer">
            <button class="btn btn-primary btn-read-post" data-slug="${post.slug}" style="width: 100%; font-size: 0.85rem; padding: 0.45rem 0.85rem;">
              READ ARTICLE ➔
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Attach click listeners to cards
    container.querySelectorAll('.btn-read-post').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.dataset.slug;
        const post = blogService.getPostBySlugOrId(slug);
        if (post) this.openArticle(post);
      });
    });

    container.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.postId;
        const post = blogService.getPostBySlugOrId(id);
        if (post) this.openArticle(post);
      });
    });
  }

  /**
   * Render Category filter chips in full blog tab
   */
  renderCategoryChips(posts) {
    const container = document.getElementById('blog-category-chips');
    if (!container) return;

    // Collect unique categories
    const catMap = new Map();
    posts.forEach(p => {
      p.categories.forEach(c => {
        catMap.set(c, (catMap.get(c) || 0) + 1);
      });
    });

    // Top categories
    const sortedCats = Array.from(catMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(entry => entry[0]);

    let html = `<button class="filter-chip ${this.activeCategory === 'all' ? 'active' : ''}" data-cat="all">All Posts (${posts.length})</button>`;
    sortedCats.forEach(cat => {
      html += `<button class="filter-chip ${this.activeCategory === cat ? 'active' : ''}" data-cat="${cat}">${cat} (${catMap.get(cat)})</button>`;
    });

    container.innerHTML = html;

    container.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeCategory = chip.dataset.cat;
        this.renderBlogPageGrid();
      });
    });
  }

  /**
   * Render full Blog tab grid
   */
  renderBlogPageGrid(allPosts) {
    const posts = allPosts || blogService.posts;
    const container = document.getElementById('blog-posts-page-grid');
    if (!container) return;

    let filtered = posts.filter(post => {
      const matchesCat = this.activeCategory === 'all' || post.categories.includes(this.activeCategory);
      const matchesSearch = !this.searchQuery ||
        post.title.toLowerCase().includes(this.searchQuery) ||
        post.excerpt.toLowerCase().includes(this.searchQuery) ||
        post.author.toLowerCase().includes(this.searchQuery) ||
        post.categories.some(c => c.toLowerCase().includes(this.searchQuery));
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-surface); border: 2px dashed var(--border-subtle); border-radius: 10px;">
          <h3 class="font-display" style="font-size: 1.5rem; color: #0f172a;">NO ARTICLES FOUND</h3>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">No posts matched category "${this.activeCategory}" or query "${this.searchQuery}".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(post => `
      <article class="blog-card tilt-card" data-post-id="${post.id}">
        <div class="blog-card-img-wrap">
          <img src="${post.featuredImage}" alt="${post.title}" loading="lazy" class="blog-card-img" />
          <span class="blog-card-date-badge">📅 ${post.formattedDate}</span>
          ${post.categories.length > 0 ? `
            <span class="blog-card-cat-badge">${post.categories[0]}</span>
          ` : ''}
        </div>

        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="blog-author-tag">✍️ ${post.author}</span>
          </div>

          <h3 class="blog-card-title">${post.title}</h3>

          <p class="blog-card-excerpt">${post.excerpt}</p>

          <div class="blog-card-tags">
            ${post.categories.slice(0, 3).map(cat => `<span class="blog-mini-tag">#${cat}</span>`).join('')}
          </div>

          <div class="blog-card-footer">
            <button class="btn btn-primary btn-read-post" data-slug="${post.slug}" style="width: 100%; font-size: 0.85rem; padding: 0.45rem 0.85rem;">
              READ ARTICLE ➔
            </button>
          </div>
        </div>
      </article>
    `).join('');

    container.querySelectorAll('.btn-read-post').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = btn.dataset.slug;
        const post = blogService.getPostBySlugOrId(slug);
        if (post) this.openArticle(post);
      });
    });

    container.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.postId;
        const post = blogService.getPostBySlugOrId(id);
        if (post) this.openArticle(post);
      });
    });
  }

  /**
   * Open full article view
   */
  openArticle(post, updateHash = true) {
    this.currentPost = post;
    const modal = document.getElementById('blog-reader-modal');
    const contentWrap = document.getElementById('blog-reader-article-wrap');
    const prevBtn = document.getElementById('blog-reader-prev');
    const nextBtn = document.getElementById('blog-reader-next');

    if (!modal || !contentWrap) return;

    const { prev, next } = blogService.getPostNeighbors(post);
    if (prevBtn) {
      prevBtn.disabled = !prev;
      prevBtn.title = prev ? `Previous: ${prev.title}` : 'No previous article';
    }
    if (nextBtn) {
      nextBtn.disabled = !next;
      nextBtn.title = next ? `Next: ${next.title}` : 'No next article';
    }

    contentWrap.innerHTML = `
      <div class="blog-article-header">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
          ${post.categories.map(c => `<span class="blog-card-cat-badge" style="position: static;">🏷️ ${c}</span>`).join('')}
        </div>
        <h1 class="comic-title-burst" style="font-size: clamp(1.8rem, 3.5vw, 2.6rem); color: #0f172a; line-height: 1.25; margin-bottom: 0.85rem; text-shadow: none;">
          ${post.title}
        </h1>
        <div class="blog-article-meta-row">
          <span>📅 Published: <strong>${post.formattedDate}</strong></span>
          <span>•</span>
          <span>✍️ Author: <strong>${post.author}</strong></span>
          <span>•</span>
          <span>🏛️ Dr. No's Official Blog</span>
        </div>
      </div>

      ${post.featuredImage ? `
        <div class="blog-article-featured-img-wrap">
          <img src="${post.featuredImage}" alt="${post.title}" class="blog-article-featured-img" />
        </div>
      ` : ''}

      <div class="blog-article-content-body">
        ${post.contentHtml}
      </div>

      <div class="blog-article-bottom-bar">
        <div>
          <a href="${post.originalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-comic" style="font-size: 0.85rem;">
            🔗 View on Original Blogger ↗
          </a>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary" onclick="document.getElementById('blog-reader-close').click();">
            ← Back to Store
          </button>
        </div>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');

    // Scroll article viewport to top
    const stage = document.querySelector('.blog-reader-scrollable');
    if (stage) stage.scrollTop = 0;

    if (updateHash) {
      window.history.pushState(null, '', `#blog/${post.slug}`);
    }
  }

  /**
   * Close article view
   */
  closeArticle() {
    const modal = document.getElementById('blog-reader-modal');
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');

    // Revert hash if currently on #blog/slug
    if (window.location.hash.startsWith('#blog/')) {
      window.history.pushState(null, '', '#home');
    }
  }

  /**
   * Open Blog Archive Vault Modal
   */
  openArchiveModal() {
    const modal = document.getElementById('blog-archive-modal');
    if (!modal) return;

    this.renderArchiveModalContent();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');

    const stage = modal.querySelector('.blog-reader-scrollable');
    if (stage) stage.scrollTop = 0;
  }

  /**
   * Close Blog Archive Vault Modal
   */
  closeArchiveModal() {
    const modal = document.getElementById('blog-archive-modal');
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
  }

  /**
   * Render organized Archive Timeline by Year and Month
   */
  renderArchiveModalContent() {
    const container = document.getElementById('blog-archive-timeline-content');
    if (!container) return;

    const timeline = blogService.getArchiveTimeline();
    const years = Object.keys(timeline).sort((a, b) => b - a);

    if (years.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <p style="color: var(--text-secondary);">No archive dispatches loaded yet.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div class="archive-vault-intro">
        <div class="sound-burst" style="font-size: 0.85rem; margin-bottom: 0.4rem;">🏛️ HISTORICAL CHRONICLES</div>
        <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: #0f172a; margin-bottom: 0.4rem;">
          DR. NO'S BLOG ARCHIVE VAULT
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
          Browse our complete chronology of weekly comic arrivals, staff recommendations, tournament standings, and vintage grail features.
        </p>
      </div>

      <div class="archive-years-list">
    `;

    years.forEach((year, yIdx) => {
      const yearData = timeline[year];
      const months = Object.keys(yearData.months);

      html += `
        <div class="archive-year-accordion ${yIdx === 0 ? 'open' : ''}">
          <div class="archive-year-header" data-year="${year}">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span class="archive-year-badge">${year}</span>
              <strong style="font-size: 1.05rem; color: var(--text-primary);">Announcements & Dispatches</strong>
            </div>
            <span class="archive-count-pill">${yearData.count} Posts</span>
          </div>

          <div class="archive-year-body">
      `;

      months.forEach(month => {
        const monthData = yearData.months[month];
        html += `
          <div class="archive-month-group">
            <h5 class="archive-month-title">📅 ${month} ${year} (${monthData.count})</h5>
            <ul class="archive-posts-list">
              ${monthData.posts.map(p => `
                <li>
                  <a href="#blog/${p.slug}" class="archive-post-link" data-slug="${p.slug}">
                    <span class="archive-link-date">${p.formattedDate}</span>
                    <strong class="archive-link-title">${p.title}</strong>
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
      </div>

      <div class="archive-vault-footer">
        <button class="btn btn-primary btn-load-more-blog" style="font-size: 0.88rem;">
          📥 Load Older Archive Batches
        </button>
        <a href="https://drnoscomicsandgames.blogspot.com/" target="_blank" rel="noopener noreferrer" class="btn btn-outline-comic" style="font-size: 0.88rem;">
          🏛️ Complete 18-Year Blogger Archive (2,400+ Posts) ↗
        </a>
      </div>
    `;

    container.innerHTML = html;

    // Attach accordion collapse toggles
    container.querySelectorAll('.archive-year-header').forEach(header => {
      header.addEventListener('click', () => {
        const parent = header.closest('.archive-year-accordion');
        if (parent) {
          parent.classList.toggle('open');
        }
      });
    });

    // Attach click listeners to open article directly from archive
    container.querySelectorAll('.archive-post-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const slug = link.dataset.slug;
        const post = blogService.getPostBySlugOrId(slug);
        if (post) {
          this.closeArchiveModal();
          this.openArticle(post);
        }
      });
    });

    // Attach load more in archive modal
    container.querySelectorAll('.btn-load-more-blog').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.innerHTML = '<span>⏳</span> Loading Archive Posts...';
        try {
          const newPosts = await blogService.fetchMoreArchivePosts();
          if (newPosts && newPosts.length > 0) {
            this.showToast(`Loaded ${newPosts.length} historical posts into archive! 📚`);
            this.renderArchiveModalContent();
            this.renderBlogPageGrid(blogService.posts);
            this.renderCategoryChips(blogService.posts);
          } else {
            this.showToast('All available historical posts are loaded.');
          }
        } catch (err) {
          console.error(err);
        } finally {
          btn.disabled = false;
          btn.innerHTML = '📥 Load Older Archive Batches';
        }
      });
    });
  }

  showToast(msg) {
    const container = document.getElementById('comic-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'comic-toast';
    toast.innerHTML = `<span>📰</span> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}
