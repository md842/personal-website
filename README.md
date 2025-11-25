# Max's Personal Website
This repository contains the source code and documentation for my personal website.

All console commands given in this document are for Arch Linux kernel 6.17.8-arch1-1.

This project was bootstrapped with [Vite](https://vitejs.dev/).

## Dependencies (required)

#### npm (npm-11.6.3-1 used)
```console
$ sudo pacman -S npm
```

## How to Build
1. Install required dependencies from previous section.
2. Clone this repository.
```console
$ git clone git@github.com:md842/personal-website.git
```
2. Navigate to the project directory.
```console
$ cd personal-website
```

3. Install package dependencies.
```console
personal-website$ npm ci
```

4. Run the production build.
```console
personal-website$ npm run build
```

## How to Run
To run the app in development mode:
```console
personal-website$ npm run dev
```

The app can now be accessed at `http://localhost:5173/`.