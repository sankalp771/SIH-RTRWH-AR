import { UserInput, CalculationResults, CityData, Coefficients } from '@shared/schema';
import citiesData from '../data/cities.json';
import coefficientsData from '../data/coefficients.json';
import fs from 'fs';
import path from 'path';

// Load static data
const cities: CityData[] = citiesData as CityData[];
const coefficients: Coefficients = coefficientsData as Coefficients;

/**
 * Scientific Rainwater Harvesting Calculation Engine
 * Based on CGWB (Central Ground Water Board) guidelines
 */
export class CalculationEngine {
  /**
   * Calculate water quality factor based on environmental conditions
   */
  private calculateQualityFactor(userInput: UserInput): number {
    const advancedFactors = coefficients.advancedFactors;
    let qualityFactor = advancedFactors.qualityFactors.environment[userInput.environment];
    
    // Adjust for bird nesting
    if (userInput.birdNesting) {
      qualityFactor *= advancedFactors.qualityFactors.birdNesting;
    }
    
    return qualityFactor;
  }

  /**
   * Get season based on month index (0-11)
   */
  private getSeason(monthIndex: number): string {
    if (monthIndex >= 2 && monthIndex <= 4) return 'premonsoon'; // Mar-May
    if (monthIndex >= 5 && monthIndex <= 8) return 'monsoon';    // Jun-Sep
    if (monthIndex >= 9 && monthIndex <= 10) return 'postmonsoon'; // Oct-Nov
    return 'winter'; // Dec-Feb
  }

  /**
   * Calculate monthly seasonal demand variation
   */
  private calculateMonthlySeasonalDemand(purpose: string): number[] {
    const multipliers = coefficients.advancedFactors.seasonalDemandMultipliers;
    return multipliers[purpose as keyof typeof multipliers] || multipliers.Domestic;
  }

  /**
   * Calculate dry period storage requirement
   */
  private calculateDryPeriodStorage(monthlyPotential: number[], householdDemand: number): number {
    const monthlyDemand = householdDemand / 12;
    let maxDeficit = 0;
    let cumulativeDeficit = 0;
    
    // Find the maximum cumulative deficit period
    for (let i = 0; i < monthlyPotential.length; i++) {
      const monthlyDeficit = monthlyDemand - monthlyPotential[i];
      cumulativeDeficit = Math.max(0, cumulativeDeficit + monthlyDeficit);
      maxDeficit = Math.max(maxDeficit, cumulativeDeficit);
    }
    
    return Math.round(maxDeficit);
  }

  /**
   * Calculate monsoon surplus that can be stored
   */
  private calculateMonsoonSurplus(monthlyPotential: number[], householdDemand: number): number {
    const monthlyDemand = householdDemand / 12;
    const monsoonMonths = [5, 6, 7, 8]; // June to September
    
    let totalSurplus = 0;
    for (const monthIndex of monsoonMonths) {
      const surplus = monthlyPotential[monthIndex] - monthlyDemand;
      if (surplus > 0) {
        totalSurplus += surplus;
      }
    }
    
    return Math.round(totalSurplus);
  }

  /**
   * Calculate filtration system cost based on water quality needs
   */
  private calculateFiltrationCost(userInput: UserInput): number {
    let baseCost = 5000; // Basic filtration
    
    if (userInput.purpose === 'Domestic') {
      baseCost = 12000; // UV + RO system
    }
    
    if (userInput.environment === 'Industrial') {
      baseCost *= 1.5; // Enhanced filtration for industrial areas
    }
    
    if (userInput.birdNesting) {
      baseCost *= 1.2; // Additional pre-filtration
    }
    
    return Math.round(baseCost);
  }

  /**
   * Calculate overall system efficiency
   */
  private calculateSystemEfficiency(userInput: UserInput, tankCapacity: number): number {
    let efficiency = 0.85; // Base efficiency
    
    // Tank size efficiency curve
    if (tankCapacity < 3000) efficiency *= 0.9;
    else if (tankCapacity > 10000) efficiency *= 1.05;
    
    // Roof type efficiency
    const roofEfficiency = {
      'RCC': 0.95,
      'GI': 1.0,
      'Asbestos': 0.85,
      'Tiles': 0.90
    };
    efficiency *= roofEfficiency[userInput.roofType as keyof typeof roofEfficiency];
    
    // Environmental impact
    if (userInput.environment === 'Industrial') efficiency *= 0.92;
    if (userInput.birdNesting) efficiency *= 0.95;
    
    return Math.min(efficiency, 0.95); // Cap at 95%
  }

  /**
   * Find city data by pincode or city name
   */
  private findCityData(location: string, pincode: string): CityData | null {
    // First try to find by pincode (more accurate)
    let cityData = cities.find(city => city.pincode.startsWith(pincode.substring(0, 3)));
    
    // If not found by pincode, try by city name (fuzzy match)
    if (!cityData) {
      const locationLower = location.toLowerCase();
      cityData = cities.find(city => 
        city.city.toLowerCase().includes(locationLower) ||
        locationLower.includes(city.city.toLowerCase()) ||
        city.state.toLowerCase().includes(locationLower)
      );
    }
    
    // Default to Delhi if no match found
    return cityData || cities.find(city => city.city === 'Delhi') || cities[0];
  }

  /**
   * Calculate Enhanced Rainwater Harvesting Potential
   * Formula: RHP = Rainfall × Roof Area × Runoff Coefficient × Quality Factor × Seasonal Factor
   */
  private calculateRainwaterPotential(userInput: UserInput, cityData: CityData): {
    annual: number;
    monthly: number[];
  } {
    const runoffCoeff = coefficients.runoffCoefficients[userInput.roofType];
    const qualityFactor = this.calculateQualityFactor(userInput);
    const evaporationLoss = coefficients.advancedFactors.evaporationLoss[cityData.region];
    
    const monthlyPotential = cityData.monthlyRainfall.map((rainfall, index) => {
      // Determine season for seasonal variation
      const season = this.getSeason(index);
      const seasonalFactor = coefficients.advancedFactors.seasonalVariation[season as keyof typeof coefficients.advancedFactors.seasonalVariation];
      
      // Calculate raw potential
      const rawPotential = userInput.roofArea * rainfall * runoffCoeff;
      
      // Apply quality and seasonal adjustments
      const adjustedPotential = rawPotential * qualityFactor * seasonalFactor;
      
      // Account for evaporation loss
      const finalPotential = adjustedPotential * (1 - evaporationLoss);
      
      return Math.round(finalPotential);
    });
    
    const annualPotential = monthlyPotential.reduce((sum, month) => sum + month, 0);
    
    return {
      annual: annualPotential,
      monthly: monthlyPotential
    };
  }

  /**
   * Calculate Enhanced Household Water Demand with Monthly Variation
   * Formula: Demand = Number of people × Daily consumption × Days in month × Purpose Factor × Monthly Seasonal Factor
   */
  private calculateHouseholdDemand(userInput: UserInput): number {
    const dailyConsumption = coefficients.waterRates.domesticConsumption;
    
    // Adjust consumption based on purpose
    let purposeFactor = 1.0;
    if (userInput.purpose === 'Irrigation') purposeFactor = 1.8; // Enhanced for agricultural needs
    if (userInput.purpose === 'Industrial') purposeFactor = 2.3; // More realistic industrial usage
    
    // Calculate monthly seasonal demand variation
    const monthlyMultipliers = this.calculateMonthlySeasonalDemand(userInput.purpose);
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    let totalAnnualDemand = 0;
    for (let i = 0; i < 12; i++) {
      const monthlyDemand = userInput.dwellers * dailyConsumption * daysInMonths[i] * purposeFactor * monthlyMultipliers[i];
      totalAnnualDemand += monthlyDemand;
    }
    
    return Math.round(totalAnnualDemand);
  }

  /**
   * Calculate Optimized Storage Tank Sizing
   * Advanced algorithm considering dry periods, peak demand, and storage efficiency
   */
  private calculateStorageTank(rainwaterPotential: number, monthlyPotential: number[], householdDemand: number, cityData: CityData): {
    capacity: number;
    dimensions: { diameter: number; height: number };
  } {
    // Analyze dry period to determine minimum storage needed
    const dryPeriodStorage = this.calculateDryPeriodStorage(monthlyPotential, householdDemand);
    
    // Calculate monsoon surplus that can be stored
    const monsoonSurplus = this.calculateMonsoonSurplus(monthlyPotential, householdDemand);
    
    // Determine optimal tank size based on multiple factors
    const demandBasedCapacity = Math.round((householdDemand / 365) * 45); // Increased to 45 days
    const potentialBasedCapacity = Math.round(rainwaterPotential * 0.25); // Increased to 25%
    const dryPeriodBasedCapacity = dryPeriodStorage;
    const monsoonBasedCapacity = Math.min(monsoonSurplus, 20000); // Cap at 20,000L
    
    // Choose the most appropriate capacity
    let tankCapacity = Math.max(
      Math.min(demandBasedCapacity, potentialBasedCapacity),
      dryPeriodBasedCapacity * 0.8, // 80% of dry period need
      3000 // Minimum 3000L for effectiveness
    );
    
    // Consider monsoon surplus for final sizing, but ensure minimum is maintained
    tankCapacity = Math.max(3000, Math.min(tankCapacity, monsoonBasedCapacity));
    
    // Calculate optimized tank dimensions (height varies for efficiency)
    const tankVolume = tankCapacity / 1000; // cubic meters
    let tankHeight, tankDiameter;
    
    if (tankVolume <= 8) {
      tankHeight = 2.0; // Standard height for smaller tanks
    } else if (tankVolume <= 20) {
      tankHeight = 2.5; // Taller for medium tanks
    } else {
      tankHeight = 3.0; // Maximum practical height
    }
    
    tankDiameter = Math.sqrt((tankVolume * 4) / (Math.PI * tankHeight));
    
    return {
      capacity: Math.round(tankCapacity),
      dimensions: {
        diameter: Number(tankDiameter.toFixed(1)),
        height: tankHeight
      }
    };
  }

  /**
   * Calculate Recharge System (for artificial recharge)
   */
  private calculateRechargeSystem(userInput: UserInput, rainwaterPotential: number, cityData: CityData): {
    rechargeVolume: number;
    pitDimensions: { length: number; width: number; depth: number };
  } {
    const infiltrationRate = coefficients.infiltrationRates[userInput.soilType]; // mm/hr
    
    // Recharge volume = 70-90% of rainwater potential (depending on soil type)
    let rechargeFactor = 0.7; // Default for clayey soil
    if (userInput.soilType === 'Sandy') rechargeFactor = 0.9;
    if (userInput.soilType === 'Loamy') rechargeFactor = 0.8;
    
    const rechargeVolume = Math.round((rainwaterPotential / 1000) * rechargeFactor);
    
    // Calculate pit dimensions based on infiltration rate and recharge volume
    // Formula: Required pit area = Daily inflow / (Infiltration rate * Operating hours)
    const dailyInflowRate = rainwaterPotential / 120; // Assuming 120 rainy days per year (L/day)
    const operatingHours = 8; // Hours per day for infiltration
    const infiltrationRateMs = infiltrationRate / 1000; // Convert mm/hr to m/hr
    
    // Calculate minimum pit area based on infiltration capacity
    const minPitArea = Math.max(9, dailyInflowRate / (infiltrationRateMs * operatingHours * 1000)); // m²
    
    // Pit depth based on groundwater depth and soil type
    const maxDepth = Math.min(4, Math.max(2, userInput.groundwaterDepth * 0.3));
    
    // Adjust pit area if storage volume requires more space
    const storageBasedArea = (rechargeVolume * 1.2) / maxDepth; // 20% extra for temporary storage
    const requiredArea = Math.max(minPitArea, storageBasedArea);
    
    const pitSide = Math.ceil(Math.sqrt(requiredArea));
    
    return {
      rechargeVolume,
      pitDimensions: {
        length: Math.max(pitSide, 3), // Minimum 3m
        width: Math.max(pitSide, 3),
        depth: maxDepth
      }
    };
  }

  /**
   * Calculate Advanced System Costs with Lifecycle Analysis
   */
  private calculateCosts(userInput: UserInput, rainwaterPotential: number, tankCapacity: number, hasRecharge: boolean): {
    systemCost: { low: number; medium: number; high: number };
    annualSavings: number;
    paybackPeriod: number;
    lifeCycleCost: number;
    maintenanceCost: number;
  } {
    // Enhanced cost calculation
    const baseCost = userInput.roofArea * coefficients.costFactors.baseCostPerSqm;
    const tankCost = tankCapacity * (tankCapacity > 10000 ? 0.75 : 0.85); // Economies of scale
    const rechargeCost = hasRecharge ? userInput.roofArea * 180 : 0; // Updated recharge cost
    const pumpCost = tankCapacity > 5000 ? 8000 : 4500; // Pump system cost
    const filtrationCost = this.calculateFiltrationCost(userInput);
    
    const totalBaseCost = baseCost + tankCost + rechargeCost + pumpCost + filtrationCost;
    
    const systemCost = {
      low: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.Low),
      medium: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.Medium),
      high: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.High)
    };
    
    // Fixed savings calculation using actual rainwaterPotential
    const householdDemand = this.calculateHouseholdDemand(userInput);
    const municipalRate = coefficients.waterRates.municipalRate;
    const systemEfficiency = this.calculateSystemEfficiency(userInput, tankCapacity);
    const usableWater = Math.min(rainwaterPotential * systemEfficiency, householdDemand);
    
    // Include water quality premium (RO water cost saving)
    const qualityPremium = userInput.purpose === 'Domestic' ? 0.015 : 0.005;
    const annualSavings = Math.round(usableWater * (municipalRate + qualityPremium));
    
    // Lifecycle cost analysis
    const advancedFactors = coefficients.advancedFactors;
    const systemLife = advancedFactors.lifeCycleFactors.system_life;
    const annualMaintenance = systemCost.medium * advancedFactors.maintenanceCosts.annual;
    const totalMaintenanceCost = annualMaintenance * systemLife;
    const lifeCycleCost = systemCost.medium + totalMaintenanceCost;
    
    const paybackPeriod = Math.round(systemCost.medium / Math.max(annualSavings - annualMaintenance, 1));
    
    return {
      systemCost,
      annualSavings,
      paybackPeriod: Math.min(paybackPeriod, 25),
      lifeCycleCost,
      maintenanceCost: Math.round(annualMaintenance)
    };
  }

  /**
   * Calculate Feasibility Score and Generate Recommendations
   */
  private calculateFeasibility(userInput: UserInput, cityData: CityData, rainwaterPotential: number, householdDemand: number): {
    feasibilityScore: number;
    feasibilityLevel: 'High' | 'Medium' | 'Low';
    recommendations: string[];
    warnings: string[];
  } {
    let score = 50; // Base score
    const recommendations: string[] = [];
    const warnings: string[] = [];
    
    // Rainfall adequacy (0-25 points)
    if (cityData.annualRainfall > 1000) {
      score += 25;
      recommendations.push('Excellent rainfall - consider larger storage capacity');
    } else if (cityData.annualRainfall > 600) {
      score += 15;
      recommendations.push('Good rainfall - standard system recommended');
    } else {
      score += 5;
      warnings.push('Low rainfall area - consider supplementary water sources');
    }
    
    // Roof suitability (0-20 points)
    if (userInput.roofType === 'RCC' || userInput.roofType === 'GI') {
      score += 20;
      recommendations.push(`${userInput.roofType} roof is excellent for rainwater harvesting`);
    } else if (userInput.roofType === 'Tiles') {
      score += 15;
      recommendations.push('Clay/concrete tiles are suitable with proper first flush diverter');
    } else {
      score += 10;
      warnings.push('Asbestos roofs require regular cleaning and filtration');
    }
    
    // Soil conditions (0-15 points)
    if (userInput.soilType === 'Sandy') {
      score += 15;
      recommendations.push('Sandy soil is ideal for groundwater recharge');
    } else if (userInput.soilType === 'Loamy') {
      score += 10;
      recommendations.push('Loamy soil provides good infiltration for recharge');
    } else {
      score += 5;
      recommendations.push('Clayey soil requires larger recharge structures');
    }
    
    // Groundwater depth (0-15 points)
    if (userInput.groundwaterDepth > 3 && userInput.groundwaterDepth < 30) {
      score += 15;
      recommendations.push('Optimal groundwater depth for recharge systems');
    } else if (userInput.groundwaterDepth <= 3) {
      score += 5;
      warnings.push('Shallow groundwater - ensure proper drainage to prevent waterlogging');
    } else {
      score += 10;
      warnings.push('Deep groundwater - recharge benefits may take longer to realize');
    }
    
    // Coverage analysis (0-10 points)
    const coverage = (rainwaterPotential / householdDemand) * 100;
    if (coverage > 80) {
      score += 10;
      recommendations.push('Excellent coverage - consider selling excess water or larger recharge');
    } else if (coverage > 50) {
      score += 7;
      recommendations.push('Good coverage - system will significantly reduce water bills');
    } else {
      score += 3;
      recommendations.push('Partial coverage - combine with water conservation measures');
    }
    
    // Environmental factors
    if (userInput.birdNesting) {
      warnings.push('Bird nesting detected - install mesh covers and regular cleaning required');
    }
    
    if (userInput.environment === 'Industrial') {
      warnings.push('Industrial area - test water quality regularly and use appropriate filtration');
    }
    
    // Monsoon dependency check
    const monsoonMonths = cityData.monthlyRainfall.slice(5, 9); // June to September
    const monsoonRainfall = monsoonMonths.reduce((sum, month) => sum + month, 0);
    if (monsoonRainfall / cityData.annualRainfall > 0.7) {
      warnings.push('High monsoon dependency - 70%+ rainfall in 4 months');
    }
    
    // Standard recommendations
    recommendations.push('Install first flush diverter to improve water quality');
    if (userInput.purpose === 'Domestic') {
      recommendations.push('Consider UV/RO purification for drinking water use');
    }
    if (userInput.hasOpenSpace) {
      recommendations.push('Connect overflow to recharge pit for maximum benefit');
    }
    
    const feasibilityLevel = score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';
    
    return {
      feasibilityScore: Math.min(100, score),
      feasibilityLevel,
      recommendations,
      warnings
    };
  }

  /**
   * Main calculation function
   */
  public calculate(userInput: UserInput, calculationType: 'rainwater' | 'recharge'): CalculationResults {
    // Find city data
    const cityData = this.findCityData(userInput.location, userInput.pincode);
    if (!cityData) {
      throw new Error(`City data not found for ${userInput.location}, ${userInput.pincode}`);
    }

    // Core calculations
    const { annual: rainwaterPotential, monthly: monthlyPotential } = this.calculateRainwaterPotential(userInput, cityData);
    const householdDemand = this.calculateHouseholdDemand(userInput);
    const coveragePercentage = Math.min(100, Math.round((rainwaterPotential / householdDemand) * 100));
    const firstFlush = Math.round(userInput.roofArea * 2); // 2mm first flush
    
    // Storage system
    const { capacity: tankCapacity, dimensions: tankDimensions } = this.calculateStorageTank(
      rainwaterPotential, monthlyPotential, householdDemand, cityData
    );
    
    // Cost analysis
    const { systemCost, annualSavings, paybackPeriod, lifeCycleCost, maintenanceCost } = this.calculateCosts(
      userInput, rainwaterPotential, tankCapacity, calculationType === 'recharge'
    );
    
    // Feasibility analysis
    const { feasibilityScore, feasibilityLevel, recommendations, warnings } = this.calculateFeasibility(
      userInput, cityData, rainwaterPotential, householdDemand
    );
    
    // Base results
    const results: CalculationResults = {
      rainwaterPotential,
      monthlyPotential,
      householdDemand,
      coveragePercentage,
      firstFlush,
      tankCapacity,
      tankDimensions,
      systemCost,
      annualSavings,
      paybackPeriod,
      lifeCycleCost,
      maintenanceCost,
      feasibilityScore,
      feasibilityLevel,
      recommendations,
      warnings
    };
    
    // Add recharge calculations if needed
    if (calculationType === 'recharge') {
      const { rechargeVolume, pitDimensions } = this.calculateRechargeSystem(
        userInput, rainwaterPotential, cityData
      );
      results.rechargeVolume = rechargeVolume;
      results.pitDimensions = pitDimensions;
    }
    
    return results;
  }
}

export const calculationEngine = new CalculationEngine();