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
router.put("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: "missing id param" });

	// Prevent changing owner directly
	const { responsable_user_id, id: _, ...updates } = req.body || {};
	updates.updated_at = new Date().toISOString();

	const { data, error } = await supabase
		.from("cloud")
		.update(updates)
		.eq("id", id)
		.eq("responsable_user_id", req.user.id)
		.select("*")
		.single();

	if (error) return res.status(400).json({ error: error.message });
	if (!data) return res.status(404).json({ error: "not found" });
	return res.json(data);
});

// Delete a record (only owner can delete)
router.delete("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: "missing id param" });

	const { data, error } = await supabase
		.from("cloud")
		.delete()
		.eq("id", id)
		.eq("responsable_user_id", req.user.id)
		.select("id")
		.single();

	if (error) return res.status(400).json({ error: error.message });
	if (!data) return res.status(404).json({ error: "not found" });
	return res.json({ deleted: data.id });
});

module.exports = router; 