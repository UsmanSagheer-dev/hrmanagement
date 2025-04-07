import { BiShow } from "react-icons/bi";
import Button from "../button/Button";
import { RiEdit2Line, RiDeleteBin5Line } from "react-icons/ri";

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const RowActions: React.FC<RowActionsProps> = ({
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="flex space-x-2">
    {onView && (
      <Button icon={BiShow} className="bg-transparent " onClick={onView} />
    )}
    {onEdit && (
      <Button icon={RiEdit2Line} className="bg-transparent" onClick={onEdit} />
    )}
    {onDelete && (
      <Button
        icon={RiDeleteBin5Line}
        className="bg-transparent"
        onClick={onDelete}
      />
    )}
  </div>
);

export default RowActions;
