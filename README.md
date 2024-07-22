# deemix-gui
An hybrid app that wraps deemix-webui and lets you use the deemix-js library

## Downloads
https://bit.ly/DeemixFixBuilds

## Running from source
You need to use `yarn`.

Install the dependencies using `yarn install-all-dev` for development.
Then you should be able to run the app with `yarn start`.
If you want to further develop deemix-gui and propose a PR, use `yarn dev`

Commands for easy setup:

```sh
# Development
git clone https://gitlab.com/deeplydrumming/DeemixFix2.git && cd DeemixFix2 && yarn install-all-dev
```

You can change the default port by setting the environment variable `PORT` to any other number before starting the app.

## Building the app
To build the app you need to have git installed and the repo cloned with `git`.
Make sure you've installed the dependencies for all packages (the root folder, `server` and `webui`).
Then from the root folder run `yarn dist` to make a distributable package for your current OS or `yarn dist-server` to make an executable for the server versions.

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
