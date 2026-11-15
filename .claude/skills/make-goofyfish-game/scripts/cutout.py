#!/usr/bin/env python3
"""Cut generated illustrations off their white background.

Removes the white connected to the image border (flood fill), plus large enclosed
areas that are pure neutral white (gaps between shelves, inside a rope loop). Drawn
whites are usually cream or shaded, so they stay opaque; pass --keep-holes if a
subject has big flat pure-white parts. Trims to content, scales to
--max px on the long side and writes transparent WebP.

usage: cutout.py OUT_DIR IMG [IMG ...] [--max 900] [--tol 18]
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage


def cut(path, out_dir, max_side, tol, holes=True, hole_min=2500):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(np.int16)
    whiteish = (255 - a).max(axis=2) <= tol
    lab, _ = ndimage.label(whiteish)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    border.discard(0)
    bg = np.isin(lab, list(border))
    if holes:
        for i, sl in enumerate(ndimage.find_objects(lab), start=1):
            if sl is None or i in border:
                continue
            m = lab[sl] == i
            size = int(m.sum())
            if size < hole_min:
                continue
            px = a[sl][m]
            if px.mean() >= 252 and np.ptp(px.mean(axis=0)) < 2:
                bg[sl] |= m
    alpha = Image.fromarray(np.where(bg, 0, 255).astype('uint8'))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    rgba = im.copy()
    rgba.putalpha(alpha)
    box = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    if box:
        pad = 4
        box = (max(0, box[0] - pad), max(0, box[1] - pad), min(im.width, box[2] + pad), min(im.height, box[3] + pad))
        rgba = rgba.crop(box)
    k = max_side / max(rgba.size)
    if k < 1:
        rgba = rgba.resize((round(rgba.width * k), round(rgba.height * k)), Image.LANCZOS)
    name = os.path.splitext(os.path.basename(path))[0] + '.webp'
    out = os.path.join(out_dir, name)
    rgba.save(out, 'WEBP', quality=86, method=6)
    return out, rgba.size


def main():
    p = argparse.ArgumentParser()
    p.add_argument('out_dir')
    p.add_argument('images', nargs='+')
    p.add_argument('--max', type=int, default=900)
    p.add_argument('--tol', type=int, default=18)
    p.add_argument('--keep-holes', action='store_true', help='keep enclosed pure-white areas opaque')
    p.add_argument('--hole-min', type=int, default=2500, help='min px area for an enclosed white area to count as background')
    a = p.parse_args()
    os.makedirs(a.out_dir, exist_ok=True)
    for img in a.images:
        out, size = cut(img, a.out_dir, a.max, a.tol, not a.keep_holes, a.hole_min)
        print(f'{out} {size[0]}x{size[1]} {os.path.getsize(out) // 1024}KB')


if __name__ == '__main__':
    sys.exit(main())
