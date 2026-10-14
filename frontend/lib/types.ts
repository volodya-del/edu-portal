import type { DrupalNode, DrupalTaxonomyTerm } from "next-drupal";

export interface Course extends DrupalNode {
  field_description?: { value?: string; summary?: string; processed?: string };
  field_duration?: number | null;
  field_is_free?: boolean;
  field_category?: DrupalTaxonomyTerm;
  field_level?: DrupalTaxonomyTerm;
  field_instructor?: DrupalNode;
  field_cover_image?: { uri?: { url: string } };
}

export interface Lesson extends DrupalNode {
  field_body?: { value?: string; processed?: string };
  field_video_url?: { uri: string; title?: string };
  field_order?: number;
  field_course?: Course;
}