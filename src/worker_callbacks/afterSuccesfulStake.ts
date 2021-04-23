import getCoefficientGenerator from '@kot-shrodingera-team/germes-generators/stake_info/getCoefficient';
import { log } from '@kot-shrodingera-team/germes-utils';
// import getCoefficient from '../stake_info/getCoefficient';

const getResultCoefficientText = (): string => {
  const infoTooltipElement = document.querySelector(
    '.betplacement[style*="display: block"] > [id$="placed"][style*="display: block"] .info_tooltip > span'
  );
  if (!infoTooltipElement) {
    log('Не найдена информация о принятой ставке', 'crimson');
    return null;
  }
  const infoTooltip = infoTooltipElement.textContent.trim();
  const resultCoefficientRegex = /@(\d+(?:\.\d+)?)$/;
  const resultCoefficientMatch = infoTooltip.match(resultCoefficientRegex);
  if (!resultCoefficientMatch) {
    log(
      `Не удалось получить коэффициент из результата: "${infoTooltip}"`,
      'crimson'
    );
    return null;
  }
  return resultCoefficientMatch[1];
};

const getResultCoefficient = getCoefficientGenerator({
  coefficientSelector: '',
  getCoefficientText: getResultCoefficientText,
  // replaceDataArray: [
  //   {
  //     searchValue: '',
  //     replaceValue: '',
  //   },
  // ],
  // removeRegex: /[\s,']/g,
  // coefficientRegex: /(\d+(?:\.\d+)?)/,
  // context: () => document,
});

// const getResultCoefficient = getCoefficient;

const afterSuccesfulStake = (): void => {
  log('Обновление итогового коэффициента', 'steelblue');
  const resultCoefficient = getResultCoefficient();
  if (resultCoefficient && resultCoefficient !== worker.StakeInfo.Coef) {
    log(
      `Коеффициент изменился: ${worker.StakeInfo.Coef} => ${resultCoefficient}`,
      'orange'
    );
    worker.StakeInfo.Coef = resultCoefficient;
    return;
  }
  log('Коеффициент не изменился', 'lightblue');
};

export default afterSuccesfulStake;
