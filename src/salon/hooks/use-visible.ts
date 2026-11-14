"use client";

import { useEffect, useState } from "react";

// Diz se o elemento (por id) está na tela, para esconder atalhos redundantes.
export function useVisible(id: string | null) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      {
        threshold: 0.1,
      },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [id]);

  return visible;
}
