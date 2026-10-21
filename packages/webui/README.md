# "Hidden" features

## Last.fm player integration

Set `LASTFM_API_KEY` and `LASTFM_API_SECRET` on the server to enable account linking,
or save them as `{ "apiKey": "...", "apiSecret": "..." }` in `lastfm.json` inside the
deemix config folder.
The player opens Last.fm for authorization and scrobbles audio from the configured
download folder. The user's Last.fm session key is saved in the deemix config folder.

- `CTRL+SHIFT+Backspace` deletes all the search bar content
- `CTRL+F` focuses the search bar
- `CTRL+B` toggles the download bar
- `ALT+Left` goes back to the previous page, if present (like would happen in the browser)
- `ALT+Right` goes forward to the next page, if present (like would happen in the browser)
- Custom context menu: on certain elements, like download buttons or album covers, when opening the context menu, a custom one with more options will appear instead of the default one
