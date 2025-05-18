const fs = require('fs');
const { Pool } = require('pg'); // Importazione libreria per PostgresSQL
const mysql = require('mysql2');


// - - CONNESSIONE AL DATABASE - - 
let conf = JSON.parse(fs.readFileSync('public/conf.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
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
// - - - END CONNECTION 

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
         id_tipo smallint NOT NULL,
         CONSTRAINT "Chat_pkey" PRIMARY KEY (id),
         CONSTRAINT "chat type fk" FOREIGN KEY (id_tipo)
            REFERENCES public.chat_type (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
      );`
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

      // CHAT TYPE
      sql = `
      CREATE TABLE IF NOT EXISTS public.chat_type
      (
         id smallint NOT NULL,
         tipo character(30) COLLATE pg_catalog."default" NOT NULL,
         CONSTRAINT chat_type_pkey PRIMARY KEY (id)
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
      downloadAllUsers: async () => {
         let query = `
            SELECT id,username, picture, email
            FROM "User" 
         `;

         return await executeQuery(query,[]);
      },

      downloadUser: async (userId) => {
         let query = `
            SELECT id,username, picture, email
            FROM "User" 
            WHERE id = $1
         `;

         const values = [
            userId
         ];

         return await executeQuery(query,values);
      },

      downloadUserByName: async (username) => {
         let query = `
            SELECT id, username, password, email, public_key, private_key, picture 
            FROM "User"
            WHERE username = $1
         `;

         const values = [
            username
         ];

         return await executeQuery(query,values);
      },

      downloadMessages : async (chatId) => {
         let query = `
            SELECT "Message".timestamp, "Message".type_id, "Message".text, "Message".image, "User".username, "User".id as userid
            FROM "User" 
            JOIN "Message" ON "User".id = "Message".user_id
            WHERE "Message".chat_id = $1
            ORDER BY "Message".timestamp
         `;

         const values = [
            chatId
         ];

         return await executeQuery(query,values);
      },

      downloadAllChatId : async () => {
         let query = `
            SELECT id
            FROM "Chat" 
         `;
         return await executeQuery(query, []);
      },

      downloadChatAll : async (userId) => {
         let query = `
            SELECT "Chat".id, "Chat".name, "Chat".picture, "Chat".id_tipo
            FROM "Chat" 
            JOIN "chat_user" ON "Chat".id = "chat_user".chat_id
            WHERE "chat_user".user_id = $1
            AND "Chat".id_tipo = 1
         `;

         const values = [
            userId
         ];

         return await executeQuery(query, values);
      },

      downloadCommunityAll : async () => {
         let query = `
            SELECT id, name, picture, id_tipo
            FROM "Chat" 
            WHERE id_tipo = 2
         `;

         return await executeQuery(query, []);
      },

      downloadChatAllNoFilter : async () => {
         let query = `
            SELECT id, name, picture, id_tipo
            FROM "Chat" 
         `;

         return await executeQuery(query, []);
      },

      createUser : async (userData) => {
         let query = `
            INSERT INTO "User"(
            username, password, picture, email, public_key, private_key)
            VALUES ($1,$2,$3,$4,$5,$6);
         `;

         let values = [
            userData.username,
            userData.password,
            userData.picture,
            userData.email,
            userData.public_key,
            userData.private_key
         ];

         return await executeQuery(query,values);
      },

      createChat : async (name,picture) => {
         let query = `
            INSERT INTO "Chat"(name, picture)
            VALUES ('$1', $2);
            RETURNING id
         `;

         const values = [
            name,
            picture
         ];

         return await executeQuery(query,values) 
      },

      createUserChat : async (userId,chatId) => {
         let query = `
            INSERT INTO public.chat_user(
            user_id, chat_id)
            VALUES ($1, $2);
         `;

         const values = [
            userId,
            chatId
         ];
      
         return await executeQuery(query,values)     
      },
      
      createMessage : async (messageData) => {
         let query = `
         INSERT INTO public."Message"(
         chat_id, user_id, type_id, text, image, "timestamp")
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id;
         `;

         let values = [
            messageData.chat_id, 
            messageData.user_id, 
            messageData.type_id, 
            messageData.text, 
            messageData.image, 
            messageData.timestamp
         ];


         return await executeQuery(query,values)
      },

      leaveChat: async ([chatId, userId]) => {
         let query =  `
            DELETE FROM "chat_user"
            WHERE "chat_user".user_id = $1;
            AND "chat_user".chat_id = $2;
         `;

         const values = [
            chatId, 
            userId
         ];

         return await executeQuery(query, values)
      },

      deleteChat : async ([chatId]) => {
         let query = `
         DELETE FROM "Chat"
         WHERE "Chat".id = $1;
         `;

         const values = [
            chatId
         ];

         return await executeQuery(query, values)

      }
   }

}

module.exports = database;