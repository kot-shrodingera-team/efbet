import { getWorkerParameter } from '@kot-shrodingera-team/germes-utils';
// import getMinimumStakeGenerator, {
//   minimumStakeReadyGenerator,
// } from '@kot-shrodingera-team/germes-generators/stake_info/getMinimumStake';

const getMinimumStake = (): number => {
  if (
    getWorkerParameter('fakeMinimumStake', 'number') ||
    getWorkerParameter('fakeAuth') ||
    getWorkerParameter('fakeOpenStake')
  ) {
    const fakeMinimumStake = getWorkerParameter(
      'fakeMinimumStake',
      'number'
    ) as number;
    if (fakeMinimumStake !== undefined) {
      return fakeMinimumStake;
    }
    return 0;
  }
  return 0.5;
};

// const minimumStakeSelector = '';
// const minimumStakeRegex = /(\d+(?:\.\d+)?)/;
// const replaceDataArray = [
//   {
//     searchValue: '',
//     replaceValue: '',
//   },
// ];
// const removeRegex = /[\s,']/g;

// export const minimumStakeReady = minimumStakeReadyGenerator({
//   minimumStakeSelector,
//   minimumStakeRegex,
//   replaceDataArray,
//   removeRegex,
//   context: () => document,
// });

// const getMinimumStake = getMinimumStakeGenerator({
//   minimumStakeSelector,
//   minimumStakeRegex,
//   replaceDataArray,
//   removeRegex,
//   disableLog: false,
//   context: () => document,
// });

export default getMinimumStake;
