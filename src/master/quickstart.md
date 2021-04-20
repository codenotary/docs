# User Quickstart with immudb and immuclient

::: tip
To learn interactively and to get started with immudb from the command line and with programming languages, visit the immudb Playground at <https://play.codenotary.com>
:::

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

## Connecting with immuclient

You may download the immuclient binary from [the latest releases on Github](https://github.com/codenotary/immudb/releases/latest). Once you have downloaded immuclient, rename it to `immuclient`, make sure to mark it as executable, then run it. The following example shows how to obtain v0.9.2 for linux amd64:

```bash
wget https://github.com/vchain-us/immudb/releases/download/v0.9.2/immuclient-v0.9.2-linux-amd64
mv immuclient-v0.9.2-linux-amd64 immuclient
chmod +x immuclient

# start the interactive shell
./immuclient
```

Alternatively, you may use Docker to run immuclient in a ready-to-use container:

```bash
docker run -it --rm --net host --name immuclient codenotary/immuclient:latest
```

## Basic operations with immuclient

Before any operations can be run by immuclient, it is necessary to authenticate against the running immudb server.

When immudb is first run, it is ready to use immediately with the default database and credentials:

- Database name: defaultdb
- User: immudb
- Password: immudb
- Port: 3322

Running `login immudb` from within immuclient will use the default database name and port. All you need to supply is the user and password:

```
immuclient> login immudb
Password: immudb
```

While immudb supports `set` and `get` for key-value storing and retrieving, its immutability means that we can verify the integrity of the underlying Merkle tree. To do this, we use the `safeset` and `safeget` commands. Let's try setting a value of `100` for the key `balance`:

```
immuclient> safeset balance 100
```

Then, we can immediately overwrite the key `balance` with a value of `9001` instead:

```
immuclient> safeset balance 9001
```

If we try to retrieve the current value of key `balance`, we should get `9001`:

```
immuclient> safeget balance
```

Note that at each step so far, the `verified` flag is set to true. This ensures that the Merkle tree remains consistent for each transaction.

We can show the history of transactions for key `balance` using the `history` command:

```
immuclient> history balance
```