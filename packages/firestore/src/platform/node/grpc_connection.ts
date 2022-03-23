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

// Note: We have to use a package import here to avoid build errors such as
// https://github.com/firebase/firebase-js-sdk/issues/5983
import * as grpc from '@grpc/grpc-js';

import { Token } from '../../api/credentials';
import { DatabaseInfo } from '../../core/database_info';
import { SDK_VERSION } from '../../core/version';
import { Connection, Stream } from '../../remote/connection';
import { mapCodeFromRpcCode } from '../../remote/rpc_error';
import { StreamBridge } from '../../remote/stream_bridge';
import { hardAssert } from '../../util/assert';
import { FirestoreError } from '../../util/error';
import { logError, logDebug, logWarn } from '../../util/log';
import { NodeCallback, nodePromise } from '../../util/node_api';
import { Deferred } from '../../util/promise';

// TODO: Fetch runtime version from grpc-js/package.json instead
// when there's a cleaner way to dynamic require JSON in both Node ESM and CJS
const grpcVersion = '__GRPC_VERSION__';

const LOG_TAG = 'Connection';
const X_GOOG_API_CLIENT_VALUE = `gl-node/${process.versions.node} fire/${SDK_VERSION} grpc/${grpcVersion}`;

function createMetadata(
  databasePath: string,
  authToken: Token | null,
  appCheckToken: Token | null,
  appId: string
): grpc.Metadata {
  hardAssert(
    authToken === null || authToken.type === 'OAuth',
    'If provided, token must be OAuth'
  );
  const metadata = new grpc.Metadata();
  if (authToken) {
    authToken.headers.forEach((value, key) => metadata.set(key, value));
  }
  if (appCheckToken) {
    appCheckToken.headers.forEach((value, key) => metadata.set(key, value));
  }
  if (appId) {
    metadata.set('X-Firebase-GMPID', appId);
  }
  metadata.set('X-Goog-Api-Client', X_GOOG_API_CLIENT_VALUE);
  // These headers are used to improve routing and project isolation by the
  // backend.
  // TODO(b/199767712): We are keeping 'Google-Cloud-Resource-Prefix' until Emulators can be
  // released with cl/428820046. Currently blocked because Emulators are now built with Java
  // 11 from Google3.
  metadata.set('Google-Cloud-Resource-Prefix', databasePath);
  metadata.set('x-goog-request-params', databasePath);
  return metadata;
}

// The type of these stubs is dynamically generated by the GRPC runtime
// from the protocol buffer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeneratedGrpcStub = any;

/**
 * A Connection implemented by GRPC-Node.
 */
export class GrpcConnection implements Connection {
  private readonly databasePath: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly firestore: any;

  // We cache stubs for the most-recently-used token.
  private cachedStub: GeneratedGrpcStub | null = null;

  constructor(protos: grpc.GrpcObject, private databaseInfo: DatabaseInfo) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.firestore = (protos as any)['google']['firestore']['v1'];
    this.databasePath = `projects/${databaseInfo.databaseId.projectId}/databases/${databaseInfo.databaseId.database}`;
  }

  private ensureActiveStub(): GeneratedGrpcStub {
    if (!this.cachedStub) {
      logDebug(LOG_TAG, 'Creating Firestore stub.');
      const credentials = this.databaseInfo.ssl
        ? grpc.credentials.createSsl()
        : grpc.credentials.createInsecure();
      this.cachedStub = new this.firestore.Firestore(
        this.databaseInfo.host,
        credentials
      );
    }
    return this.cachedStub;
  }

  invokeRPC<Req, Resp>(
    rpcName: string,
    path: string,
    request: Req,
    authToken: Token | null,
    appCheckToken: Token | null
  ): Promise<Resp> {
    const stub = this.ensureActiveStub();
    const metadata = createMetadata(
      this.databasePath,
      authToken,
      appCheckToken,
      this.databaseInfo.appId
    );
    const jsonRequest = { database: this.databasePath, ...request };

    return nodePromise((callback: NodeCallback<Resp>) => {
      logDebug(LOG_TAG, `RPC '${rpcName}' invoked with request:`, request);
      return stub[rpcName](
        jsonRequest,
        metadata,
        (grpcError?: grpc.ServiceError, value?: Resp) => {
          if (grpcError) {
            logDebug(LOG_TAG, `RPC '${rpcName}' failed with error:`, grpcError);
            callback(
              new FirestoreError(
                mapCodeFromRpcCode(grpcError.code),
                grpcError.message
              )
            );
          } else {
            logDebug(
              LOG_TAG,
              `RPC '${rpcName}' completed with response:`,
              value
            );
            callback(undefined, value);
          }
        }
      );
    });
  }

  invokeStreamingRPC<Req, Resp>(
    rpcName: string,
    path: string,
    request: Req,
    authToken: Token | null,
    appCheckToken: Token | null
  ): Promise<Resp[]> {
    const results: Resp[] = [];
    const responseDeferred = new Deferred<Resp[]>();

    logDebug(
      LOG_TAG,
      `RPC '${rpcName}' invoked (streaming) with request:`,
      request
    );
    const stub = this.ensureActiveStub();
    const metadata = createMetadata(
      this.databasePath,
      authToken,
      appCheckToken,
      this.databaseInfo.appId
    );
    const jsonRequest = { ...request, database: this.databasePath };
    const stream = stub[rpcName](jsonRequest, metadata);
    stream.on('data', (response: Resp) => {
      logDebug(LOG_TAG, `RPC ${rpcName} received result:`, response);
      results.push(response);
    });
    stream.on('end', () => {
      logDebug(LOG_TAG, `RPC '${rpcName}' completed.`);
      responseDeferred.resolve(results);
    });
    stream.on('error', (grpcError: grpc.ServiceError) => {
      logDebug(LOG_TAG, `RPC '${rpcName}' failed with error:`, grpcError);
      const code = mapCodeFromRpcCode(grpcError.code);
      responseDeferred.reject(new FirestoreError(code, grpcError.message));
    });

    return responseDeferred.promise;
  }

  // TODO(mikelehen): This "method" is a monster. Should be refactored.
  openStream<Req, Resp>(
    rpcName: string,
    authToken: Token | null,
    appCheckToken: Token | null
  ): Stream<Req, Resp> {
    const stub = this.ensureActiveStub();
    const metadata = createMetadata(
      this.databasePath,
      authToken,
      appCheckToken,
      this.databaseInfo.appId
    );
    const grpcStream = stub[rpcName](metadata);

    let closed = false;
    const close = (err?: FirestoreError): void => {
      if (!closed) {
        closed = true;
        stream.callOnClose(err);
        grpcStream.end();
      }
    };

    const stream = new StreamBridge<Req, Resp>({
      sendFn: (msg: Req) => {
        if (!closed) {
          logDebug(LOG_TAG, 'GRPC stream sending:', msg);
          try {
            grpcStream.write(msg);
          } catch (e) {
            // This probably means we didn't conform to the proto.  Make sure to
            // log the message we sent.
            logError('Failure sending:', msg);
            logError('Error:', e);
            throw e;
          }
        } else {
          logDebug(LOG_TAG, 'Not sending because gRPC stream is closed:', msg);
        }
      },
      closeFn: () => {
        logDebug(LOG_TAG, 'GRPC stream closed locally via close().');
        close();
      }
    });

    grpcStream.on('data', (msg: Resp) => {
      if (!closed) {
        logDebug(LOG_TAG, 'GRPC stream received:', msg);
        stream.callOnMessage(msg);
      }
    });

    grpcStream.on('end', () => {
      logDebug(LOG_TAG, 'GRPC stream ended.');
      close();
    });

    grpcStream.on('error', (grpcError: grpc.ServiceError) => {
      if (!closed) {
        logWarn(
          LOG_TAG,
          'GRPC stream error. Code:',
          grpcError.code,
          'Message:',
          grpcError.message
        );
        const code = mapCodeFromRpcCode(grpcError.code);
        close(new FirestoreError(code, grpcError.message));
      }
    });

    logDebug(LOG_TAG, 'Opening GRPC stream');
    // TODO(dimond): Since grpc has no explicit open status (or does it?) we
    // simulate an onOpen in the next loop after the stream had it's listeners
    // registered
    setTimeout(() => {
      stream.callOnOpen();
    }, 0);

    return stream;
  }
}
