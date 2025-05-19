# Next.js E-commerce Template 🛍️

A modern, accessible e-commerce storefront built with **Next.js 14**, **TypeScript**, **MUI**, and **Tailwind CSS** — styled primarily with MUI, extended with Tailwind utilities.
<br>Includes a full admin dashboard, product editor, and order management.

---

## 🌐 Live Preview

**🌐 Live Preview:** [modern-ecommerce-store.vercel.app](https://modern-ecommerce-store.vercel.app) &nbsp;&nbsp;&nbsp; **🗄️ Backend Repository:** [GitHub - nextjs-ecommerce-api](https://github.com/giladfuchs/nextjs-ecommerce-api)

---

## 🚀 Getting Started

To run the project locally:

- Install dependencies:

  ```bash
  pnpm install
  ```

- Start the development server:

  ```bash
  pnpm dev
  ```

---

## 🤝 Contributing

Contributions are welcome!  
If you find this project useful, consider giving it a ⭐ on GitHub — it helps others discover it!

To contribute, fork the repository and submit a pull request with your enhancements or bug fixes.

---

## ✨ Key Features

- 🎨 **MUI + Tailwind CSS** hybrid styling
- 🛒 **Cart powered by Redux** with **persisted state**
- ⚡ **Local cache** for categories and products (via client memory)
- 🔎 **Client-side filtering** with URL sync
- 🌐 **RTL support** (optimized for Hebrew)
- ♿ **Accessibility bar** with dynamic font scaling
- 🧾 **Admin Dashboard**:
  - Add/Edit products, categories, and images
  - Track and update orders
- 📤 **Image upload** support via [Vercel Blob](https://vercel.com/docs/storage/blob)
- 🧠 **SEO & Social Sharing**:
  - Utilizes **Next.js 14’s Metadata API** for dynamic `<head>` tags
  - Supports **Open Graph** and **Twitter Card** metadata
  - Enables **per-page titles**, descriptions, and rich social previews

---

## 🧩 Tech Stack

- **Next.js 14**, **React 18**, **TypeScript**
- **MUI 7**, **Tailwind CSS**
- **Redux Toolkit**, **redux-persist**
- **AG Grid**, **Formik**, **Yup**
- **react-intl** (internationalization)
- **Sonner** (toast notifications)

---

### 🛠️ Environment Variables

Create a `.env` file at the root of your project:

```env
# Public site branding and metadata
NEXT_PUBLIC_SITE_NAME=YourStoreName
NEXT_PUBLIC_BASE_URL=https://your-store.vercel.app
NEXT_PUBLIC_API_URL=https://your-api.vercel.app

# Optional: Google verification & icon for SEO/social sharing
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_ICON_IMAGE_URL=https://your-domain.com/logo.png

# Footer contact & social info (comma-separated)
NEXT_PUBLIC_FOOTER_DATA=info@example.com,123 Example St.,1234567890,instagram_handle,facebook_page,https://your-website.com

# Pre-filled WhatsApp message
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi, I came from your store website and had a question.
```

## 📁 Structure Overview

```

app/
├── admin/          → Admin panel (model-based)
├── checkout/       → Checkout flow
├── category/       → Category pages
├── product/        → Product detail pages

components/
├── admin/          → AG Grid Table, Model forms
├── cart/           → Cart modal and UI
├── checkout/       → Checkout info and summary
├── layout/         → Header, Footer
├── product/        → Product display, gallery, cards
├── shared/         → Loading, messages, accessibility

lib/
├── api/            → API helpers (catalog, orders, uploads)
├── store/          → Redux store and slices
├── types/          → Shared TypeScript types
├── assets/         → Static config like i18n messages, SEO
```

---

## 🙏 Acknowledgments

- [Vercel Commerce](https://github.com/vercel/commerce) for the initial template.

---

 