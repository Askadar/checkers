REM websockets deploy
git subtree split --prefix ws -b websocket
git push -f origin websocket:websocket
git branch -D websocket