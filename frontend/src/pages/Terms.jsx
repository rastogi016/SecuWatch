import React from "react";

const Terms = () => {
  return (
    <div className="mx-auto px-6 py-10 text-white bg-black h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Terms of Use</h1>
      <p className="mb-4">
        By using SecuWatch, you agree to the following terms and conditions. Please read them carefully before using our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Usage</h2>
      <p className="mb-4">
        SecuWatch is intended for authorized security monitoring and alert visualization only. You must not use the platform for any unlawful activities or unauthorized access attempts.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">User Responsibilities</h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your credentials and for any activity that occurs under your account. Promptly notify us of any unauthorized use.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
      <p className="mb-4">
        We do our best to ensure accurate and secure operations, but we are not liable for any direct or indirect damages resulting from the use or inability to use SecuWatch.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Changes</h2>
      <p className="mb-4">
        We may update these terms periodically. Continued use of the platform after updates constitutes acceptance of the new terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>
        For any questions regarding these terms, reach out to us at <a href="mailto:legal@secuwatch.io" className="text-blue-400">legal@secuwatch.io</a>.
      </p>
    </div>
  );
};

export default Terms;
