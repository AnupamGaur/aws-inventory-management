import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InventoryForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    item_code: '',
    item_description: '',
    unit: '',
    current_stock: '',
    last_updated_date: new Date(),
    low_stock_warning: false,
    low_stock_units: '',
    price: '',
    gst_tax_rate: '',
    inclusive_of_tax: false
  });
  const [selectedImage, setSelectedImage] = useState<File[] | null>([]);
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setPreview(previewUrl);
      setSelectedImage(Array.from(e.target.files));
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };


  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        last_updated_date: date
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, String(value));
    });
    if (selectedImage) {
      selectedImage.forEach((image, index) => {
        formDataToSend.append('img', image);
      });
    }
    try {
      await axios.post('http://localhost:3002/api/v1/item', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl p-4 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">

              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={preview}
                        className="h-20 object-contain"
                      />
                    </div>
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Multiple images supported(Upto 5)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleImageChange} />
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_name">Item Name</Label>
                <Input
                  id="item_name"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="panel">Panel</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Item Code */}
              <div className="space-y-2">
                <Label htmlFor="item_code">Item Code</Label>
                <Input
                  id="item_code"
                  name="item_code"
                  value={formData.item_code}
                  onChange={handleInputChange}
                  placeholder="Enter item code"
                />
              </div>

              {/* Item Description */}
              <div className="space-y-2">
                <Label htmlFor="item_description">Item Description</Label>
                <textarea
                  id="item_description"
                  name="item_description"
                  value={formData.item_description}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter item description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Details */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Unit Selection */}
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleSelectChange('unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">PIECES(PCS)</SelectItem>
                    <SelectItem value="kg">Kilograms(KG)</SelectItem>
                    <SelectItem value="boxes">Boxes(BOX)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selector */}
              <div className="space-y-2">
                <Label>As of Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.last_updated_date ? format(formData.last_updated_date, "P") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.last_updated_date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Opening Stock */}
              <div className="space-y-2">
                <Label htmlFor="current_stock">Opening Stock</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="current_stock"
                    name="current_stock"
                    type="number"
                    value={formData.current_stock}
                    onChange={handleInputChange}
                    placeholder="500"
                  />
                  <span className="text-sm text-gray-500">PCS</span>
                </div>
              </div>

              {/* Low Stock Warning */}
              <div className="flex items-center justify-between">
                <Label>Enable Low Stock Warning</Label>
                <Switch
                  checked={formData.low_stock_warning}
                  onCheckedChange={(checked) => handleSwitchChange('low_stock_warning', checked)}
                />
              </div>

              {/* Low Stock Units */}
              <div className="space-y-2">
                <Label htmlFor="low_stock_units">Low Stock Units</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="low_stock_units"
                    name="low_stock_units"
                    type="number"
                    value={formData.low_stock_units}
                    onChange={handleInputChange}
                    placeholder="100"
                  />
                  <span className="text-sm text-gray-500">PCS</span>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-4">Pricing Details</h3>

                {/* Purchase Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Purchase Price</Label>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm">₹</span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Tax Settings */}
                <div className="flex items-center justify-between mt-4">
                  <Label>Inclusive of tax</Label>
                  <Switch
                    checked={formData.inclusive_of_tax}
                    onCheckedChange={(checked) => handleSwitchChange('inclusive_of_tax', checked)}
                  />
                </div>

                {/* GST Rate */}
                <div className="space-y-2 mt-4">
                  <Label>GST Tax Rate (%)</Label>
                  <Select
                    value={formData.gst_tax_rate}
                    onValueChange={(value) => handleSelectChange('gst_tax_rate', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select GST rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">GST @ 5%</SelectItem>
                      <SelectItem value="12">GST @ 12%</SelectItem>
                      <SelectItem value="18">GST @ 18%</SelectItem>
                      <SelectItem value="28">GST @ 28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button type="submit">Save</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({
            item_name: '',
            category: '',
            item_code: '',
            item_description: '',
            unit: '',
            current_stock: '',
            last_updated_date: new Date(),
            low_stock_warning: false,
            low_stock_units: '',
            price: '',
            gst_tax_rate: '',
            inclusive_of_tax: false
          })}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

export default InventoryForm;