import Link from "next/link";
import { notFound } from "next/navigation";
import { drupal } from "@/lib/drupal";
import { dictionary, isLocale } from "@/lib/i18n";
import type { Lesson } from "@/lib/types";

export const revalidate = 60;

type Props = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, id } = await params;
  if (!isLocale(lang)) return {};
  try {
    const lesson = await drupal.getResource<Lesson>("node--lesson", id, {
      locale: lang,
      defaultLocale: "none",
    });
    return {
      title: lesson.title,
      description:
        lesson.body?.value?.replace(/<[^>]+>/g, "").slice(0, 160) || lesson.title,
      alternates: {
        languages: {
          uk: `/uk/lessons/${id}`,
          en: `/en/lessons/${id}`,
        },
      },
    };
  } catch {
    return { title: "Not found" };
  }
}

export default async function LessonPage({ params }: Props) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionary[lang];

  let lesson: Lesson;
  try {
    lesson = await drupal.getResource<Lesson>("node--lesson", id, {
      locale: lang,
      defaultLocale: "none",
      params: { include: "field_course" },
    });
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      {lesson.field_course && (
        <Link
          href={`/${lang}/courses/${lesson.field_course.id}`}
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
            {t.video}
          </a>
        </p>
      )}
    </main>
  );
}