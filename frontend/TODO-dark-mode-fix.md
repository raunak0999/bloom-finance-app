# Dark Mode Text Fix TODO

## Completed Steps
- [x] Update --foreground in .dark to 0 0% 98% (full white)
- [x] Update --muted-foreground in .dark to 0 0% 70% (brighter muted text)
- [x] Add * { text-opacity: 1 !important; } to force full opacity on all text
- [x] Add .text-foreground { @apply dark:text-gray-50; } for bright white text
- [x] Add .text-muted-foreground { @apply dark:text-gray-300; } for medium gray text
- [x] Remove duplicate second @layer base to consolidate styles
