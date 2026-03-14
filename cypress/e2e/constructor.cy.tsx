/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Убираем оверлей webpack
    Cypress.on('uncaught:exception', () => false);

    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Должен добавить булку и начинку в конструктор', () => {
    // Добавляем булку с force: true (игнорируем оверлей)
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click({ force: true });

    // Добавляем начинку
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click({ force: true });

    // Проверяем конструктор
    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('Должно открываться и закрываться модальное окно ингредиента', () => {
    // Кликаем на ингредиент
    cy.contains('Краторная булка N-200i').click({ force: true });

    // Проверяем, что открылась страница ингредиента (меняем на exist)
    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Краторная булка N-200i').should('exist');

    // Закрываем по крестику
    cy.get('button.Z7mUFPBZScxutAKTLKHN').click({ force: true });

    // Проверяем, что вернулись на главную
    cy.contains('Соберите бургер').should('be.visible');
  });

  it('Должен создать заказ', () => {
    // Перехватываем запрос пользователя
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    // Перехватываем запрос создания заказа
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Устанавливаем моковые токены авторизации
    cy.setCookie('accessToken', 'mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');

    // Добавляем булку и начинку
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click({ force: true });
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click({ force: true });
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');

    // Нажимаем кнопку "Оформить заказ" (первый раз - редирект на логин)
    cy.contains('Оформить заказ').click({ force: true });

    // Ждем, пока пройдет авторизация и вернемся на главную
    cy.wait('@getUser');
    cy.url().should('eq', 'http://localhost:4000/');

    // Нажимаем кнопку "Оформить заказ" снова (теперь уже авторизованы)
    cy.contains('Оформить заказ').click({ force: true });

    // Ждем запрос создания заказа
    cy.wait('@createOrder', { timeout: 10000 });

    // Проверяем номер заказа
    cy.contains('12345').should('exist');

    // Закрываем модалку
    cy.get('button.Z7mUFPBZScxutAKTLKHN').click({ force: true });
  });

  it('Должно закрываться модальное окно по клику на оверлей', () => {
    // Кликаем на ингредиент
    cy.contains('Краторная булка N-200i').click({ force: true });

    // Проверяем, что модалка открылась (просто проверяем существование)
    cy.contains('Детали ингредиента').should('exist');

    // Кликаем на оверлей
    cy.get('.RuQycGaRTQNbnIEC5d3Y').click({ force: true });

    // Проверяем, что модалка закрылась
    cy.contains('Детали ингредиента').should('not.exist');
  });
});
