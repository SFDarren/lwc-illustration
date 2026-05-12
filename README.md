# lwc-illustration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Salesforce API](https://img.shields.io/badge/Salesforce%20API-v65.0-00A1E0?logo=salesforce&logoColor=white)](https://developer.salesforce.com/)
[![Built with LWC](https://img.shields.io/badge/Built%20with-LWC-00A1E0?logo=salesforce&logoColor=white)](https://developer.salesforce.com/docs/component-library)

A flexible, themeable Lightning Web Component for rendering [Salesforce Lightning Design System (SLDS) illustrations](https://www.lightningdesignsystem.com/components/illustration/) in your Salesforce org.

---

## Features

- **5 built-in illustrations** — No Content, No Access, No Connection, Error, Desert
- **2 sizes** — `small` (300px max) and `large` (600px max), matching SLDS spec
- **Conditional text** — heading and body are individually optional; render nothing, one, or both
- **Actions slot** — pass any content (buttons, button groups, custom components) below the text
- **Full SLDS theming** — SVGs are inline so all `slds-illustration__*` CSS classes apply correctly, including brand colour overrides
- **Single deployable component** — uses LWC's `render()` multi-template pattern; no child components required
- **App Builder & Flow ready** — exposed to Lightning App Builder and Screen Flows with dropdown pickers for illustration and size; admins can configure and place it on any page or flow screen without code
- **Easy to extend** — adding a new illustration is just one new HTML file + one line in the JS map

---

## Component Architecture

Instead of `lwc:if/elseif` chains or separate child components per illustration, this component uses LWC's `render()` method to swap between multiple HTML template files within a single bundle.

```
force-app/main/default/lwc/illustration/
├── illustration.js           ← render() method + API props
├── illustration.js-meta.xml
├── illustration.html         ← no-content template (also the LWC-required default)
├── noAccess.html
├── noConnection.html
├── error.html
└── desert.html
```

Each template file is self-contained — it contains the SVG markup, the conditional text block, and the `actions` slot. The JS class provides all getters (`hasHeading`, `hasBody`, `hasText`, `containerClass`) that every template binds to, since `this` is shared across all templates.

> `render()` is not a lifecycle hook — it is a rendering control method. LWC lifecycle hooks are `connectedCallback`, `disconnectedCallback`, `renderedCallback`, and `errorCallback`.

**Why not `lwc:is` (dynamic child components)?**
`lwc:is` works well but requires a separate 3-file LWC bundle per illustration (15 files for 5 illustrations). The `render()` approach keeps everything in one deployable unit while achieving the same outcome.

**Why not SVG sprites via Static Resources?**
SLDS illustration SVGs use class-based selectors (`slds-illustration__stroke-primary`, `slds-illustration__fill-secondary`, etc.) applied directly to `<path>` and `<g>` elements. These selectors cannot penetrate the shadow DOM boundary created by cross-document `<use href="sprite.svg#id">` references. SVGs must be inline for SLDS theming to work.

---

## Installation

### Deploy to your org

```bash
sf project deploy start \
  --source-dir force-app/main/default/lwc/illustration \
  --target-org <your-org-alias>
```

To also deploy the interactive demo component:

```bash
sf project deploy start \
  --source-dir force-app/main/default/lwc/illustration \
  --source-dir force-app/main/default/lwc/illustrationDemo \
  --target-org <your-org-alias>
```

### Requirements

- Salesforce CLI (`sf`)

---

## App Builder & Screen Flows (No-Code Usage)

`c-illustration` is exposed to Lightning App Builder and Screen Flows. It can be placed on any App Page, Record Page, Home Page, or Flow Screen without writing markup.

**Lightning App Builder** (App Page, Record Page, Home Page):

| Property | Control | Options |
|---|---|---|
| Illustration | Dropdown | `no-content`, `no-access`, `no-connection`, `error`, `desert` |
| Size | Dropdown | `small`, `large` |
| Heading | Text input | Any string, or leave blank |
| Body Text | Text input | Any string, or leave blank |

**Screen Flows:**

| Property | Control | Notes |
|---|---|---|
| Illustration | Text input | Valid values: `no-content` · `no-access` · `no-connection` · `error` · `desert` |
| Size | Text input | Valid values: `small` · `large` |
| Heading | Text input | Any string, or leave blank |
| Body Text | Text input | Any string, or leave blank |

Flow Builder does not support dropdown pickers for LWC screen components without a Custom Property Editor. All properties are input-only — values can be typed directly or bound to a flow text variable; the component exposes no output variables.

> **Note:** The `actions` slot is not configurable in App Builder or Flow Builder — it can only be passed from markup. Use `c-illustration` in a parent LWC if you need an action button.

---

## Usage

### Basic

```html
<c-illustration
    name="no-content"
    size="small"
    heading="No Results Found"
    body="Try adjusting your search or filters.">
</c-illustration>
```

### Heading only

```html
<c-illustration name="no-access" size="large" heading="Access Restricted">
</c-illustration>
```

### SVG only (no text)

```html
<c-illustration name="desert" size="small"></c-illustration>
```

### With an action button

```html
<c-illustration
    name="no-content"
    size="small"
    heading="No Records Yet"
    body="Get started by creating your first record.">
    <lightning-button
        slot="actions"
        label="New Record"
        variant="brand"
        onclick={handleNew}>
    </lightning-button>
</c-illustration>
```

### With multiple action buttons

```html
<c-illustration name="error" size="large" heading="Something Went Wrong">
    <lightning-button-group slot="actions">
        <lightning-button label="Retry" onclick={handleRetry}></lightning-button>
        <lightning-button label="Contact Support" variant="brand" onclick={handleSupport}></lightning-button>
    </lightning-button-group>
</c-illustration>
```

### With a custom component in the slot

```html
<c-illustration name="no-connection" heading="No Connection">
    <c-my-retry-widget slot="actions" onretry={handleRetry}></c-my-retry-widget>
</c-illustration>
```

---

## API Reference

### Properties

| Property  | Type   | Default        | Description |
|-----------|--------|----------------|-------------|
| `name`    | String | `'no-content'` | The illustration to display. See [Available Illustrations](#available-illustrations). Falls back to `no-content` if an unrecognised value is passed. |
| `size`    | String | `'small'`      | `'small'` renders at max 300×200px (`slds-illustration_small`). `'large'` renders at max 600×400px (`slds-illustration_large`). |
| `heading` | String | —              | Optional `<h3>` heading text. Omit to render no heading. |
| `body`    | String | —              | Optional `<p>` body/subtext. Omit to render no body. |

### Slots

| Slot      | Description |
|-----------|-------------|
| `actions` | Rendered below the SVG and text block. Accepts any markup — buttons, button groups, layouts, custom components. Omit entirely to show no actions. |

### Text rendering behaviour

| `heading` | `body`    | Result |
|-----------|-----------|--------|
| provided  | provided  | Heading + body paragraph |
| provided  | omitted   | Heading only |
| omitted   | provided  | Body paragraph only |
| omitted   | omitted   | No text block rendered |

---

## Available Illustrations

| `name`          | Intended use case |
|-----------------|-------------------|
| `no-content`    | Empty search results, empty list views |
| `no-access`     | Permission denied / 403 states |
| `no-connection` | Offline / network error states |
| `error`         | Unexpected error / 500 states |
| `desert`        | General empty state / nothing created yet |

> **Note:** The SVG paths for `no-access`, `no-connection`, `error`, and `desert` are placeholder illustrations that use the correct SLDS CSS classes. Replace them with the official SVG paths from the [SLDS Illustration blueprint](https://www.lightningdesignsystem.com/components/illustration/) for production use. The `no-content` illustration uses the official SLDS SVG.

---

## Adding a New Illustration

1. **Create the template file** inside the `illustration/` bundle:

   ```
   illustration/fishing.html
   ```

   Copy any existing template (e.g. `desert.html`) as a starting point. Replace the `<svg>` content with your illustration's paths.

   ```html
   <template>
       <div class={containerClass}>
           <svg class="slds-illustration__svg" viewBox="0 0 454 194" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
               <!-- your SVG paths here, using slds-illustration__* classes -->
           </svg>
           <template lwc:if={hasText}>
               <div class="slds-text-longform">
                   <template lwc:if={hasHeading}>
                       <h3 class="slds-text-heading_medium">{heading}</h3>
                   </template>
                   <template lwc:if={hasBody}>
                       <p class="slds-text-body_regular">{body}</p>
                   </template>
               </div>
           </template>
           <slot name="actions"></slot>
       </div>
   </template>
   ```

2. **Register it in `illustration.js`** — two lines:

   ```js
   import fishingTemplate from './fishing.html';   // add import

   const TEMPLATES = {
       // ... existing entries ...
       'fishing': fishingTemplate,                  // add map entry
   };
   ```

3. **Deploy** the `illustration` component. No other files change.

---

## SLDS CSS Classes Used

These classes are applied to SVG elements and are resolved from the Lightning Design System stylesheet automatically in any Lightning context:

| Class | Applied to |
|---|---|
| `slds-illustration__svg` | The `<svg>` root element |
| `slds-illustration__fill-primary` | Filled shapes in the primary brand colour |
| `slds-illustration__fill-secondary` | Filled shapes in the secondary/muted colour |
| `slds-illustration__stroke-primary` | Stroked shapes in the primary brand colour |
| `slds-illustration__stroke-secondary` | Stroked shapes in the secondary/muted colour |

Because the SVGs are inline in the DOM, all of these are fully themeable via standard SLDS theming tokens — illustrations will automatically reflect any brand customisation applied to your org's Experience Site or Lightning App.

---

## Demo Component

`illustrationDemo` is an interactive playground component included for development purposes. It is exposed for Lightning App Builder (`lightning__AppPage`, `lightning__RecordPage`, `lightning__HomePage`) so you can drop it on any page.

Controls:

| Control | What it does |
|---|---|
| Illustration buttons | Switch between all 5 illustrations |
| Size buttons | Toggle between Small and Large |
| Text & Action toggles | Independently show/hide Heading, Body, and the Action button |
| Action label input | Edit the action button label live |
| Usage snippet | Updates in real time to show the equivalent markup for current settings |

Clicking the action button fires a `ShowToastEvent` success notification to demonstrate the slot's `onclick` wiring.

---

## License

[MIT](LICENSE) © 2026 Darren Seet
