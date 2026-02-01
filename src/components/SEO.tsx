import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterHandle?: string;
  keywords?: string;
  structuredData?: object;
}

const SEO = ({
  title,
  description = "Repuestos Picha - Venta de repuestos para carros en Venezuela. Encuentra las mejores marcas y precios para tu vehículo.",
  canonical,
  ogType = 'website',
  ogImage = '/logo.png', // Default image
  twitterHandle = '@repuestospicha',
  keywords = "repuestos, carros, venezuela, autopartes, repuestos picha, venta de repuestos",
  structuredData
}: SEOProps) => {
  const siteName = "Repuestos Picha";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const url = canonical || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
