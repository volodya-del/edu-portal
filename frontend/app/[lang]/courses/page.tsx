import Link from "next/link";
import { notFound } from "next/navigation";
import { drupal } from "@/lib/drupal";
import { dictionary, isLocale } from "@/lib/i18n";
import type { Course } from "@/lib/types";

export const revalidate = 60;

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionary[lang];

  const courses = await drupal.getResourceCollection<Course[]>("node--course", {
    locale: lang,
    defaultLocale: "none", // щоб префікс /uk або /en додавався завжди
    params: {
      "filter[status]": 1,
      include: "field_instructor,field_category,field_level",
      sort: "title",
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t.courses}</h1>
        <nav className="flex gap-3 text-sm">
          <Link href="/uk/courses">UA</Link>
          <Link href="/en/courses">EN</Link>
        </nav>
      </div>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">
              <Link href={`/${lang}/courses/${course.id}`}>{course.title}</Link>
            </h2>
            <p className="text-sm text-gray-600">
              {course.field_category?.name} · {course.field_level?.name} ·{" "}
              {course.field_instructor?.title}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}