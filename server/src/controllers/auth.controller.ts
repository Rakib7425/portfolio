import { Response } from 'express';
import * as argon2 from 'argon2';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
// import { prisma } from '../utils/prisma';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { config } from '../config';
import { Request } from 'express';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

class AuthController {
  // Login
  login = asyncHandler(async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, validation.error.issues[0].message);
    }

    const { email, password } = validation.data;

    // Find user
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userList[0];

    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret as string,
      { expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      config.jwt.refreshSecret as string,
      { expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'] }
    );

    res.json(new ApiResponse(200, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }, 'Login successful'));
  });

  // Refresh token
  refresh = asyncHandler(async (req: Request, res: Response) => {
    const validation = refreshSchema.safeParse(req.body);

    if (!validation.success) {
      throw new ApiError(400, 'Refresh token is required');
    }

    const { refreshToken } = validation.data;

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret as string) as any;

      // Generate new access token
      const accessToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        config.jwt.secret as string,
        { expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'] }
      );

      res.json(new ApiResponse(200, { accessToken }, 'Token refreshed successfully'));
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  });

  // Logout
  logout = asyncHandler(async (_req: Request, res: Response) => {
    // In a production app, you'd invalidate the refresh token in Redis or database
    res.json(new ApiResponse(200, null, 'Logged out successfully'));
  });
}

export const authController = new AuthController();
