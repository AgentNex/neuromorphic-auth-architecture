"use client";

import { useState, useCallback } from "react";
import "./PricingSection.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type BillingCycle = "monthly" | "annual";

interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  badge?: string;
  popular?: boolean;
  ctaLabel: string;
  ctaVariant: "ghost" | "primary" | "elevated";
  features: PricingFeature[];
  accentColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ANNUAL_DISCOUNT = 0.25; // 25% off annual

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Start building with zero friction.",
    monthlyPrice: 0,
    ctaLabel: "Get started",
    ctaVariant: "ghost",
    accentColor: "rgba(148,163,184,0.12)",
    features: [
      { text: "5 projects", included: true },
      { text: "1 GB storage", included: true },
      { text: "Community support", included: true },
      { text: "Basic analytics", included: true },
      { text: "Advanced orchestration", included: false },
      { text: "Custom domains", included: false },
      { text: "Priority support", included: false },
      { text: "Team seats", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For individuals who move fast.",
    monthlyPrice: 19,
    popular: true,
    badge: "Most popular",
    ctaLabel: "Start free trial",
    ctaVariant: "primary",
    accentColor: "rgba(59,130,246,0.15)",
    features: [
      { text: "Unlimited projects", included: true, highlight: true },
      { text: "100 GB storage", included: true },
      { text: "Priority email support", included: true },
      { text: "Advanced analytics", included: true, highlight: true },
      { text: "Advanced orchestration", included: true, highlight: true },
      { text: "Custom domains", included: true },
      { text: "Priority support", included: false },
      { text: "Team seats", included: false },
    ],
  },
  {
    id: "team",
    name: "Team",
    tagline: "Built for serious teams at scale.",
    monthlyPrice: 49,
    ctaLabel: "Start free trial",
    ctaVariant: "elevated",
    accentColor: "rgba(139,92,246,0.12)",
    features: [
      { text: "Unlimited projects", included: true },
      { text: "1 TB storage", included: true },
      { text: "24/7 priority support", included: true, highlight: true },
      { text: "Advanced analytics", included: true },
      { text: "Advanced orchestration", included: true },
      { text: "Custom domains", included: true },
      { text: "Priority SLA support", included: true, highlight: true },
      { text: "Up to 25 team seats", included: true, highlight: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom scale. Dedicated infrastructure.",
    monthlyPrice: null,
    ctaLabel: "Contact sales",
    ctaVariant: "ghost",
    accentColor: "rgba(52,211,153,0.08)",
    features: [
      { text: "Unlimited everything", included: true, highlight: true },
      { text: "Dedicated storage", included: true },
      { text: "Dedicated support team", included: true, highlight: true },
      { text: "Custom analytics & reporting", included: true },
      { text: "Enterprise orchestration", included: true },
      { text: "Custom domains + CDN", included: true },
      { text: "99.99% SLA guarantee", included: true, highlight: true },
      { text: "Unlimited team seats", included: true, highlight: true },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(
  monthlyPrice: number | null,
  billing: BillingCycle
): { display: string; per: string; original?: string } {
  if (monthlyPrice === null) {
    return { display: "Custom", per: "tailored to your needs" };
  }
  if (monthlyPrice === 0) {
    return { display: "$0", per: "forever free" };
  }
  if (billing === "annual") {
    const annual = monthlyPrice * (1 - ANNUAL_DISCOUNT);
    return {
      display: `$${annual.toFixed(0)}`,
      per: "per month, billed annually",
      original: `$${monthlyPrice}`,
    };
  }
  return {
    display: `$${monthlyPrice}`,
    per: "per month",
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8L6.5 11L12.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 5L11 11M11 5L5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── BillingToggle ────────────────────────────────────────────────────────────

interface BillingToggleProps {
  value: BillingCycle;
  onChange: (v: BillingCycle) => void;
  savePct: number;
}

function BillingToggle({ value, onChange, savePct }: BillingToggleProps) {
  return (
    <div className="pricing-toggle-wrap" role="group" aria-label="Billing cycle">
      {/* Monthly label */}
      <button
        type="button"
        className={`pricing-toggle-label ${value === "monthly" ? "is-active" : ""}`}
        onClick={() => onChange("monthly")}
        aria-pressed={value === "monthly"}
      >
        Monthly
      </button>

      {/* Pill track */}
      <button
        type="button"
        className="pricing-toggle-track"
        role="switch"
        aria-checked={value === "annual"}
        aria-label="Switch to annual billing"
        onClick={() => onChange(value === "monthly" ? "annual" : "monthly")}
      >
        <span
          className="pricing-toggle-thumb"
          style={{
            transform: value === "annual" ? "translateX(22px)" : "translateX(2px)",
          }}
        />
      </button>

      {/* Annual label */}
      <button
        type="button"
        className={`pricing-toggle-label ${value === "annual" ? "is-active" : ""}`}
        onClick={() => onChange("annual")}
        aria-pressed={value === "annual"}
      >
        Annual
      </button>

      {/* Save badge */}
      <span
        className="pricing-save-badge"
        aria-live="polite"
      >
        Save&nbsp;{savePct}%
      </span>
    </div>
  );
}

// ─── PricingCard ──────────────────────────────────────────────────────────────

interface PricingCardProps {
  plan: PricingPlan;
  billing: BillingCycle;
}

function PricingCard({ plan, billing }: PricingCardProps) {
  const { display, per, original } = formatPrice(plan.monthlyPrice, billing);
  const isPopular = plan.popular;

  return (
    <article
      className={`pricing-card ${isPopular ? "pricing-card--popular" : ""}`}
      style={{ "--card-accent": plan.accentColor } as React.CSSProperties}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="pricing-popular-badge" aria-label="Most popular plan">
          {plan.badge}
        </div>
      )}

      {/* Plan header */}
      <header className="pricing-card-header">
        <h3 className="pricing-plan-name">{plan.name}</h3>
        <p className="pricing-plan-tagline">{plan.tagline}</p>
      </header>

      {/* Price block */}
      <div className="pricing-price-block" aria-live="polite" aria-atomic="true">
        <div className="pricing-price-row">
          <span className="pricing-price-display">{display}</span>
          {original && (
            <span className="pricing-price-original" aria-label={`was ${original}`}>
              {original}
            </span>
          )}
        </div>
        <p className="pricing-price-per">{per}</p>
      </div>

      {/* Divider */}
      <div className="pricing-divider" aria-hidden="true" />

      {/* Features list */}
      <ul className="pricing-features" role="list">
        {plan.features.map((feat) => (
          <li
            key={feat.text}
            className={`pricing-feature-item ${feat.included ? "is-included" : "is-excluded"} ${feat.highlight ? "is-highlight" : ""}`}
          >
            <span className="pricing-feature-icon" aria-hidden="true">
              {feat.included ? (
                <CheckIcon className="check-icon" />
              ) : (
                <CrossIcon className="cross-icon" />
              )}
            </span>
            <span className="pricing-feature-text">{feat.text}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="pricing-cta">
        <button
          type="button"
          className={`pricing-cta-btn pricing-cta-btn--${plan.ctaVariant}`}
          aria-label={`${plan.ctaLabel} — ${plan.name} plan`}
        >
          {plan.ctaLabel}
        </button>
      </div>
    </article>
  );
}

// ─── PricingSection (main export) ─────────────────────────────────────────────

export default function PricingSection() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  const handleBillingChange = useCallback((v: BillingCycle) => {
    setBilling(v);
  }, []);

  const savePct = Math.round(ANNUAL_DISCOUNT * 100);

  return (
    <section className="pricing-section" aria-labelledby="pricing-heading">
      {/* Section header */}
      <div className="pricing-header">
        <p className="pricing-eyebrow">Pricing</p>
        <h2 id="pricing-heading" className="pricing-title">
          Simple, transparent pricing
        </h2>
        <p className="pricing-subtitle">
          Choose the plan that works for you. Upgrade or downgrade at any time.
        </p>

        {/* Toggle */}
        <BillingToggle
          value={billing}
          onChange={handleBillingChange}
          savePct={savePct}
        />
      </div>

      {/* Cards grid */}
      <div className="pricing-grid" role="list">
        {PLANS.map((plan) => (
          <div key={plan.id} role="listitem">
            <PricingCard plan={plan} billing={billing} />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="pricing-footer-note">
        All plans include a&nbsp;14-day free trial. No credit card required.&nbsp;
        <a href="#" className="pricing-link">
          Compare all features →
        </a>
      </p>
    </section>
  );
}
