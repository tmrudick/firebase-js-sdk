# @firebase/database-types

## 0.9.6

### Patch Changes

- Updated dependencies [[`3198d58dc`](https://github.com/firebase/firebase-js-sdk/commit/3198d58dcedbf7583914dbcc76984f6f7df8d2ef)]:
  - @firebase/util@1.5.1

## 0.9.5

### Patch Changes

- Updated dependencies [[`2d672cead`](https://github.com/firebase/firebase-js-sdk/commit/2d672cead167187cb714cd89b638c0884ba58f03)]:
  - @firebase/util@1.5.0

## 0.9.4

### Patch Changes

- Updated dependencies [[`3b481f572`](https://github.com/firebase/firebase-js-sdk/commit/3b481f572456e1eab3435bfc25717770d95a8c49)]:
  - @firebase/util@1.4.3

## 0.9.3

### Patch Changes

- Updated dependencies [[`3281315fa`](https://github.com/firebase/firebase-js-sdk/commit/3281315fae9c6f535f9d5052ee17d60861ea569a)]:
  - @firebase/util@1.4.2

## 0.9.2

### Patch Changes

- Updated dependencies [[`2322b6023`](https://github.com/firebase/firebase-js-sdk/commit/2322b6023c628cd9f4f4172767c17d215dd91684)]:
  - @firebase/util@1.4.1

## 0.9.1

### Patch Changes

- Updated dependencies [[`a99943fe3`](https://github.com/firebase/firebase-js-sdk/commit/a99943fe3bd5279761aa29d138ec91272b06df39), [`b835b4cba`](https://github.com/firebase/firebase-js-sdk/commit/b835b4cbabc4b7b180ae38b908c49205ce31a422)]:
  - @firebase/util@1.4.0

## 0.9.0

### Minor Changes

- [`cdada6c68`](https://github.com/firebase/firebase-js-sdk/commit/cdada6c68f9740d13dd6674bcb658e28e68253b6) [#5345](https://github.com/firebase/firebase-js-sdk/pull/5345) (fixes [#5015](https://github.com/firebase/firebase-js-sdk/issues/5015)) - Release modularized SDKs

### Patch Changes

- Updated dependencies [[`cdada6c68`](https://github.com/firebase/firebase-js-sdk/commit/cdada6c68f9740d13dd6674bcb658e28e68253b6)]:
  - @firebase/app-types@0.7.0

## 0.8.0

### Minor Changes

- [`3c6a11c8d`](https://github.com/firebase/firebase-js-sdk/commit/3c6a11c8d0b35afddb50e9c3e0c4d2e30f642131) [#5282](https://github.com/firebase/firebase-js-sdk/pull/5282) - Implement mockUserToken for Storage and fix JWT format bugs.

### Patch Changes

- Updated dependencies [[`3c6a11c8d`](https://github.com/firebase/firebase-js-sdk/commit/3c6a11c8d0b35afddb50e9c3e0c4d2e30f642131)]:
  - @firebase/util@1.3.0

## 0.7.3

### Patch Changes

- Updated dependencies [[`3d10d33bc`](https://github.com/firebase/firebase-js-sdk/commit/3d10d33bc167177fecbf86d2a6574af2e4e210f9)]:
  - @firebase/app-types@0.6.3

## 0.7.2

### Patch Changes

- [`e46ebb743`](https://github.com/firebase/firebase-js-sdk/commit/e46ebb743f670f3b7d2160164addeddf918fb0cb) [#4765](https://github.com/firebase/firebase-js-sdk/pull/4765) - Update types to be consistent with the main index.d.ts

## 0.7.1

### Patch Changes

- Updated dependencies [[`f24d8961b`](https://github.com/firebase/firebase-js-sdk/commit/f24d8961b3b87821413297688803fc85113086b3)]:
  - @firebase/app-types@0.6.2

## 0.7.0

### Minor Changes

- [`05614aa86`](https://github.com/firebase/firebase-js-sdk/commit/05614aa86614994b69df154bd6ce34861fae37a5) [#4427](https://github.com/firebase/firebase-js-sdk/pull/4427) - Add `startAfter()` and `endBefore()` to the Realtime Database TypeScript definitions.

## 0.6.1

### Patch Changes

- [`4f6313262`](https://github.com/firebase/firebase-js-sdk/commit/4f63132622fa46ca7373ab93440c76bcb1822620) [#4096](https://github.com/firebase/firebase-js-sdk/pull/4096) - Add the missing type definition for 'Query.get()' for RTDB

## 0.6.0

### Minor Changes

- [`ef33328f7`](https://github.com/firebase/firebase-js-sdk/commit/ef33328f7cb7d585a1304ed39649f5b69a111b3c) [#3904](https://github.com/firebase/firebase-js-sdk/pull/3904) - Add a useEmulator(host, port) method to Realtime Database

### Patch Changes

- [`602ec18e9`](https://github.com/firebase/firebase-js-sdk/commit/602ec18e92fd365a3a6432ff3a5f6a31013eb1f5) [#3968](https://github.com/firebase/firebase-js-sdk/pull/3968) - Updated the type definition for `ThenableReference` to only implement `then` and `catch`, which matches the implementation.

## 0.5.2

### Patch Changes

- [`ef348fed`](https://github.com/firebase/firebase-js-sdk/commit/ef348fed291338351706a697cbb9fb17a9d06ff4) [#3511](https://github.com/firebase/firebase-js-sdk/pull/3511) - Added interface `Database` which is implemented by `FirebaseDatabase`. This allows consumer SDKs (such as the Firebase Admin SDK) to export the database types as an interface.
