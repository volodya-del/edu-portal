export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];

export const dictionary = {
  uk: {
    courses: "Курси",
    heroTitle: "Навчайтесь у власному темпі",
    heroText: "Курси з програмування та не тільки: короткі уроки, зрозумілі приклади, доступні будь-де.",
    lessons: "Уроки",
    allCourses: "← Усі курси",
    noLessons: "Уроків поки немає.",
    noCourses: "Курсів поки немає.",
    video: "Відео до уроку",
    free: "Безкоштовно",
    hours: "год",
    instructor: "Викладач",
    open: "Відкрити курс",
    footer: "Навчальний проєкт на Drupal та Next.js",
  },
  en: {
    courses: "Courses",
    heroTitle: "Learn at your own pace",
    heroText: "Programming courses and more: short lessons, clear examples, available anywhere.",
    lessons: "Lessons",
    allCourses: "← All courses",
    noLessons: "No lessons yet.",
    noCourses: "No courses yet.",
    video: "Lesson video",
    free: "Free",
    hours: "h",
    instructor: "Instructor",
    open: "Open course",
    footer: "A learning project built with Drupal and Next.js",
  },
} as const;

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}