import { drupal } from "@/lib/drupal";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Course, Lesson } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const course = await drupal.getResource<Course>("node--course", id);
    return {
      title: course.title,
      description:
        course.field_description?.summary ||
        course.field_description?.value?.replace(/<[^>]+>/g, "").slice(0, 160) ||
        course.title,
    };
  } catch {
    return { title: "Курс не знайдено" };
  }
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let course: Course;
  try {
    course = await drupal.getResource<Course>("node--course", id, {
      params: { include: "field_instructor,field_category,field_level" },
    });
  } catch {
    notFound();
  }

  const lessons = await drupal.getResourceCollection<Lesson[]>("node--lesson", {
    params: {
      "filter[status]": 1,
      "filter[field_course.id]": id,
      sort: "field_order",
    },
  });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link href="/courses" className="text-sm text-blue-500">
        ← Усі курси
      </Link>
      <h1 className="mb-2 mt-4 text-3xl font-bold">{course.title}</h1>
      <p className="mb-6 text-sm text-gray-500">
        {course.field_category?.name} · {course.field_level?.name} ·{" "}
        {course.field_instructor?.title}
      </p>
      <h2 className="mb-3 text-xl font-semibold">Уроки</h2>
      <ol className="list-decimal space-y-2 pl-6">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link href={`/lessons/${lesson.id}`} className="text-blue-500">
              {lesson.title}
            </Link>
          </li>
        ))}
      </ol>
      {lessons.length === 0 && (
        <p className="text-gray-500">Уроків поки немає.</p>
      )}
    </main>
  );
}