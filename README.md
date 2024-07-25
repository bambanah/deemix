# deemix-gui
An hybrid app that wraps deemix-webui and lets you use the deemix-js library.  
This app wouldn't be possible without [RemixDev](https://gitlab.com/RemixDev)'s work on the original [deemix-gui](https://gitlab.com/RemixDev/deemix-gui).

## Downloads
https://bit.ly/DeemixFixBuilds

## Running from source
You need to use node version 18 or higher and `pnpm`.

If you don't have pnpm installed yet, please see here: [how to install pnpm](https://pnpm.io/installation).

Typically you can just execute `npm install -g pnpm` if you already have npm.

Install the dependencies using `pnpm i` for development.
Then you should be able to run the app with `pnpm start`.
If you want to further develop deemix-gui and propose a PR, use `pnpm dev`

Commands for easy setup:

```sh
# Development
git clone https://gitlab.com/deeplydrumming/DeemixFix.git && cd DeemixFix && pnpm i
```

You can change the default port by setting the environment variable `PORT` to any other number before starting the app.

## Building the app
To build the app you need to have git installed and the repo cloned with `git`.
Make sure you've installed the dependencies for all packages (`pnpm i`).
Then from the root folder run `pnpm dist` to make a distributable package for your current OS or `pnpm dist-server` to make an executable for the server versions.
  
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
along with this program. If not, see <https://www.gnu.org/licenses/>.