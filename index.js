import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
//const datos = require('./datos.json')

import express from 'express'
import db from './db/connection.js'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'

const html = "<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/estadistica</li><li>GET: /productos/nombre/id</li><li>GET: /productos/precio/id</li><li>GET: /productos/id</li><li>POST: /productos/</li><li>DELETE: /productos/id</li><li>PUT: /productos/id</li><li>PATCH: /productos/id</li><li>GET: /usuarios/</li><li>GET: /usuarios/nombre/id</li><li>GET: /usuarios/telefono/id</li><li>GET: /usuarios/id</li><li>POST: /usuarios/</li><li>DELETE: /usuarios/id</li><li>PUT: /usuarios/id</li><li>PATCH: /usuarios/id</li></ul>"

const app = express()

const exposedPort = 1234

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send(html)
})

//Listado completo de productos
app.get("/productos", async (req, res) => {
	try {
		let allProducts = await Producto.findAll();
		res.status(200).json(allProducts);
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//10. CONOCER LA CANTIDAD DE PRODUCTOS
//Y LA SUMATORIA DE SUS PRECIOS
app.get("/productos/estadistica", async (req, res) => {
	try {
		let productos = await Producto.findAll();
		let cantidadProductos = productos.length;
		let sumPre = productos.reduce((total, producto) => {
			return total + producto.precio;
		}, 0);
        let sumatoriaPrecios = parseFloat(sumPre.toFixed(2));
		res.status(200).json({
			cantidadProductos,
			sumatoriaPrecios,
		});
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//6. OBTENER EL PRECIO DE UN PRODUCTO
app.get("/productos/precio/:id", async (req, res) => {
	try {
		let productoId = parseInt(req.params.id);
		let productoEncontrado = await Producto.findByPk(productoId);

		if (productoEncontrado) {
			res.status(200).json({ precio: productoEncontrado.precio });
		} else {
			res.status(400).json({ error: "Producto no encontrado" });
		}
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//7. OBTENER EL NOMBRE DE UN PRODUCTO
app.get("/productos/nombre/:id", async (req, res) => {
	try {
		let productoId = parseInt(req.params.id);
		let productoEncontrado = await Producto.findByPk(productoId);

		if (productoEncontrado) {
			res.status(200).json({ nombre: productoEncontrado.nombre });
		} else {
			res.status(400).json({ error: "Producto no encontrado" });
		}
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//Devuelve los datos de un producto en particular
app.get("/productos/:id", async (req, res) => {
	try {
		let productoId = parseInt(req.params.id);
		let productoEncontrado = await Producto.findByPk(productoId);

		if (!productoEncontrado) {
			res.status(204).json({ message: "Producto no encontrado" });
		}
		res.status(200).json(productoEncontrado);
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//Agregar un producto
app.post('/productos', async (req, res) => {
    const { nombre, tipo, precio } = req.body;
    const nuevoProducto = {
      nombre,
      tipo,
      precio,
    };
    let productoAGuardar = new Producto(nuevoProducto);
    await productoAGuardar.save();
    res.status(201).json({ mensaje: 'Producto creado con éxito', producto: nuevoProducto });
  });

//Modificar un producto
app.patch('/productos/:id', async (req, res) => {
    const productoId = parseInt(req.params.id);
    const { nombre, tipo, precio } = req.body;
  
    const producto = await Producto.findByPk(productoId);
  
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  
    let datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (tipo) datosActualizados.tipo = tipo;
    if (precio) datosActualizados.precio = precio;

    await producto.update(datosActualizados);
  
    res.json({ mensaje: 'Producto actualizado con éxito', producto });
  });

//Actualizar un producto
app.put("/productos/:id", async (req, res) => {
	let productoId = parseInt(req.params.id);
	let { nombre, tipo, precio } = req.body;

	const producto = await Producto.findByPk(productoId);

	if (!producto) {
		return res.status(404).json({ mensaje: "Producto no encontrado" });
	}

    let datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (tipo) datosActualizados.tipo = tipo;
    if (precio) datosActualizados.precio = precio;

    await producto.update(datosActualizados);

	return res.json({ mensaje: "Producto actualizado con éxito", producto });
});

//Eliminar un producto
app.delete("/productos/:id", async (req, res) => {
	let idProductoABorrar = parseInt(req.params.id);
try {
	let productoABorrar = await Producto.findByPk(idProductoABorrar);

	if (!productoABorrar) {
		res.status(204).json({ message: "Producto no encontrado" });
	}
        await productoABorrar.destroy();

        res.status(200).json({ message: "success" });
	} catch (error) {
		res.status(204).json({ message: "error" });
	}
});

//1. OBTENER EL LISTADO COMPLETO DE USUARIOS
app.get("/usuarios/", async (req, res) => {
	try {
		let allUsers = await Usuario.findAll();
		res.status(200).json(allUsers);
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//8. OBTENER EL TELÉFONO DE UN USUARIO
app.get("/usuarios/telefono/:id", async (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id);
		let usuarioEncontrado = await Usuario.findByPk(usuarioId);
		if (usuarioEncontrado) {
			res.status(200).json({ telefono: usuarioEncontrado.telefono });
		} else {
			res.status(404).json({ error: "Usuario no encontrado" });
		}
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//9. OBTENER EL NOMBRE DE UN USUARIO
app.get("/usuarios/nombre/:id", async (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id);
		let usuarioEncontrado = await Usuario.findByPk(usuarioId);

		if (usuarioEncontrado) {
			res.status(200).json({ nombre: usuarioEncontrado.nombres });
		} else {
			res.status(404).json({ error: "Usuario no encontrado" });
		}
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//2. OBTENER LOS DATOS DE UN USUARIO
app.get("/usuarios/:id", async (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id);
		let usuarioEncontrado = await Usuario.findByPk(usuarioId);

		if (!usuarioEncontrado) {
			res.status(204).json({ message: "Usuario no encontrado" });
		}
		res.status(200).json(usuarioEncontrado);
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//3. CREAR UN NUEVO USUARIO
app.post('/usuarios', async (req, res) => {
    const { dni, nombres, apellidos, email, telefono } = req.body;
    const nuevoUsuario = {
      dni,
      nombres,
      apellidos,
      email,
      telefono,
    };
    let usuarioAGuardar = new Usuario(nuevoUsuario);
    await usuarioAGuardar.save();
    res.status(201).json({ mensaje: 'Usuario creado con éxito', usuario: nuevoUsuario });
  });

//4. MODIFICAR DATOS DE UN USUARIO
app.patch('/usuarios/:id', async (req, res) => {
    const usuarioId = parseInt(req.params.id);
    const { dni, nombres, apellidos, email, telefono } = req.body;
  
    const usuario = await Usuario.findByPk(usuarioId);
  
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  
    let datosActualizados = {};
    if (dni) datosActualizados.dni = dni;
    if (nombres) datosActualizados.nombres = nombres;
    if (apellidos) datosActualizados.apellidos = apellidos;
    if (email) datosActualizados.email = email;
    if (telefono) datosActualizados.telefono = telefono;

    await usuario.update(datosActualizados);
  
    res.json({ mensaje: 'Usuario actualizado con éxito', usuario});
  });

//Actualizar un usuario
app.put("/usuarios/:id", async (req, res) => {
	let usuarioId = parseInt(req.params.id);
	let { dni, nombres, apellidos, email, telefono } = req.body;

	let usuario = await Usuario.findByPk(usuarioId);

	if (!usuario) {
		return res.status(404).json({ mensaje: "Usuario no encontrado" });
	}

    let datosActualizados = {};
    if (dni) datosActualizados.dni = dni;
    if (nombres) datosActualizados.nombres = nombres;
    if (apellidos) datosActualizados.apellidos = apellidos;
    if (email) datosActualizados.email = email;
    if (telefono) datosActualizados.telefono = telefono;

    await usuario.update(datosActualizados);

	return res.json({ mensaje: "Usuario actualizado con éxito", usuario });
});

//5. ELIMINAR UN USUARIO
app.delete("/usuarios/:id", async (req, res) => {
	let usuarioId = parseInt(req.params.id);
try {
	let usuarioABorrar = await Usuario.findByPk(usuarioId);

	if (!usuarioABorrar) {
		res.status(204).json({ message: "Usuario no encontrado" });
	}

        await usuarioABorrar.destroy();
		res.status(200).json({ message: "success" });
	} catch (error) {
		res.status(204).json({ message: "error" });
	}
});


app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})




