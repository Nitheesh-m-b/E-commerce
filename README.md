Shopify (Buy T-shirts Online) (Next.js & TypeScript)

A modern, dynamic product customizer built with **Next.js**, allowing users to configure a product (like a T-shirt) based on size, color, and quantity, with **real-time price calculation** and **state persistence**.

The application features a clean, responsive UI with robust storage and SEO implementation, fulfilling all project requirements.

## ✨ Key Features & Requirements Met

| Category | Requirement | Status | Details |
| :--- | :--- | :--- | :--- |
| **Core Tech** | Next.js (TypeScript) | ✅ | Built with **Next.js 14+ (App Router)** and **TypeScript**. |
| **Pricing** | Dynamic Price Calculation | ✅ | Price updates based on base cost, color, size, and **quantity**. |
| **Persistence** | Cart Persistence | ✅ | Selected variants are stored in **`localStorage`**. |
| **UI** | Image & Variant Updates | ✅ | Product image updates instantly when the color changes. |
| **SEO** | SSR & Open Graph | ✅ | Utilizes Next.js for SSR. OG image dynamically reflects the **selected variant thumbnail**. |
| **Layout** | Responsive & Sticky CTA | ✅ | Fully responsive design with a **sticky "Add to Cart" CTA**. |
| **Bonus 1** | Variant Transitions | ✅ | Subtle CSS transitions applied to the product image on color change. |
| **Bonus 2** | Session Tracking | ✅ | Tracks the last viewed configuration in **`sessionStorage`**. |

***

## 🛠️ Technology Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** React Hooks (`useState`, `useMemo`, `useEffect`)
* **Persistence:** `localStorage` and `sessionStorage` (via custom hook)

***

## ⚙️ Dynamic Pricing Model

The application calculates the total price by first determining the cost per unit and then multiplying it by the selected quantity.

**Price Per Unit Calculation:**
$$
\text{Price}_{\text{Unit}} = \text{Base Price} + \text{Color Modifier} + \text{Size Modifier}
$$

**Total Price Calculation:**
$$
\text{Total Price} = \text{Price}_{\text{Unit}} \times \text{Quantity}
$$

This calculation is implemented using the **`useMemo` hook** in the product component for efficient, real-time updates.

***

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* Node.js (v18+)
* npm or Yarn

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd product-configurator
