import React from "react";

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white bg-black h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Privacy Policy</h1>
      <p className="mb-4">
        At SecuWatch, your privacy is our priority. We are committed to protecting any personal information you provide and ensuring transparency about how we use it.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p className="mb-4">
        We collect minimal information necessary for authentication, security monitoring, and user experience improvement. This may include your email address and basic usage logs.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
      <p className="mb-4">
        We use your data solely for operational purposes — such as login authentication and alert analytics. We do not sell or share your data with third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="mb-4">
        All stored data is secured using encryption and access controls. We regularly update our infrastructure to comply with industry best practices.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p className="mb-4">
        If you have any questions or concerns regarding this policy, please contact us at <a href="mailto:support@secuwatch.io" className="text-blue-400">support@secuwatch.io</a>.
      </p>
    </div>
  );
};

export default Privacy;
