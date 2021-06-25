
# SQL Reference

### Data types

<CustomList class="no-horizontal-padding">

* INTEGER
* BOOLEAN
* VARCHAR
* BLOB
* TIMESTAMP

</CustomList>

<WrappedSection>

### Creating tables

```
CREATE TABLE IF NOT EXISTS customers (id INTEGER, customer_name VARCHAR, email VARCHAR, address VARCHAR, city VARCHAR, ip VARCHAR, country VARCHAR, age INTEGER, active BOOLEAN, PRIMARY KEY id);
CREATE TABLE IF NOT EXISTS products (id INTEGER, product VARCHAR, price VARCHAR, PRIMARY KEY id);
CREATE TABLE IF NOT EXISTS orders (id INTEGER, customerid INTEGER, productid INTEGER, PRIMARY KEY id);
```

### Indexes

```
CREATE INDEX ON customers(customer_name);
```

### Inserting or updating data

```
INSERT INTO customers (id, customer_name, email, address, city, ip, country, age, active) values (1, 'Isidro Behnen', 'ibehnen0@mail.ru', 'ibehnen0@chronoengine.com', 'Arvika', '2.124.67.107', 'SE', 24, true);
INSERT INTO products (id, product, price) values (1, 'Juice - V8, Tomato', '$4.04');
```

`UPSERT` will update the value if a row with the same primary key already exists:

```
UPSERT INTO customers (id, customer_name, email, address, city, ip, country, age, active) values (1, 'Isidro Behnen', 'ibehnen0@mail.ru', 'ibehnen0@chronoengine.com', 'Arvika', '2.124.67.108', 'SE', 24, true);
UPSERT INTO customers (id, customer_name, email, address, city, ip, country) values (2, 'Claudianus Boldt', 'cboldt1@adobe.com', 'cboldt1@elpais.com', 'Kimhae', '125.89.31.130', 'KR');
UPSERT INTO products (id, product, price) values (2, 'Grapes - Red', '$5.03');
UPSERT INTO orders (id, customerID, productID) values (1, 1, 2);
```

### Querying

```
SELECT id, customer_name, ip FROM customers;
SELECT id, customer_name, email FROM customers WHERE country = 'SE' AND city = 'Arvika';
SELECT id, customer_name FROM customers ORDER BY customer_name ASC;
SELECT COUNT() FROM orders INNER JOIN customers ON orders.productid = customers.id;
SELECT COUNT() FROM orders INNER JOIN customers ON orders.productid = customers.id WHERE orders.productid = 2;
SELECT * FROM customers GROUP BY country;
SELECT product FROM products WHERE product LIKE 'J';
SELECT id, product FROM products WHERE (id > 0 AND NOT products.id >= 10) AND (products.product LIKE 'J');
```

### Parameters

```
SELECT c.id, c.customer_name AS name, active FROM (customers AS c) WHERE id <= 3 AND active = true;
```

### Aggregations

<CustomList class="no-horizontal-padding" inverse size="small">

* COUNT
* SUM
* MAX
* MIN
* AVG

</CustomList>

```
SELECT COUNT() AS c, SUM(age), MIN(age), MAX(age), AVG(age) FROM customers;
SELECT active, COUNT() as c, MIN(age), MAX(age) FROM customers GROUP BY active HAVING COUNT() > 0 ORDER BY active DESC;
SELECT active, COUNT() as c, MIN(age), MAX(age) FROM customers GROUP BY active HAVING COUNT() > 0 ORDER BY customer_name DESC;
```

### Transactions

```
BEGIN TRANSACTION; UPSERT INTO customers (id, age) VALUES (1, 25); UPSERT INTO products (id, price) VALUES (2, '$5.76'); COMMIT;
```

### Time travel

Time travel could be achieved in two ways 

##### by adding the 'BEFORE TX <TX_ID>' within the table name

```
# latest data
SELECT id, customer_name, ip as name FROM customers;

# past data
SELECT id, customer_name, ip FROM (customers BEFORE TX 5);
```

##### or using the 'USE SNAPSHOT BEFORE TX <TX_ID>' command that will influence all the following commands

```
# latest data
SELECT id, customer_name as name FROM customers;

# past data
USE SNAPSHOT BEFORE TX 5;
SELECT id, customer_name, ip FROM customers;
```

After using the 'USE SNAPSHOT BEFORE TX <TX_ID>' command,
it's then possible to reset to the latest with

```
USE SNAPSHOT BEFORE TX <LATEST_TX_ID>;
```

</WrappedSection>
