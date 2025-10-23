// src/HomePage/Components/TempleTwitterTimeline.jsx
import { useEffect, useRef } from "react";

export default function TempleTwitterTimeline({
  screenName = "TempleAlert",
  height = "600",
  theme = "light",
  chrome = "noheader nofooter",
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Global guard across the whole app + hot reloads
    if (!window.__TW_WIDGET_READY__) window.__TW_WIDGET_READY__ = false;
    if (!window.__TW_WIDGET_CREATED__) window.__TW_WIDGET_CREATED__ = false;

    const create = () => {
      if (!window.twttr?.widgets || !containerRef.current) return;
      if (window.__TW_WIDGET_CREATED__) return;        // hard stop: already created
      window.__TW_WIDGET_CREATED__ = true;             // mark created globally

      // Clear container once, then create the timeline
      containerRef.current.innerHTML = "";
      window.twttr.widgets.createTimeline(
        { sourceType: "profile", screenName },
        containerRef.current,
        { height, theme, chrome }
      );
    };

    // If widgets.js already initialized
    if (window.twttr?.widgets) {
      window.__TW_WIDGET_READY__ = true;
      create();
      return;
    }

    // If the script tag exists, wait for it to init; else, do nothing (you already added it in public/index.html)
    const poll = setInterval(() => {
      if (window.twttr?.widgets) {
        clearInterval(poll);
        window.__TW_WIDGET_READY__ = true;
        create();
      }
    }, 200);

    const timeout = setTimeout(() => clearInterval(poll), 6000);

    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, [screenName, height, theme, chrome]);

  return <div ref={containerRef} className={className} />;
}
