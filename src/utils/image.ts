export const onImgError = (e: Event) => {
  const el = e.target as HTMLImageElement;
  el.src = new URL('/images/pokeball.png', import.meta.url).href;
  el.onerror = null;
};
