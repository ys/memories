const siteConfig = {
  name: "Pile of Prints",
  title: "Pile of Prints",
  description: "A shoebox of daily moments worth keeping.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://daily.yannickschutz.com",
  author: {
    name: "Yannick",
    instagram: "@bonjouryannick",
  },
  og: {
    image: "/og-image.jpg",
    width: 1200,
    height: 630,
  },
};

export default siteConfig;
