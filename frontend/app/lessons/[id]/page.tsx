import { drupal } from "@/lib/drupal";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Lesson } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const lesson = await drupal.getResource<Lesson>("node--lesson", id);
    return {
      title: lesson.title,
      description:
        lesson.body?.value?.replace(/<[^>]+>/g, "").slice(0, 160) ||
        lesson.title,
    };
  } catch {
    return { title: "Урок не знайдено" };
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let lesson: Lesson;
  try {
    lesson = await drupal.getResource<Lesson>("node--lesson", id, {
      params: { include: "field_course" },
    });
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      {lesson.field_course && (
        <Link
          href={`/courses/${lesson.field_course.id}`}
          className="text-sm text-blue-500"
        >
          ← {lesson.field_course.title}
        </Link>
      )}
      <h1 className="mb-6 mt-4 text-3xl font-bold">{lesson.title}</h1>
      {lesson.body?.processed && (
        <div
          className="space-y-3"
          dangerouslySetInnerHTML={{ __html: lesson.body.processed }}
        />
      )}
      {lesson.field_video_url?.uri && (
        <p className="mt-6">
          <a
            href={lesson.field_video_url.uri}
            className="text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Відео до уроку
          </a>
        </p>
      )}
    </main>
  );
}