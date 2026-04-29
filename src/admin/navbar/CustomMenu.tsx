import { Menu } from "react-admin";
import { Book, HelpCircle, House } from "lucide-react";

export default function CustomMenu() {
  return (
    <Menu>
      <Menu.Item to="/" primaryText="Dashboard" leftIcon={<House />} />
      <Menu.Item to="/admin/lessons" primaryText="Lessons" leftIcon={<Book />} />
      <Menu.Item to="/admin/questions" primaryText="Questions" leftIcon={<HelpCircle />} />
    </Menu>
  );
}