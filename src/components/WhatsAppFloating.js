import React from 'react';

const WhatsAppFloating = () => {
  const whatsappNumber = '5562991182726'; // WhatsApp number with country code
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center z-50 animate-bounce"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.91 11.91 0 0012 0C5.37 0 0 5.37 0 12a11.91 11.91 0 001.64 6.01L0 24l6.12-1.6A11.91 11.91 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zm-8.52 17.52a9.5 9.5 0 01-4.84-1.39l-.35-.22-3.63.95.97-3.54-.23-.36a9.5 9.5 0 1111.08 4.56zm5.3-6.1c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15s-.73.94-.9 1.13c-.17.19-.34.21-.63.07a8.1 8.1 0 01-2.38-1.47 9.04 9.04 0 01-1.68-2.08c-.18-.31 0-.48.13-.63.13-.13.29-.34.44-.51.15-.17.2-.29.3-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49-.17 0-.36-.01-.55-.01s-.51.07-.78.36c-.27.29-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.19 2.11 3.22 5.12 4.52a5.5 5.5 0 002.45.42c.94 0 1.82-.38 2.48-.98a4.3 4.3 0 001.54-2.12c.16-.3.16-.56.11-.62-.05-.06-.19-.1-.39-.17z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloating;
