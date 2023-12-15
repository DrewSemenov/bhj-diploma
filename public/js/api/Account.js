/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  /**
   * Получает информацию о счёте
   * */
  static get(callback, id = '') {
    return createRequest({
      url: this.URL,
      method: 'GET',
      data: {
        id,
      },
      callback,
    });
  }
}

