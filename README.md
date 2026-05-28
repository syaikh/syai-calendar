# syai-calendar

A selectable calendar component for Svelte with week and day selection modes.

## Features

- Week and day selection modes
- Month and year selection views
- Hover highlighting with rounded corners on selection start/end
- Themeable styling via CSS variables
- Min/max date constraints

## Installation

```bash
npm install syai-calendar
```

## Requirements

This package uses Tailwind CSS for styling. Your project must have Tailwind CSS installed and configured.

## Usage

```svelte
<script>
  import { SelectableCalendar, MonthlyCalendar, YearCalendar } from 'syai-calendar';
  import { CalendarDate } from '@internationalized/date';
</script>

<!-- Day/Week selection -->
<SelectableCalendar
  mode="week"
  minValue={new CalendarDate(2024, 1, 1)}
  maxValue={new CalendarDate(2024, 12, 31)}
  theme={{
    bg: '#ffffff',
    text: '#1a1a2e',
    muted: '#64748b',
    border: '#e2e8f0',
    hover: '#e0f2fe',
    selected: '#0284c7',
    selectedText: '#ffffff',
    todayBorder: '#0ea5e9'
  }}
/>

<!-- Month selection -->
<MonthlyCalendar
  theme={{ bg: '#ffffff', text: '#1a1a2e' }}
/>

<!-- Year selection -->
<YearCalendar
  theme={{ bg: '#ffffff', text: '#1a1a2e' }}
/>
```

## Props

### SelectableCalendar
- `mode`: `"day" | "week"` - Selection mode
- `value`: `{ start: DateValue; end: DateValue } | null` - Current selection
- `onValueChange`: `(value) => void` - Callback when selection changes
- `minValue`/`maxValue`: Date constraints
- `theme`: Custom CSS variable values

### MonthlyCalendar & YearCalendar
- `value`: `{ start: DateValue; end: DateValue } | null`
- `onValueChange`: `(value) => void`
- `minValue`/`maxValue`: Date constraints
- `theme`: Custom CSS variable values

## Development

```bash
npm run dev
npm run build
npm run check
```

## License

MIT