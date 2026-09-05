import PricingSection from "@/components/PricingSection";

export const metadata = {
  title: "Pricing · Antigravity",
  description:
    "Simple, transparent pricing. Choose the plan that works for you — from free to enterprise.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen w-full">
      <PricingSection />
    </div>
  );
}
