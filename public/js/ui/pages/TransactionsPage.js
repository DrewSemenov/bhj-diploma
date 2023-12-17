/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  buttonRemoveAccount = document.querySelector('.remove-account');
  content = document.querySelector('.content');
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Передан пустой элемент');
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render();
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.buttonRemoveAccount.addEventListener('click', () =>
      this.removeAccount()
    );

    this.content.addEventListener('click', (evt) => {
      const buttonTransactionRemove = evt.target.closest(
        '.transaction__remove'
      );

      if (!buttonTransactionRemove) return;

      this.removeTransaction(buttonTransactionRemove.dataset.id);
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диалоговое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) return;
    if (!confirm('Вы действительно хотите удалить счет?')) return;

    const id = this.lastOptions.account_id;

    Account.remove({ id }, (err, response) => {
      if (err) return;
      if (response.success) {
        App.update();
        this.renderTransactions([]);
      }
      this.clear();
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждения действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (id.length && !confirm('Вы действительно хотите удалить транзакцию?'))
      return;

    Transaction.remove({ id }, (err, response) => {
      if (err) return;
      if (response.success) {
        App.update();
      }
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options = this.lastOptions) {
    if (!options) return;

    this.lastOptions = options;
    Account.get(options.account_id, (err, response) => {
      if (err) return;

      const data = response.data.filter(
        (item) => item.id === options.account_id
      )[0];

      if (!data) return;

      this.renderTitle(data.name);

      Transaction.list(
        { ...data, account_id: options.account_id },
        (err, response) => {
          if (err) return;
          if (response.success) {
            this.renderTransactions(response.data);
          }
        }
      );
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.removeTransaction([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    document.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    return `${new Date(date).toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} в
    ${new Date(date).toLocaleString('ru', {
      hour: 'numeric',
      minute: 'numeric',
    })}
    `;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML({ id, type, sum, name, created_at }) {
    return `
    <div class="transaction transaction_${type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${name}</h4>
          <div class="transaction__date">${this.formatDate(created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">${sum}<span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    this.content.innerHTML = !data.length
      ? ''
      : data.reduce((acc, item) => acc + this.getTransactionHTML(item), '');
  }
}

