import type { DateValue } from '@internationalized/date';
import type { Component } from 'svelte';

export type Theme = {
  bg?: string;
  text?: string;
  muted?: string;
  border?: string;
  hover?: string;
  selected?: string;
  selectedText?: string;
  todayBorder?: string;
  radius?: string;
};

export { default as SelectableCalendar, default as MonthlyCalendar, default as YearCalendar };
