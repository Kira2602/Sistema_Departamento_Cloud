const express = require("express");
const { supabase } = require("./supabase");

const router = express.Router();

// Get all records (sin autenticación)
router.get("/", async (req, res) => {
	console.log("📝 ==============================================");
	console.log("📝 OBTENIENDO TODOS LOS RECURSOS - SIN AUTENTICACIÓN");
	console.log("📝 ==============================================");

	try {
		const { data, error } = await supabase
			.from("cloud")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("❌ Error al obtener recursos:", error);
			return res.status(400).json({ error: error.message });
		}

		console.log("✅ Recursos obtenidos exitosamente:", data?.length || 0, "registros");
		return res.json(data || []);
	} catch (error) {
		console.error("❌ Error inesperado:", error);
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Get a specific record by ID
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	console.log("🔍 OBTENIENDO RECURSO POR ID - SIN AUTENTICACIÓN");
	console.log("🔍 ID solicitado:", id);

	try {
		const { data, error } = await supabase
			.from("cloud")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			console.error("❌ Error al obtener recurso:", error);
			return res.status(404).json({ error: "Recurso no encontrado" });
		}

		console.log("✅ Recurso encontrado:", data);
		return res.json(data);
	} catch (error) {
		console.error("❌ Error inesperado:", error);
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Create a new record (sin autenticación)
router.post("/", async (req, res) => {
	console.log("➕ ==============================================");
	console.log("➕ CREANDO NUEVO RECURSO - SIN AUTENTICACIÓN");
	console.log("📝 Datos recibidos:", req.body);
	console.log("➕ ==============================================");

	try {
		const { data, error } = await supabase
			.from("cloud")
			.insert([req.body])
			.select();

		if (error) {
			console.error("❌ Error al crear recurso:", error);
			return res.status(400).json({ error: error.message });
		}

		console.log("✅ Recurso creado exitosamente:", data[0]);
		return res.status(201).json(data[0]);
	} catch (error) {
		console.error("❌ Error inesperado:", error);
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Update a record (sin autenticación)
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: "missing id param" });

	console.log("✏️ ACTUALIZANDO RECURSO - SIN AUTENTICACIÓN");
	console.log("🔍 ID recibido:", id);
	console.log("📝 Datos a actualizar:", req.body);

	try {
		const { data, error } = await supabase
			.from("cloud")
			.update(req.body)
			.eq("id", id)
			.select();

		if (error) {
			console.error("❌ Error al actualizar:", error);
			return res.status(400).json({ error: error.message });
		}

		if (!data || data.length === 0) {
			return res.status(404).json({ error: "Recurso no encontrado" });
		}

		const updatedResource = data[0];
		console.log("✅ Recurso actualizado exitosamente:", updatedResource);

		return res.json({
			success: true,
			data: updatedResource,
			message: "Recurso actualizado correctamente"
		});
	} catch (error) {
		console.error("❌ Error inesperado:", error);
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Delete a record (sin autenticación)
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: "missing id param" });

	console.log("🗑️ ELIMINANDO RECURSO - SIN AUTENTICACIÓN");
	console.log("🔍 ID a eliminar:", id);

	try {
		// Verificar que el recurso existe
		const { data: existingResource, error: selectError } = await supabase
			.from("cloud")
			.select("id, codigo_recurso")
			.eq("id", id)
			.single();

		if (selectError) {
			console.error("❌ Error al buscar recurso:", selectError);
			return res.status(404).json({ error: "Recurso no encontrado" });
		}

		console.log("🔍 Recurso encontrado:", existingResource);

		// Eliminar directamente
		const { error: deleteError } = await supabase
			.from("cloud")
			.delete()
			.eq("id", id);

		if (deleteError) {
			console.error("❌ Error al eliminar:", deleteError);
			return res.status(400).json({ error: deleteError.message });
		}

		console.log("✅ Recurso eliminado exitosamente");
		
		return res.json({ 
			success: true,
			deleted: id,
			message: "Recurso eliminado correctamente"
		});
	} catch (error) {
		console.error("❌ Error inesperado:", error);
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

module.exports = router;