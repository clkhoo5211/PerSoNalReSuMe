# ⚙️ Configuration

## EmailJS (Contact Form)

The contact form sends messages without a backend using [EmailJS](https://www.emailjs.com).

### Setup Steps

1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
2. Create a **Service** (Gmail, Outlook, etc.) → copy the **Service ID**
3. Create an **Email Template** → copy the **Template ID**
4. Go to **Account → API Keys** → copy the **Public Key**

### Apply in Code

Edit `src/components/Contact.jsx`:

```js
const SERVICE_ID  = 'service_xxxxxxx';   // your Service ID
const TEMPLATE_ID = 'template_xxxxxxx';  // your Template ID
const PUBLIC_KEY  = 'xxxxxxxxxxxxxxxxx'; // your Public Key
```

### Template Variables

Your EmailJS template should use these variables:

```
From: {{from_name}} <{{from_email}}>
Subject: {{subject}}
Message: {{message}}
```

---

## Giscus (Blog Comments)

Comments are powered by [Giscus](https://giscus.app) (backed by GitHub Discussions).

### Current Config (`src/components/GiscusComments.jsx`)

```jsx
<Giscus
  repo="clkhoo5211/PerSoNalReSuMe"
  repoId="YOUR_REPO_ID"            // from giscus.app
  category="General"
  categoryId="YOUR_CATEGORY_ID"    // from giscus.app
  mapping="specific"               // ← critical for HashRouter
  term={term || 'general'}         // post ID used as discussion term
  theme={theme === 'dark' ? 'dark_dimmed' : 'light'}
/>
```

> **Why `mapping="specific"`?**  
> HashRouter means `window.location.pathname` is always `/PerSoNalReSuMe/` regardless of which blog post you're viewing. Using `specific` with a `term` derived from the blog post ID ensures each post gets its own unique GitHub Discussion thread.

### Getting Your Repo ID & Category ID

1. Go to https://giscus.app
2. Enter `clkhoo5211/PerSoNalReSuMe`
3. Choose **Discussions** category: "General"
4. Copy the generated `repoId` and `categoryId` values

---

## TipJar Wallet Addresses

Edit `src/components/TipJar.jsx` and replace placeholder addresses:

```js
const WALLETS = [
  { symbol: 'BTC',  network: 'Bitcoin',   address: 'YOUR_BTC_ADDRESS',  color: '#f7931a' },
  { symbol: 'ETH',  network: 'Ethereum',  address: 'YOUR_ETH_ADDRESS',  color: '#627eea' },
  { symbol: 'USDT', network: 'TRC-20',    address: 'YOUR_USDT_ADDRESS', color: '#26a17b' },
  { symbol: 'ICP',  network: 'Internet Computer', address: 'YOUR_ICP_ADDRESS', color: '#29abe2' },
];
```

QR codes are auto-generated from the address strings.

---

## Résumé PDF

Replace `public/CL_Khoo_Resume.pdf` with an updated copy at any time. The download link in the Navbar will automatically serve the new file on next deploy.

---

## Day Theme Override (Dev / Testing)

To preview a specific day's theme without waiting for that day:

```js
// src/data/dayThemes.js
export function getTodayTheme(dayOverride) {
  const d = dayOverride ?? new Date().getDay();
  return DAY_THEMES[d];
}
```

Temporarily pass a number (0–6) to `getTodayTheme(3)` in `App.jsx` to force Wednesday's Emerald Grid theme, for example.
