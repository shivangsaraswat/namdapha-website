import CategoryClient from "./CategoryClient";

export function generateStaticParams() {
  return [
    { category: 'important-contacts' },
    { category: 'pyqs' },
    { category: 'notes' },
    { category: 'video-lectures' },
    { category: 'recommended-books' },
    { category: 'student-handbook' },
    { category: 'grading-document' },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryName = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${categoryName} Management - Admin Dashboard`
  };
}

export default async function CategoryResourcePage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <CategoryClient categorySlug={category} />;
}
