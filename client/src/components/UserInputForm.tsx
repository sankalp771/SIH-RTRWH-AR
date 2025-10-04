import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { MapPin, Home, Users, DollarSign, Calculator, Droplet } from "lucide-react";
import { handleBackNavigation } from "@/lib/navigation";
import LocationMap from "./LocationMap";
import { useQuery } from "@tanstack/react-query";
import { rainwaterInputSchema, rechargeInputSchema, type RainwaterInput, type RechargeInput } from "@shared/schema";

interface UserInputFormProps {
  type: 'rainwater' | 'recharge';
  onSubmit: (data: RainwaterInput | RechargeInput) => void;
  onBack: () => void;
}

export default function UserInputForm({ type, onSubmit, onBack }: UserInputFormProps) {
  const [hasOpenSpace, setHasOpenSpace] = useState(false);
  const [hasBorewell, setHasBorewell] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  
  const { data: citiesData } = useQuery<Array<{ city: string; state: string; pincode: string }>>({ 
    queryKey: ["/api/cities"]
  });
  
  // Use the appropriate schema based on type
  const schema = type === 'rainwater' ? rainwaterInputSchema : rechargeInputSchema;
  
  const form = useForm<RainwaterInput | RechargeInput>({
    resolver: zodResolver(schema),
    defaultValues: type === 'rainwater' ? {
      name: "",
      location: "",
      pincode: "",
      roofArea: undefined,
      roofType: undefined,
      environment: undefined,
      birdNesting: false,
      dwellers: undefined,
      purpose: undefined,
      hasOpenSpace: false,
      groundwaterDepth: undefined,
      soilType: undefined,
      budget: undefined
    } as Partial<RainwaterInput> : {
      name: "",
      location: "",
      pincode: "",
      catchmentArea: undefined,
      catchmentType: undefined,
      hasOpenSpace: false,
      groundwaterDepth: undefined,
      soilType: undefined,
      budget: undefined,
      hasBorewell: false,
      borewellCount: undefined,
      borewellDepth: undefined,
      borewellCondition: undefined
    } as Partial<RechargeInput>
  });

  const handleLocationSelect = (city: string) => {
    const cityData = citiesData?.find(c => c.city === city);
    if (cityData) {
      setSelectedCity(city);
      form.setValue("location", cityData.city);
      form.setValue("pincode", cityData.pincode);
    }
  };

  const handleSubmit = (data: RainwaterInput | RechargeInput) => {
    console.log('Form submitted:', data);
    onSubmit(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => handleBackNavigation(onBack, 'UserInputForm')} 
          className="mb-4" 
          data-testid="button-back"
        >
          ← Back to Selection
        </Button>
        <h1 className="text-3xl font-semibold mb-2">
          {type === 'rainwater' ? 'Rainwater Harvesting' : 'Artificial Recharge'} Calculator
        </h1>
        <p className="text-muted-foreground">
          {type === 'rainwater' 
            ? 'Fill in the details below to calculate rainwater harvesting potential for your home or building.'
            : 'Fill in the details below to calculate artificial groundwater recharge potential for your property.'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Personal & Location Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-medium">Personal & Location Details</h3>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City/Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city name" {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIN Code</FormLabel>
                      <FormControl>
                        <Input placeholder="6-digit PIN code" {...field} data-testid="input-pincode" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Select Location on Map</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Click on a city marker to auto-fill location and PIN code
                </p>
                <LocationMap 
                  onLocationSelect={handleLocationSelect} 
                  selectedCity={selectedCity}
                  height="350px"
                />
              </div>
            </div>
          </Card>

          {/* Rainwater: Roof Details */}
          {type === 'rainwater' && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Home className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-medium">Roof Details</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="roofArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roof Area (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter roof area" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-roof-area"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roofType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roof Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-roof-type">
                            <SelectValue placeholder="Select roof type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="RCC">RCC (Reinforced Concrete)</SelectItem>
                          <SelectItem value="GI">GI (Galvanized Iron)</SelectItem>
                          <SelectItem value="Asbestos">Asbestos Sheets</SelectItem>
                          <SelectItem value="Tiles">Clay/Concrete Tiles</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          )}

          {/* Recharge: Catchment Area */}
          {type === 'recharge' && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Home className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-medium">Catchment Details</h3>
              </div>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="catchmentArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Catchment Area (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter total catchment area" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-catchment-area"
                        />
                      </FormControl>
                      <FormDescription>
                        Total area from which rainwater will be collected
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="catchmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catchment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-catchment-type">
                            <SelectValue placeholder="Select catchment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Rooftop">Rooftop</SelectItem>
                          <SelectItem value="Terrace">Terrace</SelectItem>
                          <SelectItem value="Paved">Paved Surface</SelectItem>
                          <SelectItem value="Open Ground">Open Ground</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Type of surface collecting rainwater
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          )}

          {/* Rainwater: Environment & Usage */}
          {type === 'rainwater' && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-medium">Environment & Usage</h3>
              </div>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surrounding Environment</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                          data-testid="radio-environment"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Residential" id="residential" />
                            <Label htmlFor="residential">Residential</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Industrial" id="industrial" />
                            <Label htmlFor="industrial">Industrial</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Agricultural" id="agricultural" />
                            <Label htmlFor="agricultural">Agricultural</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birdNesting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-bird-nesting"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Bird Nesting Area</FormLabel>
                        <FormDescription>
                          Check if your roof area has bird nesting (affects water quality)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dwellers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Dwellers</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Number of people" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            data-testid="input-dwellers"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Purpose</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-purpose">
                              <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Domestic">Domestic Use</SelectItem>
                            <SelectItem value="Irrigation">Irrigation</SelectItem>
                            <SelectItem value="Industrial">Industrial Use</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Recharge: Borewell Details */}
          {type === 'recharge' && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Droplet className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-medium">Borewell Details</h3>
              </div>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="hasBorewell"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setHasBorewell(checked as boolean);
                          }}
                          data-testid="checkbox-has-borewell"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Do you have a borewell?</FormLabel>
                        <FormDescription>
                          Check if you have an existing borewell that can be recharged
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {hasBorewell && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="borewellDepth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Borewell Depth (m)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Depth in meters" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-borewell-depth"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="borewellCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Borewells</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Count" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                data-testid="input-borewell-count"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="borewellCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Borewell Condition</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-borewell-condition">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Working">Working (Active yield)</SelectItem>
                              <SelectItem value="Partially-Dead">Partially Dead (Low yield)</SelectItem>
                              <SelectItem value="Dead">Dead (Not yielding)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Current water yield status of your borewell
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Site Conditions */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-medium">Site Conditions</h3>
            </div>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="hasOpenSpace"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setHasOpenSpace(checked as boolean);
                        }}
                        data-testid="checkbox-open-space"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Open Space Available</FormLabel>
                      <FormDescription>
                        {type === 'rainwater' 
                          ? 'Check if you have open space for recharge structures'
                          : 'Check if you have open space for percolation trenches or recharge pits'}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {hasOpenSpace && (
                <FormField
                  control={form.control}
                  name="openSpaceArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Open Space Area (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter open space area" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-open-space-area"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="groundwaterDepth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Groundwater Depth (m)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Depth in meters" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-groundwater-depth"
                        />
                      </FormControl>
                      <FormDescription>
                        Depth to water table from ground surface
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-soil-type">
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sandy">Sandy (High infiltration)</SelectItem>
                          <SelectItem value="Loamy">Loamy (Medium infiltration)</SelectItem>
                          <SelectItem value="Clayey">Clayey (Low infiltration)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Budget Preferences */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-medium">Budget Preferences</h3>
            </div>
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid md:grid-cols-3 gap-4"
                      data-testid="radio-budget"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-md hover-elevate">
                        <RadioGroupItem value="Low" id="budget-low" />
                        <Label htmlFor="budget-low" className="cursor-pointer">
                          <div>
                            <div className="font-medium">Low Budget</div>
                            <div className="text-sm text-muted-foreground">Basic solutions</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-md hover-elevate">
                        <RadioGroupItem value="Medium" id="budget-medium" />
                        <Label htmlFor="budget-medium" className="cursor-pointer">
                          <div>
                            <div className="font-medium">Medium Budget</div>
                            <div className="text-sm text-muted-foreground">Balanced approach</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-md hover-elevate">
                        <RadioGroupItem value="High" id="budget-high" />
                        <Label htmlFor="budget-high" className="cursor-pointer">
                          <div>
                            <div className="font-medium">High Budget</div>
                            <div className="text-sm text-muted-foreground">Premium solutions</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" className="px-12" data-testid="button-calculate">
              Calculate {type === 'rainwater' ? 'Rainwater Potential' : 'Recharge Capacity'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
