# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.2](https://github.com/MapColonies/exporter-trigger/compare/v1.2.1...v1.2.2) (2021-05-10)


### Bug Fixes

* **confd:** add conditional values in confd for cert files ([#134](https://github.com/MapColonies/exporter-trigger/issues/134)) ([ae9cc07](https://github.com/MapColonies/exporter-trigger/commit/ae9cc0798bb5e644aaf881e52ffd21a1adec0f98))

### [1.2.1](https://github.com/MapColonies/exporter-trigger/compare/v1.2.0...v1.2.1) (2021-05-10)


### Bug Fixes

* **confd:** fix config string quote ([#133](https://github.com/MapColonies/exporter-trigger/issues/133)) ([7822430](https://github.com/MapColonies/exporter-trigger/commit/7822430ec6fe422c941f80cbb0ddedf9fba064fa))

## [1.2.0](https://github.com/MapColonies/exporter-trigger/compare/v1.1.0...v1.2.0) (2021-02-02)


### Features

* **source-layer-name:** added source layer's name to the storage request ([#115](https://github.com/MapColonies/exporter-trigger/issues/115)) ([e708563](https://github.com/MapColonies/exporter-trigger/commit/e708563ca42aa1a963aba472ca13846db532730f))
* add ssl support to kafka configuration ([#121](https://github.com/MapColonies/exporter-trigger/issues/121)) ([6ca4762](https://github.com/MapColonies/exporter-trigger/commit/6ca4762eb0dd974b1a0ac443cbea90a47391afaf))


### Bug Fixes

* **swagger:** detailed 400 errors ([#122](https://github.com/MapColonies/exporter-trigger/issues/122)) ([6850e93](https://github.com/MapColonies/exporter-trigger/commit/6850e93ae7c639ac2da972a31ecdaf3da38331ae))

## [1.1.0](https://github.com/MapColonies/exporter-trigger/compare/v1.0.0...v1.1.0) (2021-01-06)


### Features

* add confd ([#24](https://github.com/MapColonies/exporter-trigger/issues/24)) ([bc12b2d](https://github.com/MapColonies/exporter-trigger/commit/bc12b2db9ea848f77b638fce8e988248dcce63e6))
* docker will no longer run as root ([#100](https://github.com/MapColonies/exporter-trigger/issues/100)) ([a5cf7fa](https://github.com/MapColonies/exporter-trigger/commit/a5cf7fa2041b721ad3c693333b629e2c03659745))
* Integration with new storage ([#73](https://github.com/MapColonies/exporter-trigger/issues/73)) ([8dbe036](https://github.com/MapColonies/exporter-trigger/commit/8dbe036acf10cd311bb48c2eef989067869dd91d))
* kafka message convention ([#27](https://github.com/MapColonies/exporter-trigger/issues/27)) ([da09f06](https://github.com/MapColonies/exporter-trigger/commit/da09f063ae1c6d333d4f9976a74a49331843251b))
* refactor service from template to 'exporter trigger' ([#1](https://github.com/MapColonies/exporter-trigger/issues/1)) ([9046ced](https://github.com/MapColonies/exporter-trigger/commit/9046ced9f52c6cd64211efdb86967a6eaf7ac395))
* **axios error:** add response body on axios request error ([#91](https://github.com/MapColonies/exporter-trigger/issues/91)) ([487b8de](https://github.com/MapColonies/exporter-trigger/commit/487b8de0884f2c40c30421af783aad3ca560ca12))
* **bbox size:** limit bbox size by given configuration ([#66](https://github.com/MapColonies/exporter-trigger/issues/66)) ([ac645b0](https://github.com/MapColonies/exporter-trigger/commit/ac645b02da5a34b6f007d0ba1e2ace35bcf8078e))
* **expiration time:** add expiration time to export data ([#80](https://github.com/MapColonies/exporter-trigger/issues/80)) ([c2f1d5e](https://github.com/MapColonies/exporter-trigger/commit/c2f1d5e75e1f147bb08ab791d90c65fe61e0e9cd))
* **export directory:** add wanted directory field to export data ([#78](https://github.com/MapColonies/exporter-trigger/issues/78)) ([f7a6aac](https://github.com/MapColonies/exporter-trigger/commit/f7a6aac36b2161660dcac139510f976cf6c719cd))
* **kafka:** handle export message and insert it to kafka ([#21](https://github.com/MapColonies/exporter-trigger/issues/21)) ([904e45d](https://github.com/MapColonies/exporter-trigger/commit/904e45df63c26c70b5cea90e2169d81a10c0f73b))
* **kafka error:** delete failed export from DB on error sending to kafka ([#82](https://github.com/MapColonies/exporter-trigger/issues/82)) ([835d076](https://github.com/MapColonies/exporter-trigger/commit/835d0768474de8654a9e7b7445c94768c7d84509))
* **max zoom:** add max zoom option to export ([#101](https://github.com/MapColonies/exporter-trigger/issues/101)) ([91bae38](https://github.com/MapColonies/exporter-trigger/commit/91bae38805ef9b7ca3f639f5736981b408c59659))
* **max zoom:** add max zoom option to export ([#105](https://github.com/MapColonies/exporter-trigger/issues/105)) ([3047068](https://github.com/MapColonies/exporter-trigger/commit/30470685b7da7d3ec270c6e6c541b7b152350ccc))
* **status:** add path in router for getting exported jobs status ([#37](https://github.com/MapColonies/exporter-trigger/issues/37)) ([1ffb330](https://github.com/MapColonies/exporter-trigger/commit/1ffb330cd95c5d936bccde343d3143009e7b8992))
* **status response:** add bbox to export status response ([#46](https://github.com/MapColonies/exporter-trigger/issues/46)) ([1393fad](https://github.com/MapColonies/exporter-trigger/commit/1393fad3ddfd1955b91a5976a9a8bfa6800f2384))


### Bug Fixes

* **confd:** fixed confd template ([#60](https://github.com/MapColonies/exporter-trigger/issues/60)) ([0ebbabe](https://github.com/MapColonies/exporter-trigger/commit/0ebbabe5019c7cae5d43ce29a42ce594ca5069a2))
* kafka config to confd ([#26](https://github.com/MapColonies/exporter-trigger/issues/26)) ([5d486d2](https://github.com/MapColonies/exporter-trigger/commit/5d486d2bc65422c3ea4a25e6baa1b53e1bdf0c8a))
* remove unnecessery condition ([#98](https://github.com/MapColonies/exporter-trigger/issues/98)) ([db4ed81](https://github.com/MapColonies/exporter-trigger/commit/db4ed816338e3de90583892c7da4d9a272102229))
* **bbox limit:** check was being done in square meters, not square km ([#77](https://github.com/MapColonies/exporter-trigger/issues/77)) ([687934c](https://github.com/MapColonies/exporter-trigger/commit/687934c9d78107fa2a7bd99472c2dce848e6e3a1))
* **data duplication:** change from bad request to conflict ([#90](https://github.com/MapColonies/exporter-trigger/issues/90)) ([6c979cd](https://github.com/MapColonies/exporter-trigger/commit/6c979cdacf6c64589cf706d2e86e9bf83ee06137))
* **dockerfile:** add confd run ([#36](https://github.com/MapColonies/exporter-trigger/issues/36)) ([c4982b7](https://github.com/MapColonies/exporter-trigger/commit/c4982b7b879eb91a5dffdba39dd5eb8987165964))
* **execution status:** change path for getting execution status ([#44](https://github.com/MapColonies/exporter-trigger/issues/44)) ([a585402](https://github.com/MapColonies/exporter-trigger/commit/a585402b968e6dda672bd6ea0de880cba1f7729c))
* **export save:** move data from axios config body to body data ([#55](https://github.com/MapColonies/exporter-trigger/issues/55)) ([cfebe5f](https://github.com/MapColonies/exporter-trigger/commit/cfebe5f5431a0cfb7d9dd4565a9bfde10c479125))
* **response:** send size instead of estimation ([#89](https://github.com/MapColonies/exporter-trigger/issues/89)) ([f837cbb](https://github.com/MapColonies/exporter-trigger/commit/f837cbb910918a59295c4bb09e1b6e70b1293108))
* **standard:** update with work standard bug fixes ([#62](https://github.com/MapColonies/exporter-trigger/issues/62)) ([490fa5f](https://github.com/MapColonies/exporter-trigger/commit/490fa5ff2ca91a26e4ee72b23a1f8695af43ad49))
* **swagger port:** check swagger config before using default environment variable SERVER_PORT ([#53](https://github.com/MapColonies/exporter-trigger/issues/53)) ([a402000](https://github.com/MapColonies/exporter-trigger/commit/a402000f43724aa067ebea35fbb443c94ac408f7))

## 1.0.0 (2020-09-06)


### Features

* **skeleton:** add default ts service boilerplate ([7f44ce2](https://github.com/MapColonies/exporter-trigger/commit/7f44ce20a96f354790ea12bb08b9953e7f01f1ac))
