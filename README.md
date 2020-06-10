# Proof-of-Time Machine

Marcel Ebert | Moritz Nicolas Bender | Paul Philip Voelker | Zaeem Athar

## Project setup

### Prerequisites

1. Install `truffle` globally (`npm install -g truffle`)
2. Install `Ganache`

### Run the project

1. Open a `Ganache` workspace and make sure that the `RPC Server` address is set to `HTTP://127.0.0.1:7545`
2. Compile the contracts (`truffle compile`)
3. Migrate the contracts (`truffle migrate`)
4. Navigate to the client directory (`cd app`)
5. Start the development server (`npm run start`)
6. Make sure that the Ethereum network of your browser is pointing to the same RPC URL as your `Ganache` workspace (`HTTP://127.0.0.1:7545`)

---

## General idea

Our idea is to build a platform that allows to store intellectual property in form of documents in a decentralized way and enables the user to prove ownership and creation time of these documents.

We are aiming for a decentralized timestamping application that uses a blockchain and IPFS to timestamp and store documents. The application allows the user to upload a document, stores the signed hash of the document to the blockchain and add the document to IPFS. A claim of ownership of a document can be verified by the user, using the block id to prove the ownership at a specific point in time and the IPFS to prove that he actually has the document.

This might be useful in different contexts. For example to prove that you had an idea for a patent before someone else or to prove that you are the author/creator of an image.

## Use cases

You could create verifiable timestamps of your documents:

1. With only uploading a signed hash of your document to the blockchain
2. With uploading a signed hash of your document to the blockchain and uploading it to the IPFS network so everybody can access it
3. With uploading a signed hash of your document to the blockchain and uploading an encrypted version of your file to the IPFS network (encrypted with your public key so that you can decrypt it with your private key) so that you can proof ownership without storing the file itself anymore (e.g. in order to prove your ownership in 10 years you don't have to keep the file on your hard-drive but keeping your key pair will suffice)

## Approach

The DApp is based on the Ethereum blockchain which is used to store the signed hashes because the blockchain assures the immutability and validity of the timestamp.

Furthermore since storing large files on a blockchain is generally a bad idea the InterPlanetary File System (IPFS) is used as a decentralized and secure file storage. IPFS is "a protocol and peer-to-peer network for storing and sharing data in a distributed file system" (source: [Wikipedia](https://en.wikipedia.org/wiki/InterPlanetary_File_System)).

In order to prepare the proof that you are the creator of a document using the platform you would:

1. import the document you want to secure into the application
2. have access to a keypair with some ETH (needed for executing the function of the smart contract)
3. either
   - sign the hash of the document (the application hashes the document)
   - the application submits the file to IPFS and signs the returned CID
4. the application will then create a new transaction which contains your signed hash and submit it to the blockchain
5. the application will save the ID of the block that contains the hash to some kind of local storage.

To prove that you are in fact the creator of a document (with using IPFS) you would have to:

1. provide the third-party that wants to validate your claim with your public key and the block identifier which contains the IPFS ID for the document
2. the third-party restores the original hash that is contained in the block by using the provided public key
3. the third-party can retrieve the document from the IPFS
4. if it's available then the file that you retrieved is guaranteed to be the same as when the timestamp was created by the way of how IPFS works
5. if it's not available the claim is invalid

To prove (without IPFS):

1. provide the third-party that wants to validate your claim with your public key, the document and the block identifier which contains the signed hash of the document
2. the third-party restores the original hash that is contained in the block by using the provided public key
3. the third-party hashes the provided document
4. compare both hashes and if they match the claim is valid

## Challenges / Solutions

### Trust issues

There exist many traditional third party timestamping applications that provide privacy and storage, but the problem with these is that we have to blindly trust them. The third party application could easily change the timestamp without our knowledge.

In order to overcome this issue we make use of blockchain. Blockchains are immutable, once a transaction is added to the blockchain it can not be changed. This addresses the trust issues we have.

### Decentralized file storage

Blockchains are decentralized, but are poor at storing large amounts of data. Once new data is added to the block thousands of nodes work together to verify the block. Since the block needs to be verified by thousands of nodes this limits the amount of new data that can be processed in a block.

To overcome the storage limitations of blockchains and to guarantee that the user has a way to retrieve his data, we make use of IPFS. By combining blockchains and IPFS we can timestamp large amounts of data and retrieve it at a later point in time.

#### IPFS usage explained

The IPFS protocol allows us to store data and retrieve it at a later time with the guarantee that the data was not tampered with.

##### Document Upload:

1.  The application adds the document to IPFS.
2.  IPFS returns a hash that is unique to the document uploaded. If the same document is uploaded again, the same hash will be returned.

##### Document Retrieval:

1.  The hash returned during the upload step is provided back to the IPFS protocol.
2.  The document mapped to the hash is returned. As the hash is unique to the document, this guarantees the validy of the document.

### Decentralized identity service

One of the issues that arises with using asymmetric cryptography is how do we guarantee that the public key belongs to a specific person and not someone else.

A decentralized identity service helps us solve this issue by allowing every public key to have its own address called a decentalized identifier(DID). The DID is stored on the public ledger along with other documents that map the address to user. The [Sovrin network](https://sovrin.org/) is an example of a decentralized identity service.

Given the limited timeframe incorporating a decentralized identity service seems hardly possible and we put it out of the scope of the project for now.

## Milestones

1. Complete research on how IPFS work/ Smart-Contracts in Ethereum
2. Setup the project
   - Setup a test-blockchain with Ganache
   - Setup IPFS functionalities
   - Setup connection between frontend and Ethereum wallet
   - Create basic front-end application with JavaScript using the Truffle Suite / Drizzle
3. Implement the Smart-Contract (in Solidity) for storing the signed hash
4. Create user-interface that covers the flow described in the approach
5. Integrate the Smart-Contract into the application
6. (maybe) Add functionalities to verify a claim
   - inputs for public key + blockID -> execute proof
   - inputs for public key + blockID + document -> execute proof
7. Test implementation
