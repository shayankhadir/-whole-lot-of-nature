import { permanentRedirect } from "next/navigation";

export default function LegacyBlogCategoryBackupRedirect() {
  permanentRedirect("/blog");
}

