REM git subtree push --prefix public origin gh-pages

REM gh-pages deploy
git subtree split --prefix public -b gh-pages
git push -f origin gh-pages:gh-pages
git branch -D gh-pages
REM websockets deploy
REM git subtree split --prefix ws -b websocket
REM git push -f origin websocket:websocket
REM git branch -D websocket
