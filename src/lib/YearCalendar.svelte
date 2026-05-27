<script lang="ts">
  import { type DateValue, CalendarDate } from "@internationalized/date";
  import { cn, getThemeStyle, type Theme } from "./utils";

  interface Props {
    value?: { start: DateValue; end: DateValue } | null;
    onValueChange?: (value: { start: DateValue; end: DateValue } | null) => void;
    minValue?: DateValue;
    maxValue?: DateValue;
    theme?: Theme;
    class?: string;
  }

  let {
    value = null,
    onValueChange,
    minValue,
    maxValue,
    theme = {},
    class: className,
  }: Props = $props();

  let hoverYear: number | null = $state(null);

  const today = new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );

  let centerYear = $state(today.year);
  const effectiveMaxValue = $derived(maxValue ?? new CalendarDate(today.year, 12, 31));
  const years = $derived(Array.from({ length: 21 }, (_, i) => centerYear - 10 + i));

  const getYearRange = (year: number): { start: DateValue; end: DateValue } => {
    return {
      start: new CalendarDate(year, 1, 1),
      end: new CalendarDate(year, 12, 31),
    };
  };

  const toTimestamp = (date: DateValue): number => {
    return Date.UTC(date.year, date.month - 1, date.day);
  };

  const isYearSelected = (year: number): boolean => {
    if (!value) return false;
    const range = getYearRange(year);
    const rangeStart = toTimestamp(range.start);
    const rangeEnd = toTimestamp(range.end);
    const valueStart = toTimestamp(value.start);
    const valueEnd = toTimestamp(value.end);
    return rangeStart >= valueStart && rangeEnd <= valueEnd;
  };

  const isYearDisabled = (year: number): boolean => {
    const yearStart = new CalendarDate(year, 1, 1);
    const yearEnd = new CalendarDate(year, 12, 31);

    if (minValue) {
      if (yearEnd.year < minValue.year) return true;
    }
    if (effectiveMaxValue) {
      if (yearStart.year > effectiveMaxValue.year) return true;
    }
    return false;
  };

  const isCurrentYear = (year: number): boolean => {
    return year === today.year;
  };

  const isYearInHover = (year: number): boolean => {
    return hoverYear === year;
  };

  const handleYearClick = (year: number) => {
    if (isYearDisabled(year)) return;
    const range = getYearRange(year);
    onValueChange?.(range);
  };

  const getYearClass = (year: number) => {
    const selected = isYearSelected(year);
    const hover = isYearInHover(year);
    const current = isCurrentYear(year);
    const disabled = isYearDisabled(year);

    return cn(
      "w-16 h-12 m-1 flex items-center justify-center text-sm rounded transition-colors",
      disabled ? "text-[var(--calendar-muted)] opacity-40 cursor-not-allowed" : "text-[var(--calendar-text)]",
      selected && "bg-[var(--calendar-selected)] text-[var(--calendar-selected-text)]",
      hover && !selected && !disabled && "bg-[var(--calendar-hover)]",
      current && !selected && !disabled && "ring-2 ring-[var(--calendar-today-border)] ring-offset-1"
    );
  };
</script>

<div class={cn("inline-block", className)}>
  <div
    class="p-4 rounded-lg"
    style={getThemeStyle(theme)}
  >
    <div class="flex items-center justify-between mb-3">
      <button
        class="inline-flex items-center justify-center rounded-md p-1 text-[var(--calendar-text)] hover:bg-[var(--calendar-hover)] transition-colors"
        aria-label="Previous decade"
        onclick={() => centerYear -= 10}
      >
        <span class="text-xs">‹</span>
      </button>
      <span class="text-sm font-medium text-[var(--calendar-text)]">{centerYear - 10} - {centerYear + 10}</span>
      <button
        class="inline-flex items-center justify-center rounded-md p-1 text-[var(--calendar-text)] hover:bg-[var(--calendar-hover)] transition-colors"
        aria-label="Next decade"
        onclick={() => centerYear += 10}
      >
        <span class="text-xs">›</span>
      </button>
    </div>

    <div class="grid grid-cols-5 gap-1">
      {#each years as year}
        {@const disabled = isYearDisabled(year)}
<button
           class={getYearClass(year)}
           {disabled}
           onmouseenter={() => !disabled && (hoverYear = year)}
           onmouseleave={() => (hoverYear = null)}
           onclick={() => handleYearClick(year)}
         >
           {year}
         </button>
      {/each}
    </div>
  </div>
</div>