# بناء المشروع
npm run build

# تجهيز 404.html للتعامل مع التوجيه في GitHub Pages
cp dist/index.html dist/404.html

# نشر مجلد dist إلى فرع gh-pages
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages