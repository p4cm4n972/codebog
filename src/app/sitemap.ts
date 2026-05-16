import type { MetadataRoute } from 'next'
import { getAdminDatabases } from '@/lib/appwrite-admin'
import { Query } from 'node-appwrite'
import type { AlgoDistrict, AlgoBuilding, AlgoProblem } from '@/lib/algobog/access-control'

const siteUrl = 'https://codebog.itmade.fr'
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!

const ALGO_COLLECTIONS = {
  DISTRICTS: 'algo-districts',
  BUILDINGS: 'algo-buildings',
  PROBLEMS: 'algo-problems',
} as const

type AppwriteDoc<T> = T & { $updatedAt: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getAdminDatabases()

  const [districtsRes, buildingsRes, problemsRes] = await Promise.all([
    db.listDocuments(DATABASE_ID, ALGO_COLLECTIONS.DISTRICTS, [Query.limit(100)]),
    db.listDocuments(DATABASE_ID, ALGO_COLLECTIONS.BUILDINGS, [Query.limit(500)]),
    db.listDocuments(DATABASE_ID, ALGO_COLLECTIONS.PROBLEMS, [
      Query.limit(2000),
      Query.select(['slug', 'districtSlug', '$updatedAt']),
    ]),
  ])

  const districts = districtsRes.documents as unknown as AppwriteDoc<AlgoDistrict>[]
  const buildings = buildingsRes.documents as unknown as AppwriteDoc<AlgoBuilding>[]
  const problems = problemsRes.documents as unknown as AppwriteDoc<AlgoProblem>[]

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/algobog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/jsbog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/cbog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/a-propos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/cgu`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/politique-confidentialite`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]

  const districtRoutes: MetadataRoute.Sitemap = districts.map(d => ({
    url: `${siteUrl}/algobog/district/${d.slug}`,
    lastModified: d.$updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const buildingRoutes: MetadataRoute.Sitemap = buildings.map(b => ({
    url: `${siteUrl}/algobog/district/${b.districtSlug}/${b.slug}`,
    lastModified: b.$updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const problemRoutes: MetadataRoute.Sitemap = problems.map(p => ({
    url: `${siteUrl}/algobog/problem/${p.slug}`,
    lastModified: p.$updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...districtRoutes, ...buildingRoutes, ...problemRoutes]
}
