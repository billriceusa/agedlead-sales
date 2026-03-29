import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource | undefined | null) {
  if (!source) return undefined;
  // Guard against image objects that lack an asset reference (e.g. {_type:"image", alt:"..."})
  // which cause the image URL builder to throw
  const src = source as Record<string, unknown>;
  if (src._type === "image" && !src.asset) return undefined;
  try {
    return imageBuilder.image(source);
  } catch {
    return undefined;
  }
}
