import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource | undefined | null) {
  if (!source) return undefined;
  return imageBuilder.image(source);
}
