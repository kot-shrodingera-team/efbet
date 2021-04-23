import clearCouponGenerator from '@kot-shrodingera-team/germes-generators/show_stake/clearCoupon';
import { log } from '@kot-shrodingera-team/germes-utils';
import getStakeCount from '../stake_info/getStakeCount';

const preCheck = async (): Promise<boolean> => {
  const continueButton = document.querySelector<HTMLElement>(
    '.betplacement[style*="display: block"] > [style*="display: block"] [behavior\\.id="ContinueBetting"]'
  );
  if (continueButton) {
    log('Нажимаем кнопку Continue', 'orange');
    continueButton.click();
  }
  return true;
};

// const apiClear = (): void => {};

// const postCheck = async (): Promise<boolean> => {
//   return true;
// };

const clearCoupon = clearCouponGenerator({
  preCheck,
  getStakeCount,
  // apiClear,
  // clearSingleSelector: '',
  clearAllSelector: '[behavior\\.id="RemoveAllSelections"]',
  // postCheck,
  // context: () => document,
});

export default clearCoupon;
