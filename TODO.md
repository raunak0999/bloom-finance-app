# TODO: Fix Render Deployment Issues

## Backend Fixes
- [ ] Add root health-check route to server.ts
- [ ] Use process.env.PORT instead of hardcoded 5001
- [ ] Update CORS to use process.env.CORS_ORIGIN
- [ ] Use process.env.MONGODB_URI instead of hardcoded URI

## Frontend Fixes
- [ ] Remove localhost fallback from frontend/src/services/api.ts
- [ ] Remove localhost fallback from frontend/src/api/api.ts
- [ ] Remove localhost URLs from frontend/src/pages/GoalsPage.tsx
- [ ] Remove localhost URLs from frontend/src/pages/AnalyticsPage.tsx
- [ ] Remove localhost fallback from frontend/src/pages/AIChatPage.tsx

## Verification
- [ ] Check build commands in package.json
- [ ] Explain Render URLs usage
- [ ] Final checklist for production deployment
