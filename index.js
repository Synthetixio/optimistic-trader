'use strict';

require('dotenv-safe').config();

const {
	providers,
	utils: { defaultAbiCoder, parseBytes32String },
} = require('ethers');

const { SynthetixJs } = require('synthetix-js');

const provider = new providers.JsonRpcProvider('https://synth.optimism.io');

const networkId = 108;

const signer = new SynthetixJs.signers.PrivateKey(provider, networkId, process.env.PRIVATE_KEY);

const snxjs = new SynthetixJs({ signer, networkId, provider });

const { toUtf8Bytes32, formatEther, parseEther } = snxjs.utils;

(async () => {
	// Subscribe to rate updates
	snxjs.ExchangeRates.contract.provider.on(snxjs.ExchangeRates.contract.filters.RatesUpdated(), res => {
		const types = snxjs.ExchangeRates.contract.interface.abi
			.find(({ name }) => name === 'RatesUpdated')
			.inputs.map(({ type }) => type);

		const [keys, rates] = defaultAbiCoder.decode(types, res.data);

		for (const [i, key] of Object.entries(keys)) {
			console.log(parseBytes32String(key), formatEther(rates[i]));
		}
	});

	// try exchange 1 sUSD for sETH
	try {
		const response = await snxjs.Synthetix.exchange(toUtf8Bytes32('sUSD'), parseEther('1'), toUtf8Bytes32('sETH'));

		console.log('Hash of', response.hash);

		await response.wait();

		console.log('Mined');
	} catch (err) {
		console.error(err);
	}
})();
