# Node.js Starter App

![technology Node.js](https://img.shields.io/badge/technology-node-green.svg)

This is a basic Node.js application created by Fury to be used as a starting point for your project.

## Usage

1. In your Dockerfile, specify the correct tag for your app. It depends on the Node.js runtime version you want to use.

   **E.g.:**

   `FROM hub.furycloud.io/mercadolibre/node:8.9.1`

   #### Available tags

   You can find all available tags for your Dockerfile [here](https://github.com/mercadolibre/fury-docker_images/blob/master/node/README.md#available-tags)

2. Set your application name in `package.json` located in the project's root. **Make sure that you remove the 'fury_' prefix from the application name.**

3. Set the CodeCov token environment variable as shown [here](https://github.com/mercadolibre/fury-docker_images/blob/master/node/README.md#codecov)

4. Add a "test:unit" script to your package.json file that runs your tests and generates a code coverage report.

5. Start coding!

## Questions

* [ci-cd@mercadolibre.com](ci-cd@mercadolibre.com)
* [fury@mercadolibre.com](fury@mercadolibre.com)