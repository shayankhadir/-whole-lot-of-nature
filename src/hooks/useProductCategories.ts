"use client";

import { useEffect, useState } from "react";
import type { WooCommerceCategory } from "@/lib/services/woocommerceService";

interface CategoriesResponse {
  success: boolean;
  data: WooCommerceCategory[];
}

export function useProductCategories() {
  const [categories, setCategories] = useState<WooCommerceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/categories", { signal: controller.signal });
        const json = (await response.json()) as CategoriesResponse;
        if (!isMounted) return;

        if (json.success) {
          setCategories(json.data);
          setError(null);
        } else {
          setError("Unable to load categories");
        }
      } catch (err) {
        if (!isMounted || (err instanceof DOMException && err.name === "AbortError")) {
          return;
        }
        setError("Unable to load categories");
        console.error("Failed to fetch categories", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { categories, isLoading, error };
}
