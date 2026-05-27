<script lang="ts">
  import SelectableCalendar from "./lib/SelectableCalendar.svelte";
  import MonthlyCalendar from "./lib/MonthlyCalendar.svelte";
  import YearCalendar from "./lib/YearCalendar.svelte";
  import { CalendarDate } from "@internationalized/date";

  let selectedRange: { start: CalendarDate; end: CalendarDate } | null = $state(null);
  let mode: "day" | "week" = $state("week");
  let viewMode: "date" | "month" | "year" = $state("date");

  const handleValueChange = (value: { start: any; end: any } | null) => {
    selectedRange = value;
  };

  const today = new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  );

  const minValue = today.subtract({ days: 27 });
  const monthMinValue = new CalendarDate(2026, 2, 1);
  const monthMaxValue = new CalendarDate(today.year, today.month, 1);
  const yearMaxValue = new CalendarDate(today.year, 12, 31);
  const yearMinValue = new CalendarDate(2020, 1, 1);

  const theme = {
    bg: "#ffffff",
    text: "#1a1a2e",
    muted: "#64748b",
    border: "#e2e8f0",
    hover: "#e0f2fe",
    selected: "#0284c7",
    selectedText: "#ffffff",
    todayBorder: "#0ea5e9",
    radius: "8px",
  };

  const description = $derived.by(() => {
    if (viewMode === "year") return "Click selects year (Jan 1 - Dec 31)";
    if (viewMode === "month")
      return "Hover highlights month, click selects month range";
    if (mode === "week")
      return "Hover highlights week, click selects Monday-Sunday (or partial if constrained by min/max)";
    return "Hover highlights day, click selects single day";
  });
</script>

<section id="center">
  <div class="hero">
    <h1>Selectable Calendar</h1>
    <p class="description">{description}</p>
  </div>

  <div class="view-toggle">
    <button
      class:selected={viewMode === "date"}
      onclick={() => (viewMode = "date")}
    >
      Date View
    </button>
    <button
      class:selected={viewMode === "month"}
      onclick={() => (viewMode = "month")}
    >
      Month View
    </button>
    <button
      class:selected={viewMode === "year"}
      onclick={() => (viewMode = "year")}
    >
      Year View
    </button>
  </div>

  {#if viewMode === "date"}
    <div class="mode-toggle">
      <button class:selected={mode === "week"} onclick={() => (mode = "week")}>
        Week Mode
      </button>
      <button class:selected={mode === "day"} onclick={() => (mode = "day")}>
        Day Mode
      </button>
    </div>

    <div class="calendar-container">
      <SelectableCalendar
        value={selectedRange}
        onValueChange={handleValueChange}
        {mode}
        {minValue}
        maxValue={today}
        {theme}
      />
    </div>
{:else if viewMode === "month"}
     <div class="calendar-container">
       <MonthlyCalendar
         value={selectedRange}
         onValueChange={handleValueChange}
         minValue={monthMinValue}
         maxValue={monthMaxValue}
         {theme}
       />
     </div>
   {:else}
     <div class="calendar-container">
       <YearCalendar
         value={selectedRange}
         onValueChange={handleValueChange}
         minValue={yearMinValue}
         maxValue={yearMaxValue}
         {theme}
       />
     </div>
   {/if}

  {#if selectedRange}
    <div class="selected-info">
      <p>Selected range:</p>
      <p class="date-range">
        {selectedRange.start.toString()} to {selectedRange.end.toString()}
      </p>
    </div>
  {/if}
</section>

<style>
  .calendar-container {
    background: var(--calendar-container-bg, #ffffff);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border, #e2e8f0);
  }

  .view-toggle {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .view-toggle button {
    padding: 8px 16px;
    border: 1px solid var(--border, #e2e8f0);
    background: var(--bg, #ffffff);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text, #1a1a2e);
  }

  .view-toggle button.selected {
    background: var(--accent, #0ea5e9);
    color: #ffffff;
    border-color: var(--accent, #0ea5e9);
  }

  .mode-toggle {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .mode-toggle button {
    padding: 8px 16px;
    border: 1px solid var(--border, #e2e8f0);
    background: var(--bg, #ffffff);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text, #1a1a2e);
  }

  .mode-toggle button.selected {
    background: var(--accent, #0ea5e9);
    color: #ffffff;
    border-color: var(--accent, #0ea5e9);
  }

  .selected-info {
    margin-top: 24px;
    padding: 16px;
    background: var(--code-bg, #f8fafc);
    border-radius: 8px;
  }

  .date-range {
    font-family: monospace;
    font-size: 14px;
    color: var(--accent, #0ea5e9);
  }
</style>

