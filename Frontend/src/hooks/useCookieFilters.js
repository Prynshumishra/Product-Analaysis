import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const FILTER_COOKIE_KEY = "dashboard_filters";

const toInputDate = (date) => date.toISOString().slice(0, 10);

const createDefaultFilters = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 14);

  return {
    startDate: toInputDate(startDate),
    endDate: toInputDate(endDate),
    ageGroup: "all",
    gender: "all"
  };
};

const loadFiltersFromCookie = () => {
  const cookieValue = Cookies.get(FILTER_COOKIE_KEY);

  if (!cookieValue) {
    return createDefaultFilters();
  }

  try {
    const parsed = JSON.parse(cookieValue);

    return {
      ...createDefaultFilters(),
      ...parsed
    };
  } catch {
    return createDefaultFilters();
  }
};

export const useCookieFilters = () => {
  const [filters, setFilters] = useState(loadFiltersFromCookie);

  useEffect(() => {
    Cookies.set(FILTER_COOKIE_KEY, JSON.stringify(filters), {
      expires: 20,
      sameSite: "Lax"
    });
  }, [filters]);

  const updateFilter = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters(createDefaultFilters());
  };

  return {
    filters,
    updateFilter,
    resetFilters
  };
};