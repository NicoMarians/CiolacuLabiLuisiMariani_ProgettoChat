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

        publish: async (eventName, data) => {
            if (events[eventName]) {
                await events[eventName].forEach(async callback => await callback(data));
            }
        },
    };
};

export const pubsub = generatePubSub()