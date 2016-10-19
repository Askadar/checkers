REM git subtree push --prefix public origin gh-pages
git subtree split --prefix public -b gh-pages
git push origin gh-pages:gh-pages
pause
