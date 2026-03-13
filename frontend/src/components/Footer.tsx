import { COLORS } from "@/styles/theme";

export default function Footer() {
  return (
    <footer
      className="w-full p-4 text-center text-sm"
      style={{ backgroundColor: COLORS.secondary, color: "white" }}
    >
      © {new Date().getFullYear()} UniBudgetHub
    </footer>
  );
}