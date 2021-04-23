import {
  checkBookerHost,
  getElement,
  log,
} from '@kot-shrodingera-team/germes-utils';
import {
  NewUrlError,
  JsFailError,
} from '@kot-shrodingera-team/germes-utils/errors';
import checkAuth, { authStateReady } from '../stake_info/checkAuth';
import { balanceReady, updateBalance } from '../stake_info/getBalance';

const preOpenEvent = async (): Promise<void> => {
  if (!checkBookerHost()) {
    log('Открыта не страница конторы (или зеркала)', 'crimson');
    window.location.href = new URL(worker.BookmakerMainUrl).href;
    throw new NewUrlError('Открываем страницу БК');
  }

  await authStateReady();
  worker.Islogin = checkAuth();
  worker.JSLogined();
  if (!worker.Islogin) {
    throw new JsFailError('Нет авторизации');
  }
  log('Есть авторизация', 'steelblue');
  await balanceReady();
  updateBalance();

  const inPlayButton = await getElement('[action="inplay"]');
  if (!inPlayButton) {
    throw new JsFailError('Не найдена кнопка In-Play');
  }
  if (!inPlayButton.classList.contains('cur')) {
    log('Открыт не In-Play', 'crimson');
    const inPlayButtonLink = inPlayButton.querySelector<HTMLElement>('a');
    if (!inPlayButton) {
      throw new JsFailError('Не найдена ссылка дя перехода в In-Play');
    }
    inPlayButtonLink.click();
    throw new NewUrlError('Переходим на In-Play');
  }
};

export default preOpenEvent;
