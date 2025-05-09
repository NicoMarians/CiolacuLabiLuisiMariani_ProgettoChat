//gestisce eventi e notifica ad altre parti di codice in asincrono
const generatePubSub = () => {

    const events = {};

    return {
        
        subscribe: (eventName, callback) => {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push(callback);
        },

        publish: (eventName, data) => {
            if (events[eventName]) {
                events[eventName].forEach(callback => callback(data));
            }
        },
    };
};

export const pubSub = generatePubSub()