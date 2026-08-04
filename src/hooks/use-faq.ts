import { useSuspenseQuery } from "@tanstack/react-query";
import { muKameApi, muKameQueryKeys } from "@/services/mukame-api";
import { useMemo, useState } from "react";

export function useFaq() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const query = useSuspenseQuery({
    queryKey: muKameQueryKeys.faq,
    queryFn: ({ signal }) => muKameApi.faq(signal),
    staleTime: 1000 * 60 * 30, // 30 minutos
  });

  const faqs = query.data?.items ?? [];

  const categories = useMemo(() => {
    const cats = new Set(faqs.map((f) => f.category));
    return Array.from(cats).sort();
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    if (!selectedCategory) return faqs;
    return faqs.filter((f) => f.category === selectedCategory);
  }, [faqs, selectedCategory]);

  return {
    ...query,
    faqs: filteredFaqs,
    allFaqs: faqs,
    categories,
    selectedCategory,
    setSelectedCategory,
  };
}
