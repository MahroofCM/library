THE SCIENCE OF GETTING RICH · animated study book (17 chapters, English + Malayalam)
A static website. No server code, no database, no build step.

1. SET YOUR WEB ADDRESS (for WhatsApp link previews)
   Open these files in any text editor and replace every  library.theyoungmakers.com/science-of-getting-rich  with your address
   (without https://), for example  sogr.youngmakeruniverse.com :
     index.html  and  ch01/index.html ... ch17/index.html
   Most editors can do this across a folder with "Find in files / Replace all".
   If you skip this, the book still works; only the WhatsApp preview card is missing.

2. UPLOAD THE WHOLE FOLDER (pick one host)
   Netlify (easiest): go to app.netlify.com/drop and drag this folder onto the page.
     Then Site settings > Domain management to add your own domain.
   Cloudflare Pages: Workers & Pages > Create > Pages > Upload assets > drag this folder.
   GitHub Pages: put the folder's contents in a repository, Settings > Pages > deploy from main branch, root.
   Your own hosting (cPanel etc.): upload the contents into public_html or a subfolder.

   The book works at the site root or in a subfolder (e.g. yoursite.com/science-of-getting-rich/).

3. LINKS TO SEND
   Whole book:        https://YOUR-ADDRESS/
   One chapter:       https://YOUR-ADDRESS/ch09/
   In Malayalam:      add ?lang=ml   e.g. https://YOUR-ADDRESS/ch09/?lang=ml
   In English:        add ?lang=en
   The reader's language choice is remembered on their phone after that.

NOTES
- Size: about 48 MB, mostly narration audio (~1.3 MB per chapter per language, loaded beat by beat).
- Readers' progress is saved in their own browser; there are no accounts.
- Fonts are self-hosted (SIL Open Font License, lib/fonts/OFL.txt).
- _headers and netlify.toml set caching on Netlify/Cloudflare; other hosts ignore them safely.
- Independent study of "The Science of Getting Rich" by Wallace D. Wattles (1910, public domain). All narration, examples and pictures are original.
- Narration: English, Kokoro (am_michael, speed 0.94); Malayalam, Microsoft ml-IN-MidhunNeural (rate -5%).
