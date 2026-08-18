# Spec source

`website-content-annotations.txt` is the text layer extracted from
**"Genesis Website Content.pdf" (Layout(Gaurav): FINAL)**.

The PDF is ~23MB and almost entirely images — the same reference set already in
`docs/reference/`. Its value is the **annotation layer**: short notes pinned to
each reference that say what the image is *for*, plus the real client, service,
avatar and testimonial names.

That text is the source of truth for `lib/home-content.ts`. Keep them in sync.

Extracted with:

    pip install pypdf
    python -c "from pypdf import PdfReader; print('\n'.join((p.extract_text() or '') for p in PdfReader('Genesis Website Content.pdf').pages))"
