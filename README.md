# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Install Dotly and use it offline

Dotly is a Progressive Web App. Deploy the production build over HTTPS (or use
`localhost` for development), then open it in a supported browser and choose
**Install app** or **Add to Home Screen** from the browser menu. Installation
options vary by browser and device.

After the first successful online visit, the service worker caches the app
shell and built assets so Dotly can launch offline. Tasks are stored in that
browser's local storage and are not automatically synced between devices.

## Today and Upcoming views

Use **Today** to see active tasks that are overdue or due today. **Upcoming**
shows active tasks due from tomorrow through the next seven days. These views
work alongside title search and tag filtering.

## PIN lock

On first launch, set a six-digit PIN. Dotly asks for it again when the app is
reopened. Use the key button in the app header to change the PIN; Dotly verifies
the current PIN before saving a new one. If you forget it, choose
**Forgot PIN? Reset lock** on the lock screen; this removes only the PIN setting
and keeps tasks stored in that browser. The PIN lock is a convenience screen,
not encryption, and does not protect task data from someone with technical
access to the browser or device.

Create and preview a production build with:

```sh
npm run build
npm run preview
```
