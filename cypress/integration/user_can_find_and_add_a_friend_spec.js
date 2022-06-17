describe("Likes", () => {
  it("can like posts and view the number of likes", () => {
    // Bob signs up
    cy.visit("/users/new");
    cy.get("#name").type("Bob");
    cy.get("#email").type("bob@example.com");
    cy.get("#password").type("password");
    cy.get("#signup-button").click();

    // Bob signs in
    cy.get("#email").type("bob@example.com");
    cy.get("#password").type("password");
    cy.get("#login").click();

    // Bob signs out 
    cy.get("#logout").click();

    // Tina signs up
    cy.visit("/users/new");
    cy.get("#name").type("Tina");
    cy.get("#email").type("tina@example.com");
    cy.get("#password").type("password2");
    cy.get("#signup-button").click();

    // Tina signs in
    cy.get("#email").type("tina@example.com");
    cy.get("#password").type("password2");
    cy.get("#login").click();

    // Tina sees a list of other users
    cy.get("#usersBtn").click();
    cy.get(".add-friends-name-row").eq(1).should("contain", "Bob")

    //  Tina adds Bob
    cy.get(".add-friend-button").eq(1).click();
    cy.get(".friend:first").should("contain", "Bob")
  });
});