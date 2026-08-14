"use client";

export default function WhatsAppButton() {
  const phoneNumber = "916380170943"; // Replace with your actual WhatsApp phone number
  const message = encodeURIComponent(
    "Hello R K B Builders, I would like to inquire about your construction services."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Chat with R K B Builders on WhatsApp"
    >
      <span className="floating-whatsapp-pulse" aria-hidden="true" />
      <span className="floating-whatsapp-tooltip" aria-hidden="true">
        Chat with us
      </span>
      <svg
        className="floating-whatsapp-icon"
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.65.733 5.128 2.012 7.25L2.05 30.15a.75.75 0 00.925.925l6.9-1.962A13.92 13.92 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.43 11.43 0 01-5.74-1.54.75.75 0 00-.54-.07l-5.06 1.44 1.44-5.06a.75.75 0 00-.07-.54A11.43 11.43 0 014.5 16C4.5 9.659 9.659 4.5 16 4.5S27.5 9.659 27.5 16 22.341 27.5 16 27.5zm6.54-8.81c-.36-.18-2.12-1.05-2.45-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.9-1.79-1.07-.96-1.8-2.14-2.01-2.5-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.67-.29-.7-.59-.6-.81-.61l-.69-.01c-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3 0 1.77 1.29 3.48 1.47 3.72.18.24 2.54 3.88 6.16 5.44.86.37 1.53.59 2.06.76.87.28 1.66.24 2.28.15.7-.1 2.12-.87 2.42-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42z" />
      </svg>
    </a>
  );
}
