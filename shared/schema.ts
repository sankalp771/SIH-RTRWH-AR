import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Rainwater Harvesting Input Schema
export const rainwaterInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  roofArea: z.number().min(1, "Roof area must be greater than 0"),
  roofType: z.enum(["RCC", "GI", "Asbestos", "Tiles"]),
  environment: z.enum(["Residential", "Industrial", "Agricultural"]),
  birdNesting: z.boolean(),
  dwellers: z.number().min(1, "Number of dwellers must be at least 1"),
  purpose: z.enum(["Domestic", "Irrigation", "Industrial"]),
  hasOpenSpace: z.boolean(),
  openSpaceArea: z.number().optional(),
  groundwaterDepth: z.number().min(0, "Groundwater depth must be positive"),
  soilType: z.enum(["Sandy", "Loamy", "Clayey"]),
  budget: z.enum(["Low", "Medium", "High"])
});

// Artificial Recharge Input Schema (for borewells and groundwater recharge)
export const rechargeInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
  catchmentArea: z.number().min(1, "Catchment area must be greater than 0"),
  catchmentType: z.enum(["Rooftop", "Terrace", "Paved", "Open Ground"]),
  hasOpenSpace: z.boolean(),
  openSpaceArea: z.number().min(1, "Open space area is required for recharge").optional(),
  soilType: z.enum(["Sandy", "Loamy", "Clayey"]),
  groundwaterDepth: z.number().min(0, "Groundwater depth must be positive"),
  hasBorewell: z.boolean(),
  borewellCount: z.number().min(0, "Borewell count cannot be negative").optional(),
  borewellDepth: z.number().min(0, "Borewell depth must be positive").optional(),
  borewellCondition: z.enum(["Working", "Dead", "Partially-Dead"]).optional(),
  aquiferType: z.enum(["Alluvial", "Hard Rock", "Coastal", "Desert"]).optional(),
  budget: z.enum(["Low", "Medium", "High"])
}).refine((data) => {
  if (data.hasOpenSpace && (!data.openSpaceArea || data.openSpaceArea <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Open space area is required when open space is available",
  path: ["openSpaceArea"]
}).refine((data) => {
  if (data.hasBorewell && (!data.borewellDepth || data.borewellDepth <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Borewell depth is required when borewell is present",
  path: ["borewellDepth"]
}).refine((data) => {
  if (data.hasBorewell && !data.borewellCondition) {
    return false;
  }
  return true;
}, {
  message: "Borewell condition is required when borewell is present",
  path: ["borewellCondition"]
});

// Combined input schema (for backwards compatibility and type union)
export const userInputSchema = z.union([rainwaterInputSchema, rechargeInputSchema]);

// Rainwater Harvesting Results Schema
export const rainwaterResultsSchema = z.object({
  rainwaterPotential: z.number(), // liters per year
  monthlyPotential: z.array(z.number()), // 12 months
  householdDemand: z.number(), // liters per year
  coveragePercentage: z.number(), // %
  firstFlush: z.number(), // liters
  tankCapacity: z.number(), // liters
  tankDimensions: z.object({
    diameter: z.number(), // meters
    height: z.number() // meters
  }),
  systemCost: z.object({
    low: z.number(),
    medium: z.number(),
    high: z.number()
  }),
  annualSavings: z.number(), // rupees
  paybackPeriod: z.number(), // years
  lifeCycleCost: z.number(), // total lifecycle cost in rupees
  maintenanceCost: z.number(), // annual maintenance cost in rupees
  feasibilityScore: z.number(), // 0-100
  feasibilityLevel: z.enum(["High", "Medium", "Low"]),
  recommendations: z.array(z.string()),
  warnings: z.array(z.string())
});

// Artificial Recharge Results Schema
export const rechargeResultsSchema = z.object({
  rainwaterPotential: z.number(), // liters per year
  monthlyPotential: z.array(z.number()), // 12 months
  rechargeVolume: z.number(), // cubic meters per year
  pitDimensions: z.object({
    length: z.number(),
    width: z.number(),
    depth: z.number()
  }).optional(),
  trenchDimensions: z.object({
    length: z.number(), // meters
    width: z.number(), // meters
    depth: z.number(), // meters
    count: z.number() // number of trenches
  }).optional(),
  borewellRechargeCapacity: z.number().optional(), // liters per hour
  borewellRejuvenation: z.object({
    recommended: z.boolean(),
    method: z.string(),
    expectedImprovement: z.string()
  }).optional(),
  systemCost: z.object({
    low: z.number(),
    medium: z.number(),
    high: z.number()
  }),
  groundwaterBenefit: z.number(), // cubic meters per year
  paybackPeriod: z.number(), // years
  lifeCycleCost: z.number(), // total lifecycle cost in rupees
  maintenanceCost: z.number(), // annual maintenance cost in rupees
  feasibilityScore: z.number(), // 0-100
  feasibilityLevel: z.enum(["High", "Medium", "Low"]),
  recommendations: z.array(z.string()),
  warnings: z.array(z.string())
});

// Combined results schema (for backwards compatibility)
export const calculationResultsSchema = z.union([rainwaterResultsSchema, rechargeResultsSchema]);

// Database Tables (for optional persistence)
export const userSubmissions = pgTable("user_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userInputs: jsonb("user_inputs").notNull(),
  calculationType: varchar("calculation_type", { length: 20 }).notNull(), // 'rainwater' or 'recharge'
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Static Data Types
export const cityDataSchema = z.object({
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  monthlyRainfall: z.array(z.number()), // 12 months in mm
  annualRainfall: z.number(), // mm
  groundwaterDepth: z.number(), // meters
  aquiferType: z.enum(["Alluvial", "Hard Rock", "Coastal", "Desert"]),
  region: z.enum(["North", "South", "East", "West", "Central", "Northeast"])
});

export const coefficientsSchema = z.object({
  runoffCoefficients: z.object({
    RCC: z.number(),
    GI: z.number(),
    Asbestos: z.number(),
    Tiles: z.number()
  }),
  infiltrationRates: z.object({ // mm/hour
    Sandy: z.number(),
    Loamy: z.number(),
    Clayey: z.number()
  }),
  costFactors: z.object({
    baseCostPerSqm: z.number(), // rupees per square meter
    budgetMultipliers: z.object({
      Low: z.number(),
      Medium: z.number(),
      High: z.number()
    })
  }),
  waterRates: z.object({
    municipalRate: z.number(), // rupees per liter
    domesticConsumption: z.number() // liters per person per day
  }),
  advancedFactors: z.object({
    evaporationLoss: z.object({
      North: z.number(),
      South: z.number(),
      East: z.number(),
      West: z.number(),
      Central: z.number(),
      Northeast: z.number()
    }),
    qualityFactors: z.object({
      environment: z.object({
        Residential: z.number(),
        Industrial: z.number(),
        Agricultural: z.number()
      }),
      roofAge: z.object({
        new: z.number(),
        moderate: z.number(),
        old: z.number()
      }),
      birdNesting: z.number()
    }),
    seasonalVariation: z.object({
      premonsoon: z.number(),
      monsoon: z.number(),
      postmonsoon: z.number(),
      winter: z.number()
    }),
    seasonalDemandMultipliers: z.object({
      Domestic: z.array(z.number()).length(12),
      Irrigation: z.array(z.number()).length(12),
      Industrial: z.array(z.number()).length(12)
    }),
    maintenanceCosts: z.object({
      annual: z.number(),
      deep_cleaning: z.number(),
      filter_replacement: z.number()
    }),
    lifeCycleFactors: z.object({
      system_life: z.number(),
      tank_life: z.number(),
      pump_life: z.number(),
      filter_life: z.number()
    })
  })
});

// Type exports
export type RainwaterInput = z.infer<typeof rainwaterInputSchema>;
export type RechargeInput = z.infer<typeof rechargeInputSchema>;
export type UserInput = z.infer<typeof userInputSchema>;
export type RainwaterResults = z.infer<typeof rainwaterResultsSchema>;
export type RechargeResults = z.infer<typeof rechargeResultsSchema>;
export type CalculationResults = z.infer<typeof calculationResultsSchema>;
export type CityData = z.infer<typeof cityDataSchema>;
export type Coefficients = z.infer<typeof coefficientsSchema>;

// Database insertion schemas
export const insertUserSubmissionSchema = createInsertSchema(userSubmissions);
export type InsertUserSubmission = z.infer<typeof insertUserSubmissionSchema>;
export type UserSubmission = typeof userSubmissions.$inferSelect;
