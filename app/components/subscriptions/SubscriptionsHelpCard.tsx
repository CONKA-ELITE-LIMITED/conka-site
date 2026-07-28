import { ContactSupportLink } from "@/app/components/ContactSupportLink";

export function SubscriptionsHelpCard() {
  return (
    <div className="mt-14 bg-[var(--brand-navy)] rounded-md text-white p-8 text-center">
      <h3
        className="font-semibold text-lg text-white mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        Need help?
      </h3>
      <p className="text-sm text-white/80 mb-6 max-w-[50ch] mx-auto">
        We can help with any subscription questions.
      </p>
      <ContactSupportLink variant="button-secondary" />
    </div>
  );
}
