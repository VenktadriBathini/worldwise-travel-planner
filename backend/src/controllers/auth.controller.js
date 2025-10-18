// backend/src/controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const asyncHandler = require("../utils/asyncHandler");
const { createUser, findUserByEmail } = require("../services/auth.service");
const {
  signAccessToken,
  signRefreshToken,
} = require("../services/jwt.service");

const registerSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email format" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  display_name: z.string().trim().optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email format" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// helper: normalize zod errors into field map
function zodToFieldErrors(zerr) {
  const out = {};
  for (const issue of zerr.issues) {
    const field = issue.path?.[0] ?? "form";
    out[field] = issue.message || "Invalid value";
  }
  return out;
}

const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "validation_error",
      field_errors: zodToFieldErrors(parsed.error),
    });
  }
  const { email, password, display_name } = parsed.data;

  // fast pre-check to return a friendly 409 (unique email)
  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({
      error: "email_already_exists",
      field: "email",
      message: "An account with this email already exists.",
    });
  }

  try {
    // If createUser expects plain password and hashes internally, keep as is
    // If not, uncomment the hash lines and pass password_hash instead
    // const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || "10", 10));
    // const user = await createUser({ email, password_hash: hash, display_name });

    const user = await createUser({ email, password, display_name });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name ?? null,
        avatar_url: user.avatar_url ?? null,
        created_at: user.created_at ?? undefined,
      },
      accessToken,
      refreshToken,
    });
  } catch (e) {
    // If DB unique constraint still triggers (race), map to specific 409
    if (
      e &&
      (e.code === "23505" || String(e.message || "").includes("duplicate key"))
    ) {
      return res.status(409).json({
        error: "email_already_exists",
        field: "email",
        message: "An account with this email already exists.",
      });
    }
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "validation_error",
      field_errors: zodToFieldErrors(parsed.error),
    });
  }
  const { email, password } = parsed.data;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      error: "invalid_credentials",
      message: "Invalid email or password.",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({
      error: "invalid_credentials",
      message: "Invalid email or password.",
    });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      display_name: user.display_name ?? null,
      avatar_url: user.avatar_url ?? null,
      created_at: user.created_at ?? undefined,
    },
    accessToken,
    refreshToken,
  });
});

module.exports = { register, login };
