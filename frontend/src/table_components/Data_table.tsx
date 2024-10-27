import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, X } from "lucide-react";
import axios from "axios";
import { Edit2Icon } from 'lucide-react'
import StockAdjustmentModal from "./Update_stock";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { RadioGroup } from "@/components/ui/radio-group";
import Link, { NavLink } from 'react-router-dom'
// Define basic interfaces


interface Item {
  id: string
  item_code: string;
  item_name: string;
  category: string;
  current_stock: number;
  stock_on_hold: number;
  stock_value: number;
  price: number;
  unit: string;
}

interface Column {
  id?: string;
  accessorKey?: keyof Item;
  header: string | ((props: { table: { getIsAllRowsSelected: () => boolean } }) => React.ReactNode);
  cell?: (props: { row: Item }) => React.ReactNode;
}


// const handleSave = () => {
//   onOpenChange(false);
// };

// const handleCancel = () => {
//   onOpenChange(false);
// };

const DataTable: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState("reduce");
  const [adjustmentAmount, setAdjustmentAmount] = useState("0");
  const [finalStock, setFinalStock] = useState(500);


  const currentStock = 500;

  useEffect(() => {
    const amount = parseInt(adjustmentAmount) || 0;
    if (adjustmentType === "add") {
      setFinalStock(currentStock + amount);
    } else {
      setFinalStock(currentStock - amount);
    }
  }, [adjustmentAmount, adjustmentType]);


  // Define columns
  const columns: Column[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value: boolean) => {
            setSelectedRows(value ? data.map(item => item.id) : []);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRows.includes(row.id)}
          onCheckedChange={(value: boolean) => {
            setSelectedRows(value
              ? [...selectedRows, row.id]
              : selectedRows.filter(id => id !== row.id)
            );
          }}
          aria-label="Select row"
        />
      ),
    },
    { accessorKey: "item_name", header: "Item Name" },
    { accessorKey: "item_code", header: "Item Code" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "current_stock", header: "Stock Quantity" },
    {
      accessorKey: "stock_on_hold", header: "Stock on Hold",
      cell: ({ row }) => {
        const unit = row.unit
        return `0 ${unit}`
      }
    },
    {
      accessorKey: "stock_value", header: "Stock Value",
      cell: ({ row }) => {
        const price = row.price
        const quantity = row.current_stock
        return `₹ ${price * quantity}`
      }
    },
    { accessorKey: "price", header: "Purchase Price" },
    {
      header: () => (
        <div>
        </div>

      ),
      id: "edit",
      cell: ({row}) => {
        return (
          <Button variant="outline" className="h-8 w-8 p-0">
            <NavLink to={`/update/${row.id}/${row.item_name}`}>
            <Edit2Icon></Edit2Icon>
            </NavLink>
          </Button>
        )
      },
    },
    {
      header: () => (
        <div>
        </div>

      ),
      id: "update_stock",
      cell: ({ row }) => {
        return (
          <div >
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-sm p-2" onClick={() => setOpen(true)}>
                  ADJUST STOCK
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <button
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
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
                    <div className="text-sm text-gray-700">{row.item_name}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Stock:</Label>
                    <div className="text-sm text-gray-700">{row.current_stock} {row.unit}</div>
                  </div>

                  <RadioGroup
                    defaultValue="reduce"
                    value={adjustmentType}
                    onValueChange={setAdjustmentType}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 p-1 bg-slate-300">
                      <RadioGroupItem value="add" id="add" />
                      <Label htmlFor="add">Add (+)</Label>
                    </div>
                    <div className="flex items-center space-x-2  bg-slate-300">
                      <RadioGroupItem value="reduce" id="reduce" />
                      <Label htmlFor="reduce">Reduce (-)</Label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-2">
                    <Label>Adjust Stock:</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        min={0}
                        type="number"
                        value={adjustmentAmount}
                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{row.unit}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Final Stock:</Label>
                    <div className="text-sm text-gray-700">{finalStock} {row.unit}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Remarks (optional):</Label>
                    <Textarea
                      placeholder="Enter remarks here..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button onClick={async () => {
                    await axios.put('http://localhost:3002/api/v1/item', {
                      updated_stock: finalStock,
                      id: row.id
                    })
                    setOpen(false)
                  }} >
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )
      },
    },
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/v1/item');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      await axios.delete('http://localhost:3002/api/v1/item', {
        data: { item_ids: selectedRows }
      });

      setData(data.filter(item => !selectedRows.includes(item.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4 w-11/12 mx-auto py-10">

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-x-4">
          <div className="text-sm text-gray-700">
            {selectedRows.length} items selected
          </div>
          <NavLink to="/create">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            Create New Item
          </Button>  
          </NavLink>    
        </div>
        {selectedRows.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </Button>)
        }
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey || column.id}>
                  {typeof column.header === 'function'
                    ? column.header({
                      table: {
                        getIsAllRowsSelected: () => selectedRows.length === data.length
                      }
                    })
                    : column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.accessorKey || column.id}>
                    {column.cell ?
                      column.cell({ row }) :
                      column.accessorKey ? row[column.accessorKey] : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;