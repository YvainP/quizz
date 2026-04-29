import { Admin, Resource } from "react-admin";
import { dataProvider } from "./dataProvider";
import CustomLayout from "./navbar/CustomLayout";

import { LessonList, LessonEdit, LessonCreate } from "./lessons";
import { QuestionList, QuestionEdit, QuestionCreate } from "./questions";

export default function AdminApp() {
  return (
    <Admin
      dataProvider={dataProvider}
      layout={CustomLayout}
      basename="/admin"
    >
      <Resource name="lessons" list={LessonList} edit={LessonEdit} create={LessonCreate} />
      <Resource name="questions" list={QuestionList} edit={QuestionEdit} create={QuestionCreate} />
    </Admin>
  );
}