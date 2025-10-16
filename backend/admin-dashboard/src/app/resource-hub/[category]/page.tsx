import CategoryClient from "./CategoryClient";

export function generateStaticParams() {
  return [
    { category: 'important-contacts' },
    { category: 'pyqs' },
  ];
}

export default function CategoryResourcePage({ params }: { params: { category: string } }) {
  return <CategoryClient categorySlug={params.category} />;
}
