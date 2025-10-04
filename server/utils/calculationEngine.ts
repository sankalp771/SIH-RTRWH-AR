import { 
  RainwaterInput, 
  RechargeInput, 
  RainwaterResults, 
  RechargeResults, 
  CityData, 
  Coefficients 
} from '@shared/schema';
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
   * Calculate water quality factor based on environmental conditions (Rainwater only)
   */
  private calculateQualityFactor(userInput: RainwaterInput): number {
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
   * Calculate filtration system cost based on water quality needs (Rainwater only)
   */
  private calculateFiltrationCost(userInput: RainwaterInput): number {
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
   * Calculate overall system efficiency (Rainwater only)
   */
  private calculateSystemEfficiency(userInput: RainwaterInput, tankCapacity: number): number {
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
   * Calculate Enhanced Rainwater Harvesting Potential (Rainwater)
   * Formula: RHP = Rainfall × Roof Area × Runoff Coefficient × Quality Factor × Seasonal Factor
   */
  private calculateRainwaterPotential(userInput: RainwaterInput, cityData: CityData): {
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
   * Calculate Recharge Potential (Artificial Recharge)
   * Formula: RP = Rainfall × Catchment Area × Runoff Coefficient × Seasonal Factor
   */
  private calculateRechargePotential(userInput: RechargeInput, cityData: CityData): {
    annual: number;
    monthly: number[];
  } {
    // Runoff coefficient based on catchment type
    const catchmentCoeff = {
      'Rooftop': 0.85,
      'Terrace': 0.90,
      'Paved': 0.80,
      'Open Ground': 0.20
    };
    
    const runoffCoeff = catchmentCoeff[userInput.catchmentType];
    const evaporationLoss = coefficients.advancedFactors.evaporationLoss[cityData.region];
    
    const monthlyPotential = cityData.monthlyRainfall.map((rainfall, index) => {
      const season = this.getSeason(index);
      const seasonalFactor = coefficients.advancedFactors.seasonalVariation[season as keyof typeof coefficients.advancedFactors.seasonalVariation];
      
      const rawPotential = userInput.catchmentArea * rainfall * runoffCoeff;
      const adjustedPotential = rawPotential * seasonalFactor;
      const finalPotential = adjustedPotential * (1 - evaporationLoss * 0.5); // Less evaporation loss for recharge
      
      return Math.round(finalPotential);
    });
    
    const annualPotential = monthlyPotential.reduce((sum, month) => sum + month, 0);
    
    return {
      annual: annualPotential,
      monthly: monthlyPotential
    };
  }

  /**
   * Calculate Trench Dimensions for Artificial Recharge
   */
  private calculateTrenchDimensions(userInput: RechargeInput, rechargeVolume: number, cityData: CityData): {
    length: number;
    width: number;
    depth: number;
    count: number;
  } | undefined {
    if (!userInput.hasOpenSpace || !userInput.openSpaceArea) {
      return undefined;
    }

    const infiltrationRate = coefficients.infiltrationRates[userInput.soilType]; // mm/hr
    const openSpaceArea = userInput.openSpaceArea;
    
    // Trench specifications based on open space
    const trenchWidth = 0.5; // meters (standard width)
    const trenchDepth = Math.min(1.5, userInput.groundwaterDepth * 0.15); // Shallower than pits
    
    // Calculate required trench length based on infiltration capacity
    const dailyInflowRate = (rechargeVolume * 1000) / 120; // L/day for rainy season
    const infiltrationRateMs = infiltrationRate / 1000; // m/hr
    const trenchArea = dailyInflowRate / (infiltrationRateMs * 8 * 1000); // m²
    
    const totalTrenchLength = trenchArea / trenchWidth;
    
    // Calculate number of trenches based on available space
    const maxTrenchLength = Math.sqrt(openSpaceArea) * 0.8; // Maximum single trench length
    const trenchCount = Math.ceil(totalTrenchLength / maxTrenchLength);
    const actualTrenchLength = totalTrenchLength / trenchCount;
    
    return {
      length: Number(actualTrenchLength.toFixed(1)),
      width: trenchWidth,
      depth: trenchDepth,
      count: Math.max(1, trenchCount)
    };
  }

  /**
   * Calculate Borewell Rejuvenation Strategy
   */
  private calculateBorewellRejuvenation(userInput: RechargeInput, rechargeVolume: number): {
    recommended: boolean;
    method: string;
    expectedImprovement: string;
  } | undefined {
    if (!userInput.hasBorewell || !userInput.borewellCondition) {
      return undefined;
    }

    const condition = userInput.borewellCondition;
    let recommended = false;
    let method = '';
    let expectedImprovement = '';

    if (condition === 'Dead') {
      recommended = true;
      method = 'Direct recharge through borewell with filter media and sedimentation chamber';
      expectedImprovement = '60-80% recovery possible with direct recharge. Expected yield: 2000-4000 LPH';
    } else if (condition === 'Partially-Dead') {
      recommended = true;
      method = 'Recharge pit near borewell (5m distance) with gravel and sand filter layers';
      expectedImprovement = '40-60% improvement in yield. Expected increase: 1500-3000 LPH';
    } else {
      recommended = true;
      method = 'Preventive recharge pit to maintain borewell health and increase groundwater table';
      expectedImprovement = '20-30% yield improvement and extended borewell life';
    }

    return {
      recommended,
      method,
      expectedImprovement
    };
  }

  /**
   * Calculate Borewell Recharge Capacity
   */
  private calculateBorewellRechargeCapacity(userInput: RechargeInput, rechargeVolume: number): number | undefined {
    if (!userInput.hasBorewell || !userInput.borewellDepth) {
      return undefined;
    }

    // Recharge capacity depends on borewell depth and condition
    const baseCapacity = 2000; // L/hr base capacity
    const depthFactor = Math.min(1.5, userInput.borewellDepth / 30); // Deeper borewells = better recharge
    
    let conditionFactor = 1.0;
    if (userInput.borewellCondition === 'Dead') {
      conditionFactor = 0.6; // Lower capacity for dead borewells initially
    } else if (userInput.borewellCondition === 'Partially-Dead') {
      conditionFactor = 0.75;
    }

    return Math.round(baseCapacity * depthFactor * conditionFactor);
  }

  /**
   * Calculate Enhanced Household Water Demand with Monthly Variation (Rainwater only)
   * Formula: Demand = Number of people × Daily consumption × Days in month × Purpose Factor × Monthly Seasonal Factor
   */
  private calculateHouseholdDemand(userInput: RainwaterInput): number {
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
   * Calculate Recharge Pit Dimensions (for artificial recharge)
   */
  private calculateRechargePit(userInput: RechargeInput, rainwaterPotential: number): {
    length: number;
    width: number;
    depth: number;
  } | undefined {
    const infiltrationRate = coefficients.infiltrationRates[userInput.soilType]; // mm/hr
    
    // Calculate pit dimensions based on infiltration rate and recharge volume
    const dailyInflowRate = rainwaterPotential / 120; // Assuming 120 rainy days per year (L/day)
    const operatingHours = 8; // Hours per day for infiltration
    const infiltrationRateMs = infiltrationRate / 1000; // Convert mm/hr to m/hr
    
    // Calculate minimum pit area based on infiltration capacity
    const minPitArea = Math.max(9, dailyInflowRate / (infiltrationRateMs * operatingHours * 1000)); // m²
    
    // Pit depth based on groundwater depth and soil type
    const maxDepth = Math.min(4, Math.max(2, userInput.groundwaterDepth * 0.3));
    
    const pitSide = Math.ceil(Math.sqrt(minPitArea));
    
    return {
      length: Math.max(pitSide, 3), // Minimum 3m
      width: Math.max(pitSide, 3),
      depth: maxDepth
    };
  }

  /**
   * Calculate Rainwater Harvesting System Costs
   */
  private calculateRainwaterCosts(userInput: RainwaterInput, rainwaterPotential: number, tankCapacity: number): {
    systemCost: { low: number; medium: number; high: number };
    annualSavings: number;
    paybackPeriod: number;
    lifeCycleCost: number;
    maintenanceCost: number;
  } {
    const baseCost = userInput.roofArea * coefficients.costFactors.baseCostPerSqm;
    const tankCost = tankCapacity * (tankCapacity > 10000 ? 0.75 : 0.85);
    const pumpCost = tankCapacity > 5000 ? 8000 : 4500;
    const filtrationCost = this.calculateFiltrationCost(userInput);
    
    const totalBaseCost = baseCost + tankCost + pumpCost + filtrationCost;
    
    const systemCost = {
      low: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.Low),
      medium: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.Medium),
      high: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.High)
    };
    
    const householdDemand = this.calculateHouseholdDemand(userInput);
    const municipalRate = coefficients.waterRates.municipalRate;
    const systemEfficiency = this.calculateSystemEfficiency(userInput, tankCapacity);
    const usableWater = Math.min(rainwaterPotential * systemEfficiency, householdDemand);
    
    const qualityPremium = userInput.purpose === 'Domestic' ? 0.015 : 0.005;
    const annualSavings = Math.round(usableWater * (municipalRate + qualityPremium));
    
    const advancedFactors = coefficients.advancedFactors;
    const systemLife = advancedFactors.lifeCycleFactors.system_life;
    const annualMaintenance = systemCost.medium * advancedFactors.maintenanceCosts.annual;
    const lifeCycleCost = systemCost.medium + (annualMaintenance * systemLife);
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
   * Calculate Artificial Recharge System Costs
   */
  private calculateRechargeCosts(userInput: RechargeInput, rechargeVolume: number): {
    systemCost: { low: number; medium: number; high: number };
    paybackPeriod: number;
    lifeCycleCost: number;
    maintenanceCost: number;
    groundwaterBenefit: number;
  } {
    // Recharge system cost calculation
    const baseCost = userInput.catchmentArea * 250; // Cost per sqm for recharge setup
    const pitCost = 45000; // Standard recharge pit cost
    const trenchCost = userInput.hasOpenSpace && userInput.openSpaceArea ? userInput.openSpaceArea * 150 : 0;
    const borewellRechargeCost = userInput.hasBorewell ? 35000 : 0; // Borewell recharge setup
    
    const totalBaseCost = baseCost + pitCost + trenchCost + borewellRechargeCost;
    
    const systemCost = {
      low: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.Low),
      medium: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.Medium),
      high: Math.round(totalBaseCost * coefficients.costFactors.budgetMultipliers.High)
    };
    
    // Environmental/community benefit (not direct monetary savings)
    const groundwaterBenefit = rechargeVolume; // m³ per year
    
    const advancedFactors = coefficients.advancedFactors;
    const systemLife = advancedFactors.lifeCycleFactors.system_life;
    const annualMaintenance = systemCost.medium * 0.03; // 3% annual maintenance for recharge
    const lifeCycleCost = systemCost.medium + (annualMaintenance * systemLife);
    
    // Payback in terms of borewell sustainability (estimated value)
    const borewellSavings = userInput.hasBorewell ? 12000 : 5000; // Annual value of sustained groundwater
    const paybackPeriod = Math.round(systemCost.medium / Math.max(borewellSavings, 1));
    
    return {
      systemCost,
      paybackPeriod: Math.min(paybackPeriod, 30),
      lifeCycleCost,
      maintenanceCost: Math.round(annualMaintenance),
      groundwaterBenefit
    };
  }

  /**
   * Main calculation function - delegates to specific calculators
   */
  public calculate(userInput: RainwaterInput | RechargeInput, calculationType: 'rainwater' | 'recharge'): RainwaterResults | RechargeResults {
    if (calculationType === 'rainwater') {
      return this.calculateRainwaterHarvesting(userInput as RainwaterInput);
    } else {
      return this.calculateArtificialRecharge(userInput as RechargeInput);
    }
  }

  /**
   * Calculate Rainwater Harvesting System
   */
  private calculateRainwaterHarvesting(userInput: RainwaterInput): RainwaterResults {
    const cityData = this.findCityData(userInput.location, userInput.pincode);
    if (!cityData) {
      throw new Error(`City data not found for ${userInput.location}, ${userInput.pincode}`);
    }

    const { annual: rainwaterPotential, monthly: monthlyPotential } = this.calculateRainwaterPotential(userInput, cityData);
    const householdDemand = this.calculateHouseholdDemand(userInput);
    const coveragePercentage = Math.min(100, Math.round((rainwaterPotential / householdDemand) * 100));
    const firstFlush = Math.round(userInput.roofArea * 2);
    
    const { capacity: tankCapacity, dimensions: tankDimensions } = this.calculateStorageTank(
      rainwaterPotential, monthlyPotential, householdDemand, cityData
    );
    
    const { systemCost, annualSavings, paybackPeriod, lifeCycleCost, maintenanceCost } = 
      this.calculateRainwaterCosts(userInput, rainwaterPotential, tankCapacity);
    
    const { feasibilityScore, feasibilityLevel, recommendations, warnings } = 
      this.calculateRainwaterFeasibility(userInput, cityData, rainwaterPotential, householdDemand);
    
    return {
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
  }

  /**
   * Calculate Artificial Recharge System
   */
  private calculateArtificialRecharge(userInput: RechargeInput): RechargeResults {
    const cityData = this.findCityData(userInput.location, userInput.pincode);
    if (!cityData) {
      throw new Error(`City data not found for ${userInput.location}, ${userInput.pincode}`);
    }

    const { annual: rainwaterPotential, monthly: monthlyPotential } = this.calculateRechargePotential(userInput, cityData);
    
    const rechargeFactor = userInput.soilType === 'Sandy' ? 0.9 : userInput.soilType === 'Loamy' ? 0.8 : 0.7;
    const rechargeVolume = Math.round((rainwaterPotential / 1000) * rechargeFactor);
    
    const pitDimensions = this.calculateRechargePit(userInput, rainwaterPotential);
    const trenchDimensions = this.calculateTrenchDimensions(userInput, rechargeVolume, cityData);
    const borewellRejuvenation = this.calculateBorewellRejuvenation(userInput, rechargeVolume);
    const borewellRechargeCapacity = this.calculateBorewellRechargeCapacity(userInput, rechargeVolume);
    
    const { systemCost, paybackPeriod, lifeCycleCost, maintenanceCost, groundwaterBenefit } = 
      this.calculateRechargeCosts(userInput, rechargeVolume);
    
    const { feasibilityScore, feasibilityLevel, recommendations, warnings } = 
      this.calculateRechargeFeasibility(userInput, cityData, rechargeVolume);
    
    return {
      rainwaterPotential,
      monthlyPotential,
      rechargeVolume,
      pitDimensions,
      trenchDimensions,
      borewellRechargeCapacity,
      borewellRejuvenation,
      systemCost,
      groundwaterBenefit,
      paybackPeriod,
      lifeCycleCost,
      maintenanceCost,
      feasibilityScore,
      feasibilityLevel,
      recommendations,
      warnings
    };
  }

  /**
   * Calculate Rainwater Harvesting Feasibility
   */
  private calculateRainwaterFeasibility(userInput: RainwaterInput, cityData: CityData, rainwaterPotential: number, householdDemand: number): {
    feasibilityScore: number;
    feasibilityLevel: 'High' | 'Medium' | 'Low';
    recommendations: string[];
    warnings: string[];
  } {
    let score = 50;
    const recommendations: string[] = [];
    const warnings: string[] = [];
    
    if (cityData.annualRainfall > 1000) {
      score += 25;
      recommendations.push('Excellent rainfall - consider larger storage capacity');
    } else if (cityData.annualRainfall > 600) {
      score += 15;
    } else {
      score += 5;
      warnings.push('Low rainfall area - consider supplementary water sources');
    }
    
    if (userInput.roofType === 'RCC' || userInput.roofType === 'GI') {
      score += 20;
      recommendations.push(`${userInput.roofType} roof is excellent for rainwater harvesting`);
    } else {
      score += 10;
      warnings.push('Regular roof cleaning and maintenance required');
    }
    
    const coverage = (rainwaterPotential / householdDemand) * 100;
    if (coverage > 80) {
      score += 10;
      recommendations.push('Excellent coverage - system will meet most water needs');
    } else if (coverage > 50) {
      score += 7;
    } else {
      score += 3;
      recommendations.push('Partial coverage - combine with water conservation');
    }
    
    recommendations.push('Install first flush diverter for water quality');
    if (userInput.purpose === 'Domestic') {
      recommendations.push('Consider UV/RO purification for drinking water');
    }
    
    const feasibilityLevel = score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';
    return { feasibilityScore: Math.min(100, score), feasibilityLevel, recommendations, warnings };
  }

  /**
   * Calculate Artificial Recharge Feasibility
   */
  private calculateRechargeFeasibility(userInput: RechargeInput, cityData: CityData, rechargeVolume: number): {
    feasibilityScore: number;
    feasibilityLevel: 'High' | 'Medium' | 'Low';
    recommendations: string[];
    warnings: string[];
  } {
    let score = 50;
    const recommendations: string[] = [];
    const warnings: string[] = [];
    
    if (cityData.annualRainfall > 1000) {
      score += 20;
      recommendations.push('Excellent rainfall - high recharge potential');
    } else if (cityData.annualRainfall > 600) {
      score += 12;
    } else {
      score += 5;
      warnings.push('Moderate rainfall - recharge benefits will be seasonal');
    }
    
    if (userInput.soilType === 'Sandy') {
      score += 25;
      recommendations.push('Sandy soil is ideal for rapid groundwater recharge');
    } else if (userInput.soilType === 'Loamy') {
      score += 18;
      recommendations.push('Loamy soil provides good infiltration rates');
    } else {
      score += 10;
      recommendations.push('Clayey soil requires larger recharge structures for effectiveness');
      warnings.push('Slow infiltration - ensure proper pit/trench dimensions');
    }
    
    if (userInput.groundwaterDepth > 3 && userInput.groundwaterDepth < 30) {
      score += 15;
      recommendations.push('Optimal groundwater depth for recharge systems');
    } else if (userInput.groundwaterDepth <= 3) {
      score += 5;
      warnings.push('Shallow groundwater - monitor for waterlogging');
    } else {
      score += 10;
      warnings.push('Deep groundwater - recharge benefits may take time');
    }
    
    if (userInput.hasBorewell && userInput.borewellCondition === 'Dead') {
      recommendations.push('Direct borewell recharge recommended for rejuvenation');
      recommendations.push('Install filter chamber before borewell to prevent clogging');
      score += 10;
    } else if (userInput.hasBorewell && userInput.borewellCondition === 'Partially-Dead') {
      recommendations.push('Recharge pit near borewell will improve yield significantly');
      score += 8;
    }
    
    if (userInput.hasOpenSpace && userInput.openSpaceArea) {
      recommendations.push(`Construct ${Math.ceil(userInput.openSpaceArea / 20)} percolation trenches for distributed recharge`);
      recommendations.push('Trenches should be 0.5m wide, 1-1.5m deep, filled with gravel and sand layers');
      score += 10;
    } else {
      warnings.push('Limited open space - recharge options restricted to pits only');
    }
    
    recommendations.push('Regular maintenance: clean recharge structures before monsoon');
    recommendations.push('Monitor groundwater level changes annually to assess effectiveness');
    
    const feasibilityLevel = score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';
    return { feasibilityScore: Math.min(100, score), feasibilityLevel, recommendations, warnings };
  }
}

export const calculationEngine = new CalculationEngine();