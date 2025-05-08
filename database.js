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
      let sql = `
         CREATE TABLE IF NOT EXISTS public."Chat"
         (
            id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
            name character(50) COLLATE pg_catalog."default" NOT NULL,
            picture character(100) COLLATE pg_catalog."default" NOT NULL,
            CONSTRAINT "Chat_pkey" PRIMARY KEY (id)
         )`;
      await executeQuery(sql);

      sql = `
      CREATE TABLE IF NOT EXISTS public."User"
      (
         id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
         username character(50) COLLATE pg_catalog."default" NOT NULL,
         password character(100) COLLATE pg_catalog."default" NOT NULL,
         picture character(100) COLLATE pg_catalog."default",
         email character(100) COLLATE pg_catalog."default" NOT NULL,
         "publicKey" character(100) COLLATE pg_catalog."default" NOT NULL,
         "privateKey" character(100) COLLATE pg_catalog."default" NOT NULL,
         CONSTRAINT "User_pkey" PRIMARY KEY (id)
      )`;
      await executeQuery(sql);

      sql = `
      CREATE TABLE IF NOT EXISTS public.chat_user
      (
         id smallint NOT NULL,
         "idUser" smallint NOT NULL,
         "idChat" smallint NOT NULL,
         CONSTRAINT chat_user_pkey PRIMARY KEY (id),
         CONSTRAINT "chat fk" FOREIGN KEY ("idChat")
            REFERENCES public."Chat" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
         CONSTRAINT "user fk" FOREIGN KEY ("idUser")
            REFERENCES public."User" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
      )`;
      await executeQuery(sql);

      sql = `
      CREATE TABLE IF NOT EXISTS public."Message"
      (
         id smallint NOT NULL,
         "chatId" smallint NOT NULL,
         "userId" smallint NOT NULL,
         "time" timestamp(6) without time zone NOT NULL,
         "typeId" smallint NOT NULL,
         text character(1000) COLLATE pg_catalog."default" NOT NULL,
         image character(100) COLLATE pg_catalog."default" NOT NULL,
         CONSTRAINT "Message_pkey" PRIMARY KEY (id),
         CONSTRAINT "chat fk messagge" FOREIGN KEY ("chatId")
            REFERENCES public."Chat" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
         CONSTRAINT "type fk messagge" FOREIGN KEY ("typeId")
            REFERENCES public."MessaggeType" (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID,
         CONSTRAINT "user fk messagge" FOREIGN KEY ("userId")
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

   insert: async (book) => {
      //INSERIMENTO ELEMENTO NELLA TABELLA
      let sql = `
         INSERT INTO booking (idType, date, hour, name)
         VALUES ('${book.idType}', '${book.date}', '${book.hour}', '${book.name}')
           `;
      console.log("SQL INSERIMENTO-> ", book);
      return await executeQuery(sql)
    },

   delete: (id) => {
      //ELIMINAZIONE ELEMENTO DALLA TABELLA
      let sql = `
      DELETE FROM booking
      WHERE id = $ID
      `;
      sql = sql.replace('$ID', id)
      return executeQuery(sql);
    }, 

   update: (orario) => {
      //MODIFICARE DOPO
      let sql = `
      UPDATE todo
      SET completed=$COMPLETED
      WHERE id=$ID
         `;
      sql = sql.replace("%ID", todo.id);
      sql = sql.replace("%COMPLETED", todo.completed);
      return executeQuery(sql); 
   },

}

module.exports = database;