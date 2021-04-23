// import { log } from '@kot-shrodingera-team/germes-utils';

import { getElement, log } from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';
import setFramesReferences from './helpers/setFramesReferences';

// const efbetSportNames: Record<number, string> = {
//   1: 'FOOTBALL',
//   2: 'TENNIS',
//   4: 'BASKETBALL',
//   5: 'VOLLEY',
//   7: 'TABLETENNIS',
// };

const openEvent = async (): Promise<void> => {
  await setFramesReferences();

  const inplayIFrameDocument = window.germesData.inplayIFrame.contentDocument;
  // if (!Object.keys(efbetSportNames).includes(String(worker.SportId))) {
  //   throw new JsFailError(
  //     'Не удалось сформировать название спорта. Обратитесь в ТП'
  //   );
  // }
  // const efbetSportName = efbetSportNames[worker.SportId];
  // log(`Ищем блок спорта ${efbetSportName}`, 'steelblue');
  // const sportBlock = await getElement(
  //   `.${efbetSportName}`,
  //   5000,
  //   inplayIFrameDocument
  // );
  // if (!sportBlock) {
  //   throw new JsFailError('Не наден блок нужного спорта');
  // }
  const sportList = await getElement(
    '.sportsList',
    10000,
    inplayIFrameDocument
  );
  if (!sportList) {
    throw new JsFailError('Не наден список спортов');
  }
  await getElement(
    '.sportTbl .sportHeader[style]:not([data-ng-animate])', // пока не исчезнет аттрибут data-ng-animate заголовки могут быть не кликабельны
    5000,
    sportList
  );
  const sportTables = sportList.querySelectorAll('.sportTbl');
  if (!sportTables.length) {
    throw new JsFailError('Не надены блоки спортов');
  }
  log('Раскрываем блоки спортов', 'orange');
  sportTables.forEach((sportTable, key) => {
    const sportHeader = sportTable.querySelector<HTMLElement>('.sportHeader');
    if (!sportHeader) {
      log(`Не найден заголовок блока спорта спорта №${key}`, 'crimson');
      return;
    }
    if (sportHeader.classList.contains('collapsed')) {
      // log('Раскрываем блок спорта', 'orange');
      sportHeader.click();
      // const sportHeaderExpanded = await getElement(
      //   '.sportHeader:not(.collapsed)',
      //   5000,
      //   sportBlock
      // );
      // if (!sportHeaderExpanded) {
      //   throw new JsFailError('Блок спорта не развернулся');
      // }
    }
  });
  log('Ищем событие', 'steelblue');
  const targetEvent = await getElement<HTMLElement>(
    `[data-idfoevent="${worker.EventId}"]`,
    5000,
    sportList
  );
  if (!targetEvent) {
    throw new JsFailError('Событие не найдено');
  }
  log('Событие найдено. Переходим', 'steelblue');
  targetEvent.click();
  log('Ждём появления заголовка нужного события', 'steelblue');
  const targerEventHeader = await getElement(
    `.head .mainInfo:not(.ng-hide) [data-idfoevent="${worker.EventId}"]`,
    5000,
    inplayIFrameDocument
  );
  if (!targerEventHeader) {
    throw new JsFailError('Не дождались появления заголовка нужного события');
  }
  log('Перешли на событие', 'steelblue');
};

export default openEvent;
