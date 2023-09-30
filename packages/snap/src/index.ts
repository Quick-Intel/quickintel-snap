import { OnTransactionHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text, copyable } from '@metamask/snaps-ui';
import { QUICK_INTEL_URL, QUICK_INTEL_KEY } from '../quickintel/constants';

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  const quickIntelShield = '🛡';

  const chainId = await ethereum.request({ method: 'eth_chainId' });

  const txData = transaction?.data;

  const body = {
    chainid: chainId,
    txdata: txData?.toString(),
  };

  const auditReq = await getData(body);
  console.log('sending tkns', txData, transaction?.data);
  const panelArr: any = [];
  // Display Token Audit details.
  if (
    (typeof transaction.data === 'string' && transaction.data === '0x') ||
    txData === undefined
  ) {
    return {
      content: panel([
        heading(`${quickIntelShield} Quick Intel Audit`),
        text(
          'This snap only provides transaction insights for tokens when interacting with contracts (ie. DEX Swaps.)',
        ),
      ]),
    };
  }

  if (auditReq?.length > 0) {
    auditReq.forEach((item: any) => {
      panelArr.push(
        text(
          `Token: ${item?.tokenName} (${
            item?.tokenSymbol
          })\n\n\nContract Verified: ${
            item?.verified ? '✅' : '❌'
          }\n\n\nWarnings: ${item?.warnings}${
            item?.warning_Details?.length > 0
              ? `\n\n\n${item?.warning_Details
                  ?.map((itm: any) => {
                    return `${itm}\n\n\n`;
                  })
                  .join('')}`
              : ''
          }\n\n\nCautions: ${item?.cautions}${
            item?.caution_Details?.length > 0
              ? `\n\n\n${item?.caution_Details
                  ?.map((itm: any) => {
                    return `${itm}\n\n\n`;
                  })
                  .join('')}`
              : ''
          }`,
        ),
        divider(),
        text(`View Full Audit on Quick Intel:`),
        copyable(
          `https://app.quickintel.io/scanner?type=token&chain=${item?.chain}&contractAddress=${item?.tokenAddress}`,
        ),
      );
    });
  } else {
    throw new Error(
      `No Audit Results or chain not supported for Token Audit. Contact Quick Intel for more information.`,
    );
  }

  if (panelArr.length === 0) {
    panelArr.push(
      text(
        `No Audit Results or chain not supported for Token Audit. Contact Quick Intel for more information.`,
      ),
    );
  }

  return {
    content: panel([
      heading(`${quickIntelShield} Quick Intel Token Audit`),
      ...panelArr,
    ]),
  };
};

/**
 * Request Audit
 *
 * @param bodydata - Transaction Data
 * @returns Array.
 */
async function getData(bodydata: object | null): Promise<any> {
  console.log('tst', QUICK_INTEL_KEY, QUICK_INTEL_URL);
  const response = await fetch(
    `${QUICK_INTEL_URL}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        api_key: QUICK_INTEL_KEY,
      },
      body: JSON.stringify(bodydata),
    },
  );
  return response?.json();
}
