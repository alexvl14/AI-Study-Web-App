/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface scale
        "surface":                    "#fbf9f9",
        "surface-dim":                "#dbdad9",
        "surface-bright":             "#fbf9f9",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#f5f3f3",
        "surface-container":          "#efeded",
        "surface-container-high":     "#e9e8e7",
        "surface-container-highest":  "#e3e2e2",
        "surface-variant":            "#e3e2e2",
        "surface-tint":               "#006b5f",
        // On-surface
        "on-surface":                 "#1b1c1c",
        "on-surface-variant":         "#3d4946",
        "inverse-surface":            "#303031",
        "inverse-on-surface":         "#f2f0f0",
        // Background
        "background":                 "#fbf9f9",
        "on-background":              "#1b1c1c",
        // Outline
        "outline":                    "#6d7a76",
        "outline-variant":            "#bcc9c5",
        // Primary (teal)
        "primary":                    "#006b5f",
        "on-primary":                 "#ffffff",
        "primary-container":          "#5ec9b8",
        "on-primary-container":       "#005249",
        "inverse-primary":            "#6ed8c7",
        "primary-fixed":              "#8bf5e3",
        "primary-fixed-dim":          "#6ed8c7",
        "on-primary-fixed":           "#00201c",
        "on-primary-fixed-variant":   "#005047",
        // Secondary (charcoal)
        "secondary":                  "#5f5e5e",
        "on-secondary":               "#ffffff",
        "secondary-container":        "#e4e2e1",
        "on-secondary-container":     "#656464",
        "secondary-fixed":            "#e4e2e1",
        "secondary-fixed-dim":        "#c8c6c5",
        "on-secondary-fixed":         "#1b1c1c",
        "on-secondary-fixed-variant": "#474747",
        // Tertiary (neutral grey)
        "tertiary":                   "#5e5e5c",
        "on-tertiary":                "#ffffff",
        "tertiary-container":         "#b8b7b4",
        "on-tertiary-container":      "#484846",
        "tertiary-fixed":             "#e4e2de",
        "tertiary-fixed-dim":         "#c8c6c3",
        "on-tertiary-fixed":          "#1b1c1a",
        "on-tertiary-fixed-variant":  "#474744",
        // Error
        "error":                      "#ba1a1a",
        "on-error":                   "#ffffff",
        "error-container":            "#ffdad6",
        "on-error-container":         "#93000a",
      },
      fontFamily: {
        sans:  ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        "display-lg":        ["56px", { lineHeight: "64px",  letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["40px", { lineHeight: "48px",  fontWeight: "700" }],
        "headline-lg":       ["32px", { lineHeight: "40px",  fontWeight: "600" }],
        "headline-md":       ["24px", { lineHeight: "32px",  fontWeight: "600" }],
        "body-lg":           ["18px", { lineHeight: "28px",  fontWeight: "400" }],
        "body-md":           ["16px", { lineHeight: "24px",  fontWeight: "400" }],
        "label-md":          ["14px", { lineHeight: "20px",  letterSpacing: "0.05em", fontWeight: "600" }],
      },
      borderRadius: {
        "none":    "0",
        "sm":      "0.25rem",
        "DEFAULT": "0.5rem",
        "md":      "0.75rem",
        "lg":      "1rem",
        "xl":      "1.5rem",
        "full":    "9999px",
      },
      boxShadow: {
        "hard":    "4px 4px 0px 0px rgba(27, 28, 28, 0.20)",
        "hard-sm": "2px 2px 0px 0px rgba(27, 28, 28, 0.10)",
        "hard-lg": "8px 8px 0px 0px rgba(27, 28, 28, 0.20)",
      },
      spacing: {
        "unit":           "8px",
        "gutter":         "24px",
        "margin-mobile":  "20px",
        "margin-desktop": "80px",
      },
      maxWidth: {
        "max-width": "1280px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
