# SDKs API

## Contents
- [Connection and authentication](#connection-and-authentication)
    - [Mutual TLS](#mutual-tls)
    - [Disable authentication](#disable-authentication)
    - [Verify state signature](#verify-state-signature)
- [State management](#state-management)
- [Tamperproof reading and writing](#tamperproof-reading-and-writing)
    - [Verified get and set](#verified-get-and-set)
- [Writing and reading](#writing-and-reading)
    - [Get and Set](#get-and-set)
    - [Transaction by index](#transaction-by-index)
    - [Verified transaction by index](#verified-transaction-by-index)
- [History](#history)
- [Counting](#counting)
- [Scan](#scan)
- [References](#references)
    - [SetReference and VerifiedSetReference](#setreference-and-verifiedsetreference)
    - [Resolving reference with transaction id](#resolving-reference-with-transaction-id)
- [Secondary indexes](#secondary-indexes)
    - [Sorted sets](#sorted-sets)
- [Transactions](#transactions)
    - [SetAll](#Setall)
    - [GetAll](#Getall)
    - [ExecAll](#Execall)
- [Tamperproofing utilities](#tamperproofing-utilities)
    - [Current State](#current-state)
- [User management (ChangePermission,SetActiveUser,DatabaseList)](#user-management)
- [Multi databases(CreateDatabase,UseDatabase)](#multi-databases)
- [Health](#health)

## Connection and authentication

The immudb server runs on port 3323 as the default. The code samples below illustrate how to connect your client to the server and authenticate using default options and the default username and password.
You can modify defaults on the immudb server in `immudb.toml` in the config folder.
:::: tabs

::: tab Go

The Login method returns a token required for all interactions with the server.

```go
c, err := client.NewImmuClient(client.DefaultOptions())
if err != nil {
    log.Fatal(err)
}
ctx := context.Background()
// login with default username and password and storing a token
lr , err := c.Login(ctx, []byte(`immudb`), []byte(`immudb2`))
if err != nil {
    log.Fatal(err)
}
// set up an authenticated context that will be required in future operations
md := metadata.Pairs("authorization", lr.Token)
ctx = metadata.NewOutgoingContext(context.Background(), md)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

### Mutual tls
To enable mutual authentication, a certificate chain must be provided to both the server and client.
That will cause each to authenticate with the other simultaneously.
In order to generate certs, use the openssl tool:
[generate.sh](https://github.com/codenotary/immudb/tree/master/tools/mtls).
```bash
./generate.sh localhost mysecretpassword
```
This generates a list of folders containing certificates and private keys to set up a mTLS connection.
:::: tabs

::: tab Go
```go
	client, err := c.NewImmuClient(
		c.DefaultOptions().WithMTLsOptions(
			c.MTLsOptions{}.WithCertificate("{path-to-immudb-src-folder}/tools/mtls/4_client/certs/localhost.cert.pem").
				WithPkey("{path-to-immudb-src-folder}/tools/mtls/4_client/private/localhost.key.pem").
				WithClientCAs("{path-to-immudb-src-folder}/tools/mtls/2_intermediate/certs/ca-chain.cert.pem").
				WithServername("localhost"),
				).
			WithMTLs(true),
		)
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	// login with default username and password
	lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

### Disable authentication
You also have the option to run immudb with authentication disabled. However, without authentication enabled, it's not possible to connect to a server already configured with databases and user permissions. If a valid token is present, authentication is enabled by default.

:::: tabs

::: tab Go
```go
    client, err := c.NewImmuClient(
		c.DefaultOptions().WithAuth(false),
	)
	if err != nil {
		log.Fatal(err)
	}
	vi, err := client.VerifiedSet(ctx, []byte(`immudb`), []byte(`hello world`))
	if  err != nil {
		log.Fatal(err)
	}
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

# Verify state signature

If `immudb` is launched with a private signing key, each signed request can be verified with the public key.
This ensures the identity of the server.
Check [state signature](/0.9.0/immudb/#state-signature) to see how to generate a valid key.

:::: tabs

::: tab Go
```go
    	c, err := client.NewImmuClient(client.DefaultOptions().WithServerSigningPubKey("../../immudb/src/wrong.public.key"))
    	if err != nil {
    		log.Fatal(err)
    	}
    	ctx := context.Background()

    	lr , err := c.Login(ctx, []byte(`immudb`), []byte(`immudb`))
    	if err != nil {
    		log.Fatal(err)
    	}

    	md := metadata.Pairs("authorization", lr.Token)
    	ctx = metadata.NewOutgoingContext(context.Background(), md)

    	if _, err := c.Set(ctx, []byte(`immudb`), []byte(`hello world`)); err != nil {
    		log.Fatal(err)
    	}

    	var state *schema.ImmutableState
    	if state, err = c.CurrentState(ctx); err != nil {
    		log.Fatal(err) // if signature is not verified here is trigger an appropriate error
    	}

    	fmt.Print(state)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## State management

It's the responsibility of the immudb client to track the server state. That way it can check each verified read or write operation against a trusted state.

:::: tabs

::: tab Go
The component in charge of state handling is the `StateService`.
To set up the `stateService` 3 interfaces need to be implemented and provided to the `StateService` constructor:
* `Cache` interface in the `cache` package. Standard cache.NewFileCache provides a file state store solution.
* `StateProvider` in the `stateService` package. It provides a fresh state from immudb server when the client is being initialized for the first time. Standard StateProvider provides a service that retrieve immudb first state hash from a gRPC endpoint.
* `UUIDProvider` in the `stateService` package. It provides the immudb identifier. This is needed to allow the client to safely connect to multiple immudb instances. Standard UUIDProvider provides the immudb server identifier from a gRPC endpoint.

Following an example how to obtain a client instance with a custom state service.
```go
    func MyCustomImmuClient(options *c.Options) (cli c.ImmuClient, err error) {
    	ctx := context.Background()

    	cli = c.DefaultClient()

    	options.DialOptions = cli.SetupDialOptions(options)

    	cli.WithOptions(options)

    	var clientConn *grpc.ClientConn
    	if clientConn, err = cli.Connect(ctx); err != nil {
    		return nil, err
    	}

    	cli.WithClientConn(clientConn)

    	serviceClient := schema.NewImmuServiceClient(clientConn)
    	cli.WithServiceClient(serviceClient)

    	if err = cli.WaitForHealthCheck(ctx); err != nil {
    		return nil, err
    	}

    	immudbStateProvider := stateService.NewImmudbStateProvider(serviceClient)
    	immudbUUIDProvider := stateService.NewImmudbUUIDProvider(serviceClient)

    	customDir := "custom_state_dir"
    	os.Mkdir(customDir, os.ModePerm)
    	stateService, err := stateService.NewStateService(
    		cache.NewFileCache(customDir),
    		logger.NewSimpleLogger("immuclient", os.Stderr),
    		immudbStateProvider,
    		immudbUUIDProvider)
    	if err != nil {
    		return nil, err
    	}

    	dt, err := timestamp.NewDefaultTimestamp()
    	if err != nil {
    		return nil, err
    	}

    	ts := c.NewTimestampService(dt)
    	cli.WithTimestampService(ts).WithStateService(stateService)

    	return cli, nil
    }
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::


## Tamperproof reading and writing

You can read and write records securely using built-in cryptographic verification.


### Verified get and set
The client implements the mathematical validations, while your application uses a traditional read or write function.

:::: tabs

::: tab Go
```go
	tx, err := client.VerifiedSet(ctx, []byte(`hello`), []byte(`immutable world`))
    if  err != nil {
    	log.Fatal(err)
	}

	fmt.Printf("Successfully committed and verified tx %d\n", tx.Id)

    entry, err := client.VerifiedGet(ctx, []byte(`hello`))
    if  err != nil {
    	log.Fatal(err)
	}

	fmt.Printf("Successfully retrieved and verified entry: %v\n", entry)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## Writing and reading

The format for writing data is the same both in Set and VerifiedSet, just as it is for reading data both in both Get and VerifiedGet.

The only difference is that VerifiedSet returns proofs needed to mathematically verify that the data was not tampered.
Note that generating that proof has a slight performance impact, so primitives are allowed without the proof.
It is still possible get the proofs for a specific item at any time, so the decision about when or how frequently to do checks (with the Verify version of a method) is completely up to the user.
It's possible also to use dedicated [auditors](immuclient/#auditor) to ensure the database consistency, but the pattern in which every client is also an auditor is the more interesting one.

### Get and Set

:::: tabs

::: tab Go
```go
    tx, err = client.Set(ctx, []byte(`hello`), []byte(`immutable world`))
	if  err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Successfully committed tx %d\n", tx.Id)

	entry, err := client.Get(ctx, []byte(`hello`))
	if  err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Successfully retrieved entry: %v\n", entry)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

### Transaction by index
This section is not yet ready for immudb 0.9. We are working on it in order to improve it and we are close to deliver. Stay tuned!

:::: tabs

::: tab Go
```go
	    tx, err := client.TxByID(ctx, txId)
    	if  err != nil {
    		log.Fatal(err)
    	}
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

### Verified transaction by index
This section is not yet ready for immudb 0.9. We are working on it in order to improve it and we are close to deliver. Stay tuned!

:::: tabs

::: tab Go
```go
	    tx, err := client.VerifiedTxByID(ctx, txId)
    	if  err != nil {
    		log.Fatal(err)
    	}
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## History
The fundamental property of immudb is that it's an append-only database.
This means that an _update_ does not change an existing record. Instead, it is a new insert of the **same key** with a **new value**.
It's possible to retrieve all the values for a particular key with the history command.

`History` accepts the following parameters:
* `Key`: a key of an item
* `Offset`: the starting index (excluded from the search). Optional
* `Limit`: maximum returned items. Optional
* `Desc`: items are returned in reverse order. Optional
* `SinceTx`:

:::: tabs

::: tab Go
```go
    client.Set(ctx, []byte(`hello`), []byte(`immutable world`))
	client.Set(ctx, []byte(`hello`), []byte(`immudb`))

	req := &schema.HistoryRequest{
		Key: []byte(`hello`),
	}

	entries, err := client.History(ctx, req)
	if  err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Successfully retrieved %d entries for key %s\n", len(entries), req.Key)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## Counting

:::: tabs

::: tab Go
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Go sdk github project](https://github.com/codenotary/immudb/issues/new)
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## Scan
The `scan` command is used to iterate over the collection of elements present in the currently selected database.
`Scan` accepts the following parameters:

* `Prefix`: prefix
* `SeekKey`: initial key to returns. Optional
* `Desc`: sorting order. Optional
* `Limit`: maximum returned items. Optional
* `SinceTx`: transaction limit id. 0 is the last server transaction. Optional

:::: tabs

::: tab Go

An ordinary `scan` command and a reversed one.

```go
    client, err := c.NewImmuClient(c.DefaultOptions())
    if err != nil {
        log.Fatal(err)
    }
    ctx := context.Background()
    lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))

    md := metadata.Pairs("authorization", lr.Token)
    ctx = metadata.NewOutgoingContext(context.Background(), md)

    client.Set(ctx, []byte(`aaa`), []byte(`item1`))
    client.Set(ctx, []byte(`bbb`), []byte(`item2`))
    client.Set(ctx, []byte(`abc`),[]byte(`item3`))

    scanReq := &schema.ScanRequest{
        SeekKey: nil,
        Prefix:  []byte(`a`),
        Desc:    false,
        Limit   0,
        SinceTx: 0,
    }

    list, err := client.Scan(ctx, scanReq)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("%v\n", list)
    scanReq1 := &schema.ScanRequest{
        SeekKey: nil,
        Prefix:  []byte(`a`),
        Desc:    true,
        Limit   0,
        SinceTx: 0,
    }

    list, err := client.Scan(ctx, scanReq1)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("%v\n", list)
```

Example with an offset:

```go
    scanReq = &schema.ScanRequest{
        SeekKey: []byte(``),
        Prefix:  []byte(``),
        Desc:    true,
        Limit   0,
        SinceTx: 0,
    }

    list, err := client.Scan(ctx, scanReq)
	fmt.Printf("%v\n", list)

    scanReq = &schema.ScanRequest{
        SeekKey: []byte(`bbb`),
        Prefix:  []byte(``),
        Desc:    true,
        Limit   0,
        SinceTx: 0,
    }

    list, err = client.Scan(ctx, scanReq)
    fmt.Printf("%v\n", list)

    scanReq = &schema.ScanRequest{
        SeekKey: []byte(`b`),
        Prefix:  []byte(`b`),
        Desc:    true,
        Limit   0,
        SinceTx: 0,
    }

    list, err = client.Scan(ctx, scanReq)
    fmt.Printf("%v\n", list)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## References
`SetReference` is like a "tag" operation. It appends a reference on a key/value element.
As a consequence, when we retrieve that reference with a `Get` or `VerifiedGet` the value retrieved will be the original value associated with the original key.
Its ```VerifiedReference``` counterpart is the same except that it also produces the inclusion and consistency proofs.

### SetReference and verifiedSetReference
:::: tabs

::: tab Go
```go
	client, err := c.NewImmuClient(c.DefaultOptions())
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))

	md := metadata.Pairs("authorization", lr.Token)
	ctx = metadata.NewOutgoingContext(context.Background(), md)

	_, err = client.Set(ctx, []byte(`firstKey`),[]byte(`firstValue`))
	if err != nil {
		log.Fatal(err)
	}
	reference, err := client.SetReference(ctx, []byte(`myTag`), []byte(`firstKey`), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%v\n", reference)
	firstItem, err := client.Get(ctx, []byte(`myTag`))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%v\n", firstItem)
```

Example with verifications

```go
	client, err := c.NewImmuClient(c.DefaultOptions())
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))

	md := metadata.Pairs("authorization", lr.Token)
	ctx = metadata.NewOutgoingContext(context.Background(), md)

	_, err = client.Set(ctx, []byte(`firstKey`),[]byte(`firstValue`))
	if err != nil {
		log.Fatal(err)
	}
	reference, err := client.VerifiedSetReference(ctx, []byte(`myTag`), []byte(`firstKey`), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%v\n", reference)

	firstItem, err := client.Get(ctx, []byte(`myTag`))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%v\n", firstItem)

    referenceVerified, err := client.VerifiedSetReference(ctx, []byte(`myTag`), []byte(`firstKey`), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%v\n", referenceVerified)
```

:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

### Get and verifiedGet

When reference is resolved with get or verifiedGet in case of multiples equals references the last reference is returned.
:::: tabs

::: tab Go

```go
	client, err := c.NewImmuClient(c.DefaultOptions())
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))

	md := metadata.Pairs("authorization", lr.Token)
	ctx = metadata.NewOutgoingContext(context.Background(), md)

	_, err = client.Set(ctx, []byte(`firstKey`),[]byte(`firstValue`))
	if err != nil {
		log.Fatal(err)
	}

    _, err = client.Set(ctx, []byte(`secondKey`),[]byte(`secondValue`))
	if err != nil {
		log.Fatal(err)
	}

	reference, err := client.VerifiedSetReference(ctx, []byte(`myTag`), []byte(`firstKey`), nil)
    if err != nil {
    	log.Fatal(err)
	}

    reference, err := client.VerifiedSetReference(ctx, []byte(`myTag`), []byte(`secondKey`), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%v\n", reference)

	secondItem, err := client.Get(ctx, []byte(`myTag`))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%v\n", secondItem)

```

:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

### Resolving reference with transaction id
Creating references with`SetReferenceAt` and `VerifiedSetReferenceAt` fix a reference to a specific item in time.
:::: tabs

::: tab Go
This section is not yet ready for immudb 0.9. We are working on it in order to improve it and we are close to deliver. Stay tuned!
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## Secondary indexes

On top of the key value store immudb provides secondary indexes to help developers to handle complex queries.

### Sorted sets
The ```sorted set``` data type provides simplest secondary index you can create with immudb. That's a data structure that represents a set of elements ordered by the score of each element, which is a floating point number.
The score type is a float64 to accommodate the maximum number of uses cases.
64-bit floating point gives a lot of flexibility and dynamic range, at the expense of having only 53-bits of integer.

When an integer64 is cast to a float there _could_ be a loss of precision, but the insertion order is guaranteed by the internal database index that is appended to the internal index key.

`ZAdd` can reference an item by `key` or by `index`.

`ZScan` accepts following arguments:

* Set: the name of the collection
* SeekKey
* SeekScore
* SeekAtTx
* InclusiveSeek
* Limit: the maximum items returned,
* Desc: items are returned in score ascending or descending order
* MinScore: minimum score filter
* MaxScore: maximum score filter
* SinceTx

:::: tabs

::: tab Go

This section is not yet ready for immudb 0.9. We are working on it in order to improve it and we are close to deliver. Stay tuned!

:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## Transactions

`GetAll`, `SetAll` and `ExecAll` are the foundation of transactions in immudb. They allow the execution of a group of commands in a single step, with two important guarantees:
* All the commands in a transaction are serialized and executed sequentially. No request issued by another client can ever interrupt the execution of a transaction. This guarantees that the commands are executed as a single isolated operation.
* Either all of the commands are processed, or none are, so the transaction is also atomic.

### GetAll

:::: tabs

::: tab Go
```go
    itList, err := db.GetAll( [][]byte{
			[]byte("key1"),
			[]byte("key2"),
			[]byte("key3"),
		})
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read about our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

### SetAll
A more versatile atomic multi set operation
:::: tabs
SetBatch and GetBatch example
::: tab Go
```go
	kvList := &schema.KVList{KVs: []*schema.KeyValue{
		{Key: []byte("1,2,3"), Value: []byte("3,2,1")},
		{Key: []byte("4,5,6"), Value: []byte("6,5,4")},
	}}

	_, err = client.SetAll(ctx, kvList)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read about our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

### ExecAll
`ExecAll` permits multiple insertions at once. The difference is that is possible to to specify a list of a mix of key value set, reference and zAdd insertions.
The argument of a ExecAll is an array of the following types:
* `Op_Kv`: ordinary key value item
* `Op_ZAdd`: [ZAdd](#sorted-sets) option element
* `Op_Ref`: [Reference](#references) option element

It's possible to persist and reference items that are already persisted on disk. In that case is mandatory to provide the index of the referenced item. This has to be done for:
* `Op_ZAdd`
* `Op_Ref`
If `zAdd` or `reference` is not yet persisted on disk it's possible to add it as a regular key value and the reference is done onFly.
:::: tabs
ExecAll
::: tab Go

```go
client, err := c.NewImmuClient(c.DefaultOptions())
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))

	md := metadata.Pairs("authorization", lr.Token)
	ctx = metadata.NewOutgoingContext(context.Background(), md)

	idx, _ := client.Set(ctx, []byte(`persistedKey`),[]byte(`persistedVal`))

	// Ops payload
	aOps := &schema.Ops{
		Operations: []*schema.Op{
			{
				Operation: &schema.Op_Kv{
					Kv: &schema.KeyValue{
						Key:   []byte(`notPersistedKey`),
						Value: []byte(`notPersistedVal`),
					},
				},
			},
			{
				Operation: &schema.Op_ZAdd{
					ZAdd: &schema.ZAddRequest{
						Set:   []byte(`mySet`),
						Score: 0.6,
						Key:   []byte(`notPersistedKey`)},
				},
			},
			{
				Operation: &schema.Op_ZAdd{
					ZAdd: &schema.ZAddRequest{
						Set:   []byte(`mySet`),
						Score: 0.6,
						Key:   []byte(`persistedKey`),
						Index: idx,
					},
				},
			},
		},
	}

	idx , err = client.ExecAll(ctx, aOps)

	fmt.Printf("%v\n", idx)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## Tamperproofing utilities

### Current State
:::: tabs
`CurrentState` returns the last state of the server.

::: tab Go
```go
    	client, err := c.NewImmuClient(c.DefaultOptions())
    	if err != nil {
    		log.Fatal(err)
    	}
    	ctx := context.Background()
    	lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))

    	md := metadata.Pairs("authorization", lr.Token)
    	ctx = metadata.NewOutgoingContext(context.Background(), md)

    	state, err := client.CurrentState(ctx)
    	if err != nil {
    		log.Fatal(err)
    	}

    	fmt.Printf("current state is : %v", state)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## User management
User management is exposed with following methods:
* CreateUser
* ChangePermission
* ChangePassword

Password must have between 8 and 32 letters, digits and special characters of which at least 1 uppercase letter, 1 digit and 1 special character.

Admin permissions are:
* PermissionSysAdmin = 255
* PermissionAdmin = 254

Non-admin permissions are:
* PermissionNone = 0
* PermissionR = 1
* PermissionRW = 2

:::: tabs

::: tab Go
```go
	client, err := c.NewImmuClient(c.DefaultOptions())
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))

	md := metadata.Pairs("authorization", lr.Token)
	ctx = metadata.NewOutgoingContext(context.Background(), md)

	err = client.CreateUser(ctx, []byte(`myNewUser1`), []byte(`myS3cretPassword!`), auth.PermissionR, "defaultdb")
	if err != nil {
		log.Fatal(err)
	}
	err = client.ChangePermission(ctx, schema.PermissionAction_GRANT, "myNewUser1", "defaultDB",  auth.PermissionRW)
	if err != nil {
		log.Fatal(err)
	}
	err = client.ChangePassword(ctx, []byte(`myNewUser1`), []byte(`myS3cretPassword!`), []byte(`myNewS3cretPassword!`))
	if err != nil {
		log.Fatal(err)
	}
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## Multiple databases
Starting with version 0.7.0 of immudb, we introduced multi-database support.
By default, the first database is either called `defaultdb` or based on the environment variable `IMMUDB_DBNAME`.
Handling users and databases requires the appropriate privileges.
Users with `PermissionAdmin` can control everything. Non-admin users have restricted permissions and can read or write only their databases, assuming sufficient privileges.
:::: tabs
This example shows how to create a new database and how to write records to it.
To create a new database, use `CreateDatabase` method.
::: tab Go
To write into a specific database an authenticated context is required.
Start by calling the `UseDatabase` method to obtain a `token`.
A token is used for both authorization and routing commands to a specific database.
To set up an authenticated context, it's sufficient to put a `token` inside metadata.
```go
	client, err := c.NewImmuClient(c.DefaultOptions())
	if err != nil {
		log.Fatal(err)
	}
	ctx := context.Background()
	lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))

	md := metadata.Pairs("authorization", lr.Token)
	ctx = metadata.NewOutgoingContext(context.Background(), md)

	err = client.CreateDatabase(ctx, &schema.Database{
		Databasename: "myimmutabledb",
	})
	if err != nil {
		log.Fatal(err)
	}
	dbList, err := client.DatabaseList(ctx)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("database list: %v", dbList)

	// creating a context to write in the new database
	resp, err := client.UseDatabase(ctx, &schema.Database{
		Databasename: "myimmutabledb",
	})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("auth token: %v", resp.Token)

	md = metadata.Pairs("authorization", resp.Token)
	ctx = metadata.NewOutgoingContext(context.Background(), md)
	// writing in myimmutabledb
	_, err = client.Set(ctx, []byte(`key`), []byte(`val`))
	if err != nil {
		log.Fatal(err)
	}
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::

## HealthCheck
HealthCheck return an error if `immudb` status is not ok.
:::: tabs
::: tab Go
```go
	client, err := c.NewImmuClient(c.DefaultOptions())
    if err != nil {
        log.Fatal(err)
    }
    ctx := context.Background()
    lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))

    md := metadata.Pairs("authorization", lr.Token)
    ctx = metadata.NewOutgoingContext(context.Background(), md)

    err = client.HealthCheck(ctx)
```
:::

::: tab Java
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Python sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [Node.js sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [.Net sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/immugw/) option.
:::

::::
