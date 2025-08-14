import React, { useState } from 'react';
import RegionalManagerLayout from '@/components/RegionalManagerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SendIcon } from 'lucide-react';
import { toast } from 'sonner';

const MaterialRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    zone: '',
    materialType: '',
    quantity: '',
    estimatedCost: '',
    urgency: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.zone || !formData.materialType || !formData.quantity || !formData.urgency) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate form submission
    toast.success('Material request submitted successfully!');
    
    // Reset form
    setFormData({
      title: '',
      zone: '',
      materialType: '',
      quantity: '',
      estimatedCost: '',
      urgency: '',
      description: ''
    });
    
    // Navigate back to dashboard
    setTimeout(() => {
      navigate('/regional-manager/dashboard');
    }, 1500);
  };

  return (
    <RegionalManagerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/regional-manager/dashboard')}
            className="gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Material Request Form</h1>
            <p className="text-muted-foreground">Submit a new material request for your zone</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter request title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Zone */}
              <div className="space-y-2">
                <Label htmlFor="zone">Zone *</Label>
                <Select value={formData.zone} onValueChange={(value) => handleInputChange('zone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North Zone">North Zone</SelectItem>
                    <SelectItem value="South Zone">South Zone</SelectItem>
                    <SelectItem value="East Zone">East Zone</SelectItem>
                    <SelectItem value="West Zone">West Zone</SelectItem>
                    <SelectItem value="Central Zone">Central Zone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Material Type */}
              <div className="space-y-2">
                <Label htmlFor="materialType">Material Type *</Label>
                <Select value={formData.materialType} onValueChange={(value) => handleInputChange('materialType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Industrial Equipment">Industrial Equipment</SelectItem>
                    <SelectItem value="Construction Materials">Construction Materials</SelectItem>
                    <SelectItem value="Automotive Parts">Automotive Parts</SelectItem>
                    <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                    <SelectItem value="Cleaning Supplies">Cleaning Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    required
                    min="1"
                  />
                </div>

                {/* Estimated Cost */}
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    placeholder="Enter estimated cost"
                    value={formData.estimatedCost}
                    onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter detailed description of the material request"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/regional-manager/dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <SendIcon className="h-4 w-4" />
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </RegionalManagerLayout>
  );
};

export default MaterialRequestForm;