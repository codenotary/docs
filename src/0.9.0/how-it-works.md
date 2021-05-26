# How it works

Download [immudb short research paper](https://codenotary.com/technologies/immudb/) to get a conceptual understanding of the technical foundations of immudb.

The SDK ```client``` object offers a simple set of methods for reading and writing ledger entries, along with several utility functions. Users have the option to include data validation as part of each transaction. 

Before getting into code samples, you may find it beneficial to review the following high-level introduction to SDK functions. 

## Adding data

The _Set_ method of the client object is used to add new entries to the ledger. Two variations are available:
- ```Set``` Adds a key-value pair to the ledger.
- ```VerifiedSet``` Adds a key-value pair to the ledger and verify automatically.

## Fetching data

The _Get_ method of the client object is used to read entries from the ledger. Two variations are available:
- ```Get``` Reads a value from the ledger without verification.
- ```VerifiedGet``` Reads a value from the ledger and verify automatically.

## Checking data consistency

This section is not yet ready for immudb 0.9. We are working on it in order to improve it and we are close to deliver. Stay tuned!

## State signature

Providing `immudb` with a signing key enables the cryptographic state signature.
That means that an auditor or a third party client, for instance, could verify the authenticity of the returned current state after calling the `currentState` gRPC method.
Here are the gRPC message definitions:
```proto
message ImmutableState {
	uint64 txId = 3;
	bytes txHash = 4;
	Signature signature = 5;
}

message Signature {
	bytes signature = 1;
	bytes publicKey = 2;
}
```
Check [state signature](/0.9.0/immudb/#state-signature) and [verify state signature](/0.9.0/sdks-api.html#verify-state-signature) paragraphs for additional details.

Immuclient and [immugw](https://github.com/codenotary/immugw) are shipped with auditor capabilities.
To get the signed state in combination with the auditor, launch...
* ...immuclient with auditor capabilities:
```bash
immuclient audit-mode --audit-username {immudb-username} --audit-password {immudb-pw} --audit-signature validate
```
* ...with [immugw](https://github.com/codenotary/immugw) with auditor capabilities:
```bash
./immugw --audit --audit-username {immudb-username} --audit-password {immudb-pw} --audit-signature validate
```

## Item References

Item references enable the insertion of a special entry which references another existing item. 

A typical use case is an account balance. While a conventional banking application might update an account record as the balance changes, there's no such thing as updating an immutable database. Since you can only add new records with immudb, you may want to tie together entries that represent a new value for an entity that's part of a previous entry, such as an account balance.

immudb provides methods that then let you query all entries associated with a particular reference entity.

## Primary Index

The primary index enables queries and search based on the **data key**.

## Secondary Index

The secondary index enables queries and search based on the **data value**.

## Cryptographic signatures

A signature (PKI) provided by the client can be become part of the insertion process.

## Authentication (transport)

Integrated mTLS offers the best approach for machine-to-machine authentication, also providing communications security (entryption) over the transport channel.

# immugw communication
immugw can be found in its [own repository](https://github.com/codenotary/immugw)

immugw proxies REST client communication and gRPC server interface. For security reasons, immugw should not run on the same server as immudb. The following diagram shows how the communication works:

![immugw communication explained](https://raw.githubusercontent.com/codenotary/immugw/master/img/immugw-diagram.png)
