import { Layout } from "react-admin";
import CustomMenu from "./CustomMenu";

export default function CustomLayout(props: any) {
  return <Layout {...props} menu={CustomMenu} />;
}