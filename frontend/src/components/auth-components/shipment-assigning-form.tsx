import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ShipmentAssigningForm({
  shipmentId,
}: {
  shipmentId: string;
}) {
  const handleSubmit = () => {};

  return (
    <form>
      <div className="flex flex-col gap-2 my-4">
        <Label>Client Name:</Label>
        <Input placeholder="John Doe" />
      </div>
      <div className="flex flex-col gap-2 my-4">
        <Label>Contact Number:</Label>
        <Input placeholder="(123) 456-7890" />
      </div>

      <div className="flex flex-col gap-2 my-4">
        <Label>Truck Number:</Label>
        <Input placeholder="LTE-444" />
      </div>
      <div className="flex">
        <Button
          className="bg-[#1e786c] cursor-pointer text-white ml-auto"
          type="button"
          onClick={handleSubmit}
        >
          Done
        </Button>
      </div>
    </form>
  );
}
