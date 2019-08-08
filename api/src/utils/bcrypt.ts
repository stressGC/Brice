'use strict';

import * as bcryptjs from 'bcryptjs';

/**
 * Compares hashed and clear password
 *
 * @param {string} providedPassword clear password to compare to 
 * @param {string} hashedPassword hashed password to compare to
 * @returns {Promise<boolean>} Promise containing the function to be called
 */
export const comparePasswords =
  (providedPassword: string, hashedPassword: string): Promise<boolean> =>
    bcryptjs.compare(providedPassword, hashedPassword);

/**
 * hashes a password using the bcrypt library
 *
 * @param {string} password password to hash
 * @returns {Promise<string>} Promise containing the function to be called
 */
export const hashPassword = (password: string): Promise<string> => bcryptjs.hash(password, 8);
