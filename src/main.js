/**
 * Dr. No's Comics & Games SuperStore - Main Entry Application
 */

import './styles/base.css';
import './styles/pageflip.css';
import './styles/parallax.css';
import './styles/components.css';
import './styles/reader.css';

import { ParallaxEngine } from './js/parallaxEngine.js';
import { PageEngine } from './js/pageEngine.js';
import { PullListManager } from './js/pullList.js';
import { ComicReader } from './js/comicReader.js';
import { UIManager } from './js/ui.js';
import { BlogUI } from './js/blogUI.js';

document.addEventListener('DOMContentLoaded', () => {
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
});
