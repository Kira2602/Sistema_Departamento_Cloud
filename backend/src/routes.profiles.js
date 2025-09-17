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

// Get current user profile
router.get("/me", requireAuth, async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("user_id", req.user.id)
			.single();

		if (error && error.code !== 'PGRST116') {
			return res.status(400).json({ error: error.message });
		}

		// If no profile exists, return user data from auth
		if (!data) {
			return res.json({
				success: true,
				data: {
					user_id: req.user.id,
					full_name: req.user.user_metadata?.full_name || req.user.email,
					avatar_url: req.user.user_metadata?.avatar_url || null,
					bio: null,
					created_at: req.user.created_at,
					updated: null
				}
			});
		}

		return res.json({
			success: true,
			data: data
		});
	} catch (error) {
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Get all profiles (for admin or user selection)
router.get("/", requireAuth, async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.order("full_name", { ascending: true });

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

// Get profile by user_id
router.get("/:user_id", requireAuth, async (req, res) => {
	try {
		const { user_id } = req.params;
		
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("user_id", user_id)
			.single();

		if (error) {
			return res.status(404).json({ error: "Perfil no encontrado" });
		}

		return res.json({
			success: true,
			data: data
		});
	} catch (error) {
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Create or update user profile
router.post("/", requireAuth, async (req, res) => {
	try {
		const { full_name, avatar_url, bio } = req.body || {};

		if (!full_name) {
			return res.status(400).json({ error: "full_name es requerido" });
		}

		const profileData = {
			user_id: req.user.id,
			full_name,
			avatar_url,
			bio,
			updated: new Date().toISOString()
		};

		// Try to update first, if it doesn't exist, insert
		const { data: existingProfile } = await supabase
			.from("profiles")
			.select("id")
			.eq("user_id", req.user.id)
			.single();

		let data, error;

		if (existingProfile) {
			// Update existing profile
			const updateResult = await supabase
				.from("profiles")
				.update(profileData)
				.eq("user_id", req.user.id)
				.select("*")
				.single();
			data = updateResult.data;
			error = updateResult.error;
		} else {
			// Create new profile
			const insertResult = await supabase
				.from("profiles")
				.insert(profileData)
				.select("*")
				.single();
			data = insertResult.data;
			error = insertResult.error;
		}

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		return res.json({
			success: true,
			data: data,
			message: existingProfile ? "Perfil actualizado exitosamente" : "Perfil creado exitosamente"
		});
	} catch (error) {
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

// Update user profile
router.put("/", requireAuth, async (req, res) => {
	try {
		const updateData = req.body || {};
		updateData.updated = new Date().toISOString();

		const { data, error } = await supabase
			.from("profiles")
			.update(updateData)
			.eq("user_id", req.user.id)
			.select("*")
			.single();

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		if (!data) {
			return res.status(404).json({ error: "Perfil no encontrado" });
		}

		return res.json({
			success: true,
			data: data,
			message: "Perfil actualizado exitosamente"
		});
	} catch (error) {
		return res.status(500).json({ error: "Error interno del servidor" });
	}
});

module.exports = router;