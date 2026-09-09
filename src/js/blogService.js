/**
 * Comic Book Store Template - Dynamic News & Blog Content Service
 * Fetches and displays blog posts or falls back to customizable local announcements.
 * Optional: Set BLOGGER_FEED_URL to your store's Google Blogger JSON feed.
 */

// Optional: Set your custom Blogger JSON URL here (e.g. 'https://yourblog.blogspot.com/feeds/posts/default?alt=json&max-results=25')
const BLOGGER_FEED_URL = null; 
const CACHE_KEY = 'comic_store_blog_cache_v2';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

// Clean starter announcements for any comic book store
const FALLBACK_POSTS = [
  {
    id: 'post-welcome-to-comic-shop',
    slug: 'welcome-to-our-comic-book-store',
    title: 'Welcome to [Your Comic Shop Name] - Your Comic & Gaming Hub!',
    publishedDate: new Date().toISOString(),
    formattedDate: 'Today',
    author: 'Store Team',
    categories: ['Announcements', 'Community', 'Welcome'],
    featuredImage: './assets/blank_white.png',
    excerpt: 'Welcome to our store! Explore thousands of new releases, back issues, tabletop gaming events, and our signature subscription pull-box service.',
    contentHtml: `
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
    `,
    originalUrl: '#blog'
  },
  {
    id: 'post-new-comics-day-picks',
    slug: 'new-comic-book-day-featured-titles-staff-picks',
    title: 'New Comic Book Day: This Week\'s Featured Titles & Staff Picks',
    publishedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    formattedDate: '2 days ago',
    author: 'Staff Picks',
    categories: ['New Arrivals', 'Staff Picks', 'Comics'],
    featuredImage: './assets/blank_white.png',
    excerpt: 'Check out this week\'s hottest new comic drops, variant covers, and staff recommendations now in stock on our shelves.',
    contentHtml: `
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
    `,
    originalUrl: '#blog'
  },
  {
    id: 'post-weekend-gaming-schedule',
    slug: 'weekend-gaming-and-tournament-schedule',
    title: 'Weekend Gaming Schedule: Friday Night Magic & Pokémon League',
    publishedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    formattedDate: '5 days ago',
    author: 'Tournament Organizer',
    categories: ['Events', 'Gaming', 'Tournaments'],
    featuredImage: './assets/blank_white.png',
    excerpt: 'Join our friendly local gaming community this weekend for Magic Booster Drafts, Pokémon League play, and casual tabletop gaming.',
    contentHtml: `
      <p>Looking for fun tabletop games in your area? Our play space is open for open gaming and weekly sanctioned tournaments.</p>
      <h3>Weekly Schedule Highlights:</h3>
      <ul>
        <li><strong>Friday 4:00 PM:</strong> Pokémon League (All Ages & Beginners Welcome)</li>
        <li><strong>Friday 6:30 PM:</strong> Friday Night Magic Booster Draft ($18 entry with prize packs)</li>
        <li><strong>Saturday 1:00 PM:</strong> Yu-Gi-Oh! Local Tournament ($5 entry)</li>
        <li><strong>Saturday 3:00 PM:</strong> One Piece CCG Tournament & Board Game Open Play</li>
      </ul>
      <p>Space is limited! Call ahead or visit the counter to reserve your seat.</p>
    `,
    originalUrl: '#blog'
  }
];

export class BlogService {
  constructor() {
    this.posts = [];
    this.lastFetched = null;
    this.isFetching = false;
  }

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

  upgradeBloggerImageUrl(url) {
    if (!url) return './assets/blank_white.png';
    let upgraded = url;
    upgraded = upgraded.replace(/\/(s|w|h)\d+[^/]*\//g, '/s1600/');
    upgraded = upgraded.replace(/=[swh]\d+[^"'\s&]*/g, '=s1600');
    return upgraded;
  }

  extractFeaturedImage(entry) {
    const content = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : '');
    if (content) {
      const linkMatch = content.match(/<a[^>]+href=["']([^"']+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^"']*)?)["']/i);
      if (linkMatch && linkMatch[1]) {
        return this.upgradeBloggerImageUrl(linkMatch[1]);
      }
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch && imgMatch[1]) {
        return this.upgradeBloggerImageUrl(imgMatch[1]);
      }
    }
    if (entry.media$thumbnail && entry.media$thumbnail.url) {
      return this.upgradeBloggerImageUrl(entry.media$thumbnail.url);
    }
    return './assets/blank_white.png';
  }

  extractExcerpt(contentHtml, maxLength = 160) {
    if (!contentHtml) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentHtml;
    tempDiv.querySelectorAll('script, style').forEach(el => el.remove());
    let text = tempDiv.textContent || tempDiv.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length > maxLength) {
      return text.substring(0, maxLength).trim() + '...';
    }
    return text;
  }

  sanitizeContentHtml(rawHtml) {
    if (!rawHtml) return '';
    const div = document.createElement('div');
    div.innerHTML = rawHtml;
    div.querySelectorAll('script, iframe, object, embed').forEach(el => el.remove());
    div.querySelectorAll('img').forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.classList.add('blog-post-inline-img');
      img.removeAttribute('width');
      img.removeAttribute('height');
    });
    div.querySelectorAll('a').forEach(a => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
    return div.innerHTML;
  }

  parseBloggerEntry(entry) {
    const rawId = entry.id ? entry.id.$t : `post-${Math.random().toString(36).substring(2, 9)}`;
    const id = rawId.split('post-')[1] || rawId.replace(/[^a-zA-Z0-9]/g, '_');
    const title = entry.title ? entry.title.$t : 'Untitled Post';
    const publishedDate = entry.published ? entry.published.$t : new Date().toISOString();
    const updatedDate = entry.updated ? entry.updated.$t : publishedDate;
    const author = entry.author && entry.author[0] ? (entry.author[0].name ? entry.author[0].name.$t : 'Store Staff') : 'Store Staff';
    const categories = entry.category ? entry.category.map(c => c.term).filter(Boolean) : ['Store News'];
    
    let originalUrl = '#blog';
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

  async fetchLiveFeed() {
    if (!BLOGGER_FEED_URL) {
      return null;
    }
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
      console.warn('Direct Blogger fetch failed:', directErr);
    }
    return null;
  }

  async getPosts(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = this.getCachedPosts();
      if (cached) {
        this.posts = cached;
        return this.posts;
      }
    }

    this.isFetching = true;
    if (BLOGGER_FEED_URL) {
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
    }

    this.isFetching = false;
    this.posts = FALLBACK_POSTS;
    return this.posts;
  }

  getPostBySlugOrId(slugOrId) {
    if (!slugOrId) return null;
    return this.posts.find(p => p.slug === slugOrId || p.id === slugOrId || p.id.includes(slugOrId) || slugOrId.includes(p.slug)) || null;
  }

  getPostNeighbors(currentPost) {
    const idx = this.posts.findIndex(p => p.id === currentPost.id || p.slug === currentPost.slug);
    if (idx === -1) return { prev: null, next: null };
    return {
      prev: idx > 0 ? this.posts[idx - 1] : null,
      next: idx < this.posts.length - 1 ? this.posts[idx + 1] : null
    };
  }

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
      timeline[year].months[month].posts.push(post);
    });

    return timeline;
  }

  getAllCategories() {
    const categoriesSet = new Set();
    this.posts.forEach(p => {
      if (Array.isArray(p.categories)) {
        p.categories.forEach(c => categoriesSet.add(c));
      }
    });
    return Array.from(categoriesSet).sort();
  }
}

export const blogService = new BlogService();
