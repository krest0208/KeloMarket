import { animate, hover, inView, press, scroll } from 'motion';

export function setupSiteMotion(root: HTMLElement) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return () => {};
  const revealTargets = '.section-title,.gallery-section-heading,.gallery-frame,.gallery-hero-copy,.gallery-material-heading,.gallery-material-grid,.gallery-karelia,.gallery-comparison,.gallery-interior-frame,.steps-grid,.delivery-grid,.closing-section,.page-title,.catalog-banner,.constructor-help,.product-care,.product-detail-grid,.mobile-nav';
  const actionTargets = 'button:not(:disabled),a.btn,a.kmw-action,a.product-go,a.collection-tile,a.cart-link';
  const revealed = new WeakSet<Element>();
  const gestures = new Map<HTMLElement, () => void>();
  const entrances = new Map<HTMLElement, () => void>();
  const scrollScenes = new Map<HTMLElement, () => void>();
  const running = new Map<HTMLElement, ReturnType<typeof animate>>();
  const touched = new Set<HTMLElement>();
  const feedbackText = new WeakMap<HTMLElement, string>();
  let disposed = false;
  let pendingFrame = 0;
  const gentleSpring = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.75 };
  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  function play(element: HTMLElement, frames: Parameters<typeof animate>[1], options: Parameters<typeof animate>[2]) {
    if (disposed || !root.contains(element)) return;
    running.get(element)?.stop();
    const animation = animate(element, frames, options);
    running.set(element, animation);
    touched.add(element);
  }

  function register() {
    if (disposed) return;
    for (const [element, cancel] of gestures) {
      if (!root.contains(element)) {
        cancel();
        running.get(element)?.cancel();
        running.delete(element);
        touched.delete(element);
        gestures.delete(element);
      }
    }
    for (const [element, animation] of running) {
      if (!root.contains(element)) { animation.cancel(); running.delete(element); touched.delete(element); }
    }
    for (const [element, cancel] of entrances) {
      if (!root.contains(element)) { cancel(); entrances.delete(element); }
    }
    for (const [element, cancel] of scrollScenes) {
      if (!root.contains(element)) { cancel(); scrollScenes.delete(element); }
    }
    if (window.matchMedia('(min-width: 801px)').matches) {
      for (const element of root.querySelectorAll<HTMLElement>('.gallery-hero-image')) {
        if (scrollScenes.has(element)) continue;
        const target = element.closest<HTMLElement>('.gallery-hero');
        if (!target) continue;
        const animation = animate(element, { y: [0, -28], scale: [1, 1.025] }, { ease: 'linear' });
        const cancel = scroll(animation, { target, offset: ['start start', 'end start'] });
        scrollScenes.set(element, () => { cancel(); animation.cancel(); element.style.removeProperty('transform'); });
      }
    }
    for (const element of root.querySelectorAll<HTMLElement>(revealTargets)) {
      if (revealed.has(element)) continue;
      revealed.add(element);
      if (element.parentElement?.closest(revealTargets)) continue;
      const cancel = inView(element, () => {
        play(element, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, ease });
      }, { amount: 0.12, margin: '0px 0px -24px 0px' });
      entrances.set(element, cancel);
    }
    for (const element of root.querySelectorAll<HTMLElement>(actionTargets)) {
      if (gestures.has(element)) continue;
      const cancel = press(element, () => {
        if (element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true') return;
        play(element, { scale: 0.975 }, { duration: 0.11, ease: 'easeOut' });
        return () => play(element, { scale: 1 }, gentleSpring);
      });
      gestures.set(element, cancel);
    }
    for (const element of root.querySelectorAll<HTMLElement>('.product-card')) {
      if (gestures.has(element)) continue;
      const cancel = hover(element, () => {
        play(element, { y: -2 }, gentleSpring);
        return () => play(element, { y: 0 }, gentleSpring);
      });
      gestures.set(element, cancel);
    }
    for (const element of root.querySelectorAll<HTMLElement>('.config-total strong,.cart-count')) {
      const value = element.textContent || '';
      const previous = feedbackText.get(element);
      if ((previous !== undefined && previous !== value) || (previous === undefined && element.matches('.cart-count'))) {
        const editingLength = document.activeElement?.matches('input[type=range],input[type=number]');
        if (editingLength && element.matches('.config-total strong')) { feedbackText.set(element, value); continue; }
        play(element, element.matches('.cart-count') ? { scale: [0.9, 1.12, 1] } : { opacity: [0.55, 1], y: [3, 0] }, { duration: 0.22, ease });
      }
      feedbackText.set(element, value);
    }
  }
  const observer = new MutationObserver(records => {
    const changedGrid = records.some(record => record.type === 'childList' && record.target instanceof HTMLElement && record.target.matches('.product-grid'));
    if (changedGrid) {
      const grid = root.querySelector<HTMLElement>('.catalog-products');
      if (grid) play(grid, { opacity: [0.7, 1], y: [7, 0] }, { duration: 0.23, ease });
    }
    if (pendingFrame) return;
    pendingFrame = requestAnimationFrame(() => { pendingFrame = 0; register(); });
  });
  register();
  observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['disabled'] });
  return () => {
    disposed = true;
    observer.disconnect();
    cancelAnimationFrame(pendingFrame);
    for (const cancel of gestures.values()) cancel();
    for (const cancel of entrances.values()) cancel();
    for (const cancel of scrollScenes.values()) cancel();
    for (const animation of running.values()) animation.cancel();
    for (const element of touched) {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
    }
    gestures.clear(); entrances.clear(); scrollScenes.clear(); running.clear(); touched.clear();
  };
}
