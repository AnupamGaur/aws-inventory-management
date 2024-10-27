import React from 'react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface StockAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StockAdjustmentModal = ({ open, onOpenChange }: StockAdjustmentModalProps) => {
  const [adjustmentType, setAdjustmentType] = useState("reduce");
  const [adjustmentAmount, setAdjustmentAmount] = useState("0");
  const [remarks, setRemarks] = useState("");
  const [finalStock, setFinalStock] = useState(500);
  
  const currentStock = 500;
  const itemName = "Vikram 350";

  useEffect(() => {
    const amount = parseInt(adjustmentAmount) || 0;
    if (adjustmentType === "add") {
      setFinalStock(currentStock + amount);
    } else {
      setFinalStock(currentStock - amount);
    }
  }, [adjustmentAmount, adjustmentType]);

  const handleSave = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Adjust Stock Quantity
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Item Name:</Label>
            <div className="text-sm text-gray-700">{itemName}</div>
          </div>
          
          <div className="space-y-2">
            <Label>Current Stock:</Label>
            <div className="text-sm text-gray-700">{currentStock} PCS</div>
          </div>
          
          <RadioGroup
            defaultValue="reduce"
            value={adjustmentType}
            onValueChange={setAdjustmentType}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="add" id="add" />
              <Label htmlFor="add">Add (+)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reduce" id="reduce" />
              <Label htmlFor="reduce">Reduce (-)</Label>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label>Adjust Stock:</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                className="w-full"
              />
              <span className="text-sm text-gray-500">PCS</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Final Stock:</Label>
            <div className="text-sm text-gray-700">{finalStock} PCS</div>
          </div>
          
          <div className="space-y-2">
            <Label>Remarks (optional):</Label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks here..."
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockAdjustmentModal;