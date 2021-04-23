import { getWorkerParameter, log } from '@kot-shrodingera-team/germes-utils';

const getParameter = (): number => {
  if (
    getWorkerParameter('fakeParameter') ||
    getWorkerParameter('fakeOpenStake')
  ) {
    const parameter = Number(JSON.parse(worker.ForkObj).param);
    if (Number.isNaN(parameter)) {
      return -6666;
    }
    return parameter;
  }

  const selectionNameSelector =
    '.betslip[style*="display: block;"] .nbs-selection-name';
  // const eventNameSelector = '.nbs-selection-name .event-name';
  const marketNameSelector =
    '.betslip[style*="display: block;"] .nbs-selection-name .market';

  const selectionNameElement = document.querySelector(selectionNameSelector);
  if (!selectionNameElement) {
    log('Не найдена информация о ставке в купоне', 'crimson');
    return -9999;
  }
  // const eventNameElement = document.querySelector(eventNameSelector);
  // if (!eventNameElement) {
  //   log('Не найдено событие открытой ставки', 'crimson');
  //   return -9999;
  // }
  const betNameElement = selectionNameElement.firstChild;
  if (!betNameElement) {
    log('Не найдена роспись открытой ставки', 'crimson');
    return -9999;
  }
  const marketNameElement = document.querySelector(marketNameSelector);
  if (!marketNameElement) {
    log('Не найден маркет открытой ставки', 'crimson');
    return -9999;
  }
  // const eventName = eventNameElement.textContent.trim();
  const betName = betNameElement.textContent.trim();
  const marketName = marketNameElement.textContent.trim();

  if (marketName === 'Draw No Bet') {
    return 0;
  }

  const parameterRegex = /([+-]?\d+(?:[,.]\d+)?)$/;
  const parameterMatch = betName.match(parameterRegex);
  if (parameterMatch) {
    return Number(parameterMatch[1].replace(',', '.'));
  }
  return -6666;
};

export default getParameter;
