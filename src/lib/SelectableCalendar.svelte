<script lang="ts">
  import { Calendar } from "bits-ui";
  import { type DateValue, CalendarDate } from "@internationalized/date";
  import { cn, type Theme, getThemeStyle } from "./utils";

  type SelectionMode = "day" | "week";

  interface Props {
    value?: { start: DateValue; end: DateValue } | null;
    onValueChange?: (value: { start: DateValue; end: DateValue } | null) => void;
    mode?: SelectionMode;
    minValue?: DateValue;
    maxValue?: DateValue;
    theme?: Theme;
    class?: string;
  }

  let {
    value = null,
    onValueChange,
    mode = "week",
    minValue,
    maxValue,
    theme = {},
    class: className,
  }: Props = $props();

  let hoverDate: DateValue | null = $state(null);
  let lastClickedDate: DateValue | null = $state(null);

  const today = new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );

  const getWeekRange = (date: DateValue): { start: DateValue; end: DateValue } => {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    const dayOfWeek = jsDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = date.subtract({ days: daysToMonday });
    const weekEnd = weekStart.add({ days: 6 });
    return { start: weekStart, end: weekEnd };
  };

  const toTimestamp = (date: DateValue): number => {
    return new Date(date.year, date.month - 1, date.day).getTime();
  };

  const isDateInSelectedRange = (date: DateValue): boolean => {
    if (!value) return false;
    // Use CalendarDate comparison for reliable date matching
    if (date.compare(value.start) < 0 || date.compare(value.end) > 0) return false;
    return true;
  };

  const isDateInHoverRange = (date: DateValue): boolean => {
    if (!hoverDate) return false;
    const range = mode === "week" ? getWeekRange(hoverDate) : { start: hoverDate, end: hoverDate };
    if (date.compare(range.start) < 0 || date.compare(range.end) > 0) return false;
    if (isDateDisabled(date)) return false;
    return true;
  };

  const isToday = (date: DateValue): boolean => {
    return (
      date.year === today.year &&
      date.month === today.month &&
      date.day === today.day
    );
  };

  const isDateInCurrentMonth = (date: DateValue): boolean => {
    return date.year === today.year && date.month === today.month;
  };

  const effectiveMaxValue = $derived(maxValue ?? (mode === "day" ? today : undefined));

  const isDateDisabled = (date: DateValue): boolean => {
    if (minValue && date.compare(minValue) < 0) return true;
    if (effectiveMaxValue && date.compare(effectiveMaxValue) > 0) return true;
    return false;
  };

  const handleDayClick = (date: DateValue) => {
    lastClickedDate = date;
    setTimeout(() => {
      lastClickedDate = null;
    }, 100);
    hoverDate = null;
    let range: { start: DateValue; end: DateValue } | null = null;
    if (mode === "week") {
      range = getWeekRange(date);
      let clampedStart = range.start;
      let clampedEnd = range.end;
      if (effectiveMaxValue && clampedEnd.compare(effectiveMaxValue) > 0) {
        clampedEnd = effectiveMaxValue;
      }
      if (minValue && clampedStart.compare(minValue) < 0) {
        clampedStart = minValue;
      }
      if (clampedStart.compare(clampedEnd) > 0) {
        range = null;
      } else {
        range = { start: clampedStart, end: clampedEnd };
      }
    } else {
      if (isDateDisabled(date)) return;
      range = { start: date, end: date };
    }
    onValueChange?.(range ?? null);
  };

  const handleMouseEnter = (date: DateValue) => {
    if (lastClickedDate) {
      const clickedWeek = getWeekRange(lastClickedDate);
      const currentWeek = getWeekRange(date);
      if (
        clickedWeek.start.year === currentWeek.start.year &&
        clickedWeek.start.month === currentWeek.start.month &&
        clickedWeek.start.day === currentWeek.start.day
      ) {
        return;
      }
    }
    // Don't set hover for disabled dates to avoid hover styling conflicts
    if (isDateDisabled(date)) {
      return;
    }
    hoverDate = date;
  };

  const handleMouseLeave = () => {
    hoverDate = null;
  };

  const getDayClass = (date: DateValue) => {
    const selected = isDateInSelectedRange(date);
    const hover = isDateInHoverRange(date);
    const todayFlag = isToday(date);
    const inCurrentMonth = isDateInCurrentMonth(date);
    const disabled = isDateDisabled(date);

    return cn(
      "relative w-8 h-8 text-center text-sm rounded transition-colors",
      // Selected takes priority - always show with selected text
      selected && "bg-[var(--calendar-selected)] text-[var(--calendar-selected-text)]",
      // Then hover (not selected)
      hover && !selected && "bg-[var(--calendar-hover)] text-[var(--calendar-text)]",
      // Then disabled (not selected or hover)
      disabled && !selected && "text-[var(--calendar-muted)] opacity-40 cursor-not-allowed",
      // Then current month
      (!selected && !hover && !disabled && inCurrentMonth) && "text-[var(--calendar-text)]",
      // Then other months
      (!selected && !hover && !disabled && !inCurrentMonth) && "text-[var(--calendar-muted)] opacity-60",
      todayFlag && !selected && !disabled && "ring-2 ring-[var(--calendar-today-border)] ring-offset-1"
    );
  };

  // Default values based on mode
  const defaultValue = (): DateValue => {
    if (mode === "day") return today;
    return getWeekRange(today).start;
  };

  let defaultMaxValue: DateValue | undefined = $derived(
    mode === "day" ? today : undefined
  );
</script>

<div class={cn("inline-block", className)}>
  <Calendar.Root
    type="single"
    value={value?.start ?? defaultValue()}
    onValueChange={() => {}}
    {minValue}
    maxValue={maxValue ?? defaultMaxValue}
    disabled={false}
    weekStartsOn={1}
    class="p-3"
    style={getThemeStyle(theme)}
    disableDaysOutsideMonth={false}
  >
    {#snippet children({ months })}
      <Calendar.Header class="flex items-center justify-between mb-2">
        <Calendar.PrevButton
          class="inline-flex items-center justify-center rounded-md p-1 text-[var(--calendar-text)] hover:bg-[var(--calendar-hover)] transition-colors"
        >
          <span class="text-xs">‹</span>
        </Calendar.PrevButton>
        <Calendar.Heading class="text-sm font-medium text-[var(--calendar-text)]" />
        <Calendar.NextButton
          class="inline-flex items-center justify-center rounded-md p-1 text-[var(--calendar-text)] hover:bg-[var(--calendar-hover)] transition-colors"
        >
          <span class="text-xs">›</span>
        </Calendar.NextButton>
      </Calendar.Header>

      <Calendar.Grid class="border-collapse">
        <Calendar.GridHead>
          <Calendar.GridRow>
            {#each ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as day}
              <Calendar.HeadCell
                class="w-8 h-8 text-center text-xs font-medium text-[var(--calendar-muted)]"
              >
                {day}
              </Calendar.HeadCell>
            {/each}
          </Calendar.GridRow>
        </Calendar.GridHead>

        <Calendar.GridBody>
          {#each months as month}
            {#each month.weeks as week}
              <Calendar.GridRow>
                {#each week as date}
{@const todayFlag = isToday(date)}
                    <Calendar.Cell
                      {date}
                      month={month.value}
                      class={getDayClass(date)}
                      onmouseenter={() => handleMouseEnter(date)}
                      onmouseleave={handleMouseLeave}
                      onclick={() => handleDayClick(date)}
                    >
                      <span class={cn(todayFlag && "font-bold")}>{date.day}</span>
                    </Calendar.Cell>
                {/each}
              </Calendar.GridRow>
            {/each}
          {/each}
        </Calendar.GridBody>
      </Calendar.Grid>
    {/snippet}
  </Calendar.Root>
</div>