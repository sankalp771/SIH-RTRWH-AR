import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculationEngine } from "./utils/calculationEngine";
import { 
  rainwaterInputSchema, 
  rechargeInputSchema,
  type RainwaterInput, 
  type RechargeInput,
  type RainwaterResults,
  type RechargeResults
} from "@shared/schema";
import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // Calculation endpoint
  app.post("/api/calculate", async (req, res) => {
    try {
      const { userInputs, calculationType } = req.body;
      
      if (!['rainwater', 'recharge'].includes(calculationType)) {
        return res.status(400).json({ error: 'Invalid calculation type' });
      }
      
      // Validate input data based on calculation type
      let validatedInputs: RainwaterInput | RechargeInput;
      if (calculationType === 'rainwater') {
        validatedInputs = rainwaterInputSchema.parse(userInputs);
      } else {
        validatedInputs = rechargeInputSchema.parse(userInputs);
      }
      
      // Perform calculations
      const results = calculationEngine.calculate(validatedInputs, calculationType);
      
      // Save to storage for history (optional)
      const savedSubmission = await storage.saveSubmission(
        validatedInputs, 
        calculationType, 
        results
      );
      
      res.json({
        success: true,
        submissionId: savedSubmission.id,
        results
      });
      
    } catch (error: any) {
      console.error('Calculation error:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Invalid input data',
          details: error.errors
        });
      }
      
      res.status(500).json({
        error: 'Internal server error during calculation',
        message: error.message
      });
    }
  });

  // Get calculation history
  app.get("/api/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const submissions = await storage.getRecentSubmissions(limit);
      
      res.json({
        success: true,
        submissions: submissions.map(sub => {
          const userInputs = sub.userInputs as (RainwaterInput | RechargeInput);
          const results = sub.results as (RainwaterResults | RechargeResults);
          return {
            id: sub.id,
            calculationType: sub.calculationType,
            location: userInputs.location,
            name: userInputs.name,
            createdAt: sub.createdAt,
            feasibilityLevel: results.feasibilityLevel,
            coveragePercentage: sub.calculationType === 'rainwater' ? (results as RainwaterResults).coveragePercentage : undefined
          };
        })
      });
    } catch (error: any) {
      console.error('History retrieval error:', error);
      res.status(500).json({
        error: 'Failed to retrieve calculation history'
      });
    }
  });

  // Get specific submission
  app.get("/api/submission/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const submission = await storage.getSubmission(id);
      
      if (!submission) {
        return res.status(404).json({
          error: 'Submission not found'
        });
      }
      
      res.json({
        success: true,
        submission
      });
    } catch (error: any) {
      console.error('Submission retrieval error:', error);
      res.status(500).json({
        error: 'Failed to retrieve submission'
      });
    }
  });

  // Generate PDF report
  app.post("/api/generate-pdf", async (req, res) => {
    try {
      const { submissionId } = req.body;
      
      const submission = await storage.getSubmission(submissionId);
      if (!submission) {
        return res.status(404).json({
          error: 'Submission not found'
        });
      }
      
      // Type cast the stored data
      const userData = submission.userInputs as (RainwaterInput | RechargeInput);
      const results = submission.results as (RainwaterResults | RechargeResults);
      const type = submission.calculationType;
      
      // Generate PDF using jsPDF
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('RTRWH/AR Analysis Report', 20, 30);
      
      doc.setFontSize(12);
      doc.text(`${type === 'rainwater' ? 'Rainwater Harvesting' : 'Artificial Recharge'} Analysis`, 20, 45);
      doc.text(`Generated for: ${userData.name}`, 20, 55);
      doc.text(`Location: ${userData.location}, ${userData.pincode}`, 20, 65);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 75);
      
      // Key Results
      doc.setFontSize(16);
      doc.text('Key Results:', 20, 95);
      
      doc.setFontSize(10);
      let resultText: string[] = [];
      
      if (type === 'rainwater') {
        const rainwaterData = userData as RainwaterInput;
        const rainwaterResults = results as RainwaterResults;
        resultText = [
          `Roof Area: ${rainwaterData.roofArea} m² (${rainwaterData.roofType})`,
          `Annual Rainwater Potential: ${rainwaterResults.rainwaterPotential.toLocaleString('en-IN')} L`,
          `Household Demand: ${rainwaterResults.householdDemand.toLocaleString('en-IN')} L`,
          `Coverage: ${rainwaterResults.coveragePercentage}%`,
          `Recommended Tank Capacity: ${rainwaterResults.tankCapacity.toLocaleString('en-IN')} L`,
          `Tank Dimensions: ${rainwaterResults.tankDimensions.diameter}m × ${rainwaterResults.tankDimensions.height}m`,
          `System Cost (Medium): ₹${rainwaterResults.systemCost.medium.toLocaleString('en-IN')}`,
          `Annual Savings: ₹${rainwaterResults.annualSavings.toLocaleString('en-IN')}`,
          `Payback Period: ${rainwaterResults.paybackPeriod} years`,
          `Feasibility: ${rainwaterResults.feasibilityLevel} (${rainwaterResults.feasibilityScore}/100)`
        ];
      } else {
        const rechargeData = userData as RechargeInput;
        const rechargeResults = results as RechargeResults;
        resultText = [
          `Catchment Area: ${rechargeData.catchmentArea} m²`,
          `Annual Rainwater Potential: ${rechargeResults.rainwaterPotential.toLocaleString('en-IN')} L`,
          `Annual Recharge Volume: ${rechargeResults.rechargeVolume} m³`,
          `System Cost (Medium): ₹${rechargeResults.systemCost.medium.toLocaleString('en-IN')}`,
          `Groundwater Benefit: ${rechargeResults.groundwaterBenefit} m³/year`,
          `Payback Period: ${rechargeResults.paybackPeriod} years`,
          `Feasibility: ${rechargeResults.feasibilityLevel} (${rechargeResults.feasibilityScore}/100)`
        ];
        
        if (rechargeResults.pitDimensions) {
          resultText.push(
            `Pit Dimensions: ${rechargeResults.pitDimensions.length}×${rechargeResults.pitDimensions.width}×${rechargeResults.pitDimensions.depth}m`
          );
        }
        
        if (rechargeData.hasBorewell) {
          resultText.push(`Borewell Recharging: Yes (${rechargeData.borewellCondition})`);
        }
      }
      
      resultText.forEach((text, index) => {
        doc.text(text, 20, 110 + (index * 10));
      });
      
      // Recommendations
      doc.setFontSize(16);
      doc.text('Recommendations:', 20, 200);
      
      doc.setFontSize(10);
      results.recommendations.forEach((rec: string, index: number) => {
        const wrappedText = doc.splitTextToSize(`• ${rec}`, 170);
        doc.text(wrappedText, 20, 215 + (index * 15));
      });
      
      // Warnings if any
      if (results.warnings.length > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Important Considerations:', 20, 30);
        
        doc.setFontSize(10);
        results.warnings.forEach((warning: string, index: number) => {
          const wrappedText = doc.splitTextToSize(`⚠ ${warning}`, 170);
          doc.text(wrappedText, 20, 45 + (index * 15));
        });
      }
      
      // Generate PDF buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      
      // Set headers for PDF download
      // Sanitize filename to prevent header injection
      const sanitizedName = userData.name
        .replace(/[^a-zA-Z0-9\s-_]/g, '') // Remove unsafe characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .substring(0, 50); // Limit length
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition', 
        `attachment; filename="${type}-analysis-report-${sanitizedName}.pdf"`
      );
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
      
    } catch (error: any) {
      console.error('PDF generation error:', error);
      res.status(500).json({
        error: 'Failed to generate PDF report',
        message: error.message
      });
    }
  });

  // Get cities data
  app.get("/api/cities", (req, res) => {
    try {
      const citiesPath = path.resolve(import.meta.dirname, "data", "cities.json");
      const citiesData = fs.readFileSync(citiesPath, "utf-8");
      const cities = JSON.parse(citiesData);
      res.json(cities);
    } catch (error: any) {
      console.error("Failed to read cities data:", error);
      res.status(500).json({
        error: "Failed to retrieve cities data",
        message: error.message
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "RTRWH/AR Calculation API"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}