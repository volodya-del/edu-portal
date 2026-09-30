import { drupal } from "@/lib/drupal";
import Link from "next/link";

export const revalidate = 60; // ISR: оновлення кешу раз на хвилину

export default async function CoursesPage() {
  const courses = await drupal.getResourceCollection<any[]>("node--course", {
    params: {
      "filter[status]": 1,
      include: "field_instructor,field_category,field_level",
      sort: "title",
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Курси</h1>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">
  <Link href={`/courses/${course.id}`}>{course.title}</Link>
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
