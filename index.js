'use strict';

require('dotenv-safe').config();

const { providers } = require('ethers');

const { SynthetixJs } = require('synthetix-js');

const provider = new providers.JsonRpcProvider('https://synth.optimism.io');

const networkId = 108;

const signer = new SynthetixJs.signers.PrivateKey(provider, networkId, process.env.PRIVATE_KEY);

const snxjs = new SynthetixJs({ signer, networkId, provider });

const { toUtf8Bytes32, formatEther, parseEther } = snxjs.utils;

(async () => {
	// Get the price of ETH
	const rateForETH = await snxjs.ExchangeRates.rateForCurrency(toUtf8Bytes32('sETH'));
	console.log(formatEther(rateForETH));

	try {
		// try exchange 1 sUSD for sETH
		const response = await snxjs.Synthetix.exchange(toUtf8Bytes32('sUSD'), parseEther('1'), toUtf8Bytes32('sETH'));

		console.log('Hash of', response.hash);

		await response.wait();

		console.log('Mined');
	} catch (err) {
		console.error(err);
	}
})();
