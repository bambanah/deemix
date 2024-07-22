# deemix-webui

This is just the WebUI for deemix, it should be used with deemix-gui or something like that.
If you are a web developer and want to contribute to this project, please read the [COMPILE-UI](COMPILE-UI.md) file.

# "Hidden" features

- `CTRL+SHIFT+Backspace` deletes all the search bar content
- `CTRL+F` focuses the search bar
- `CTRL+B` toggles the download bar
- `ALT+Left` goes back to the previous page, if present (like would happen in the browser)
- `ALT+Right` goes forward to the next page, if present (like would happen in the browser)
- Custom context menu: on certain elements, like download buttons or album covers, when opening the context menu, a custom one with more options will appear instead of the default one

# Deps

- `rollup-plugin-vue@4.2.0` is needed because of https://github.com/vuejs/rollup-plugin-vue/issues/238

# License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
