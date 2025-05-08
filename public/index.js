// -- Parsing -- 


// -- Business Logic -- 
import {generatePubSub} from './BL - components/pubsub.js';
import {createMiddleware} from './BL - components/middleware.js';

// -- View --






fetch("./conf.json").then(r => r.json()).then(conf => {
    const pubsub = generatePubSub();
    const middleware = createMiddleware();

})