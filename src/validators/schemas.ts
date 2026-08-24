import { z } from 'zod';
export const registerSchema=z.object({name:z.string().min(2),email:z.string().email(),password:z.string().min(8),phone:z.string().min(6).optional()});
export const loginSchema=z.object({email:z.string().email(),password:z.string().min(1)});
export const quoteSchema=z.object({pickupPostalCode:z.string().regex(/^\d{6}$/),dropPostalCode:z.string().regex(/^\d{6}$/),pickupAddress:z.string().min(8).optional(),dropAddress:z.string().min(8).optional(),length:z.number().positive(),breadth:z.number().positive(),height:z.number().positive(),actualWeight:z.number().positive(),orderType:z.enum(['B2B','B2C']),paymentType:z.enum(['PREPAID','COD']),pickupLatitude:z.number().optional(),pickupLongitude:z.number().optional()});
export const statusSchema=z.object({status:z.enum(['CONFIRMED','PICKED_UP','IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED','FAILED']),note:z.string().max(500).optional(),failureReason:z.string().min(2).optional(),failureNote:z.string().max(500).optional()});
