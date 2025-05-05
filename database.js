const fs = require('fs');
const mysql = require('mysql2');
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