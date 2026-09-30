import { NextDrupal } from "next-drupal";

export const drupal = new NextDrupal(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string
);
