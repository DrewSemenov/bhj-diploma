/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  selects = document.querySelectorAll('.accounts-select');
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const user = User.current();
    if (!user) return;

    Account.list(user, (err, response) => {
      if (err) return;

      this.selects.forEach(
        (select) =>
          (select.innerHTML = response.data.reduce(
            (acc, { id, name }) =>
              acc + `<option value="${id}">${name}</option>`,

            ''
          ))
      );
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (err) return;

      if (!response.success) return;

      const formName = this.element.closest('.modal').dataset.modalId;

      App.update();
      App.getModal(formName).close();
    });
  }
}

