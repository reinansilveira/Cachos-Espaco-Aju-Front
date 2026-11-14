"use client";

import { useMemo, useState } from "react";
import type { CatalogService } from "../salon.types";
import { groupCatalog } from "../salon.utils";

export function useServiceMenu(catalog: CatalogService[]) {
  const groups = useMemo(() => groupCatalog(catalog), [catalog]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = groups.find((group) => group.id === activeId) ?? groups[0];

  return { groups, active, select: setActiveId };
}
