/**
 * Dr. No's Comics & Games - Blogger Dynamic Content Service
 * Fetches, parses, caches, and sanitizes live blog posts from https://drnoscomicsandgames.blogspot.com/
 */

const BLOGGER_FEED_URL = 'https://drnoscomicsandgames.blogspot.com/feeds/posts/default?alt=json&max-results=25';
const CACHE_KEY = 'drnos_blog_posts_cache_v2';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

// Initial fallback posts in case of network issues or offline mode
const FALLBACK_POSTS = [
  {
    id: 'post-new-comics-day-aug-26-2026',
    slug: 'new-comics-day-is-here-employee-picks-august-26-2026',
    title: 'New Comics Day is HERE!!! Employee Picks for August 26, 2026!',
    publishedDate: '2026-08-26T08:00:00.000-04:00',
    formattedDate: 'Aug 26, 2026',
    author: 'Cliff & Dr. No\'s Staff',
    categories: ['New Arrivals', 'Employee Picks', 'Comics'],
    featuredImage: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipVJ3pvBx0BSKquzQRu8mWKsYqN9FLlHLXDGSqrjvnYiqG9JOq_qDAMVmV_rGHgUCUsTUJok8AYmK_1ze0LJ2fSUI-CQJCeyxMEt0HRq3gZCUB7Y60FybayxDICto3pcjUvpWoDAScBlIDb6fFRALIYdo2YJz8H0XmAxQz-qOA3SoJAiujuMRR/s1600/New-Comic-Book-Day_Rainbow.gif',
    excerpt: 'Another new week of comics means another round of Dr. No\'s Staff Picks! Here are this week\'s picks from those "In the No\'s": Conan The Barbarian #34, Superman #41, Predator Vs. Planet of the Apes #2, Blood of the Wolf Man #3...',
    contentHtml: `
      <div class="blog-notice-box">
        <strong>Dr. No’s is open 11am - 8pm Monday - Saturday, 12pm - 6pm Sunday!</strong><br>
        Curbside Pick-up Available! Call (770) 422-4642 or email manager@drnos.com
      </div>
      <p>Another new week of comics means another round of Dr. No's Staff Picks! Here are this week's picks from those "In the <strong><span class="brand-red-highlight">No's</span></strong>":</p>
      <div class="blog-staff-pick">
        <h4>Cliff's Pick: Conan: The Barbarian #34 (Titan)</h4>
        <p>A thrilling new chapter in the saga of the Cimmerian warrior as he faces uncharted horrors on the Hyborian border.</p>
      </div>
      <div class="blog-staff-pick">
        <h4>Ryan's Pick: Superman #41 (DC Comics)</h4>
        <p>The Man of Steel faces a colossal cosmic trial that threatens Metropolis and beyond in this blockbuster issue.</p>
      </div>
      <div class="blog-staff-pick">
        <h4>Buck's Pick: Predator Vs. Planet of the Apes #2 (Marvel)</h4>
        <p>The ultimate sci-fi crossover intensifies as the galaxy's deadlier hunter stalks the Simian kingdom.</p>
      </div>
      <div class="blog-staff-pick">
        <h4>Izzy's Pick: Universal Monsters: Blood of the Wolf Man #3 (Image/Skybound)</h4>
        <p>Classic cinematic horror reborn with spine-chilling art and classic supernatural atmosphere.</p>
      </div>
    `,
    originalUrl: 'https://drnoscomicsandgames.blogspot.com/'
  },
  {
    id: 'post-dr-nos-best-sellers',
    slug: 'dr-nos-top-ten-best-sellers-weekly-roundup',
    title: 'Dr. No\'s Top 10 Best Sellers & Variant Spotlight',
    publishedDate: '2026-08-20T09:30:00.000-04:00',
    formattedDate: 'Aug 20, 2026',
    author: 'Cliff Biggers',
    categories: ['Best-Sellers', 'Comics', 'Variants'],
    featuredImage: 'https://blogger.googleusercontent.com/img/a/AVvXsEiEr-9QDPhBMdqJbbRv0AbcbLJcXib0o4HdNzcQY0bJIlIiki6sun-LedpK22LRkZZDVJ_kDrGrCfvRBJ6tfl1bfKt_TWYRNy-m4n9D_SfhlJwMAMOm7h5d7SkVZUYyWk7152JfSMaDZQeP7_Udi4dsKWPx3h0db1kqp6hO8CLlN4EyDWcznUbL=s1600',
    excerpt: 'Check out the top-selling comic books and graphic novels at Dr. No\'s Comics & Games SuperStore this week, plus key variant covers arriving in stock...',
    contentHtml: `
      <p>Here are the week's hottest titles flying off Dr. No's shelves in Marietta! Subscribers who have these on their pull box enjoy guaranteed holds and up to 20% discounts.</p>
      <ol>
        <li><strong>Batman / Spawn Re-Ignition #1</strong> (DC / Image)</li>
        <li><strong>Ultimate Spider-Man #8</strong> (Marvel)</li>
        <li><strong>Transformers #11</strong> (Skybound / Image)</li>
        <li><strong>X-Men #3</strong> (Marvel)</li>
        <li><strong>Ghost Machine: Rook Exodus #5</strong> (Image)</li>
      </ol>
      <p>Visit our counter or update your subscription pull box today!</p>
    `,
    originalUrl: 'https://drnoscomicsandgames.blogspot.com/'
  },
  {
    id: 'post-fnm-magic-pokemon-league',
    slug: 'friday-night-magic-pokemon-league-weekend-tournament-schedule',
    title: 'Friday Night Magic & Saturday Pokémon Tournament Schedule',
    publishedDate: '2026-08-15T10:00:00.000-04:00',
    formattedDate: 'Aug 15, 2026',
    author: 'Dr. No\'s Gaming Arena',
    categories: ['Events', 'Magic: The Gathering', 'Pokemon', 'In-Store Gaming'],
    featuredImage: 'https://blogger.googleusercontent.com/img/a/AVvXsEgHgSp5PoTgb4CamfjAwg94gW5EWJfDk_G3BWxBE5x81HpvD-w1SUFiUxEt2TUuF5pzILy2dSnYqtqLuajbWx0DPEs_Z6SMRrvPpW-tfIHSff1dtcp7lf67A26RcBVURflwqYmvxkxtJLic8YWYMn732OEJhaje6Ycq7PA9BM0kuJchvcOM0oTM=s1600',
    excerpt: 'Join us every Friday & Saturday in Dr. No\'s gaming arena for MTG Booster Drafts, Yu-Gi-Oh tournaments, and Pokémon League open play. All skill levels welcome!',
    contentHtml: `
      <p>Looking for organized play in Cobb County? Dr. No's gaming tables are packed with weekly events for Magic: The Gathering, Pokémon TCG, Yu-Gi-Oh!, and One Piece CCG.</p>
      <h3>Weekly Schedule:</h3>
      <ul>
        <li><strong>Fridays 4:00 PM:</strong> Pokémon League (All Ages & Beginners Welcome)</li>
        <li><strong>Fridays 4:00 PM:</strong> Open Boardgames Play</li>
        <li><strong>Fridays 6:00 PM:</strong> Magic: The Gathering Booster Draft ($15 entry with prize packs)</li>
        <li><strong>Fridays 7:00 PM:</strong> Yu-Gi-Oh! Tournament</li>
        <li><strong>Saturdays:</strong> One Piece & Konami Celebration Tournaments</li>
      </ul>
      <p>Join our Discord or call (770) 422-4642 for pre-registration!</p>
    `,
    originalUrl: 'https://drnoscomicsandgames.blogspot.com/'
  }
];

export class BlogService {
  constructor() {
    this.posts = [];
    this.lastFetched = null;
    this.isFetching = false;
  }

  /**
   * Helper to format ISO date string to human-readable format
   */
  formatDate(isoString) {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  }

  /**
   * Generate an SEO/URL-friendly slug from title
   */
  createSlug(title, id) {
    if (!title) return `post-${id || Date.now()}`;
    const clean = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return clean || `post-${id}`;
  }

  /**
   * Upgrade any Blogger image URL to full crystal-clear resolution
   */
  upgradeBloggerImageUrl(url) {
    if (!url) return './assets/hero_banner.jpg';
    let upgraded = url;
    // Replace /s72-c/, /s72-w64-h64-c/, /w72-h72-p-k-no-nu/, /s320/, /s640/ etc. with /s1600/
    upgraded = upgraded.replace(/\/(s|w|h)\d+[^/]*\//g, '/s1600/');
    // Replace =s72-c, =w260-h400, =w263-h400, =s72-w640-c-nu, =s72 etc. with =s1600
    upgraded = upgraded.replace(/=[swh]\d+[^"'\s&]*/g, '=s1600');
    return upgraded;
  }

  /**
   * Extract high-resolution image URL from entry
   */
  extractFeaturedImage(entry) {
    const content = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : '');

    // 1. First priority: Check content HTML for high-resolution images or <a> image wrappers
    if (content) {
      // Check <a> links that wrap images (Blogger links to full res image)
      const linkMatch = content.match(/<a[^>]+href=["']([^"']+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^"']*)?)["']/i);
      if (linkMatch && linkMatch[1]) {
        return this.upgradeBloggerImageUrl(linkMatch[1]);
      }

      // Check <img> tag src
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        return this.upgradeBloggerImageUrl(imgMatch[1]);
      }
    }

    // 2. Check media$thumbnail and upgrade from low-res (72px) to full high-res (1600px)
    if (entry.media$thumbnail && entry.media$thumbnail.url) {
      return this.upgradeBloggerImageUrl(entry.media$thumbnail.url);
    }

    // Default comic artwork banner if no image in post
    return './assets/hero_banner.jpg';
  }

  /**
   * Extract text excerpt from HTML content
   */
  extractExcerpt(contentHtml, maxLength = 160) {
    if (!contentHtml) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentHtml;
    // Remove unwanted script/style elements
    tempDiv.querySelectorAll('script, style').forEach(el => el.remove());
    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length > maxLength) {
      return text.substring(0, maxLength).trim() + '...';
    }
    return text;
  }

  /**
   * Clean and sanitize post HTML for native responsive rendering
   */
  sanitizeContentHtml(rawHtml) {
    if (!rawHtml) return '';
    // Create a DOM container to process elements
    const div = document.createElement('div');
    div.innerHTML = rawHtml;

    // Remove any malicious script/iframe/object tags
    div.querySelectorAll('script, iframe, object, embed').forEach(el => el.remove());

    // Process all images to ensure responsive layout and lazy loading
    div.querySelectorAll('img').forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.classList.add('blog-post-inline-img');
      img.removeAttribute('width');
      img.removeAttribute('height');
    });

    // Make external links open in new tab securely
    div.querySelectorAll('a').forEach(a => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });

    return div.innerHTML;
  }

  /**
   * Parse Blogger Atom JSON Feed entry into standard Post object
   */
  parseBloggerEntry(entry) {
    const rawId = entry.id ? entry.id.$t : `post-${Math.random().toString(36).substring(2, 9)}`;
    const id = rawId.split('post-')[1] || rawId.replace(/[^a-zA-Z0-9]/g, '_');
    const title = entry.title ? entry.title.$t : 'Untitled Post';
    const publishedDate = entry.published ? entry.published.$t : new Date().toISOString();
    const updatedDate = entry.updated ? entry.updated.$t : publishedDate;
    const author = entry.author && entry.author[0] ? (entry.author[0].name ? entry.author[0].name.$t : 'Dr. No\'s Staff') : 'Dr. No\'s Staff';
    const categories = entry.category ? entry.category.map(c => c.term).filter(Boolean) : ['Store News'];
    
    // Find original blogspot permalink
    let originalUrl = 'https://drnoscomicsandgames.blogspot.com/';
    if (entry.link && Array.isArray(entry.link)) {
      const altLink = entry.link.find(l => l.rel === 'alternate');
      if (altLink && altLink.href) {
        originalUrl = altLink.href;
      }
    }

    const rawContent = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : '');
    const contentHtml = this.sanitizeContentHtml(rawContent);
    const featuredImage = this.extractFeaturedImage(entry);
    const excerpt = this.extractExcerpt(rawContent, 160);
    const slug = this.createSlug(title, id);

    return {
      id,
      slug,
      title,
      publishedDate,
      updatedDate,
      formattedDate: this.formatDate(publishedDate),
      author,
      categories,
      featuredImage,
      excerpt,
      contentHtml,
      originalUrl
    };
  }

  /**
   * Load cached posts from localStorage
   */
  getCachedPosts() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const data = JSON.parse(cached);
      if (data && data.timestamp && (Date.now() - data.timestamp < CACHE_TTL_MS) && Array.isArray(data.posts) && data.posts.length > 0) {
        this.lastFetched = new Date(data.timestamp);
        return data.posts;
      }
    } catch (e) {
      console.warn('Error reading blog cache:', e);
    }
    return null;
  }

  /**
   * Save posts to localStorage cache
   */
  setCachedPosts(posts) {
    try {
      const data = {
        timestamp: Date.now(),
        posts
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      this.lastFetched = new Date();
    } catch (e) {
      console.warn('Error writing blog cache:', e);
    }
  }

  /**
   * Fetch live Blogger feed using direct fetch with JSONP fallback
   */
  async fetchLiveFeed() {
    // 1. Try Direct Fetch first
    try {
      const res = await fetch(BLOGGER_FEED_URL, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-cache'
      });
      if (res.ok) {
        const json = await res.json();
        if (json.feed && Array.isArray(json.feed.entry)) {
          return json.feed.entry.map(e => this.parseBloggerEntry(e));
        }
      }
    } catch (directErr) {
      console.warn('Direct Blogger fetch failed, trying JSONP fallback...', directErr);
    }

    // 2. Try JSONP dynamic script fallback (bypasses browser CORS restrictions completely)
    try {
      const jsonpResult = await this.fetchViaJsonp();
      if (jsonpResult && jsonpResult.feed && Array.isArray(jsonpResult.feed.entry)) {
        return jsonpResult.feed.entry.map(e => this.parseBloggerEntry(e));
      }
    } catch (jsonpErr) {
      console.warn('JSONP fallback failed:', jsonpErr);
    }

    throw new Error('Could not fetch Blogger feed via direct fetch or JSONP.');
  }

  /**
   * JSONP requester
   */
  fetchViaJsonp() {
    return new Promise((resolve, reject) => {
      const callbackName = `bloggerCallback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const script = document.createElement('script');
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('JSONP request timed out'));
      }, 10000);

      const cleanup = () => {
        clearTimeout(timeout);
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };

      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };

      script.src = `https://drnoscomicsandgames.blogspot.com/feeds/posts/default?alt=json-in-script&callback=${callbackName}&max-results=25`;
      script.onerror = () => {
        cleanup();
        reject(new Error('Failed to load JSONP script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Main method to get blog posts (checks cache -> fetches live -> falls back gracefully)
   */
  async getPosts(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = this.getCachedPosts();
      if (cached) {
        this.posts = cached;
        return this.posts;
      }
    }

    this.isFetching = true;
    try {
      const livePosts = await this.fetchLiveFeed();
      if (livePosts && livePosts.length > 0) {
        this.posts = livePosts;
        this.setCachedPosts(livePosts);
        this.isFetching = false;
        return this.posts;
      }
    } catch (err) {
      console.error('Error fetching live blog posts:', err);
    }

    this.isFetching = false;

    // If fetch failed, use any existing stale cache or fallback snapshot
    try {
      const staleCached = localStorage.getItem(CACHE_KEY);
      if (staleCached) {
        const parsed = JSON.parse(staleCached);
        if (parsed.posts && parsed.posts.length > 0) {
          this.posts = parsed.posts;
          return this.posts;
        }
      }
    } catch {
      // Ignore
    }

    // Default to fallback snapshot
    this.posts = FALLBACK_POSTS;
    return this.posts;
  }

  /**
   * Get single post by ID or Slug
   */
  getPostBySlugOrId(slugOrId) {
    if (!slugOrId) return null;
    return this.posts.find(p => p.slug === slugOrId || p.id === slugOrId || p.id.includes(slugOrId) || slugOrId.includes(p.slug)) || null;
  }

  /**
   * Get neighboring posts for prev/next navigation
   */
  getPostNeighbors(currentPost) {
    const idx = this.posts.findIndex(p => p.id === currentPost.id || p.slug === currentPost.slug);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? this.posts[idx - 1] : null,
      next: idx < this.posts.length - 1 ? this.posts[idx + 1] : null
    };
  }

  /**
   * Generate an organized Archive Timeline grouped by Year and Month
   */
  getArchiveTimeline() {
    const timeline = {};

    this.posts.forEach(post => {
      const date = new Date(post.publishedDate);
      const year = isNaN(date.getFullYear()) ? 'Recent' : date.getFullYear().toString();
      const month = isNaN(date.getMonth()) ? 'General' : date.toLocaleString('en-US', { month: 'long' });

      if (!timeline[year]) {
        timeline[year] = {
          year,
          count: 0,
          months: {}
        };
      }

      timeline[year].count++;

      if (!timeline[year].months[month]) {
        timeline[year].months[month] = {
          month,
          count: 0,
          posts: []
        };
      }

      timeline[year].months[month].count++;
      timeline[year].months[month].posts.push({
        id: post.id,
        slug: post.slug,
        title: post.title,
        formattedDate: post.formattedDate,
        author: post.author,
        categories: post.categories
      });
    });

    return timeline;
  }

  /**
   * Fetch additional archive batch from Blogger
   */
  async fetchMoreArchivePosts() {
    const startIndex = this.posts.length + 1;
    const url = `https://drnoscomicsandgames.blogspot.com/feeds/posts/default?alt=json&start-index=${startIndex}&max-results=25`;

    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' }, cache: 'no-cache' });
      if (res.ok) {
        const json = await res.json();
        if (json.feed && Array.isArray(json.feed.entry)) {
          const newPosts = json.feed.entry.map(e => this.parseBloggerEntry(e));
          // Filter out duplicates
          const existingIds = new Set(this.posts.map(p => p.id));
          const uniqueNew = newPosts.filter(p => !existingIds.has(p.id));
          this.posts = [...this.posts, ...uniqueNew];
          this.setCachedPosts(this.posts);
          return uniqueNew;
        }
      }
    } catch (e) {
      console.warn('Direct fetch more failed, trying JSONP...', e);
      try {
        const jsonpData = await new Promise((resolve, reject) => {
          const cbName = `bloggerMore_${Date.now()}`;
          const script = document.createElement('script');
          const to = setTimeout(() => { cleanup(); reject(new Error('JSONP timeout')); }, 8000);
          const cleanup = () => { clearTimeout(to); delete window[cbName]; script.remove(); };
          window[cbName] = (d) => { cleanup(); resolve(d); };
          script.src = `https://drnoscomicsandgames.blogspot.com/feeds/posts/default?alt=json-in-script&start-index=${startIndex}&max-results=25&callback=${cbName}`;
          script.onerror = () => { cleanup(); reject(new Error('JSONP error')); };
          document.head.appendChild(script);
        });

        if (jsonpData && jsonpData.feed && Array.isArray(jsonpData.feed.entry)) {
          const newPosts = jsonpData.feed.entry.map(e => this.parseBloggerEntry(e));
          const existingIds = new Set(this.posts.map(p => p.id));
          const uniqueNew = newPosts.filter(p => !existingIds.has(p.id));
          this.posts = [...this.posts, ...uniqueNew];
          this.setCachedPosts(this.posts);
          return uniqueNew;
        }
      } catch (err) {
        console.error('Failed to load more archive posts:', err);
      }
    }

    return [];
  }
}

export const blogService = new BlogService();
