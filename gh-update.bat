REM git subtree push --prefix public origin gh-pages

REM gh-pages deploy
git subtree split --prefix public -b gh-pages
git push -f origin gh-pages:gh-pages
git branch -D gh-pages
REM websockets deploy
git subtree split --prefix public -b websocket
git push -f origin websocket:websocket
git branch -D websocket
