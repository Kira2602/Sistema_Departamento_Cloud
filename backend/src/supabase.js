const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		autoRefreshToken: true,
		detectSessionInUrl: false
	}
});

// Only create an admin client if service role is provided
let supabaseAdmin = null;
if (SUPABASE_SERVICE_ROLE_KEY) {
	supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false }
	});
}

module.exports = { supabase, supabaseAdmin }; 