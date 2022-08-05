When metamask is not connected to the website (via ethereum.enable()), you can create a provider from `window.ethereum` via `ethers.providers.Web3Provider(window.ethereum,4)` as long as metamask is installed. 

Your provider can be connected to any network like above and if the second `networkish` paramater to `ethers.provider.Web3Provider()` is ommited, the provider is connected to metamask's currently connected network. You can also create a signer from th provider even tho metamask is not connected.

However, when you need to sign a transaction with one of metamask's providers signer, the return of `provider.getSigner()`, the operation will throw an error as you must connect metamask to the site to be able to use it's signer to sign transaction.

What is returned by contract function call e.g `await contract.register()`, is the transaction object rpresenting the transaction just as it is sent to a node's mempool. You can take this objet and send it to any node and it'll be mined. 

`await tx.wait()` will just wait for the transaction to be mined. What is returned by `await tx.wait()` is the receipt of the transaction after execution by the node. It carries all the necessary fields like `events`, `gasUsed`, etc. The return of thi s object indicates that the transaction has been mined and executed.