//constante para mysql
const mysql = require ('mysql');

// npm install --save express mysql body-parser
// npm run start

//constante para express
const express = require ('express');
const jwt = require ("jsonwebtoken");
//variable para los metodos express 
var app = express();

// constante para el paquete de body-parser
const bp = require('body-parser');
const { Router } = require('express');

// enviando los datos de Json a nodejs API
app.use(bp.json());

//conectar a la database mysql
var mysqlConnection = mysql.createConnection({

    host : '142.44.161.115',
  //  host : 'localhost',
    port : 3306,
    user : 'TIENDASM' , 
    password : 'Tiendas##231',
    database : 'TIENDASM',
    multipleStatements: true
}) ;  

// app.use("/inventario/", require("./inventario"));


// test de conexion database 
mysqlConnection.connect( (err)=>{
    if (!err){
        console.log('Conexion Exitosa'); 
    } else {
        console.log('Error De Conexion');
    }
} ) ; 


// ejecutar el server en un servidor en especifico
app.listen (3000, () => console.log('Server Running puerto: 3000'));


//PRUEBA                   BUENO
app.get('/PRUEBA', (req, res)=> {
    res.send('PRUEBA EXITOSA ')
});


// JW TOKEN
app.post("/login", (req, res) => {
  const user= {
    id:1,
    nombre: "Jonathan",
    email: "jona@email.com"
  }

  jwt.sign({user: user }, 'secretkey', (err, token)=> {
    res.json({
      token : token 
    })
  });
 // res.json(user);
});



function verifytoken (req, res, next){
    const bearerheader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined'){
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();  
   } else {
    res.send (403);
  }
}



// *************************************  SELECTS *********************************
// GET ARTICULOS (TODOS)             BUENO 
app.get("/SELECT_ARTS",(req, res) => {
    mysqlConnection.query("call SELECT_ARTICULOS", (err, rows, fields) => {
     if (!err) res.send(rows[0]);
     else console.log(err);
   });
 });

 // GET CATEGORIAS (TODAS)             BUENO 
app.get("/SELECT_CATS",(req, res) => {
   mysqlConnection.query("call SELECT_CAT_ARTICULOS", (err, rows, fields) => {
     if (!err) res.send(rows[0]);
     else console.log(err);
   })
 });

  // SELECT UN ARTICULO                   BUENOOOOO!
  app.get("/SELECT_ART", (req, res) => {
    try {
    const { COD_ARTICULO } = req.body;
    const consulta = `call SELECT_ARTICULO('${COD_ARTICULO}')`;
    mysqlConnection.query(consulta, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
             res.json(results[0]);
        } else {
            res.send("0")
        }
    })
    } catch (error) {
     res.send("0")
   }
  });

  // SELECT UNA CATEGORIA                  BUENOOOOO!
  app.get("/SELECT_CATEGORIA", (req, res) => {
    try {
    const { COD_CATEGORIA } = req.body;
    const consulta = `call SELECT_CAT_ARTICULO('${COD_CATEGORIA}')`;
    mysqlConnection.query(consulta, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
             res.json(results[0]);
        } else {
            res.send("0")
        }
    })
    } catch (error) {
     res.send("0")
   }
  });

// *************************************  INSERTS *********************************
 /*
 //POST  INSERTAR CATEGORIA       XXXXXXXX  MALOOO
app.post("/INSERTAR_CATEGORIA", (req, res) => {
  try {
    const { NOM_CATEGORIA, DESCRIPCION, FEC_REGISTRO} = req.body;
    const consulta = `call 	INSERTAR_CAT_ARTICULO('${NOM_CATEGORIA}','${DESCRIPCION}','${FEC_REGISTRO}'})`;
    mysqlConnection.query(consulta, error => {
      //conn.query(consulta, error => {
        if (error) throw error;
        res.send("Categoria añadida")
    });
  } catch (error) {
    res.send("error");
  }
});


  //POST  INSERTAR CATEGORIA       MALOO XXXXXX
app.post("/INSERT_CAT", (req, res) => { 
    const{
         NOM_CATEGORIA, DESCRIPCION, FEC_REGISTRO
       }= req.body;
        const sql=`
        SET @NOM_CATEGORIA=?; SET @DESCRIPCION=?; SET @FEC_REGISTRO=?;
        call INSERTAR_CAT_ARTICULO (@NOM_CATEGORIA, SET @DESCRIPCION, SET @FEC_REGISTRO);`;
        mysqlConnection.query( 
          sql,[NOM_CATEGORIA,DESCRIPCION, FEC_REGISTRO],
         (err, rows, fields) => {
       if (!err) res.send("Datos agregados exitosamente");
       else console.log(err);
       });
    });   
    */

 ///////////POST  INSERTAR CATEGORIA     BUENOOOO!!!
    app.post("/INSERT_CATEGORIA", (req, res) => {     
      const { NOM_CATEGORIA, DESCRIPCION, FEC_REGISTRO}= req.body;
      console.log(req.body)
          const sql =` call INSERTAR_CAT_ARTICULO (?, ?, ? );`;
          //const sql= "call INSERTAR_CAT_ARTICULO (?, ?, ? ); " ;
          mysqlConnection.query( sql,[NOM_CATEGORIA,DESCRIPCION, FEC_REGISTRO], (err, rows, fields) => {
         if (!err) res.send("Datos agregados exitosamente");
         else console.log(err);
         });
      });

       //POST  INSERTAR ARTICULO     BUENOOOO 
    app.post("/INSERT_ARTICULO", (req, res) => {     
      const { COD_CATEGORIA, NOM_ART, PREC_COMPRA, PREC_VENTA,
        DESCRIPCION, EXISTENCIAS, ESTADO, FEC_MODIFICACION}= req.body;
      console.log(req.body)
          const sql =` call INSERTAR_ARTICULO (?, ?, ? , ?, ?, ?, ?, ?);`;
          mysqlConnection.query( sql,[COD_CATEGORIA, NOM_ART, PREC_COMPRA, PREC_VENTA,
            DESCRIPCION, EXISTENCIAS, ESTADO, FEC_MODIFICACION], (err, rows, fields) => {
         if (!err) res.send("Datos agregados exitosamente");
         else console.log(err);
         });
      });
      

      // *************************************  DELETE  *********************************
      // DELETE UN ARTICULO                   BUENOOOOO!
      app.delete("/DELETE_ART", (req, res) => {
        const { COD_ARTICULO} = req.body;
        const mysql = `
        SET @COD_ARTICULO=?;
        CALL DELETE_ARTICULO(@COD_ARTICULO);`;
        mysqlConnection.query(
          mysql,
          [COD_ARTICULO],
         (err, rows, fields) => {
            if (!err) res.send("Articulo Eliminado");
            else console.log(err);
          }
        );
      });


      // DELETE CATEGORIA ARTICULO            BUENOOOOOO!!
      app.delete("/DELETE_CAT_ART", (req, res) => {
        const { COD_CATEGORIA} = req.body;
        const mysql = `
        SET @COD_CATEGORIA=?;
        CALL DELETE_CAT_ART(@COD_CATEGORIA);`;
        mysqlConnection.query(
          mysql,
          [COD_CATEGORIA],
         (err, rows, fields) => {
            if (!err) res.send("Categoria Eliminada");
            else console.log(err);
          }
        );
      });


       // ************************************* UPDATES *********************************
      /*
      // UPDATE CATEGORIA ARTICULO              XXXXXXXXXXX
      app.put("/UPDATE_CAT", (req, res) => {
        try {
            const {COD_CATEGORIA, NOM_CATEGORIA, DESCRIPCION, FEC_REGISTRO } = req.body;
            const consulta = `call 	UPDATE_CAT_ARTICULO(${COD_CATEGORIA}, ${NOM_CATEGORIA},${DESCRIPCION}, 
              ${FEC_REGISTRO})`;
            mysqlConnection.query(consulta, error => {
                if (error) throw error;
                res.send("Datos actualizados");
            }); 
        } catch (error) {
            res.send("Error :(");
        } 
      });   */
        

     // UPDATE CATEGORIA ARTICULO     BUENOOOO!
     app.put(["/UPDATE_CATEGORIA" ], (req, res) => {
      const { COD_CATEGORIA, NOM_CATEGORIA, DESCRIPCION, FEC_REGISTRO } = req.body;
      const sql = `
        SET @COD_CATEGORIA=?;
        SET @NOM_CATEGORIA=?;
        SET @DESCRIPCION=?;
        SET @FEC_REGISTRO=?;
        CALL UPDATE_CAT_ARTICULO( @COD_CATEGORIA, @NOM_CATEGORIA , @DESCRIPCION, @FEC_REGISTRO);`;
      mysqlConnection.query(
          sql, [COD_CATEGORIA, NOM_CATEGORIA, DESCRIPCION, FEC_REGISTRO ], (err, rows, fields) => {
        if (!err) res.send("Datos actualizados");
        else console.log(err);
          }
      );
  });

     // UPDATE  ARTICULO     BUENOOOO!!!
     app.put(["/UPDATE_ART" ], (req, res) => {
      const { COD_ARTICULO, COD_CATEGORIA, NOM_ART, PREC_COMPRA, PREC_VENTA,
        DESCRIPCION, EXISTENCIAS, ESTADO, FEC_MODIFICACION } = req.body;
      const sql = `
        SET @COD_ARTICULO=?;
        SET @COD_CATEGORIA=?;
        SET @NOM_ART=?;
        SET @PREC_COMPRA=?;
        SET @PREC_VENTA=?;
        SET @DESCRIPCION=?;
        SET @EXISTENCIAS=?;
        SET @ESTADO=?;
        SET @FEC_MODIFICACION=?;
        CALL UPDATE_ARTICULO ( @COD_ARTICULO, @COD_CATEGORIA , @NOM_ART, @PREC_COMPRA, 
        @PREC_VENTA, @DESCRIPCION, @EXISTENCIAS, @ESTADO, @FEC_MODIFICACION);`;
      mysqlConnection.query(
          sql, [COD_ARTICULO, COD_CATEGORIA, NOM_ART, PREC_COMPRA, PREC_VENTA,
            DESCRIPCION, EXISTENCIAS, ESTADO, FEC_MODIFICACION ], (err, rows, fields) => {
        if (!err) res.send("Datos actualizados");
        else console.log(err);
          }
      );
  });



