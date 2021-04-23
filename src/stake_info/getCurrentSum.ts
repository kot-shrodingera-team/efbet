import getCurrentSumGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getCurrentSum';

export const sumInputSelector =
  '.betslip[style*="display: block;"] input.bsstake';

const getCurrentSum = getCurrentSumGenerator({
  sumInputSelector,
  zeroValues: ['NaN'],
  // replaceDataArray: [
  //   {
  //     searchValue: '',
  //     replaceValue: '',
  //   },
  // ],
  // removeRegex: /[\s,']/g,
  // currentSumRegex: /(\d+(?:\.\d+)?)/,
  // context: () => document,
});

export default getCurrentSum;
