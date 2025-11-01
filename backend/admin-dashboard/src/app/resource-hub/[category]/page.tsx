import CategoryClient from "./CategoryClient";

export function generateStaticParams() {
  return [
    { category: 'important-contacts' },
    { category: 'pyqs' },
  ];
}

export default async function CategoryResourcePage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <CategoryClient categorySlug={category} />;
}
