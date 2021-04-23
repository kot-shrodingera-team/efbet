import {
  getElement,
  // awaiter,
  // getElement,
  log,
  repeatingOpenBet,
} from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import getStakeCount from '../stake_info/getStakeCount';
import clearCoupon from './clearCoupon';

interface EfbetBetData {
  /**
   * eventname
   */
  orig_name: string;
  idfoselection: string;
  /**
   * selectionname
   */
  name: string;
  /**
   * currentpriceup
   */
  pu: string;
  /**
   * currentpricedown
   */
  pd: string;
  /**
   * hadvalue
   */
  hv: string;
  /**
   * selectionhashcode
   */
  shc: string;
  /**
   * marketname
   */
  mn: string;
  /**
   * idfomarket
   */
  im: string;
  /**
   * eachwayterms (eachwayplaceterms)
   */
  et: string;
  /**
   * pricetypes
   */
  prt: string;
}

// const errorSelector =
//   '.betplacement[style*="display: block"] > [id$="rejected"][style*="display: block;"] [style*="display: block;"] > .nbs-exclamation';

const openBet = async (): Promise<void> => {
  const couponCleared = await clearCoupon();
  if (!couponCleared) {
    throw new JsFailError('Не удалось очистить купон');
  }

  // Получение данных из меты
  const betData = JSON.parse(worker.BetId) as EfbetBetData;

  // Формирование данных для поиска
  // const data = {
  //   appSenderId: 'inplayAppMain',
  //   action: 'addSelection',
  //   actionParameters: {
  //     eachwayplaceterms: JSON.parse(betData.et),
  //     eachwayreduction: [] as unknown,
  //     eventname: betData.orig_name,
  //     fixedoddspricetypes: ['CP'],
  //     hadvalue: betData.hv || undefined,
  //     idfomarket: betData.im,
  //     pricetype: ['CP'],
  //     idfoselection: betData.idfoselection,
  //     istradable: true,
  //     istrapbettingoptionon: false,
  //     marketname: betData.mn,
  //     pricedown: betData.pd,
  //     priceup: betData.pu,
  //     selectionhashcode: betData.shc,
  //     selectionname: betData.name,
  //     // tsstart: '2021-03-23T04:03:00',
  //   },
  // };

  const inplayIFrame = document.querySelector<HTMLIFrameElement>(
    '#inplayAppMain'
  );
  if (!inplayIFrame) {
    throw new JsFailError('Не наден In-Play фрейм');
  }
  const inplayIFrameDocument = inplayIFrame.contentDocument;

  const betSelector = `[data-idfoselection="${betData.idfoselection}"]`;
  log(`betSelector = "${betSelector}"`, 'white', true);

  // Поиск ставки
  const bet = await getElement<HTMLElement>(
    betSelector,
    5000,
    inplayIFrameDocument
  );
  if (!bet) {
    throw new JsFailError('Ставка не найдена');
  }

  // Открытие ставки, проверка, что ставка попала в купон
  const openingAction = async () => {
    // postMessage(data, 'https://www.efbet.net');
    bet.click();
  };
  await repeatingOpenBet(openingAction, getStakeCount, 5, 1000, 50);

  const selectionNameSelector = '.nbs-selection-name';
  const selectionNameElement = document.querySelector(selectionNameSelector);

  if (!selectionNameElement) {
    throw new JsFailError('Не найдена информация о ставке в купоне');
  }

  const eventNameSelector = '.nbs-selection-name .event-name';
  const marketNameSelector = '.nbs-selection-name .market';
  const eventNameElement = document.querySelector(eventNameSelector);
  if (!eventNameElement) {
    throw new JsFailError('Не найдено событие открытой ставки');
  }
  const betNameElement = selectionNameElement.firstChild;
  if (!betNameElement) {
    throw new JsFailError('Не найдена роспись открытой ставки');
  }
  const marketNameElement = document.querySelector(marketNameSelector);
  if (!marketNameElement) {
    throw new JsFailError('Не найден маркет открытой ставки');
  }
  const eventName = eventNameElement.textContent.trim();
  const betName = betNameElement.textContent.trim();
  const marketName = marketNameElement.textContent.trim();
  log(`Открыта ставка\n${eventName}\n${marketName}\n${betName}`, 'steelblue');

  // await Promise.race([
  //   awaiter(
  //     () => {
  //       const coefficientElement = document.querySelector(
  //         '.betslip[style*="display: block;"] .nbs-odds'
  //       );
  //       if (!coefficientElement) {
  //         return false;
  //       }
  //       const coefficientText = coefficientElement.textContent.trim();
  //       return !Number.isNaN(Number(coefficientText));
  //     },
  //     10000,
  //     100
  //   ),
  //   awaiter(
  //     () => {
  //       const suspendCover = document.querySelector('.suspendCover');
  //       if (!suspendCover) {
  //         return false;
  //       }
  //       const suspended =
  //         window.getComputedStyle(suspendCover).display !== 'none';
  //       return suspended;
  //     },
  //     10000,
  //     100
  //   ),
  // ]);

  // const suspendCover = document.querySelector('.suspendCover');
  // if (suspendCover) {
  //   const suspended = window.getComputedStyle(suspendCover).display !== 'none';
  //   if (suspended) {
  //     throw new JsFailError('Ставка недоступна');
  //   }
  // }

  // const coefficientElement = document.querySelector(
  //   '.betslip[style*="display: block;"] .nbs-odds'
  // );
  // if (!coefficientElement) {
  //   throw new JsFailError('Не найден коэффициент');
  // }
  // const coefficientText = coefficientElement.textContent.trim();
  // if (Number.isNaN(Number(coefficientText))) {
  //   throw new JsFailError(
  //     `Не дождались появления коэффициента (${coefficientText})`
  //   );
  // }

  // const errorElement = document.querySelector(errorSelector);
  // if (errorElement) {
  //   const errorText = errorElement.textContent.trim().replace(/[ \t]+/g, ' ');
  //   log('[openBet] Найдена ошибка ставки', 'crimson');
  //   log(errorText, 'tomato');
  //   const errorDisappeared = await awaiter(
  //     () => {
  //       return !document.querySelector(errorSelector);
  //     },
  //     5000,
  //     100
  //   );
  //   if (!errorDisappeared) {
  //     throw new JsFailError('Ошибка не исчезла');
  //   }
  // } else {
  //   log('[openBet] Нет ошибки ставки', 'steelblue');
  // }
};

export default openBet;
