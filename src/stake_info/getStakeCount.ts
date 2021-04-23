import getStakeCountGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getStakeCount';

const getStakeCount = getStakeCountGenerator({
  stakeSelector: '.betslip[style*="display: block;"] .nbs-selection',
  // context: () => document,
});

export default getStakeCount;
