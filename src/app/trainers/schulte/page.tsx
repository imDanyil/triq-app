import type { Metadata } from "next";
import SchulteTable from "@/components/trainers/schulte/SchulteTable";

export const metadata: Metadata = {
  title: "Таблиці Шульте | TRIQ",
};

export default function SchulteTrainer() {
  return <SchulteTable />;
}
