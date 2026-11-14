"use client";

import { useMemo, useState } from "react";
import { TEXTURES, type GoalId, type TextureId } from "../salon.data";
import type { CatalogService } from "../salon.types";
import { recommend } from "../salon.utils";

export function useCurlFinder(catalog: CatalogService[]) {
  const [texture, setTexture] = useState<TextureId | null>(null);
  const [goal, setGoal] = useState<GoalId | null>(null);

  const picks = useMemo(
    () => (texture && goal ? recommend(catalog, texture, goal) : []),
    [catalog, texture, goal],
  );

  return {
    texture,
    setTexture,
    goal,
    setGoal,
    picks,
    tip: TEXTURES.find((item) => item.id === texture)?.tip ?? null,
    reset: () => {
      setTexture(null);
      setGoal(null);
    },
  };
}
