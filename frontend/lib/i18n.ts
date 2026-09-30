export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];

export const dictionary = {
  uk: { courses: "Курси", lessons: "Уроки", allCourses: "← Усі курси", noLessons: "Уроків поки немає.", video: "Відео до уроку" },
  en: { courses: "Courses", lessons: "Lessons", allCourses: "← All courses", noLessons: "No lessons yet.", video: "Lesson video" },
} as const;

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}