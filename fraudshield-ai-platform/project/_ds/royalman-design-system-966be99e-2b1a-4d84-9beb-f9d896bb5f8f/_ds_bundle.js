/* @ds-bundle: {"format":4,"namespace":"RoyalmanDesignSystem_966be9","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"FAQItem","sourcePath":"components/marketing/FAQItem.jsx"},{"name":"FeatureItem","sourcePath":"components/marketing/FeatureItem.jsx"},{"name":"PriceCard","sourcePath":"components/marketing/PriceCard.jsx"},{"name":"StepItem","sourcePath":"components/marketing/StepItem.jsx"},{"name":"Testimonial","sourcePath":"components/marketing/Testimonial.jsx"}],"sourceHashes":{"components/core/Button.jsx":"640124eb6f34","components/core/Card.jsx":"c86fa1e8a6e5","components/core/Input.jsx":"cb49074cb6aa","components/core/SectionHeading.jsx":"36a1f9916b41","components/marketing/FAQItem.jsx":"d5ede47d98ef","components/marketing/FeatureItem.jsx":"a9fd3431d530","components/marketing/PriceCard.jsx":"4cab56331faf","components/marketing/StepItem.jsx":"29651b85b589","components/marketing/Testimonial.jsx":"926cd97d69e7","ui_kits/website/AboutScreen.jsx":"ef51bb3abd5f","ui_kits/website/BlogScreen.jsx":"a8d45e8fd730","ui_kits/website/Footer.jsx":"9d1b43c47421","ui_kits/website/Header.jsx":"2f3d363a74ff","ui_kits/website/HomeScreen.jsx":"babe0850665c","ui_kits/website/data.js":"c4a439b7d093"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RoyalmanDesignSystem_966be9 = window.RoyalmanDesignSystem_966be9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Royalman primary button.
 * Ground truth: bg-brandOne, white bold text, hover swaps to brandTwo (blue).
 * Two shapes appear on the site — "lg" (rounded-lg, used in nav / quote)
 * and "pill" (rounded-full, used for section CTAs).
 */
function Button({
  children,
  shape = "pill",
  size = "md",
  variant = "primary",
  icon = null,
  as = "button",
  href,
  onClick,
  disabled = false,
  style = {},
  ...rest
}) {
  const radius = shape === "lg" ? "var(--rm-radius-lg)" : "var(--rm-radius-full)";
  const sizes = {
    sm: {
      padding: "8px 18px",
      fontSize: "14px",
      height: "36px"
    },
    md: {
      padding: "10px 24px",
      fontSize: "16px",
      height: "44px"
    },
    lg: {
      padding: "12px 28px",
      fontSize: "18px",
      height: "48px"
    }
  };
  const variants = {
    primary: {
      background: "var(--rm-orange)",
      color: "#fff",
      border: "none"
    },
    secondary: {
      background: "var(--rm-blue)",
      color: "#fff",
      border: "none"
    },
    outline: {
      background: "transparent",
      color: "var(--rm-blue)",
      border: "2px solid var(--rm-blue)"
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverBg = variant === "outline" ? "var(--rm-blue)" : "var(--rm-blue)";
  const hoverColor = "#fff";
  const s = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontFamily: "var(--rm-font)",
    fontWeight: 700,
    lineHeight: 1,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    borderRadius: radius,
    boxShadow: "var(--rm-shadow-lg)",
    transition: "background var(--rm-duration) var(--rm-ease), color var(--rm-duration) var(--rm-ease), transform var(--rm-duration) var(--rm-ease)",
    transform: hover && !disabled ? "scale(1.05)" : "scale(1)",
    ...sizes[size],
    ...variants[variant],
    ...(hover && !disabled ? {
      background: hoverBg,
      color: hoverColor
    } : {}),
    ...style
  };
  const Tag = href ? "a" : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: s
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Royalman surface card.
 * Ground truth: white bg, rounded-lg, shadow-lg, p-6, often border-gray-200.
 * The universal container behind packages, testimonials, FAQ, feature blocks.
 */
function Card({
  children,
  border = true,
  padding = "24px",
  align = "stretch",
  style = {},
  ...rest
}) {
  const s = {
    background: "var(--rm-surface-card)",
    borderRadius: "var(--rm-radius-lg)",
    boxShadow: "var(--rm-shadow-lg)",
    border: border ? "1px solid var(--rm-border-card)" : "none",
    padding,
    display: "flex",
    flexDirection: "column",
    alignItems: align,
    fontFamily: "var(--rm-font)",
    color: "var(--rm-text-body)",
    ...style
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: s
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text / email input.
 * Ground truth: footer newsletter input — rounded-xl, white, no outline,
 * left padding. Kept simple and label-friendly.
 */
function Input({
  type = "text",
  placeholder = "",
  label,
  value,
  onChange,
  style = {},
  ...rest
}) {
  const input = /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    style: {
      height: "44px",
      width: "100%",
      borderRadius: "var(--rm-radius-xl)",
      border: "1px solid var(--rm-gray-200)",
      outline: "none",
      padding: "0 20px",
      fontFamily: "var(--rm-font)",
      fontSize: "15px",
      color: "var(--rm-gray-800)",
      boxSizing: "border-box",
      ...style
    }
  }, rest));
  if (!label) return input;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      fontFamily: "var(--rm-font)",
      fontSize: "14px",
      color: "var(--rm-gray-700)"
    }
  }, label, input);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
/**
 * Centered section heading block.
 * Ground truth: optional orange eyebrow, bold gray-800 title (text-3xl),
 * optional gray-600 subtitle. Used above nearly every section.
 */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  titleColor = "var(--rm-text-heading)",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      maxWidth: align === "center" ? "768px" : "none",
      margin: align === "center" ? "0 auto" : "0",
      fontFamily: "var(--rm-font)",
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--rm-orange)",
      fontWeight: 700,
      fontSize: "14px",
      marginBottom: "8px"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: titleColor,
      fontWeight: 800,
      fontSize: "30px",
      lineHeight: 1.2,
      margin: 0
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--rm-text-body)",
      fontSize: "18px",
      fontWeight: 500,
      lineHeight: 1.5,
      marginTop: "12px"
    }
  }, subtitle));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/marketing/FAQItem.jsx
try { (() => {
/**
 * FAQ item — icon + question + answer.
 * Ground truth: FAQ.jsx — accent icon left, bold gray-800 question,
 * gray-700 answer, inside a shadow card. Optionally collapsible.
 */
function FAQItem({
  icon,
  question,
  answer,
  accent = "var(--rm-accent-blue)",
  collapsible = false,
  defaultOpen = true,
  style = {}
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const isOpen = collapsible ? open : true;
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    style: {
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: collapsible ? () => setOpen(o => !o) : undefined,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
      cursor: collapsible ? "pointer" : "default"
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      color: accent,
      fontSize: "26px",
      flexShrink: 0,
      lineHeight: 1
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "18px",
      fontWeight: 600,
      color: "var(--rm-gray-800)",
      display: "flex",
      justifyContent: "space-between",
      gap: "12px"
    }
  }, question, collapsible && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--rm-gray-500)",
      fontWeight: 400
    }
  }, isOpen ? "–" : "+")), isOpen && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: "15px",
      lineHeight: 1.6,
      color: "var(--rm-gray-700)"
    }
  }, answer))));
}
Object.assign(__ds_scope, { FAQItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/FAQItem.jsx", error: String((e && e.message) || e) }); }

// components/marketing/FeatureItem.jsx
try { (() => {
/**
 * Icon + title + description row.
 * Ground truth: the three-up feature blocks in Royalman / GeneralSolution /
 * AboutContent — an orange icon beside a bold gray-800 title and gray-600 copy.
 */
function FeatureItem({
  icon,
  title,
  description,
  layout = "row",
  iconColor = "var(--rm-orange)",
  style = {}
}) {
  const isRow = layout === "row";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: isRow ? "row" : "column",
      alignItems: isRow ? "flex-start" : "center",
      textAlign: isRow ? "left" : "center",
      gap: "12px",
      fontFamily: "var(--rm-font)",
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      color: iconColor,
      fontSize: "30px",
      flexShrink: 0,
      lineHeight: 1
    }
  }, icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "18px",
      fontWeight: 600,
      color: "var(--rm-gray-800)"
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: "15px",
      lineHeight: 1.55,
      color: "var(--rm-gray-600)"
    }
  }, description)));
}
Object.assign(__ds_scope, { FeatureItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/FeatureItem.jsx", error: String((e && e.message) || e) }); }

// components/marketing/PriceCard.jsx
try { (() => {
/**
 * Pricing package card.
 * Ground truth: Packages.jsx — accent icon, title, subtitle, price,
 * check-listed features, "ideal for" line, full-width CTA button.
 */
function PriceCard({
  icon,
  title,
  subtitle,
  price,
  period,
  features = [],
  idealFor,
  ctaLabel = "Choose Plan",
  onSelect,
  featured = false,
  accent = "var(--rm-accent-blue)",
  style = {}
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    align: "center",
    style: {
      textAlign: "center",
      border: featured ? "2px solid var(--rm-orange)" : "1px solid var(--rm-border-card)",
      position: "relative",
      ...style
    }
  }, featured && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "-12px",
      background: "var(--rm-orange)",
      color: "#fff",
      fontSize: "11px",
      fontWeight: 700,
      padding: "4px 14px",
      borderRadius: "var(--rm-radius-full)"
    }
  }, "MOST POPULAR"), icon && /*#__PURE__*/React.createElement("div", {
    style: {
      color: accent,
      fontSize: "30px",
      marginBottom: "12px"
    }
  }, icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "24px",
      fontWeight: 700,
      color: "var(--rm-gray-800)"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      fontSize: "15px",
      fontWeight: 600,
      color: "var(--rm-gray-600)"
    }
  }, subtitle), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0",
      fontSize: "34px",
      fontWeight: 800,
      color: "var(--rm-gray-800)"
    }
  }, price, period && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "15px",
      fontWeight: 500,
      color: "var(--rm-gray-500)"
    }
  }, " ", period)), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "0 0 16px",
      textAlign: "left",
      width: "100%"
    }
  }, features.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "8px",
      fontSize: "14px",
      color: "var(--rm-gray-700)",
      marginBottom: "8px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--rm-gray-500)",
      flexShrink: 0,
      marginTop: "2px"
    }
  }, "\u2713"), f))), idealFor && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "13px",
      color: "var(--rm-gray-600)",
      margin: "0 0 16px",
      fontStyle: "italic"
    }
  }, idealFor), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    shape: "lg",
    onClick: onSelect,
    style: {
      width: "100%",
      boxShadow: "var(--rm-shadow-md)"
    }
  }, ctaLabel));
}
Object.assign(__ds_scope, { PriceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/PriceCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/StepItem.jsx
try { (() => {
/**
 * Numbered process step row.
 * Ground truth: Steps.jsx — accent icon, bold step title, gray-600 description,
 * inside a shadow card, laid out as a row on desktop.
 */
function StepItem({
  icon,
  step,
  title,
  description,
  accent = "var(--rm-accent-blue)",
  style = {}
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    style: {
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: accent,
      fontSize: "28px",
      flexShrink: 0,
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }
  }, icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "18px",
      fontWeight: 600,
      color: "var(--rm-gray-800)"
    }
  }, step ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent
    }
  }, step, " ") : null, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      fontSize: "15px",
      lineHeight: 1.55,
      color: "var(--rm-gray-600)"
    }
  }, description))));
}
Object.assign(__ds_scope, { StepItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/StepItem.jsx", error: String((e && e.message) || e) }); }

// components/marketing/Testimonial.jsx
try { (() => {
/**
 * Testimonial quote card.
 * Ground truth: Testimonials.jsx — bordered white card, gray-300 quote marks
 * in the corners, bold name, italic gray-600 quote.
 */
function Testimonial({
  name,
  quote,
  style = {}
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    style: {
      position: "relative",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "10px",
      left: "14px",
      color: "var(--rm-gray-300)",
      fontSize: "34px",
      fontFamily: "Georgia, serif",
      lineHeight: 1
    }
  }, "\u201C"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "8px 0 12px",
      fontSize: "20px",
      fontWeight: 600,
      color: "var(--rm-gray-800)"
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontStyle: "italic",
      lineHeight: 1.65,
      color: "var(--rm-gray-600)",
      fontSize: "15px"
    }
  }, quote));
}
Object.assign(__ds_scope, { Testimonial });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/Testimonial.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/AboutScreen.jsx
try { (() => {
const ABOUT_BG = "https://res.cloudinary.com/decwhxo32/image/upload/v1723310140/AboutHero_gtn0oi.jpg";
function AboutScreen({
  onOrder
}) {
  const D = window.RM_DATA.about;
  const {
    Card,
    SectionHeading,
    Button,
    FeatureItem
  } = window.RoyalmanDesignSystem_966be9;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: 340,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `url(${ABOUT_BG})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginTop: -74,
      paddingTop: 74
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.7)"
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      position: "relative",
      zIndex: 1,
      color: "#fff",
      fontSize: 44,
      fontWeight: 800
    }
  }, "About Us")), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--rm-gray-100)",
      padding: "64px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1152,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: D.title,
    subtitle: D.intro,
    style: {
      marginBottom: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 28
    }
  }, D.cards.map((c, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    border: false
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 600,
      color: "var(--rm-gray-800)"
    }
  }, c.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      color: "var(--rm-gray-600)",
      lineHeight: 1.6
    }
  }, c.text)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "linear-gradient(90deg, var(--rm-blue), var(--rm-orange))",
      padding: "64px 24px",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1152,
      margin: "0 auto",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 34,
      fontWeight: 800,
      marginTop: 0,
      marginBottom: 36
    }
  }, "Why Choose Us?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 28
    }
  }, D.why.map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "rgba(255,255,255,0.1)",
      borderRadius: "var(--rm-radius-lg)",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 12px",
      fontSize: 20,
      fontWeight: 600
    }
  }, w.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      lineHeight: 1.6
    }
  }, w.text)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "#fff",
      padding: "64px 24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Ready to Elevate Your Online Presence?",
    style: {
      marginBottom: 24
    }
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: onOrder
  }, "Start Your Order")));
}
window.AboutScreen = AboutScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/AboutScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/BlogScreen.jsx
try { (() => {
const BLOG_BG = "https://res.cloudinary.com/decwhxo32/image/upload/v1724083671/blog_i4tg5l.webp";
function BlogScreen() {
  const D = window.RM_DATA;
  const {
    Card,
    SectionHeading
  } = window.RoyalmanDesignSystem_966be9;
  const [hover, setHover] = React.useState(-1);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: 320,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `url(${BLOG_BG})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginTop: -74,
      paddingTop: 74
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.65)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      textAlign: "center",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 44,
      fontWeight: 800,
      margin: 0
    }
  }, "The Royalman Blog"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      marginTop: 12
    }
  }, "Insights on web design, SEO, and growing your business online."))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--rm-gray-100)",
      padding: "64px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1152,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap: 28
    }
  }, D.posts.map((p, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    style: {
      cursor: "pointer",
      transform: hover === i ? "translateY(-4px)" : "none",
      transition: "transform var(--rm-duration) var(--rm-ease), box-shadow var(--rm-duration) var(--rm-ease)",
      boxShadow: hover === i ? "var(--rm-shadow-xl)" : "var(--rm-shadow-lg)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: "flex-start",
      background: "var(--rm-orange)",
      color: "#fff",
      fontSize: 12,
      fontWeight: 700,
      padding: "4px 12px",
      borderRadius: "var(--rm-radius-full)",
      marginBottom: 14
    }
  }, p.tag), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 22,
      fontWeight: 700,
      color: "var(--rm-gray-800)",
      lineHeight: 1.25
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 16px",
      color: "var(--rm-gray-600)",
      lineHeight: 1.6
    }
  }, p.excerpt), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--rm-gray-500)"
    }
  }, p.read), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--rm-orange)",
      fontWeight: 700,
      fontSize: 14
    }
  }, "Read more ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right"
  })))))))));
}
window.BlogScreen = BlogScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/BlogScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
const FOOTER_BG = "https://res.cloudinary.com/decwhxo32/image/upload/v1723390446/footerbackground_relqna.jpg";
function Footer() {
  const D = window.RM_DATA;
  const socials = ["fa-whatsapp", "fa-facebook-f", "fa-linkedin-in", "fa-instagram", "fa-x-twitter"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      backgroundImage: `url(${FOOTER_BG})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--rm-overlay-85)",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 40,
      padding: "64px 80px",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.RM_LOGO,
    alt: "Royalman",
    style: {
      height: 90
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 22,
      margin: 0
    }
  }, D.contact.tagline), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      margin: 0
    }
  }, "Contact Us And Let's Get Started"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 22,
      fontSize: 24,
      color: "var(--rm-orange)"
    }
  }, socials.map(s => /*#__PURE__*/React.createElement("i", {
    key: s,
    className: `fa-brands ${s}`,
    style: {
      cursor: "pointer"
    }
  }))), /*#__PURE__*/React.createElement("a", {
    style: {
      color: "var(--rm-orange)",
      cursor: "pointer"
    }
  }, "Terms of Service"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: "var(--rm-orange)",
      cursor: "pointer"
    }
  }, "Privacy Policy")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 320,
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 20,
      margin: 0,
      fontWeight: 600
    }
  }, "Get in Touch"), /*#__PURE__*/React.createElement("p", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-phone",
    style: {
      color: "var(--rm-orange)",
      fontSize: 22
    }
  }), D.contact.phones.join("  ")), /*#__PURE__*/React.createElement("p", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      margin: 0,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-envelope",
    style: {
      color: "var(--rm-orange)",
      fontSize: 22
    }
  }), /*#__PURE__*/React.createElement("span", null, D.contact.emails.join("  ·  "))), /*#__PURE__*/React.createElement("p", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp",
    style: {
      color: "var(--rm-orange)",
      fontSize: 22
    }
  }), "Message us on WhatsApp"), /*#__PURE__*/React.createElement("button", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      height: 42,
      width: 190,
      background: "var(--rm-orange)",
      border: "none",
      fontWeight: 700,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-group",
    style: {
      color: "var(--rm-blue)",
      fontSize: 18
    }
  }), "Refer & Earn")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 28,
      lineHeight: 1.1,
      margin: 0
    }
  }, "Subscribe to Our Newsletter"), /*#__PURE__*/React.createElement("label", {
    style: {
      alignSelf: "flex-start",
      fontSize: 14
    }
  }, "Email address:"), /*#__PURE__*/React.createElement("input", {
    placeholder: "Your email address",
    style: {
      height: 42,
      width: "100%",
      borderRadius: "var(--rm-radius-xl)",
      border: "none",
      outline: "none",
      padding: "0 20px",
      boxSizing: "border-box"
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      height: 42,
      width: 150,
      background: "var(--rm-orange)",
      border: "none",
      borderRadius: "var(--rm-radius-xl)",
      fontSize: 18,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Subscribe")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--rm-gray-950)",
      color: "#fff",
      padding: "16px",
      textAlign: "center",
      fontSize: 17
    }
  }, "\xA9 2024 Royalman Digital Concept. All Rights Reserved."));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
const LOGO = "https://res.cloudinary.com/decwhxo32/image/upload/v1723390784/RoyalmanLogo_vvjuvk.png";
function Header({
  current,
  onNav,
  onQuote,
  solid
}) {
  const D = window.RM_DATA;
  const [hoverIdx, setHoverIdx] = React.useState(-1);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 30,
      padding: "10px 40px",
      transition: "all 0.4s var(--rm-ease)",
      background: solid ? "#fff" : "transparent",
      boxShadow: solid ? "var(--rm-shadow-lg)" : "none",
      color: solid ? "#000" : "#fff"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO,
    alt: "Royalman",
    style: {
      height: 54
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 32,
      fontWeight: 700,
      fontSize: 17
    }
  }, D.nav.map((item, i) => {
    const active = item === current;
    return /*#__PURE__*/React.createElement("a", {
      key: item,
      onClick: () => onNav(item),
      onMouseEnter: () => setHoverIdx(i),
      onMouseLeave: () => setHoverIdx(-1),
      style: {
        cursor: "pointer",
        color: active || hoverIdx === i ? "var(--rm-orange)" : "inherit",
        transition: "color var(--rm-duration) var(--rm-ease)"
      }
    }, item);
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onQuote,
    style: {
      height: 36,
      width: 168,
      borderRadius: "var(--rm-radius-lg)",
      background: "var(--rm-orange)",
      color: "#fff",
      fontWeight: 700,
      border: "none",
      cursor: "pointer",
      transition: "background var(--rm-duration) var(--rm-ease)"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--rm-blue)",
    onMouseLeave: e => e.currentTarget.style.background = "var(--rm-orange)"
  }, "Free Quote"));
}
window.Header = Header;
window.RM_LOGO = LOGO;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
const HERO_BG = "https://res.cloudinary.com/decwhxo32/image/upload/v1723390366/BgImage_hpfyf0.jpg";
function Countdown() {
  // Static evergreen countdown display (design fidelity, not a live clock).
  const box = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 8,
    padding: "10px 14px",
    minWidth: 62
  };
  const num = {
    fontSize: 26,
    fontWeight: 800,
    color: "var(--rm-orange)",
    lineHeight: 1
  };
  const lbl = {
    fontSize: 11,
    color: "#fff",
    marginTop: 4,
    letterSpacing: "0.05em"
  };
  const units = [["05", "DAYS"], ["12", "HRS"], ["48", "MIN"], ["30", "SEC"]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, units.map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: box
  }, /*#__PURE__*/React.createElement("span", {
    style: num
  }, n), /*#__PURE__*/React.createElement("span", {
    style: lbl
  }, l))));
}
function Section({
  children,
  muted,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: muted ? "var(--rm-gray-100)" : "#fff",
      padding: "56px 24px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1152,
      margin: "0 auto"
    }
  }, children));
}
function HomeScreen({
  onOrder
}) {
  const D = window.RM_DATA;
  const {
    SectionHeading,
    Card,
    Button,
    FeatureItem,
    Testimonial,
    StepItem,
    PriceCard,
    FAQItem
  } = window.RoyalmanDesignSystem_966be9;
  const I = c => /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${c}`
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: 620,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `url(${HERO_BG})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginTop: -74,
      paddingTop: 74
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.82)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      textAlign: "center",
      maxWidth: 680,
      padding: "60px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--rm-orange)",
      fontWeight: 700,
      fontSize: 18,
      margin: 0
    }
  }, D.hero.eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: "#fff",
      fontSize: 38,
      fontWeight: 800,
      lineHeight: 1.2,
      margin: 0
    }
  }, D.hero.heading), /*#__PURE__*/React.createElement(Countdown, null), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "#fff",
      fontSize: 17,
      lineHeight: 1.6,
      margin: 0,
      maxWidth: 560
    }
  }, D.hero.sub), /*#__PURE__*/React.createElement(Button, {
    shape: "lg",
    size: "lg",
    onClick: onOrder,
    style: {
      marginTop: 8
    }
  }, D.hero.cta))), /*#__PURE__*/React.createElement(Section, {
    muted: true
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      maxWidth: 720,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "left",
    title: D.problems.title,
    style: {
      marginBottom: 24
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, D.problems.items.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      fontSize: 16,
      color: "var(--rm-gray-700)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${p.icon}`,
    style: {
      color: "var(--rm-blue)",
      fontSize: 24,
      marginTop: 2,
      width: 30,
      textAlign: "center"
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--rm-gray-800)"
    }
  }, p.label), " ", p.text)))))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Card, {
    style: {
      maxWidth: 768,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: D.solution.title,
    subtitle: D.solution.body,
    style: {
      marginBottom: 28
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 24
    }
  }, D.solution.features.map((f, i) => /*#__PURE__*/React.createElement(FeatureItem, {
    key: i,
    layout: "row",
    icon: I(f.icon),
    title: f.title,
    description: f.text
  }))))), /*#__PURE__*/React.createElement(Section, {
    muted: true
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Don't Just Take Our Word for It\u2026",
    style: {
      marginBottom: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      maxWidth: 860,
      margin: "0 auto"
    }
  }, D.testimonials.map((t, i) => /*#__PURE__*/React.createElement(Testimonial, {
    key: i,
    name: t.name,
    quote: t.quote
  })))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Ready to Transform Your Website Without the Hassle?",
    style: {
      marginBottom: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      maxWidth: 860,
      margin: "0 auto"
    }
  }, D.steps.map((s, i) => /*#__PURE__*/React.createElement(StepItem, {
    key: i,
    icon: I(s.icon),
    accent: s.accent,
    step: s.step,
    title: s.title,
    description: s.text
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onOrder
  }, "Book Your Free Consultation"))), /*#__PURE__*/React.createElement(Section, {
    muted: true
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      maxWidth: 768,
      margin: "0 auto",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "100% Satisfaction Guaranteed \u2014 Or Your Money Back!",
    titleColor: "var(--rm-orange)",
    subtitle: "We're confident you'll love your new website, but if you're not completely satisfied\u2026"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--rm-gray-700)",
      lineHeight: 1.65,
      margin: "20px 0"
    }
  }, "We stand by our work. That's why we offer a 30-day money-back guarantee. If you're not completely satisfied within 30 days of launch, we'll refund your investment \u2014 no questions asked."), /*#__PURE__*/React.createElement(Button, {
    onClick: onOrder
  }, "Start Your Risk-Free Project"))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Find the Perfect Package for Your Business",
    subtitle: "Three tailored packages, each with everything you need for a high-performing website.",
    style: {
      marginBottom: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 24,
      alignItems: "start"
    }
  }, D.packages.map((p, i) => /*#__PURE__*/React.createElement(PriceCard, {
    key: i,
    icon: I(p.icon),
    accent: p.accent,
    title: p.title,
    subtitle: p.subtitle,
    price: p.price,
    features: p.features,
    idealFor: p.idealFor,
    ctaLabel: p.cta,
    featured: p.featured,
    onSelect: onOrder
  })))), /*#__PURE__*/React.createElement(Section, {
    muted: true
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    title: "Frequently Asked Questions",
    style: {
      marginBottom: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      maxWidth: 860,
      margin: "0 auto"
    }
  }, D.faqs.map((f, i) => /*#__PURE__*/React.createElement(FAQItem, {
    key: i,
    icon: I(f.icon),
    accent: f.accent,
    question: f.q,
    answer: f.a,
    collapsible: true,
    defaultOpen: i === 0
  })))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
// Real content lifted from the Royalman website source.
window.RM_DATA = {
  nav: ["Home", "About us", "Contact us", "Blog"],
  hero: {
    eyebrow: "Attention Business Owners!",
    heading: "Get a Custom-Fit Website that puts you ahead of your competitors, designed with precision to reflect your unique brand.",
    sub: "Our custom-fit website delivers seamless user experience and superior performance to drive conversion.",
    cta: "Start Your Order"
  },
  problems: {
    title: "We Know It's Frustrating When You Have:",
    items: [{
      icon: "fa-arrow-right",
      label: "Low Conversion Rates:",
      text: "You're getting traffic, but not enough customers are taking action."
    }, {
      icon: "fa-desktop",
      label: "Outdated Website Design:",
      text: "Your website looks unprofessional and doesn't reflect your brand's true value."
    }, {
      icon: "fa-mobile-screen-button",
      label: "Poor User Experience:",
      text: "Your site is slow, hard to navigate, or not optimized for mobile users."
    }, {
      icon: "fa-magnifying-glass",
      label: "Lack of SEO and Visibility:",
      text: "You're missing out on organic traffic because your site isn't optimized for search."
    }, {
      icon: "fa-circle-exclamation",
      label: "High Bounce Rates:",
      text: "Visitors leave your site before taking any meaningful action."
    }]
  },
  solution: {
    title: "The Power of a High-Performing Website",
    body: "Imagine having a website that works for you 24/7, turning visitors into loyal customers and driving continuous growth.",
    features: [{
      icon: "fa-laptop-code",
      title: "User-Friendly Design",
      text: "An intuitive design makes it easier for visitors to navigate and take action."
    }, {
      icon: "fa-rocket",
      title: "Increased Conversions",
      text: "Optimized functionality guides visitors smoothly through their journey."
    }, {
      icon: "fa-users",
      title: "Brand Trust",
      text: "A professional website builds credibility and encourages engagement."
    }]
  },
  testimonials: [{
    name: "John Samuel — Owner of J.E.S Aluminium Services",
    quote: "Working with Royalman Digital Concept was a game-changer for us. They created a stunning, user-friendly design that truly reflects our brand. Within the first month, we saw a 50% increase in conversions."
  }, {
    name: "Ace Nkechi Agbah — CEO of Kechmelon Deliciousness",
    quote: "After my 10-minute consultation, I knew I was in good hands. Our bounce rates dropped significantly, and we're now ranking higher on Google. Truly a fantastic experience."
  }, {
    name: "Charles David — CEO of Charlgry Devia",
    quote: "Royalman transformed our website into a powerful marketing tool. Sleek, mobile-friendly, and SEO-optimized. We've seen a noticeable increase in online orders since launch."
  }],
  steps: [{
    icon: "fa-calendar-days",
    accent: "var(--rm-accent-blue)",
    step: "Step 1:",
    title: "Book Your Free 10-Minute Consultation",
    text: "Schedule a quick one-on-one meeting to discuss your needs and goals."
  }, {
    icon: "fa-money-check-dollar",
    accent: "var(--rm-accent-green)",
    step: "Step 2:",
    title: "Secure Your Project with a 70% Deposit",
    text: "Once we've agreed on the plan, make a 70% upfront payment to kickstart the project."
  }, {
    icon: "fa-file-arrow-up",
    accent: "var(--rm-accent-yellow)",
    step: "Step 3:",
    title: "Share Your Assets",
    text: "Send us your logo, images, and any content. We can help source additional materials."
  }, {
    icon: "fa-pen-to-square",
    accent: "var(--rm-accent-purple)",
    step: "Step 4:",
    title: "Review and Provide Feedback",
    text: "Receive the first draft and provide feedback. We'll adjust until it meets expectations."
  }, {
    icon: "fa-rocket",
    accent: "var(--rm-accent-red)",
    step: "Step 5:",
    title: "Approve, Pay, and Launch",
    text: "Approve the design, complete the remaining 30%, and we'll handle hosting and launch."
  }],
  packages: [{
    icon: "fa-mobile-screen",
    accent: "var(--rm-accent-blue)",
    title: "Essential",
    subtitle: "Perfect for Small Businesses or Startups",
    price: "$500",
    idealFor: "Establishing a professional online presence",
    cta: "Choose Essential",
    features: ["Custom Website Design", "Mobile Optimization", "Basic SEO Setup", "Contact Form Integration", "Professional copywriting", "1 Round of Revisions", "Domain & SSL certificate", "30-Day Money-Back Guarantee"]
  }, {
    icon: "fa-chart-line",
    accent: "var(--rm-accent-green)",
    title: "Professional",
    subtitle: "Ideal for Growing Businesses",
    price: "$700",
    idealFor: "Increased engagement and visibility",
    cta: "Choose Professional",
    featured: true,
    features: ["All features in Essential", "Enhanced SEO & Analytics", "Custom Graphics & Imagery", "2 Rounds of Revisions", "Blog Integration", "Social Media Integration", "30-Day Money-Back Guarantee"]
  }, {
    icon: "fa-cart-shopping",
    accent: "var(--rm-accent-red)",
    title: "Premium",
    subtitle: "The Ultimate Solution for Maximum Impact",
    price: "$1000",
    idealFor: "Top-tier performance and growth",
    cta: "Choose Premium",
    features: ["All features in Professional", "Advanced SEO & Performance", "E-Commerce Functionality", "Unlimited Revisions", "Priority Support", "60-Day Post-Launch Support", "30-Day Money-Back Guarantee"]
  }],
  faqs: [{
    icon: "fa-circle-check",
    accent: "var(--rm-accent-green)",
    q: "What's included in the packages?",
    a: "Each package offers a range of features. Essential includes custom design and basic SEO; Professional adds enhanced SEO, blog, and social integration; Premium includes advanced SEO, e-commerce, and priority support."
  }, {
    icon: "fa-clock",
    accent: "var(--rm-accent-yellow)",
    q: "How long does it take to complete a website?",
    a: "Essential typically takes about 5 days, Professional around 7 days, and Premium approximately 14 days. We'll confirm a specific timeline during your free consultation."
  }, {
    icon: "fa-face-smile",
    accent: "var(--rm-accent-blue)",
    q: "What happens if I'm not happy with the design?",
    a: "We offer a 30-day money-back guarantee. If you're not satisfied within 30 days of launch, we'll provide a full refund. Each package also includes revisions."
  }, {
    icon: "fa-mobile-screen-button",
    accent: "var(--rm-accent-purple)",
    q: "Will my website be mobile-friendly?",
    a: "Yes. All our websites are mobile-responsive and look and function beautifully on smartphones and tablets. We prioritize mobile optimization."
  }],
  about: {
    title: "About ROYALMAN DIGITAL CONCEPT",
    intro: "At ROYALMAN DIGITAL CONCEPT, we specialize in creating custom websites that speak your brand's language and attract your ideal clients. We focus on personalized design that helps businesses shine online.",
    cards: [{
      title: "Tailored to You",
      text: "Each website is custom-made to reflect your brand's unique identity."
    }, {
      title: "Experienced Team",
      text: "Our team has handled complex projects with great results for our clients."
    }, {
      title: "Focused on Conversion",
      text: "We build websites that not only look great but also drive sales and leads."
    }],
    why: [{
      title: "Tailored Websites",
      text: "We create custom solutions for your business, so your site is unlike any other."
    }, {
      title: "Customer-Centric",
      text: "We put your needs first and ensure satisfaction throughout the project."
    }, {
      title: "Proven Results",
      text: "We help turn your visitors into loyal customers with websites that perform."
    }]
  },
  posts: [{
    tag: "Web Design",
    title: "Why Your Business Needs a Custom-Fit Website in 2024",
    excerpt: "Off-the-shelf templates cost you conversions. Here's how a bespoke build reflects your brand and drives real results.",
    read: "5 min read"
  }, {
    tag: "SEO",
    title: "5 SEO Fundamentals Every Small Business Should Nail",
    excerpt: "From page speed to on-page optimization — the basics that move you up the search rankings.",
    read: "6 min read"
  }, {
    tag: "Conversion",
    title: "How a Redesign Increased Conversion by 130%",
    excerpt: "A real-world look at the design changes that turned a struggling site into a sales engine.",
    read: "4 min read"
  }, {
    tag: "Mobile",
    title: "Mobile-First: Designing for the Majority of Your Visitors",
    excerpt: "Most of your traffic is on a phone. Here's why mobile responsiveness is non-negotiable.",
    read: "5 min read"
  }],
  contact: {
    phones: ["+234 902 990 3813", "+234 805 377 4667"],
    emails: ["info@royalmandigitalconcept.com", "royalmandigitalconcept@gmail.com"],
    tagline: "Quality and Affordable Web Development For You."
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.FAQItem = __ds_scope.FAQItem;

__ds_ns.FeatureItem = __ds_scope.FeatureItem;

__ds_ns.PriceCard = __ds_scope.PriceCard;

__ds_ns.StepItem = __ds_scope.StepItem;

__ds_ns.Testimonial = __ds_scope.Testimonial;

})();
