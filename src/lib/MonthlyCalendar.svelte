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

  let year = $state(new Date().getFullYear());
  let hoverMonth: number | null = $state(null);
  let showNextYear = $state(false);

  const today = new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getMonthRange = (year: number, month: number): { start: DateValue; end: DateValue } => {
    const monthStart = new CalendarDate(year, month, 1);
    const nextMonth = monthStart.add({ months: 1 });
    const monthEnd = nextMonth.subtract({ days: 1 });
    return { start: monthStart, end: monthEnd };
  };

  const toTimestamp = (date: DateValue): number => {
    return Date.UTC(date.year, date.month - 1, date.day);
  };

  const isMonthSelected = (year: number, month: number): boolean => {
    if (!value) return false;
    const range = getMonthRange(year, month);
    const rangeStart = toTimestamp(range.start);
    const rangeEnd = toTimestamp(range.end);
    const valueStart = toTimestamp(value.start);
    const valueEnd = toTimestamp(value.end);
    return rangeStart >= valueStart && rangeEnd <= valueEnd;
  };

  const isMonthInHover = (year: number, month: number): boolean => {
    if (hoverMonth === null) return false;
    return hoverMonth === month;
  };

  const isCurrentMonth = (month: number): boolean => {
    return year === today.year && month === today.month;
  };

  const handleMonthClick = (month: number) => {
    if (isMonthDisabled(month)) return;
    const range = getMonthRange(year, month);
    onValueChange?.(range);
  };

  const handleMouseEnter = (month: number) => {
    hoverMonth = month;
  };

  const handleMouseLeave = () => {
    hoverMonth = null;
  };

  const getMonthClass = (year: number, month: number) => {
    const selected = isMonthSelected(year, month);
    const hover = isMonthInHover(year, month);
    const current = isCurrentMonth(month);
    const disabled = isMonthDisabled(month);

    return cn(
      "w-16 h-12 m-1 flex items-center justify-center text-sm rounded transition-colors",
      disabled ? "text-[var(--calendar-muted)] opacity-40 cursor-not-allowed" : "text-[var(--calendar-text)]",
      selected && "bg-[var(--calendar-selected)] text-[var(--calendar-selected-text)]",
      hover && !selected && !disabled && "bg-[var(--calendar-hover)]",
      current && !selected && !disabled && "ring-2 ring-[var(--calendar-today-border)] ring-offset-1"
    );
  };

  const isMonthDisabled = (month: number): boolean => {
    const monthStart = new CalendarDate(year, month, 1);
    const monthEnd = new CalendarDate(year, month, 28);
    
    if (minValue) {
      if (monthStart.year < minValue.year || 
          (monthStart.year === minValue.year && monthStart.month < minValue.month)) {
        return true;
      }
    }
    if (maxValue) {
      if (monthStart.year > maxValue.year || 
          (monthStart.year === maxValue.year && monthStart.month > maxValue.month)) {
        return true;
      }
    }
    return false;
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
        aria-label="Previous year"
        onclick={() => year--}
      >
        <span class="text-xs">‹</span>
      </button>
      <span class="text-sm font-medium text-[var(--calendar-text)]">{year}</span>
      <button
        class="inline-flex items-center justify-center rounded-md p-1 text-[var(--calendar-text)] hover:bg-[var(--calendar-hover)] transition-colors"
        aria-label="Next year"
        onclick={() => year++}
      >
        <span class="text-xs">›</span>
      </button>
    </div>

    <div class="grid grid-cols-4 gap-1">
      {#each months as monthName, i}
        {@const month = i + 1}
        {@const disabled = isMonthDisabled(month)}
<button
           class={getMonthClass(year, month)}
           disabled={disabled}
           onmouseenter={() => !disabled && handleMouseEnter(month)}
           onmouseleave={() => handleMouseLeave()}
           onclick={() => handleMonthClick(month)}
         >
           {monthName}
         </button>
      {/each}
    </div>
  </div>
</div>