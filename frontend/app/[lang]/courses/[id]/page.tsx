import Link from "next/link";
import { notFound } from "next/navigation";
import { coverGradient, courseCover } from "@/components/CourseCard";
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
      alternates: { languages: { uk: `/uk/courses/${id}`, en: `/en/courses/${id}` } },
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
      params: { include: "field_instructor,field_category,field_level,field_cover_image" },
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

  const cover = courseCover(course);

  return (
    <main>
      <section style={{ background: coverGradient(course.title) }} className="relative text-white">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        )}
        <div className="relative mx-auto max-w-4xl px-6 py-14">
          <Link href={`/${lang}/courses`} className="text-sm text-white/80 hover:text-white">
            {t.allCourses}
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">{course.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {[course.field_category?.name, course.field_level?.name].filter(Boolean).map((v) => (
              <span key={v} className="rounded-full bg-white/20 px-3 py-1">
                {v}
              </span>
            ))}
            {course.field_instructor?.title && (
              <span className="rounded-full bg-white/20 px-3 py-1">
                {t.instructor}: {course.field_instructor.title}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {course.field_description?.processed && (
          <div
            className="lesson-body mb-10 text-lg text-slate-700"
            dangerouslySetInnerHTML={{ __html: course.field_description.processed }}
          />
        )}

        <h2 className="mb-4 text-2xl font-bold">{t.lessons}</h2>
        {lessons.length === 0 ? (
          <p className="text-muted">{t.noLessons}</p>
        ) : (
          <ol className="space-y-3">
            {lessons.map((lesson, i) => (
              <li key={lesson.id}>
                <Link
                  href={`/${lang}/lessons/${lesson.id}`}
                  className="flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition hover:border-accent hover:shadow-sm"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent">
                    {i + 1}
                  </span>
                  <span className="font-medium">{lesson.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}