# Sporttech

Static deployment bundle for `https://dinopeng.com/sporttech/`.

The published page lives under `/sporttech/` so it can be mounted as a subpath.

Expected repository layout:

```text
sporttech/
  index.html
  assets/
    favicon.svg
    sporttech-budget-hero-small.jpg
```

The HTML uses relative asset paths, so it can be served from the `/sporttech/`
subdirectory without additional build steps.
