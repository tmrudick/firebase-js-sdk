# @firebase/util

## 1.5.1

### Patch Changes

- [`3198d58dc`](https://github.com/firebase/firebase-js-sdk/commit/3198d58dcedbf7583914dbcc76984f6f7df8d2ef) [#6088](https://github.com/firebase/firebase-js-sdk/pull/6088) - Remove unneeded types from public typings file.

## 1.5.0

### Minor Changes

- [`2d672cead`](https://github.com/firebase/firebase-js-sdk/commit/2d672cead167187cb714cd89b638c0884ba58f03) [#6061](https://github.com/firebase/firebase-js-sdk/pull/6061) - Remove idb dependency and replace with our own code.

## 1.4.3

### Patch Changes

- [`3b481f572`](https://github.com/firebase/firebase-js-sdk/commit/3b481f572456e1eab3435bfc25717770d95a8c49) [#5831](https://github.com/firebase/firebase-js-sdk/pull/5831) (fixes [#5754](https://github.com/firebase/firebase-js-sdk/issues/5754)) - FirestoreError and StorageError now extend FirebaseError

## 1.4.2

### Patch Changes

- [`3281315fa`](https://github.com/firebase/firebase-js-sdk/commit/3281315fae9c6f535f9d5052ee17d60861ea569a) [#5708](https://github.com/firebase/firebase-js-sdk/pull/5708) (fixes [#1487](https://github.com/firebase/firebase-js-sdk/issues/1487)) - Update build scripts to work with the exports field

## 1.4.1

### Patch Changes

- [`2322b6023`](https://github.com/firebase/firebase-js-sdk/commit/2322b6023c628cd9f4f4172767c17d215dd91684) [#5693](https://github.com/firebase/firebase-js-sdk/pull/5693) - Add exports field to all packages

## 1.4.0

### Minor Changes

- [`a99943fe3`](https://github.com/firebase/firebase-js-sdk/commit/a99943fe3bd5279761aa29d138ec91272b06df39) [#5539](https://github.com/firebase/firebase-js-sdk/pull/5539) - Use esm2017 builds by default

### Patch Changes

- [`b835b4cba`](https://github.com/firebase/firebase-js-sdk/commit/b835b4cbabc4b7b180ae38b908c49205ce31a422) [#5506](https://github.com/firebase/firebase-js-sdk/pull/5506) - areCookiesEnabled could encounter runtime errors in certain enviornments

## 1.3.0

### Minor Changes

- [`3c6a11c8d`](https://github.com/firebase/firebase-js-sdk/commit/3c6a11c8d0b35afddb50e9c3e0c4d2e30f642131) [#5282](https://github.com/firebase/firebase-js-sdk/pull/5282) - Implement mockUserToken for Storage and fix JWT format bugs.

## 1.2.0

### Minor Changes

- [`a3cbe719b`](https://github.com/firebase/firebase-js-sdk/commit/a3cbe719b1bd733a5c4c15ee0d0e6388d512054c) [#5207](https://github.com/firebase/firebase-js-sdk/pull/5207) - Added deepEqual for comparing objects

## 1.1.0

### Minor Changes

- [`ac4ad08a2`](https://github.com/firebase/firebase-js-sdk/commit/ac4ad08a284397ec966e991dd388bb1fba857467) [#4792](https://github.com/firebase/firebase-js-sdk/pull/4792) - Add mockUserToken support for database emulator.

## 1.0.0

### Major Changes

- [`7354a0ed4`](https://github.com/firebase/firebase-js-sdk/commit/7354a0ed438f4e3df6577e4927e8c8f8f1fbbfda) [#4720](https://github.com/firebase/firebase-js-sdk/pull/4720) - Internal changes to Database and Validation APIs.

## 0.4.1

### Patch Changes

- [`de5f90501`](https://github.com/firebase/firebase-js-sdk/commit/de5f9050137acc9ed1490082e5aa429b5de3cb2a) [#4673](https://github.com/firebase/firebase-js-sdk/pull/4673) - Added a utility function and type for compat interop API

## 0.4.0

### Minor Changes

- [`ec95df3d0`](https://github.com/firebase/firebase-js-sdk/commit/ec95df3d07e5f091f2a7f7327e46417f64d04b4e) [#4610](https://github.com/firebase/firebase-js-sdk/pull/4610) - Add extractQuerystring() function which extracts the query string part of a URL, including the leading question mark (if present).

## 0.3.4

### Patch Changes

- [`9cf727fcc`](https://github.com/firebase/firebase-js-sdk/commit/9cf727fcc3d049551b16ae0698ac33dc2fe45ada) [#4001](https://github.com/firebase/firebase-js-sdk/pull/4001) - Do not merge `__proto__` in `deepExtend` to prevent `__proto__` pollution.

## 0.3.3

### Patch Changes

- [`a5768b0aa`](https://github.com/firebase/firebase-js-sdk/commit/a5768b0aa7d7ce732279931aa436e988c9f36487) [#3932](https://github.com/firebase/firebase-js-sdk/pull/3932) - Point browser field to esm build. Now you need to use default import instead of namespace import to import firebase.

  Before this change

  ```
  import * as firebase from 'firebase/app';
  ```

  After this change

  ```
  import firebase from 'firebase/app';
  ```

* [`7d916d905`](https://github.com/firebase/firebase-js-sdk/commit/7d916d905ba16816ac8ac7c8748c83831ff614ce) [#3946](https://github.com/firebase/firebase-js-sdk/pull/3946) - Write template data to a new `customData` field in`FirebaseError` instead of writing to the error object itself to avoid overwriting existing fields.

## 0.3.2

### Patch Changes

- [`fb3b095e4`](https://github.com/firebase/firebase-js-sdk/commit/fb3b095e4b7c8f57fdb3172bc039c84576abf290) [#2800](https://github.com/firebase/firebase-js-sdk/pull/2800) - Moved `calculateBackoffMillis()` exponential backoff function from remote-config to util,
  where it can be shared between packages.

## 0.3.1

### Patch Changes

- [`d4ca3da0`](https://github.com/firebase/firebase-js-sdk/commit/d4ca3da0a59fcea1261ba69d7eb663bba38d3089) [#3585](https://github.com/firebase/firebase-js-sdk/pull/3585) - Extended Usage of `isIndexedDBAvailable` to Service Worker

## 0.3.0

### Minor Changes

- [`a87676b8`](https://github.com/firebase/firebase-js-sdk/commit/a87676b84b78ccc2f057a22eb947a5d13402949c) [#3472](https://github.com/firebase/firebase-js-sdk/pull/3472) - - Fix an error where an analytics PR included a change to `@firebase/util`, but
  the util package was not properly included in the changeset for a patch bump.

  - `@firebase/util` adds environment check methods `isIndexedDBAvailable`
    `validateIndexedDBOpenable`, and `areCookiesEnabled`.
