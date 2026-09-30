import Link from "next/link";
import { notFound } from "next/navigation";
import { drupal } from "@/lib/drupal";
import { dictionary, isLocale } from "@/lib/i18n";
import type { Course, Lesson } from "@/lib/types";

export const revalidate = 60;

type Props = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, id } = await params;
  if (!isLocale(lang)) return {};
  try {
    const course = await drupal.getResource<Course>("node--course", id, {
      locale: lang,
      defaultLocale: "none",
    });
    return {
      title: course.title,
      description:
        course.field_description?.summary ||
        course.field_description?.value?.replace(/<[^>]+>/g, "").slice(0, 160) ||
        course.title,
      alternates: {
        languages: {
          uk: `/uk/courses/${id}`,
          en: `/en/courses/${id}`,
        },
      },
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function CoursePage({ params }: Props) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionary[lang];

  let course: Course;
  try {
    course = await drupal.getResource<Course>("node--course", id, {
      locale: lang,
      defaultLocale: "none",
      params: { include: "field_instructor,field_category,field_level" },
    });
  } catch {
    notFound();
  }

  const lessons = await drupal.getResourceCollection<Lesson[]>("node--lesson", {
    locale: lang,
    defaultLocale: "none",
    params: {
      "filter[status]": 1,
      "filter[field_course.id]": id,
      sort: "field_order",
    },
  });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link href={`/${lang}/courses`} className="text-sm text-blue-500">
        {t.allCourses}
      </Link>
      <h1 className="mb-2 mt-4 text-3xl font-bold">{course.title}</h1>
      <p className="mb-6 text-sm text-gray-500">
        {course.field_category?.name} · {course.field_level?.name} ·{" "}
        {course.field_instructor?.title}
      </p>
      <h2 className="mb-3 text-xl font-semibold">{t.lessons}</h2>
      <ol className="list-decimal space-y-2 pl-6">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link href={`/${lang}/lessons/${lesson.id}`} className="text-blue-500">
              {lesson.title}
            </Link>
          </li>
        ))}
      </ol>
      {lessons.length === 0 && <p className="text-gray-500">{t.noLessons}</p>}
    </main>
  );
}