const express = require("express");
const { supabase } = require("./supabase");

const router = express.Router();

// Email/password signup
router.post("/signup", async (req, res) => {
	const { email, password, data } = req.body || {};
	if (!email || !password) return res.status(400).json({ error: "email and password are required" });
	const { data: signUpData, error } = await supabase.auth.signUp({ email, password, options: { data } });
	if (error) return res.status(400).json({ error: error.message });
	return res.json(signUpData);
});

// Email/password sign-in
router.post("/signin", async (req, res) => {
	const { email, password } = req.body || {};
	if (!email || !password) return res.status(400).json({ error: "email and password are required" });
	const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) return res.status(401).json({ error: error.message });
	return res.json(signInData);
});

// Sign out (uses current auth session if provided via Authorization header Bearer token)
router.post("/signout", async (req, res) => {
	const { error } = await supabase.auth.signOut();
	if (error) return res.status(400).json({ error: error.message });
	return res.json({ success: true });
});

// Get current user (expects Authorization: Bearer <access_token>)
router.get("/user", async (req, res) => {
	const authHeader = req.headers["authorization"] || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
	if (!token) return res.status(401).json({ error: "missing bearer token" });
	const { data, error } = await supabase.auth.getUser(token);
	if (error) return res.status(401).json({ error: error.message });
	return res.json(data);
});

// Example protected middleware using bearer token
const requireAuth = async (req, res, next) => {
	const authHeader = req.headers["authorization"] || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
	if (!token) return res.status(401).json({ error: "missing bearer token" });
	const { data, error } = await supabase.auth.getUser(token);
	if (error || !data?.user) return res.status(401).json({ error: error?.message || "unauthorized" });
	req.user = data.user;
	return next();
};

// Example protected route
router.get("/protected", requireAuth, (req, res) => {
	return res.json({ ok: true, user: req.user });
});

module.exports = router; 