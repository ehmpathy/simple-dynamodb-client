# Changelog

## [0.10.3](https://github.com/ehmpathy/simple-dynamodb-client/compare/v0.10.2...v0.10.3) (2024-05-25)


### Bug Fixes

* **deps:** update aws sdk dep ([#14](https://github.com/ehmpathy/simple-dynamodb-client/issues/14)) ([071c4b8](https://github.com/ehmpathy/simple-dynamodb-client/commit/071c4b8d19d3d25599cc289709c45c32e62a779e))

## [0.10.2](https://github.com/ehmpathy/simple-dynamodb-client/compare/v0.10.1...v0.10.2) (2024-05-25)


### Bug Fixes

* **practs:** upgrade to latest best ([#12](https://github.com/ehmpathy/simple-dynamodb-client/issues/12)) ([acbed8c](https://github.com/ehmpathy/simple-dynamodb-client/commit/acbed8c0426418cf9024bb066a14944dbdf537f8))

### [0.10.1](https://www.github.com/ehmpathy/simple-dynamodb-client/compare/v0.10.0...v0.10.1) (2024-05-25)


### Bug Fixes

* **query:** loop within query to avoid silent aws 1mb pagination footgun ([#10](https://www.github.com/ehmpathy/simple-dynamodb-client/issues/10)) ([d179974](https://www.github.com/ehmpathy/simple-dynamodb-client/commit/d17997436891912559f0f41e98c344c874992770))

## [0.10.0](https://www.github.com/ehmpathy/simple-dynamodb-client/compare/v0.9.1...v0.10.0) (2022-12-18)


### Features

* **observability:** wrap dynamodb query errors with context for easier debugging ([b720b8d](https://www.github.com/ehmpathy/simple-dynamodb-client/commit/b720b8d198823c5b6537d76275b5ba94e6de65ec))


### Bug Fixes

* **refs:** replace uladkasach repo refs to ehmpathy repo refs ([967f505](https://www.github.com/ehmpathy/simple-dynamodb-client/commit/967f50589f8b2c432c445df73608da91bb81174e))

### [0.9.1](https://www.github.com/ehmpathy/simple-dynamodb-client/compare/v0.9.0...v0.9.1) (2022-12-18)


### Bug Fixes

* **local:** dont use https agent when using custom dynamodb endpoint that starts with http:// ([283e0ae](https://www.github.com/ehmpathy/simple-dynamodb-client/commit/283e0ae2e7d9bdec9470fd044697a4ebcf382eaf))

## [0.9.0](https://www.github.com/ehmpathy/simple-dynamodb-client/compare/v0.8.0...v0.9.0) (2022-12-18)


### Features

* bump version to skip previously accidentally published version number ([5b06827](https://www.github.com/ehmpathy/simple-dynamodb-client/commit/5b06827e0199078d89b2f70f43b378b61a824a76))

## [0.8.0](https://www.github.com/ehmpathy/simple-dynamodb-client/compare/v0.7.1...v0.8.0) (2022-12-18)


### Features

* **local:** support executing local dynamodb instances w/ custom endpoint env var ([32514a4](https://www.github.com/ehmpathy/simple-dynamodb-client/commit/32514a48168a0e027793e3e6a65cb76457223944))


### Bug Fixes

* **cicd:** upgrade cicd to support please release ([15de39d](https://www.github.com/ehmpathy/simple-dynamodb-client/commit/15de39d2bdb9474d60f84fceb3b338ba4277e600))
