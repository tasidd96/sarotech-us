"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product") ?? "";
  const variantParam = searchParams.get("variant") ?? "";
  const boxesParam = searchParams.get("boxes") ?? "";

  const prefilledMessage = useMemo(() => {
    if (!productParam && !variantParam && !boxesParam) return "";
    const parts: string[] = ["Hi SARO TECH team,", ""];
    parts.push("I&rsquo;d like a quote for:");
    if (productParam) parts.push(`• Product: ${productParam}`);
    if (variantParam) parts.push(`• Variant: ${variantParam}`);
    if (boxesParam) parts.push(`• Quantity: ${boxesParam} box(es)`);
    parts.push("", "Thanks!");
    return parts.join("\n").replace(/&rsquo;/g, "’");
  }, [productParam, variantParam, boxesParam]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(prefilledMessage);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      productParam ? `Quote request: ${productParam}` : "Project inquiry from sarotech.us"
    );
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        message,
      ].join("\n")
    );
    window.location.href = `mailto:info@sarotech.us?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(productParam || variantParam || boxesParam) && (
        <div className="rounded-md border border-saro-green/30 bg-saro-green/5 p-4 text-sm text-saro-dark">
          <p className="mb-1 font-semibold">Quote request prefilled</p>
          <p className="text-gray-700">
            {productParam && <>Product: {productParam}. </>}
            {variantParam && <>Variant: {variantParam}. </>}
            {boxesParam && <>Quantity: {boxesParam} box(es).</>}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">
          Name *
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-saro-green focus:outline-none focus:ring-1 focus:ring-saro-green"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-saro-green focus:outline-none focus:ring-1 focus:ring-saro-green"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium">
            Phone *
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-saro-green focus:outline-none focus:ring-1 focus:ring-saro-green"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">
          Tell us about your project *
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-saro-green focus:outline-none focus:ring-1 focus:ring-saro-green"
        />
      </div>

      <button
        type="submit"
        className="inline-block rounded bg-saro-green px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-saro-green-light"
      >
        Send Message
      </button>

      <p className="text-xs text-gray-500">
        Submitting opens your email client with the message prefilled. Direct
        submissions to our CRM coming soon.
      </p>
    </form>
  );
}
