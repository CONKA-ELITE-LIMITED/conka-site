import { ContactSupportLink } from "@/app/components/ContactSupportLink";

export function OrdersHelpCard() {
  return (
    <div className="mt-14 bg-white rounded-md border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-8 text-center">
      <h3
        className="font-semibold text-lg text-black mb-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        Questions about your order?
      </h3>
      <p className="text-sm text-black/60 mb-6 max-w-[50ch] mx-auto">
        Our team is here to help with tracking, returns, or any other questions.
      </p>
      <ContactSupportLink variant="button-primary" />
    </div>
  );
}
