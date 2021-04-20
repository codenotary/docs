# Developer Jumpstart for immudb SDKs
[![Slack](https://img.shields.io/badge/join%20slack-%23immutability-brightgreen.svg)](https://slack.vchain.us/) [![Discuss at immudb@googlegroups.com](https://img.shields.io/badge/discuss-immudb%40googlegroups.com-blue.svg)](https://groups.google.com/group/immudb) [![License](https://img.shields.io/github/license/codenotary/immudb4j)](https://github.com/codenotary/immudb/blob/master/LICENSE)

## Introduction
This guide helps developers quickly start with CodeNotary's immudb database and client. It guides you from start to finish with code samples in Node.js, Java, Python, Go, and .Net. After completing the guide, you will have the basic concepts necessary to begin using immudb within your organization.

Note: If you're using another development language, please read up on our [immugw](https://docs.immudb.io/master/immugw/) option.

## Getting immudb running

You may download the immudb binary from [the latest releases on Github](https://github.com/codenotary/immudb/releases/latest). Once you have downloaded immudb, rename it to `immudb`, make sure to mark it as executable, then run it. The following example shows how to obtain v0.9.2 for linux amd64:

```bash
wget https://github.com/vchain-us/immudb/releases/download/v0.9.2/immudb-v0.9.2-linux-amd64
mv immudb-v0.9.2-linux-amd64 immudb
chmod +x immudb

# run immudb in the foreground to see all output
./immudb

# or run immudb in the background
./immudb -d
```

Alternatively, you may use Docker to run immudb in a ready-to-use container:

```bash
docker run -d --net host -it --rm --name immudb codenotary/immudb:latest
```

## Creating an immudb client

### Integration

Integrate the immudb Client into your application using the official Software Development Kits (SDKs).

:::: tabs

::: tab Go

``` shell script
# Make sure your project is using Go Modules
go mod init app
# Install immudb sdk
go get -u github.com/codenotary/immudb
```

``` go
// Then import the package
import (
  "github.com/codenotary/immudb/pkg/client"
)
 ```
:::

::: tab Java
Just include immudb4j as a dependency in your project:

if using `Maven`:
```xml
    <dependency>
        <groupId>io.codenotary</groupId>
        <artifactId>immudb4j</artifactId>
        <version>0.2.0</version>
    </dependency>
```

if using `Gradle`:
```groovy
    compile 'io.codenotary:immudb4j:0.2.0'
```
[Java SDK repository](https://github.com/codenotary/immudb4j)

immudb4j is currently hosted on both [Maven Central] and [Github Packages].

[Github Packages]: https://docs.github.com/en/packages
[Maven Central]: https://search.maven.org/artifact/io.codenotary/immudb4j
:::

::: tab Python
Install the package using pip:

```shell
    pip3 install immudb-py
```

 Then import the client as follows:

```python
    from immudb import ImmudbClient
```

*Note*: immudb-py need `grpcio` module from google. On Alpine linux, you need
 these packages in order to correctly build (and install) grpcio:
 - `linux-headers`
 - `python3-dev`
 - `g++`

[Python SDK repository](https://github.com/codenotary/immudb-py)

:::

::: tab Node.js

Include the immudb-node as a dependency in your project.

```javascript
	const immudbClient = require('immudb-node')
```

[Node.js SDK repository](https://github.com/codenotary/immudb-node)

:::

::: tab .Net

Use Microsoft's [NuGet](https://www.nuget.org/packages/Immudb4DotNet/) package manager to get immudb4DotNet.


Creating a Client.

  - Using the default configuration.
	```csharp
	  var client = new CodeNotary.ImmuDb.ImmuClient("localhost"))
	```

  - The immudb implements IDisposable, so you can wrap it with "using".

	```csharp
	using (var client = new CodeNotary.ImmuDb.ImmuClient("localhost", 3322)){}
	```

 [.Net SDK repository](https://github.com/codenotary/immudb4dotnet)
:::

::: tab Others
If you're using another language, then read up on our [immugw](https://docs.immudb.io/master/immugw/) option.
:::

::::

### Connection and authentication

Immudb run on 3322 default port. Here we connecting a client with default options and
authenticating using default username and password.
It's possible to modify defaults on immudb server config folder inside `immudb.toml`
:::: tabs

::: tab Go

Login method return a token needed in all interactions with the server.

```go
client, err := c.NewImmuClient(client.DefaultOptions())
if err != nil {
    log.Fatal(err)
}
ctx := context.Background()
// login with default username and password and storing a token
lr , err := client.Login(ctx, []byte(`immudb`), []byte(`immudb`))
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
Do you want to make a feature request or help out? Open an issue on [java sdk github project](https://github.com/codenotary/immudb4j/issues/new)
:::

::: tab Python
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [java sdk github project](https://github.com/codenotary/immudb-py/issues/new)
:::

::: tab Node.js
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [java sdk github project](https://github.com/codenotary/immudb-node/issues/new)
:::

::: tab .Net
This feature is not yet supported or not documented.
Do you want to make a feature request or help out? Open an issue on [java sdk github project](https://github.com/codenotary/immudb4dotnet/issues/new)
:::

::: tab Others
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/master/immugw/) option.
:::

::::

### Tamperproof read and write


:::: tabs

You can write with built-in cryptographic verification. The client implements the mathematical validations, while your application uses a traditional read or write function.

::: tab Go
```go
    vtx, err := client.VerifiedSet(ctx, []byte(`hello`), []byte(`immutable world`))
	if  err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Set and verified key '%s' with value '%s' at tx %d\n", []byte(`hello`), []byte(`immutable world`), vtx.Id)

	ventry, err := client.VerifiedGet(ctx, []byte(`hello`))
	if  err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Sucessfully verified key '%s' with value '%s' at tx %d\n", ventry.Key, ventry.Value, ventry.Tx)
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
If you're using another development language, please read up on our [immugw](https://docs.immudb.io/master/immugw/) option.
:::

::::



### To get going quickly:
  - Get the [immudb-client-example code](https://github.com/codenotary/immudb-client-examples). `Note: Only Golang SDK is currently upgraded for immudb 0.9.0`
  - Learn about the basic coding you will use to interact with your immudb client and database. This guide goes from start to finish, in creating a new client instance, writing and reading data, and much more.
   Take a look at the [SDKs api](/master/sdks-api) page.


## Conclusion

Congratulations for completing the development quick start guide. You've been guided through the essentials you need to know to begin using CodeNotary's immudb solution.

You now have:
 - An immudb database server and are familiar with basic authentication.
 - An immudb client.
 - A new immudb database.
 - An instance of the immudb client running.
 - Gone through reading and writing data with and without cryptographic verification.

We've only scratched the surface of immudb's capabilities. Here are some additional resources you might find helpful:
- Learn more through our [documentation](https://docs.immudb.io/master/).
    - Learn more about the immudb [SDKs](https://docs.immudb.io/master/sdks-api.html#contents).
    - Try out [immuadmin](https://docs.immudb.io/master/immuadmin/)
- Follow CodeNotary's [blog](https://codenotary.io/blog) for more immudb articles and release announcements.
- Additional technical background on immudb and its performance, see the [Readme](https://github.com/codenotary/immudb/blob/master/README.md) within CodeNotary's immudb GitHub Project.
<img align="center" src="https://codenotary.io/images/word-tree.png"/>
