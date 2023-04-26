// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import '@4tw/cypress-drag-drop';
import "cypress-real-events";
import './commands';
import 'dayjs';
import 'cypress-file-upload';
import addContext from 'mochawesome/addContext';

// Alternatively you can use CommonJS syntax:
// require('./commands')
chai.use(require("chai-sorted"));

Cypress.on("test:after:run", (test, runnable) => {  
    if (test.state === "failed") {    
        const screenshot = `mochawesome-report/assets/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;    
        addContext({ test }, screenshot);  
    }
});