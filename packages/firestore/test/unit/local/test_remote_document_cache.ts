/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SnapshotVersion } from '../../../src/core/snapshot_version';
import { IndexManager } from '../../../src/local/index_manager';
import { remoteDocumentCacheGetNewDocumentChanges } from '../../../src/local/indexeddb_remote_document_cache';
import { Persistence } from '../../../src/local/persistence';
import { PersistencePromise } from '../../../src/local/persistence_promise';
import { RemoteDocumentCache } from '../../../src/local/remote_document_cache';
import { RemoteDocumentChangeBuffer } from '../../../src/local/remote_document_change_buffer';
import {
  DocumentKeySet,
  MutableDocumentMap
} from '../../../src/model/collections';
import { Document, MutableDocument } from '../../../src/model/document';
import { DocumentKey } from '../../../src/model/document_key';
import { IndexOffset } from '../../../src/model/field_index';
import { ResourcePath } from '../../../src/model/path';

/**
 * A wrapper around a RemoteDocumentCache that automatically creates a
 * transaction around every operation to reduce test boilerplate.
 */
export class TestRemoteDocumentCache {
  private readonly cache: RemoteDocumentCache;

  constructor(private readonly persistence: Persistence) {
    this.cache = persistence.getRemoteDocumentCache();
  }

  setIndexManager(indexManager: IndexManager): void {
    this.cache.setIndexManager(indexManager);
  }

  /**
   * Reads all of the documents first so we can safely add them and keep the size calculation in
   * sync.
   */
  addEntries(documents: MutableDocument[]): Promise<void> {
    return this.persistence.runTransaction(
      'addEntry',
      'readwrite-primary',
      txn => {
        const changeBuffer = this.newChangeBuffer();
        return PersistencePromise.forEach(documents, (document: Document) =>
          changeBuffer.getEntry(txn, document.key).next(() => {})
        ).next(() => {
          for (const document of documents) {
            changeBuffer.addEntry(document);
          }
          return changeBuffer.apply(txn);
        });
      }
    );
  }

  /**
   * Adds a single document using the document's version as its read time.
   * Reads the document first to track the document size internally.
   */
  addEntry(document: MutableDocument): Promise<void> {
    return this.addEntries([document]);
  }

  removeEntry(
    documentKey: DocumentKey,
    version?: SnapshotVersion
  ): Promise<void> {
    return this.persistence.runTransaction(
      'removeEntry',
      'readwrite-primary',
      txn => {
        const changeBuffer = this.newChangeBuffer(
          version ? { trackRemovals: true } : undefined
        );
        return changeBuffer.getEntry(txn, documentKey).next(() => {
          changeBuffer.removeEntry(
            documentKey,
            version ?? SnapshotVersion.min()
          );
          return changeBuffer.apply(txn);
        });
      }
    );
  }

  getEntry(documentKey: DocumentKey): Promise<MutableDocument> {
    return this.persistence.runTransaction('getEntry', 'readonly', txn => {
      return this.cache.getEntry(txn, documentKey);
    });
  }

  getEntries(documentKeys: DocumentKeySet): Promise<MutableDocumentMap> {
    return this.persistence.runTransaction('getEntries', 'readonly', txn => {
      return this.cache.getEntries(txn, documentKeys);
    });
  }

  getAllFromCollection(
    collection: ResourcePath,
    offset: IndexOffset
  ): Promise<MutableDocumentMap> {
    return this.persistence.runTransaction(
      'getAllFromCollection',
      'readonly',
      txn => this.cache.getAllFromCollection(txn, collection, offset)
    );
  }

  getAllFromCollectionGroup(
    collectionGroup: string,
    offset: IndexOffset,
    limit: number
  ): Promise<MutableDocumentMap> {
    return this.persistence.runTransaction(
      'getAllFromCollectionGroup',
      'readonly',
      txn =>
        this.cache.getAllFromCollectionGroup(
          txn,
          collectionGroup,
          offset,
          limit
        )
    );
  }

  getNewDocumentChanges(sinceReadTime: SnapshotVersion): Promise<{
    changedDocs: MutableDocumentMap;
    readTime: SnapshotVersion;
  }> {
    return this.persistence.runTransaction(
      'getNewDocumentChanges',
      'readonly',
      txn => {
        return remoteDocumentCacheGetNewDocumentChanges(
          this.cache,
          txn,
          sinceReadTime
        );
      }
    );
  }

  getSize(): Promise<number> {
    return this.persistence.runTransaction('get size', 'readonly', txn =>
      this.cache.getSize(txn)
    );
  }

  newChangeBuffer(options?: {
    trackRemovals: boolean;
  }): RemoteDocumentChangeBuffer {
    return this.cache.newChangeBuffer(options);
  }
}
