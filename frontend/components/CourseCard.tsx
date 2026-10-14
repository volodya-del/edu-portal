import Link from "next/link";
import type { Course } from "@/lib/types";
import { dictionary, type Locale } from "@/lib/i18n";

function hue(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

export function courseCover(course: Course) {
  const path = course.field_cover_image?.uri?.url;
  return path ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${path}` : null;
}

export function coverGradient(title: string) {
  const h = hue(title);
  return `linear-gradient(135deg, hsl(${h} 70% 55%), hsl(${(h + 50) % 360} 70% 40%))`;
}

export default function CourseCard({ course, lang }: { course: Course; lang: Locale }) {
  const t = dictionary[lang];
  const cover = courseCover(course);

  return (
    <Link
      href={`/${lang}/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="h-40 w-full" style={{ background: coverGradient(course.title) }}>
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          {course.field_category?.name && (
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">
              {course.field_category.name}
            </span>
          )}
          {course.field_level?.name && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-muted">
              {course.field_level.name}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold group-hover:text-accent">{course.title}</h2>
        <div className="mt-auto flex items-center justify-between text-sm text-muted">
          <span>{course.field_instructor?.title}</span>
          <span>
            {course.field_is_free
              ? t.free
              : course.field_duration
                ? `${course.field_duration} ${t.hours}`
                : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}