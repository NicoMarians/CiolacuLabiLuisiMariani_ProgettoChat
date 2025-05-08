const { exec } = require('child_process');
const fs = require('fs');

const { Pool } = require('pg');


const { isNativeError } = require('util/types');
let conf = JSON.parse(fs.readFileSync('public/conf.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
const connection = mysql.createConnection(conf);


const executeQuery = (sql) => {
   return new Promise((resolve, reject) => {      
         connection.query(sql, function (err, result) {
            if (err) {
               console.error(err);
               reject();     
            }   
            console.log('done');
            resolve(result);         
      });
   })
}

const database = {

   createTables: async () => {
      //CHAT
      let sql = `
         CREATE TABLE IF NOT EXISTS public."Chat"
         (
            id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
            name character(50) COLLATE pg_catalog."default" NOT NULL,
            picture character(100) COLLATE pg_catalog."default" NOT NULL,
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
         id smallint NOT NULL,
         id_user smallint NOT NULL,
         id_chat smallint NOT NULL,
         CONSTRAINT chat_user_pkey PRIMARY KEY (id),
         CONSTRAINT "chat fk" FOREIGN KEY (id_chat)
            REFERENCES public."Chat" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
         CONSTRAINT "user fk" FOREIGN KEY (id_user)
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
         id smallint NOT NULL,
         chat_id smallint NOT NULL,
         user_id smallint NOT NULL,
         "time" timestamp(6) without time zone NOT NULL,
         type_id smallint NOT NULL,
         text character(1000) COLLATE pg_catalog."default" NOT NULL,
         image character(100) COLLATE pg_catalog."default" NOT NULL,
         data date NOT NULL,
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

      sql = `
      CREATE TABLE IF NOT EXISTS public."MessaggeType"
         (
            id smallint NOT NULL,
            type character(20) COLLATE pg_catalog."default" NOT NULL,
            CONSTRAINT "MessaggeType_pkey" PRIMARY KEY (id)
         )`;
      return await executeQuery(sql);
      
   },

   queries: {
      downloadUser: async (userId) => {
         let query = `
            SELECT username, picture, email
            FROM public.User as User 
            WHERE id = '${userId}' 
         `;

         return await executeQuery(query);
      },

      downloadMessages : async (chatId) => {
         let query = `
            SELECT Message.date, Message.time, Message.message_type, Message.text, Message.image, User.username
            FROM Public.User as User
            JOIN Public.Message as Message ON User.id = Message.userId
            WHERE Message.id = '${chatId}'
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