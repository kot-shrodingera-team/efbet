import checkCouponLoadingGenerator from '@kot-shrodingera-team/germes-generators/worker_callbacks/checkCouponLoading';
import {
  log,
  getElement,
  awaiter,
  getRemainingTimeout,
  checkCouponLoadingError,
  checkCouponLoadingSuccess,
  text,
  sendTGBotMessage,
  // sleep,
} from '@kot-shrodingera-team/germes-utils';
import { StateMachine } from '@kot-shrodingera-team/germes-utils/stateMachine';
import openBet from '../show_stake/openBet';

const loaderSelector =
  '.betplacement[style*="display: block"] > [id$="waiting"][style*="display: block"]';
const confirmButtonSelector =
  '.betplacement[style*="display: block"] > [id$="confirmation-required"][style*="display: block;"] [behavior\\.id="ConfirmBetSlip"]';
const priceChangeSelector =
  '.betplacement[style*="display: block"] > [id$="confirmation-required"][style*="display: block;"] .price_change_message';
export const errorSelector =
  '.betplacement[style*="display: block"] > [id$="rejected"][style*="display: block;"] [style*="display: block;"] > .nbs-exclamation';
// const errorTextSelector = '';
const betPlacedSelector =
  '.betplacement[style*="display: block"] > [id$="placed"][style*="display: block"]';

const asyncCheck = async () => {
  const machine = new StateMachine();

  machine.promises = {
    loader: () => getElement(loaderSelector, getRemainingTimeout()),
    confirmButton: () =>
      getElement(confirmButtonSelector, getRemainingTimeout()),
    error: () => getElement(errorSelector, getRemainingTimeout()),
    betPlaced: () => getElement(betPlacedSelector, getRemainingTimeout()),
  };

  machine.setStates({
    start: {
      entry: async () => {
        log('Начало обработки ставки', 'steelblue');
      },
    },
    loader: {
      entry: async () => {
        log('Появился индикатор', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = 'индикатор';
        delete machine.promises.loader;
        machine.promises.loaderDissappeared = () =>
          awaiter(
            () => document.querySelector(loaderSelector) === null,
            getRemainingTimeout()
          );
      },
    },
    loaderDissappeared: {
      entry: async () => {
        log('Исчез индикатор', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = null;
        delete machine.promises.loaderDissappeared;
      },
    },
    confirmButton: {
      entry: async () => {
        log('Появилось сообщение об изменении коэффициента', 'steelblue');
        const priceChangeElement = document.querySelector(priceChangeSelector);
        if (!priceChangeElement) {
          log('Не найдено сообщение об изменении котировок', 'crimson');
        } else {
          const priceChangeText = text(priceChangeElement);
          log(priceChangeText, 'tomato');
        }
        window.germesData.betProcessingAdditionalInfo = null;
        if (worker.StakeAcceptRuleShoulder === 2) {
          log('Принимаем изменения', 'orange');
          machine.promises.loader = () =>
            getElement(loaderSelector, getRemainingTimeout());
          machine.data.result.click();
          return;
        }
        log('Ждём окончания ожидания', 'steelblue');
        delete machine.promises.confirmButton;
      },
    },
    error: {
      entry: async () => {
        log('Появилась ошибка', 'steelblue');
        window.germesData.betProcessingAdditionalInfo = null;
        const errorText = text(machine.data.result);
        log(errorText, 'tomato');
        if (/^Timed out/i.test(errorText)) {
          await checkCouponLoadingError({
            botMessage: 'Вышло время ожидания принятия изменения коэффициента',
            reopen: {
              openBet,
            },
          });
        } else {
          sendTGBotMessage(
            '1786981726:AAE35XkwJRsuReonfh1X2b8E7k9X4vknC_s',
            126302051,
            errorText
          );
          await checkCouponLoadingError({
            informMessage: errorText,
            reopen: {
              openBet,
            },
          });
        }
      },
      final: true,
    },
    betPlaced: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        checkCouponLoadingSuccess('Ставка принята');
      },
      final: true,
    },
    timeout: {
      entry: async () => {
        window.germesData.betProcessingAdditionalInfo = null;
        await checkCouponLoadingError({
          botMessage: 'Не дождались результата ставки',
          informMessage: 'Не дождались результата ставки',
        });
      },
      final: true,
    },
  });

  machine.start('start');

  // const testErrorElement = document.querySelector(errorSelector);
  // if (testErrorElement) {
  //   const errorText = testErrorElement.textContent
  //     .trim()
  //     .replace(/[ \t]+/g, ' ');
  //   log('[asyncCheck] Найдена ошибка ставки', 'crimson');
  //   log(errorText, 'tomato');
  //   console.log(document.querySelector('#ph-main-right').outerHTML);
  // } else {
  //   log('[asyncCheck] Нет ошибки ставки', 'steelblue');
  // }

  // await Promise.race([
  //   getElement(loaderSelector, getRemainingTimeout()),
  //   getElement(confirmButtonSelector, getRemainingTimeout()),
  //   getElement(errorSelector, getRemainingTimeout()),
  //   getElement(betPlacedSelector, getRemainingTimeout()),
  // ]);

  // const loaderElement = document.querySelector(loaderSelector);

  // if (loaderElement) {
  //   log('Появился индикатор', 'steelblue');
  //   window.germesData.betProcessingAdditionalInfo = 'индикатор';
  //   awaiter(
  //     () => {
  //       return document.querySelector(loaderSelector) === null;
  //     },
  //     getRemainingTimeout(),
  //     100
  //   ).then((loaderDissappeared) => {
  //     if (loaderDissappeared) {
  //       log('Исчез индикатор', 'steelblue');
  //       window.germesData.betProcessingAdditionalInfo = null;
  //     }
  //   });

  //   window.germesData.betProcessingStep = 'waitingForResult';
  //   await Promise.race([
  //     getElement(confirmButtonSelector, getRemainingTimeout()),
  //     getElement(errorSelector, getRemainingTimeout()),
  //     getElement(betPlacedSelector, getRemainingTimeout()),
  //   ]);
  // }

  // const confirmButton = document.querySelector<HTMLElement>(
  //   confirmButtonSelector
  // );

  // if (confirmButton) {
  //   log('Изменение котировок', 'steelblue');
  //   const priceChangeElement = document.querySelector(priceChangeSelector);
  //   if (!priceChangeElement) {
  //     log('Не найдено сообщение об изменении котировок', 'crimson');
  //   } else {
  //     const priceChangeText = priceChangeElement.textContent
  //       .trim()
  //       .replace(/[ \t]+/g, ' ');
  //     log(priceChangeText, 'tomato');
  //   }
  //   log('Принимаем изменения', 'orange');
  //   confirmButton.click();
  //   await Promise.race([
  //     getElement(errorSelector, getRemainingTimeout()),
  //     getElement(betPlacedSelector, getRemainingTimeout()),
  //   ]);
  // }

  // const errorElement = document.querySelector(errorSelector);
  // const betPlacedElement = document.querySelector(betPlacedSelector);

  // if (errorElement) {
  //   log('Появилась ошибка', 'crimson');
  //   // const errorTextElement = errorElement.querySelector(errorTextSelector);
  //   // if (!errorTextElement) {
  //   //   error('Не найден текст ошибки');
  //   // }
  //   // const errorText = errorTextElement.textContent.trim();
  //   const errorText = errorElement.textContent.trim().replace(/[ \t]+/g, ' ');
  //   log(errorText, 'tomato');
  //   worker.Helper.SendInformedMessage(errorText);
  //   return checkCouponLoadingError({
  //     reopen: {
  //       openBet,
  //     },
  //   });
  // }
  // if (betPlacedElement) {
  //   return checkCouponLoadingSuccess('Ставка принята');
  // }

  // return checkCouponLoadingError({
  //   botMessage: 'Не дождались результата ставки',
  //   informMessage: 'Не дождались результата ставки',
  // });
};

const checkCouponLoading = checkCouponLoadingGenerator({
  asyncCheck,
});

export default checkCouponLoading;
