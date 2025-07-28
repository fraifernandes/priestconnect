import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(['priest', 'institution']),
  name: z.string(),
  createdAt: z.date(),
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });

// Priest profile schema
export const priestProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  parish: z.string(),
  location: z.string(),
  services: z.array(z.enum(['mass', 'confession', 'prayer_blessings', 'recollection_retreat'])),
  bio: z.string().optional(),
  phone: z.string().optional(),
});

export const insertPriestProfileSchema = priestProfileSchema.omit({ id: true });

// Availability schema
export const availabilitySchema = z.object({
  id: z.string(),
  priestId: z.string(),
  date: z.string(), // ISO date string
  timeSlots: z.array(z.object({
    startTime: z.string(), // HH:mm format
    endTime: z.string(),
    isAvailable: z.boolean(),
  })),
});

export const insertAvailabilitySchema = availabilitySchema.omit({ id: true });

// Booking schema
export const bookingSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  priestId: z.string(),
  serviceType: z.enum(['mass', 'confession', 'prayer_blessings', 'recollection_retreat']),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'accepted', 'declined', 'completed']),
  createdAt: z.date(),
});

export const insertBookingSchema = bookingSchema.omit({ id: true, createdAt: true });

// Institution profile schema
export const institutionProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  address: z.string(),
  location: z.string(),
  contactPerson: z.string(),
  phone: z.string().optional(),
});

export const insertInstitutionProfileSchema = institutionProfileSchema.omit({ id: true });

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PriestProfile = z.infer<typeof priestProfileSchema>;
export type InsertPriestProfile = z.infer<typeof insertPriestProfileSchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InstitutionProfile = z.infer<typeof institutionProfileSchema>;
export type InsertInstitutionProfile = z.infer<typeof insertInstitutionProfileSchema>;
