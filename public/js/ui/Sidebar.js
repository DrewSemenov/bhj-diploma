/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarMini = document.querySelector('.sidebar-mini');
    const buttonMenuToggle = document.querySelector('.sidebar-toggle');

    buttonMenuToggle.addEventListener('click', (evt) => {
      evt.preventDefault();

      ['sidebar-open', 'sidebar-collapse'].forEach((className) =>
        sidebarMini.classList.toggle(className)
      );
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регистрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const sidebarMenu = document.querySelector('.sidebar-menu');

    sidebarMenu.addEventListener('click', (evt) => {
      const button = evt.target.closest('li.menu-item');
      if (!button) return;

      evt.preventDefault();

      const buttonName = [...button.classList]
        .filter((className) => className.match('_'))[0]
        .split('_')[1];

      if (buttonName !== 'logout') {
        App.getModal(buttonName).open();
      }

      if (buttonName === 'logout') {
        User.logout((err, response) => {
          if (response.success) {
            App.setState('init');
          }
        });
      }
    });
  }
}

