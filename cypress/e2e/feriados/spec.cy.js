const{feriados} = require('../../../support/pom/feriados/createHoliday');
 const nameDate = Cypress.env('nameDate');
 
 
 describe('createHoliday', () => {
     beforeEach(() => {
       cy.session('aad_username', () => {
       cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'))
       cy.visit('/')
     })
     }) 
 it('deberia poder crearse un feriado', (holiday) => { 
     cy.fixture('holiday.json').then(data => {
     cy.visit('/')
     feriados.enterFeriados()
         cy.request({
             method: "GET",
             url:  `${Cypress.env().baseUrlAPI}/feriados?nombre=${data.holiday.nameDate}`, //${data.holiday.nameDate} es el nombre del feriado que quiero que obtenga.
             failOnstatusCode: false,
             headers: {
             Authorization: `Bearer ${Cypress.env.token}`
             },
         
          }).its('body.content').each((holiday) => { 
         cy.request({
             method: "PUT",
             url:  `${Cypress.env().baseUrlAPI}/feriados/${holiday.id}/desactivar `, //${holiday.id} es el id del feriado que quiero eliminar, porque en el endopoint PUT está el ID, y no el nombre
             headers: {
             Authorization: `Bearer ${Cypress.env.token}`
             }
             
        }).then((response) =>{
         expect(response.status).to.eq(202)
 
        }).then(() => {
         cy.wait(2000)
 
        })
      
           cy.request({
             method: "POST",
             url:  `${Cypress.env().baseUrlAPI}/create-feriados`,
             body: data.createHoliday, // contiene los datos para crear el feriado (fecha, nombre, tipo, etc.)
             headers: {
             Authorization: Bearer `${Cypress.env.token}`
             },
             failOnstatusCode: false,
   }).then((responsive) => {
         if (responsive.status == 409) {
             cy.log('el feriado ya existe');
 
         } else {
             expect(responsive.status).to.eq(202);
             cy.log('feriado creado exitosamente')
         }
        
   }) 
 })    
 }) 
 })
 })