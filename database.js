const { exec } = require('child_process');
const fs = require('fs');
const { Pool } = require('pg');
const mysql = require('mysql2');
let conf = JSON.parse(fs.readFileSync('public/conf.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
console.log(conf.database);
const pool = new Pool({
    user: conf.database.user,         
    host: conf.database.host,        
    database: conf.database.database,  
    password: conf.database.password, 
    port: conf.database.port,          
    ssl: {
        ca: fs.readFileSync(__dirname + '/ca.pem')
    }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Errore di connessione al database:', err.stack);
    } else {
        console.log('Connessione al database riuscita');
        release();
    }
});


const executeQuery = async (sql, params = []) => {
    try {
        const result = await pool.query(sql, params);
        return result.rows;
    } catch (err) {
        console.error('Errore: ', err);
        throw err;
    }
};

const database = {
   createTables: async () => {
      //CHAT
      let sql = `
      CREATE TABLE IF NOT EXISTS public."Chat"
      (
         id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
         name character(50) COLLATE pg_catalog."default" NOT NULL,
         picture character(100) COLLATE pg_catalog."default",
         CONSTRAINT "Chat_pkey" PRIMARY KEY (id)
      )`;
      await executeQuery(sql);

      //USER
      sql = `
      CREATE TABLE IF NOT EXISTS public."User"
      (
         id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
         username character(50) COLLATE pg_catalog."default" NOT NULL,
         password character(100) COLLATE pg_catalog."default" NOT NULL,
         picture character(100) COLLATE pg_catalog."default",
         email character(100) COLLATE pg_catalog."default" NOT NULL,
         public_key character(100) COLLATE pg_catalog."default" NOT NULL,
         private_key character(100) COLLATE pg_catalog."default" NOT NULL,
         CONSTRAINT "User_pkey" PRIMARY KEY (id)
      )`;
      await executeQuery(sql);

      //CHAT_USER
      sql = `
      CREATE TABLE IF NOT EXISTS public.chat_user
      (
         id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
         user_id smallint NOT NULL,
         chat_id smallint NOT NULL,
         CONSTRAINT chat_user_pkey PRIMARY KEY (id),
         CONSTRAINT "chat fk" FOREIGN KEY (chat_id)
            REFERENCES public."Chat" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
         CONSTRAINT "user fk" FOREIGN KEY (user_id)
            REFERENCES public."User" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
      )`;
      await executeQuery(sql);

      //MESSAGE
      sql = `
      CREATE TABLE IF NOT EXISTS public."Message"
      (
         id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
         chat_id smallint NOT NULL,
         user_id smallint NOT NULL,
         type_id smallint NOT NULL,
         text character(1000) COLLATE pg_catalog."default",
         image character(100) COLLATE pg_catalog."default",
         "timestamp" timestamp without time zone NOT NULL,
         CONSTRAINT "Message_pkey" PRIMARY KEY (id),
         CONSTRAINT "chat fk messagge" FOREIGN KEY (chat_id)
            REFERENCES public."Chat" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
         CONSTRAINT "type fk messagge" FOREIGN KEY (type_id)
            REFERENCES public."Message_type" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
         CONSTRAINT "user fk messagge" FOREIGN KEY (user_id)
            REFERENCES public."User" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
      )`;
      await executeQuery(sql);

      //MESSAGE TYPE
      sql = `
      CREATE TABLE IF NOT EXISTS public."Message_type"
      (
         id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
         type character(20) COLLATE pg_catalog."default" NOT NULL,
         CONSTRAINT "MessaggeType_pkey" PRIMARY KEY (id)
      )`;
      return await executeQuery(sql);
      
   },

   queries: {
      downloadUser: async (userId) => {
         let query = `
            SELECT username, picture, email
            FROM "User" 
            WHERE id = '${userId}'
         `;

         return await executeQuery(query);
      },

      downloadMessages : async (chatId) => {
         let query = `
            SELECT "Message".timestamp, "Message".type_id, "Message".text, "Message".image, "User".username
            FROM "User"
            JOIN "Message" ON "User".id = "Message".user_id
            WHERE "Message".chat_id = '${chatId}'
            `;

         return await executeQuery(query);
      },

      downloadChatAll : async (userId) => {
         let query = `
            SELECT Chat.name,Chat.picture,
            FROM Public.Chat as Chat
            JOIN 
         `;

         return await executeQuery(query);
      },

      downloadCommunityAll : async () => {

      },

      createUser : async (userData) => {

      },

      createChat : async (userId_1,userId_2) => {

      },
      
      createMessage : async (messageData) => {

      },

      deleteChat : async (userId,chatId) => {

      }
   },

}

module.exports = database;