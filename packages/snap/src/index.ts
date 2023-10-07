import { OnTransactionHandler } from '@metamask/snaps-types';
import { divider, heading, panel, text, copyable } from '@metamask/snaps-ui';
import {
  QUICK_INTEL_URL,
  QUICK_INTEL_PUBLIC_SNAP_KEY,
} from '../quickintel/constants';

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const quickIntelShield = '🛡';

  const txData = transaction?.data;

  const body = {
    chainid: chainId,
    txdata: txData,
  };

  const auditReq = await getData(body);

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
        divider(),
        text(`Contact the Quick Intel team for any questions or concerns:`),
        copyable(`https://linktr.ee/quickintel`),
      ]),
    };
  }

  if (auditReq && auditReq?.length > 0) {
    auditReq.forEach((item: any) => {
      const auditUrl = new URL('https://app.quickintel.io/scanner');
      auditUrl.searchParams.append('type', 'token');
      auditUrl.searchParams.append('chain', item?.chain);
      auditUrl.searchParams.append('contractAddress', item?.tokenAddress);

      panelArr.push(
        text(
          `Token: ${item?.tokenName} (${
            item?.tokenSymbol
          })\n\n\nCA: ${item?.tokenAddress?.slice(
            0,
            4,
          )}..${item?.tokenAddress?.slice(
            item?.tokenAddress?.length - 4,
            item?.tokenAddress?.length,
          )}\n\n\nContract Verified: ${
            item?.verified ? '✅' : '❌'
          }\n\n\nWarnings: ${item?.warnings ? item?.warnings : 'N/A'}${
            item?.warning_Details?.length > 0
              ? `\n\n\n${item?.warning_Details
                  ?.map((itm: any) => {
                    return `${itm}\n\n\n`;
                  })
                  .join('')}`
              : ''
          }\n\n\nCautions: ${item?.cautions ? item?.cautions : 'N/A'}${
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
        copyable(`${auditUrl}`),
      );
    });
  }

  if (panelArr.length === 0) {
    panelArr.push(
      text(
        `No Audit Results or chain not supported for Token Audit. Contact Quick Intel for more information.`,
      ),
      divider(),
      text(`Contact the Quick Intel team for any questions or concerns:`),
      copyable(`https://linktr.ee/quickintel`),
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
 * Request Audit.
 *
 * @param bodydata - Transaction Data.
 * @returns Array.
 */
async function getData(bodydata: object | null): Promise<any> {
  const response = await fetch(`${QUICK_INTEL_URL}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: QUICK_INTEL_PUBLIC_SNAP_KEY,
    },
    body: JSON.stringify(bodydata),
  });

  return bodydata && response?.ok ? response?.json() : null;
}
