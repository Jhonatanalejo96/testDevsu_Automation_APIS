describe("Pruebas API PetStore", () => {
  const baseUrl = "https://petstore.swagger.io/v2/pet";
  const petId = 100;

  it("Crear mascota", () => {
    cy.request({
      method: "POST",
      url: baseUrl,
      body: {
        id: petId,
        category: { id: 0, name: "string" },
        name: "prueba",
        photoUrls: ["string"],
        tags: [{ id: 0, name: "string" }],
        status: "available",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(petId);
      expect(response.body.name).to.eq("prueba");
      expect(response.body.status).to.eq("available");
    });
  });

  it("Consultar mascota por ID", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/${petId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(petId);
      expect(response.body.name).to.eq("prueba");
    });
  });

  it("Editar mascota - nombre y estado", () => {
    cy.request({
      method: "PUT",
      url: baseUrl,
      body: {
        id: petId,
        category: { id: 0, name: "string" },
        name: "pruebamod",
        photoUrls: ["string"],
        tags: [{ id: 0, name: "string" }],
        status: "sold",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq("pruebamod");
      expect(response.body.status).to.eq("sold");
    });
  });

  it("Consltar mascota por estado", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/findByStatus?status=sold`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      // Validar que la lista contenga la mascota modificada
      const pet = response.body.find((p) => p.id === petId);
      expect(pet).to.not.be.undefined;
      expect(pet.name).to.eq("pruebamod");
      expect(pet.status).to.eq("sold");
    });
  });
});
