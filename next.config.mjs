import { withContentCollections } from "@content-collections/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/czech-case-cards",
        destination: "/language-learning/czech-case-cards",
        permanent: true,
      },
      {
        source: "/russian-case-cards",
        destination: "/language-learning/russian-case-cards",
        permanent: true,
      },
      // TODO: add posts without dates
    ];
  },
};

export default withContentCollections(nextConfig);
