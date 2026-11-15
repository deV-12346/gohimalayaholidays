import { MetadataRoute } from "next";
import { connectDb } from "@/libs/ConnectDb";
import packageModel from "@/models/package.model";

const baseUrl = "https://gohimalayaholidays.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/packages`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/enquiry`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  // Add one entry per package detail page. If the database is unreachable at
  // build/request time, fall back to the static pages instead of failing.
  try {
    await connectDb();
    const packages = await packageModel.find().select("_id updatedAt").lean();
    const packagePages: MetadataRoute.Sitemap = packages.map((p) => ({
      url: `${baseUrl}/packages/${String(p._id)}`,
      lastModified: (p as { updatedAt?: Date }).updatedAt ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticPages, ...packagePages];
  } catch (error) {
    console.error("Sitemap: could not load packages", error);
    return staticPages;
  }
}
