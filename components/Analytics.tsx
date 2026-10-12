import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-BJDG7ZD8E8";

/**
 * Google Analytics, public pages only. Never loaded inside the signed-in app, so it can't see bills,
 * cases or health information. Ad features are off. Loads after the page is idle so it doesn't slow anything down.
 */
export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
      <Script id="ga" strategy="lazyOnload">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { allow_google_signals: false, allow_ad_personalization_signals: false });
      `}</Script>
    </>
  );
}
