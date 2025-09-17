const express = require("express");
const { supabase } = require("./supabase");

const router = express.Router();

// Auth middleware: requires Authorization: Bearer <access_token>
const requireAuth = async (req, res, next) => {
	const authHeader = req.headers["authorization"] || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
	if (!token) return res.status(401).json({ error: "missing bearer token" });
	const { data, error } = await supabase.auth.getUser(token);
	if (error || !data?.user) return res.status(401).json({ error: error?.message || "unauthorized" });
	req.user = data.user;
	return next();
};

// Get all cloud resources for authenticated user
router.get("/", requireAuth, async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("cloud")
			.select("*")
			.eq("responsable_user_id", req.user.id)
			.order("created_at", { ascending: false });

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		return res.json({
			success: true,
			data: data,
			count: data.length
		});
	} catch (error) {
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Get all cloud resources (admin view - sin JOIN por ahora)
router.get("/all", requireAuth, async (req, res) => {
	try {
		console.log('🔍 Ejecutando query getAllResources...');
		const { data, error } = await supabase
			.from("cloud")
			.select("*")
			.order("created_at", { ascending: false });

		console.log('📊 Resultado de la query:', { data: data?.length || 0, error: error?.message });

		if (error) {
			console.error('❌ Error en query:', error);
			return res.status(400).json({ error: error.message });
		}

		console.log('✅ Query exitosa, enviando respuesta...');
		return res.json({
			success: true,
			data: data,
			count: data.length
		});
	} catch (error) {
		console.error('💥 Error en catch:', error);
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Get single cloud resource by ID (sin JOIN por ahora)
router.get("/:id", requireAuth, async (req, res) => {
	try {
		const { id } = req.params;
		
		const { data, error } = await supabase
			.from("cloud")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			return res.status(404).json({ error: "Recurso no encontrado" });
		}

		return res.json({
			success: true,
			data: data
		});
	} catch (error) {
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Insert into cloud table (owner enforced)
router.post("/", requireAuth, async (req, res) => {
	const {
		codigo_recurso,
		proveedor_cloud,
		servicio_producto,
		id_recurso,
		estado,
		fecha_inicio,
		region_zona,
		costo_mensual_estimado,
		fecha_fin_contrato,
		garantia,
		notas
	} = req.body || {};

	if (!codigo_recurso || !proveedor_cloud || !servicio_producto || !id_recurso || !estado) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const payload = {
		codigo_recurso,
		proveedor_cloud,
		servicio_producto,
		id_recurso,
		responsable_user_id: req.user.id, // enforce owner
		estado,
		fecha_inicio: fecha_inicio || new Date().toISOString(),
		region_zona,
		costo_mensual_estimado,
		fecha_fin_contrato,
		garantia,
		notas
	};

	const { data, error } = await supabase
		.from("cloud")
		.insert(payload)
		.select("*")
		.single();
	if (error) return res.status(400).json({ error: error.message });
	return res.status(201).json(data);
});

// Update a record (only owner can update)
// Update a record (any authenticated user can update)
router.put("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: "missing id param" });

	console.log('✏️ ==============================================');
	console.log('✏️ ACTUALIZANDO RECURSO - MODO DEPARTAMENTAL');
	console.log('🔍 ID recibido:', id);
	console.log('👤 Usuario que actualiza:', req.user.id);
	console.log('📧 Email del usuario:', req.user.email);
	console.log('📝 Datos a actualizar:', req.body);
	console.log('✏️ ==============================================');

	// Verificar que el recurso existe
	const { data: existingResource, error: selectError } = await supabase
		.from("cloud")
		.select("id, codigo_recurso")
		.eq("id", id);

	if (selectError || !existingResource || existingResource.length === 0) {
		console.error('❌ Error al buscar recurso:', selectError);
		return res.status(404).json({ error: "Recurso no encontrado" });
	}

	console.log('🔍 Recurso encontrado:', existingResource[0]);

	// Prevent changing owner directly and prepare updates
	const { responsable_user_id, id: _, ...updates } = req.body || {};
	updates.updated_at = new Date().toISOString();

	console.log('📝 Actualizaciones a aplicar:', updates);

	// Update without owner restriction and without .single()
	const { data, error } = await supabase
		.from("cloud")
		.update(updates)
		.eq("id", id)
		.select("*");

	if (error) {
		console.error('❌ Error al actualizar:', error);
		return res.status(400).json({ error: error.message });
	}

	if (!data || data.length === 0) {
		console.error('❌ No se encontró el recurso para actualizar');
		return res.status(404).json({ error: "Recurso no encontrado" });
	}

	const updatedResource = data[0];
	console.log('✅ Recurso actualizado exitosamente:', updatedResource);
	console.log('✏️ ==============================================');

	return res.json({
		success: true,
		data: updatedResource,
		message: "Recurso actualizado correctamente",
		updatedBy: req.user.email
	});
});

// Delete a record (any authenticated user can delete)
router.delete("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: "missing id param" });

	console.log('🗑️ ==============================================');
	console.log('🗑️ ELIMINANDO RECURSO - MODO DEPARTAMENTAL');
	console.log('🔍 ID recibido:', id);
	console.log('👤 Usuario que elimina:', req.user.id);
	console.log('📧 Email del usuario:', req.user.email);
	console.log('🗑️ ==============================================');

	// Verificar que el recurso existe
	const { data: existingResource, error: selectError } = await supabase
		.from("cloud")
		.select("id, codigo_recurso, responsable_user_id")
		.eq("id", id)
		.single();

	if (selectError) {
		console.error('❌ Error al buscar recurso:', selectError);
		console.error('❌ Detalles del error:', JSON.stringify(selectError, null, 2));
		return res.status(404).json({ error: "Recurso no encontrado" });
	}

	console.log('🔍 Recurso encontrado:', existingResource);
	console.log('👤 Dueño original del recurso:', existingResource.responsable_user_id);
	console.log('✅ Permitiendo eliminación - Sistema departamental');

	// Eliminar directamente (cualquier usuario autenticado puede eliminar)
	console.log('🗑️ Procediendo a eliminar...');
	const { error: deleteError, data: deletedData } = await supabase
		.from("cloud")
		.delete()
		.eq("id", id);

	if (deleteError) {
		console.error('❌ Error al eliminar:', deleteError);
		console.error('❌ Detalles del error DELETE:', JSON.stringify(deleteError, null, 2));
		return res.status(400).json({ error: deleteError.message });
	}

	console.log('✅ Resultado de la eliminación:', deletedData);
	console.log('✅ Recurso eliminado exitosamente de Supabase');
	console.log('🗑️ ==============================================');
	
	return res.json({ 
		success: true,
		deleted: id,
		message: "Recurso eliminado correctamente",
		deletedBy: req.user.email
	});
});

module.exports = router; 