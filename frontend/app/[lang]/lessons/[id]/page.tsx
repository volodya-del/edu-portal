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

  <main className="mx-auto max-w-3xl px-6 py-10">
  {lesson.field_course && (
    <Link href={`/${lang}/courses/${lesson.field_course.id}`} className="text-sm text-accent">
      ← {lesson.field_course.title}
    </Link>
  )}
  <article className="mt-4 rounded-2xl border border-line bg-white p-8 shadow-sm">
    <h1 className="mb-6 text-3xl font-bold tracking-tight">{lesson.title}</h1>
    {lesson.body?.processed && (
      <div
        className="lesson-body text-slate-700"
        dangerouslySetInnerHTML={{ __html: lesson.body.processed }}
      />
    )}
    {lesson.field_video_url?.uri && (
      <a
        href={lesson.field_video_url.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center rounded-full bg-accent px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
      >
        ▶ {t.video}
      </a>
    )}
  </article>
</main>
}