# immudb explained

## What is immudb?

immudb is a key-value database with built-in cryptographic proof and verification. It can track changes in sensitive data and the integrity of the history will be protected by the clients, without the need to trust the server.

immudb is a non-relational, NoSQL database. Data is a collection of key-values pairs with timestamps and hashes. You can add new transactions, but deletion or modification of older transactions isn’t allowed, thus making your data immutable. When a key record's value changes over time (such as a bank balance), you can get multiple instances with different timestamps to give you the complete history of that record's changes. You can store a variety of common data types, verification checksums, or JSON.

## What makes immudb special?

<FeatureTable/>

- **Keep track of changes and audit them.** Traditional database transactions and logs are hard to scale and are mutable, so there is no way to know for sure if your data has been compromised. immudb is immutable. You can add new versions of existing records, but never change or delete records. This lets you store critical data without fear of it being changed silently.

- **Verify your data without sacrificing performance.** Data stored in immudb is cryptographically coherent and verifiable, just like blockchains, but without all the complexity. Unlike blockchains, immudb can handle millions of transactions per second, and can be used both as a lightweight service or embedded in your application as a library.

- **Protect yourself from supply-chain attacks.** While Cyber Security is an important part of your organization’s business plan, immudb provides another layer of security to ensure data integrity even in the event your perimeter is breached during an attack. Data cannot be deleted or modified once stored into immudb. Additions of new data are logged and auditable, enabling you to view any suspect additions made during the intrusion.

## How can I use immudb?

Depending on your use case, immudb might function as your application's primary or as a secondary database. As a secondary, complimentary database, use immudb to cross-check the integrity of your important data (by verifying checksums or comparing stored data values). A secondary database enables you to quickly use immudb without completely re-engineering your existing application.

Use cases:
  - Integration with your DevOps ensures code security throughout the development and deployment process. Embed immudb into your [Azure DevOps](https://codenotary.io/blog/securing-your-azure-devops-ecosystem-jenkins-and-kubernetes-aks/) with Jenkins and Kubernetes. Use just [Jenkins](https://codenotary.io/blog/jenkins-build-deployment-pipeline-a-how-to-for-ensuring-integrity/). Alternatively, integrate with [GitLab](https://codenotary.io/blog/fully-trusted-gitlab-pipeline/) or [GitHub](https://codenotary.io/blog/use-github-actions-for-validated-builds/).

  - Guarantee [File Integrity](https://codenotary.io/blog/file-integrity-monitoring-change-management/) of your critical data. Examples include storing your organization's sensitive financial, credit card transactional, invoices, contracts, educational transcripts, and other important data.

  - Ensure integrity of your legal [Documents and Invoices](https://codenotary.io/blog/immutably-store-or-guarantee-the-immutability-of-documents-and-invoices-for-compliance-reasons/), contracts, forms, and your downloads and emails.

  - Save your Internet of Things (IoT) sensor data as a failsafe plan for loss of data.

  - Keep your investment guidelines or stock market data tamperproof for your investment bank or client financial portfolios.

  - Store important log files to keep them tamperproof to meet regulations like PCI compliance.

  - Protect medical data, test results, or recipes from alteration.

  - Companies use immudb to protect credit card transactions and to secure processes by storing digital certificates and checksums.

