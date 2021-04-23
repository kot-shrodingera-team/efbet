import doStakeGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/doStake';
// import { log } from '@kot-shrodingera-team/germes-utils';
import getCoefficient from '../stake_info/getCoefficient';

// const errorSelector =
//   '.betplacement[style*="display: block"] > [id$="rejected"][style*="display: block;"] [style*="display: block;"] > .nbs-exclamation';

// const preCheck = (): boolean => {
//   // const errorElement = document.querySelector(errorSelector);
//   // if (errorElement) {
//   //   const errorText = errorElement.textContent.trim().replace(/[ \t]+/g, ' ');
//   //   log('[doStake] Найдена ошибка ставки', 'crimson');
//   //   log(errorText, 'tomato');
//   //   return false;
//   // }
//   // log('[doStake] Нет ошибки ставки', 'steelblue');
//   // console.log(document.querySelector('#ph-main-right').outerHTML);

//   return true;
// };

// const postCheck = (): boolean => {
//   return true;
// };

const doStake = doStakeGenerator({
  // preCheck,
  doStakeButtonSelector: '[behavior\\.id="PlaceBet"]',
  // errorClasses: [
  //   {
  //     className: '',
  //     message: '',
  //   },
  // ],
  // disabledCheck: false,
  getCoefficient,
  // postCheck,
  // context: () => document,
});

export default doStake;
