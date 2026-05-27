# syai-calendar

A selectable calendar component for Svelte with week and day selection modes.

## Features

- Week and day selection modes
- Hover highlighting with rounded corners on selection start/end
- Month and year selection views
- Themeable styling with CSS variables
- Min/max date constraints

## Installation

```bash
npm install
```

## Usage

```svelte
<script>
  import SelectableCalendar from './lib/SelectableCalendar.svelte';
  import { CalendarDate } from '@internationalized/date';
</script>

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
```

## Development

```bash
npm run dev
npm run build
npm run check
```

## License

MIT