import type { NextConfig } from "next";

const securityHeaders = [
  // Empêche le clickjacking (XFO)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Empêche le sniffing MIME
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer minimal pour la vie privée
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // HSTS : force HTTPS pendant 1 an, inclut les sous-domaines
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // COOP : isole le contexte de navigation (protection Spectre)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  // COEP : optionnel, active SharedArrayBuffer (utile pour isolated-vm)
  // { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
  // Permissions restrictives
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['isolated-vm'],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
