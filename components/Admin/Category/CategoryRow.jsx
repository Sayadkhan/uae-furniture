// components/Admin/Category/CategoryRow.jsx
import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import CategoryActions from "./CategoryActions";

export default function CategoryRow({ category, index, onDelete }) {
  return (
    <TableRow className="hover:bg-muted/20 transition-colors">
      <TableCell className="text-center font-medium">{index + 1}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Image
            src={category.image || "/placeholder.png"}
            alt={category.name}
            width={45}
            height={45}
            className="rounded-md border object-cover"
          />
        </div>
      </TableCell>
      <TableCell className="font-semibold">{category.name}</TableCell>

      {/* pass down delete handler to client actions */}
      <CategoryActions category={category} onDelete={onDelete} />
    </TableRow>
  );
}
