import { drupal } from "@/lib/drupal";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let course: any;
  try {
    course = await drupal.getResource("node--course", id, {
      params: { include: "field_instructor,field_category,field_level" },
    });
  } catch {
    notFound();
  }

  const lessons = await drupal.getResourceCollection<any[]>("node--lesson", {
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
          <li key={lesson.id}>{lesson.title}</li>
        ))}
      </ol>
      {lessons.length === 0 && <p className="text-gray-500">Уроків поки немає.</p>}
    </main>
  );
}
