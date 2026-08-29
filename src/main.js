import { ParallaxEngine } from './js/parallaxEngine.js';
import { PageEngine } from './js/pageEngine.js';
import { PullListManager } from './js/pullList.js';
import { ComicReader } from './js/comicReader.js';
import { UIManager } from './js/ui.js';
import { BlogUI } from './js/blogUI.js';

const startApp = () => {
  try {
    // Initialize Parallax coordinator
    const parallax = new ParallaxEngine();

    // Initialize 3D Page flip coordinator
    const pageEngine = new PageEngine(parallax);

    // Initialize Pull Box / Subscription manager
    const pullList = new PullListManager();

    // Initialize Interactive Comic Sampler Reader
    const comicReader = new ComicReader();

    // Initialize UI manager & event binders
    const ui = new UIManager(pullList, comicReader, pageEngine);

    // Initialize Dynamic Blogger Native Blog Engine
    const blogUI = new BlogUI(pageEngine);

    console.log("💥 Dr. No's Comics & Games SuperStore App Initialized with Live Blogger CMS Integration!");
  } catch (err) {
    console.error("Error initializing Dr. No's SuperStore application:", err);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
