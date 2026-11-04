import { DEFAULT_WHATSAPP_MESSAGE, whatsappHref } from "@/lib/whatsapp";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.7L1 22.5l6-1.1A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.6.7.7-3.5-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.2-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 12 12 0 0 0 4.5 4 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

export function WhatsAppButton({
  number = "",
  message = DEFAULT_WHATSAPP_MESSAGE,
  floating = false,
  iconOnly = false,
  label = "WhatsApp",
}: {
  number?: string;
  message?: string;
  floating?: boolean;
  iconOnly?: boolean;
  label?: string;
}) {
  const href = whatsappHref(number, message);
  const className = floating
    ? "fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white"
    : iconOnly
      ? "btn icon-btn bg-[#25D366] text-white"
      : "btn bg-[#25D366] text-white";

  if (!href) {
    return (
      <button type="button" className={className} aria-label="WhatsApp">
        <WhatsAppIcon />
        {floating || iconOnly ? <span className="sr-only">{label}</span> : <span>{label}</span>}
      </button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
      <WhatsAppIcon />
      {floating || iconOnly ? <span className="sr-only">{label}</span> : <span>{label}</span>}
    </a>
  );
}
