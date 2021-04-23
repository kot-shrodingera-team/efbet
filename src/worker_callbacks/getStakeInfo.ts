import getStakeInfoGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/getStakeInfo';
import { log } from '@kot-shrodingera-team/germes-utils';
import checkAuth from '../stake_info/checkAuth';
import getStakeCount from '../stake_info/getStakeCount';
import getBalance from '../stake_info/getBalance';
import checkStakeEnabled from '../stake_info/checkStakeEnabled';
import getCoefficient from '../stake_info/getCoefficient';
import getParameter from '../stake_info/getParameter';
import getMinimumStake from '../stake_info/getMinimumStake';
import getMaximumStake from '../stake_info/getMaximumStake';
import getCurrentSum from '../stake_info/getCurrentSum';
import showStake from '../show_stake';

const isReShowStakeNeeded = () => {
  const continueButton = document.querySelector<HTMLElement>(
    '.betplacement[style*="display: block"] > [style*="display: block"] [behavior\\.id="ContinueBetting"]'
  );
  if (continueButton) {
    log('Есть кнопка Continue. Нужно переоткрытие купона', 'crimson');
    log('Нажимаем кнопку Continue', 'orange');
    continueButton.click();
    return true;
  }
  return false;
};

// const preAction = (): void => {};

const getStakeInfo = getStakeInfoGenerator({
  reShowStake: {
    isNeeded: isReShowStakeNeeded,
    showStake,
  },
  // preAction,
  checkAuth,
  getStakeCount,
  getBalance,
  getMinimumStake,
  getMaximumStake,
  getCurrentSum,
  checkStakeEnabled,
  getCoefficient,
  getParameter,
});

export default getStakeInfo;
