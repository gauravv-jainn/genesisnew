/**
 * Where the sheets get their paper from.
 *
 * A photographed sheet of aged paper beats anything generated with SVG
 * filters, and by a wide margin — real stock has fibre, foxing, creases and
 * uneven staining that procedural noise only ever caricatures. So the sheets
 * use a real texture when one is present and fall back to the procedural
 * stock when it is not.
 *
 * TO USE A REAL TEXTURE: save the image as
 *
 *     public/textures/aged-paper.jpg
 *
 * and set USE_PHOTO_STOCK to true. Nothing else changes — every sheet picks
 * it up, and each one offsets and scales its own crop so no two sheets show
 * the same patch of the photograph.
 *
 * This is a MATERIAL on each element, not a background image behind the
 * scene: the room, the light, the figure and every sheet remain real DOM.
 */

/** Flip to true once public/textures/aged-paper.jpg exists. */
export const USE_PHOTO_STOCK = false;

export const PHOTO_STOCK_URL = "/textures/aged-paper.jpg";

/**
 * A distinct crop of the texture per sheet, so a hundred sheets cut from one
 * photograph never repeat visibly. Deterministic in `seed` so SSR matches.
 */
export function stockCrop(seed: number) {
  const random = (salt: number) => {
    const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };

  // Zoom well past the sheet so each crop samples a small, distinct patch.
  const zoom = 260 + random(1) * 180;

  return {
    backgroundImage: `url("${PHOTO_STOCK_URL}")`,
    backgroundSize: `${zoom.toFixed(0)}% ${zoom.toFixed(0)}%`,
    backgroundPosition: `${(random(2) * 100).toFixed(1)}% ${(random(3) * 100).toFixed(1)}%`,
  };
}
