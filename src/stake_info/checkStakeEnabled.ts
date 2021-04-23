import checkStakeEnabledGenerator from '@kot-shrodingera-team/germes-generators/stake_info/checkStakeEnabled';
import { log } from '@kot-shrodingera-team/germes-utils';
import getStakeCount from './getStakeCount';

const preCheck = (): boolean => {
  const suspendCover = document.querySelector('.suspendCover');
  if (!suspendCover) {
    return true;
  }
  const suspended = window.getComputedStyle(suspendCover).display !== 'none';
  if (suspended) {
    log('Ставка недоступна', 'crimson');
    return false;
  }
  return true;
};

const checkStakeEnabled = checkStakeEnabledGenerator({
  preCheck,
  getStakeCount,
  betCheck: {
    selector: '.betslip[style*="display: block;"] .nbs-selection',
    // errorClasses: [
    //   {
    //     className: '',
    //     message: '',
    //   },
    // ],
  },
  // errorsCheck: [
  //   {
  //     selector: '',
  //     message: '',
  //   },
  // ],
  // context: () => document,
});

export default checkStakeEnabled;
