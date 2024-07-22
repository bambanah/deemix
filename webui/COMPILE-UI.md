**NOTE: THIS FILE IS NEEDED JUST FOR DEVELOPERS OF THIS PROJECT, IF YOU AREN'T YOU CAN IGNORE IT**

This file explains how to compile files for the WebUI.

# What you need to do just the first time

1. Download and install Node.js, you can download it [here](https://nodejs.org/en/download/) (also installs npm)

2. Once you have finished to install Node.js, check if everything is ok by running in a terminal the commands

```bash
$ node -v
```
and then
```bash
$ npm -v
```

If you see the corresponding versions of node and npm, you can move onto install yarn.

3. Install the yarn package manager by running in a terminal the command

```bash
$ npm install -g yarn
```

You may want to use `sudo` with that if it gives you permission errors.

4. Check if yarn has been installed correctly by running in a terminal the command

```bash
$ yarn --version
```

If you see the version number of yarm, you are ready to code!

5. Go to the root of this project, open your favorite terminal and run

```bash
$ yarn install
```

To work on this webui you will need a working server as well. If you've downloaded this with deemix-gui you can run in a terminal positioned inside the deemix-gui folder the command

```bash
$ yarn install-all-dev
```

To install all dependencies for all the modules (gui, server and webui)

# Scripts

## Development

By simply running

```bash
$ yarn dev
```

you will have 2 tasks running at the same time:
- the server
- the [rollup](https://rollupjs.org/guide/en/) watcher pointing to the configured `.js` file and ready to re-bundle

Note that in development mode 1 more file (`bundle.js.map`) will be created in the public folder. This file will be deleted when running the build command, so you don't need to worry about it.

**You can now go to http://127.0.0.1:6595 and see the app running.**

### Editing files

You can edit `.scss` and `.js` files and simply refresh the page to see your new code directly in the app.

However, if you need to edit the `public/index.html` file you'll have to kill the terminal and re-run `npm run dev` to see your edits.

### Adding files

If you want to add new `.js` or `.vue` files, just add them. deemix uses ES6 synthax, so you'll probably need to export some functions or variables from your new file. Files that will export and import nothing will be ignored by the bundler (rollup).

If you want to add new `.scss` (style) files, you need to import them in the main `style.scss` file. The `.scss` files **must** all start with an underscore _, except for the `style.scss` file.

## Building

When you want to deploy your application, you **must** run

```bash
$ yarn build
```

This is necessary to get

- a bundled `.js` file **minified**
- deleted the `.map` file

in order to drop the final application size (we are talking about MBs, maps are heavy).

# Other

If you notice that another team member installed or updated one or more new packages, just run

```bash
$ yarn install
```

and you will be fine.
