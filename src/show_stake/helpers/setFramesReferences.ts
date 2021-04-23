import { awaiter, getElement, log } from '@kot-shrodingera-team/germes-utils';
import { JsFailError } from '@kot-shrodingera-team/germes-utils/errors';

const setFramesReferences = async (): Promise<void> => {
  window.germesData.inplayIFrame = await getElement<HTMLIFrameElement>(
    '#inplayAppMain[style]' // пока не появится аттрибут style, элемент может пересоздаться
  );
  if (!window.germesData.inplayIFrame) {
    throw new JsFailError('Не наден In-Play фрейм');
  }
  if (
    window.germesData.inplayIFrame.contentWindow.location.href === 'about:blank'
  ) {
    log('Ждём появления документа In-Play фрейма', 'steelblue');
    const result = await awaiter(
      () => {
        return (
          window.germesData.inplayIFrame.contentWindow.location.href !==
          'about:blank'
        );
      },
      10000,
      50
    );
    if (!result) {
      throw new JsFailError('Не дождались появления документа In-Play фрейма');
    }
    log('Появился документ In-Play фрейма', 'steelblue');
  } else {
    log('Уже есть документ In-Play фрейма', 'steelblue');
  }
  const document = await awaiter(() => {
    if (
      window.germesData.inplayIFrame.contentDocument &&
      window.germesData.inplayIFrame.contentDocument.body
    ) {
      return window.germesData.inplayIFrame.contentDocument;
    }
    return null;
  });
  if (!document) {
    throw new JsFailError('Документ In-Play фрейма пуст');
  }
};

export default setFramesReferences;
