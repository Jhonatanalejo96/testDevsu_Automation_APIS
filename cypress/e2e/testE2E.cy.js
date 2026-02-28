import data from "../fixtures/config.json";

describe("Prueba flujo de compra", () => {
  it("Flujo completo de compra", () => {
    // Login usando datos del JSON
    cy.visit(data.url);
    cy.get("#user-name").type(data.Credenciales.username);
    cy.get("#password").type(data.Credenciales.password);
    cy.get("#login-button").click();
    cy.url().should("include", "inventory.html");
    cy.screenshot("login-exitoso");

    // Agregar dos productos aleatorios
    cy.get(".inventory_item").then((items) => {
      const indices = Cypress._.sampleSize([...Array(items.length).keys()], 2);
      const productos = indices.map((i) => {
        const nombre = Cypress.$(items[i]).find(".inventory_item_name").text();
        const precio = Cypress.$(items[i]).find(".inventory_item_price").text();
        const descripcion = Cypress.$(items[i])
          .find(".inventory_item_desc")
          .text();
        cy.wrap(items[i]).find("button").click();
        return { nombre, precio, descripcion };
      });

      // Ir al carrito y validar productos aleatorios
      cy.get(".shopping_cart_link").click();
      cy.screenshot("productos-en-carrito");
      productos.forEach((prod) => {
        cy.contains(".cart_item", prod.nombre).within(() => {
          cy.get(".inventory_item_name").should("have.text", prod.nombre);
          cy.get(".inventory_item_desc").should("have.text", prod.descripcion);
          cy.get(".inventory_item_price").should("have.text", prod.precio);
        });
      });

      // Verificación formulario de compra
      cy.get("#checkout").click();
      cy.get("#first-name").type(data.datosVerificación.firstName);
      cy.get("#last-name").type(data.datosVerificación.lastName);
      cy.get("#postal-code").type(data.datosVerificación.postalcode);
      cy.get("#continue").click();
      cy.screenshot("checkout-formulario");

      // Validar resumen de compra
      productos.forEach((prod) => {
        cy.contains(".cart_item", prod.nombre).within(() => {
          cy.get(".inventory_item_name").should("have.text", prod.nombre);
          cy.get(".inventory_item_desc").should("have.text", prod.descripcion);
          cy.get(".inventory_item_price").should("have.text", prod.precio);
        });
      });

      // Validar que el subtotal sea la suma de los productos seleccionados
      cy.get('[data-test="subtotal-label"]')
        .invoke("text")
        .then((subtotalText) => {
          const subtotal = parseFloat(
            subtotalText.replace("Item total: $", "")
          );
          const sumaPrecios = productos.reduce(
            (sum, prod) => sum + parseFloat(prod.precio.replace("$", "")),
            0
          );

          // Comparación con tolerancia de 0.01
          expect(subtotal).to.be.closeTo(sumaPrecios, 0.01);

          cy.get('[data-test="tax-label"]')
            .invoke("text")
            .then((taxText) => {
              const tax = parseFloat(taxText.replace("Tax: $", ""));
              cy.get('[data-test="total-label"]')
                .invoke("text")
                .then((totalText) => {
                  const total = parseFloat(totalText.replace("Total: $", ""));
                  // Comparación con tolerancia de 0.01
                  expect(total).to.be.closeTo(subtotal + tax, 0.01);
                });
            });
        });

      // Finalizar compra y validación de texto
      cy.get("#finish").click();
      cy.get(".complete-header").should(
        "have.text",
        "Thank you for your order!" ///comentar si quieren un caso fallido
        //"Thank you for your order" ///descomentar si quieren un caso fallido
      );
      cy.screenshot("compra-finalizada");
    });
  });
});
