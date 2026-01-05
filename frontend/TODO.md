# Dark Mode Fix TODO

## 1. Pre-paint Theme Application
- [ ] Add inline script in index.html to read localStorage "vite-ui-theme" and set html class before React loads

## 2. ThemeProvider Enhancements
- [ ] Update theme-provider.tsx to add transition-colors class to html
- [ ] Ensure smooth localStorage sync in useEffect

## 3. CSS Transitions
- [ ] Add color-scheme transition to html in index.css
- [ ] Add global dark text styles (dark:text-gray-100) for fallback visibility

## 4. Component Updates
- [x] Update Dashboard.tsx to use dark: variants instead of hardcoded bg-white, text-gray-800
- [ ] Check and update other components (Sidebar, Transactions, etc.) for dark mode support

## 5. Input Styles Verification
- [ ] Verify input styles in index.css are applied correctly (dark:bg-gray-800 dark:text-white)

## 6. Testing
- [ ] Test dark mode toggle for smooth transitions without FOIT
- [ ] Verify text visibility in all components
