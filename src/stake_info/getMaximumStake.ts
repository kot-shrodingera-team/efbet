import { getWorkerParameter } from '@kot-shrodingera-team/germes-utils';
// import getMaximumStakeGenerator, {
//   maximumStakeReadyGenerator,
// } from '@kot-shrodingera-team/germes-generators/stake_info/getMaximumStake';
import getBalance from './getBalance';

const getMaximumStake = (): number => {
  if (
    getWorkerParameter('fakeMaximumStake', 'number') ||
    getWorkerParameter('fakeAuth') ||
    getWorkerParameter('fakeOpenStake')
  ) {
    const fakeMaximumStake = getWorkerParameter(
      'fakeMaximumStake',
      'number'
    ) as number;
    if (fakeMaximumStake !== undefined) {
      return fakeMaximumStake;
    }
    return 100000;
  }
  return getBalance();
};

// const maximumStakeSelector = '';
// const maximumStakeRegex = /(\d+(?:\.\d+)?)/;
// const replaceDataArray = [
//   {
//     searchValue: '',
//     replaceValue: '',
//   },
// ];
// const removeRegex = /[\s,']/g;

// export const maximumStakeReady = maximumStakeReadyGenerator({
//   maximumStakeSelector,
//   maximumStakeRegex,
//   replaceDataArray,
//   removeRegex,
//   context: () => document,
// });

// const getMaximumStake = getMaximumStakeGenerator({
//   maximumStakeSelector,
//   maximumStakeRegex,
//   replaceDataArray,
//   removeRegex,
//   disableLog: false,
//   context: () => document,
// });

export default getMaximumStake;
