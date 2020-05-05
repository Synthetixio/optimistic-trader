# Optimistic Trader

1. Clone this repo
1. Create a `.env` file with `PRIVATE_KEY=` followed by your private key (include the `0x`)
1. Tinker with the code
1. Run with `npm start`

## Extracting your private key from the site

For your private key, use the `Export Account` button to copy your URL.

![image](https://user-images.githubusercontent.com/799038/81026229-5d751d80-8e47-11ea-87fe-b22d07988f0f.png)

Take this URL, and use it below to see your private key locally

```javascript
const exportLink = 'PASTE YOUR EXPORT ACCOUNT HERE';
console.log(
	'Private key is',
	ethers.Wallet.fromMnemonic(exportLink.match(/\?account=(.+)$/)[1].replace(/-/g, ' ')).privateKey,
);
```
