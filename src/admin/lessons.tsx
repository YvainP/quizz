import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  required,
} from "react-admin";

/* ---------------- LIST ---------------- */
export const LessonList = () => (
  <List>
    <Datagrid rowClick="edit">

      <TextField source="title" />
      <TextField source="description" />
      <TextField source="example" />

      <EditButton />

      <DeleteButton
        mutationMode="pessimistic"
        confirmTitle="Delete lesson"
        confirmContent="Are you sure you want to delete this lesson?"
      />

    </Datagrid>
  </List>
);

/* ---------------- EDIT ---------------- */
export const LessonEdit = () => (
  <Edit redirect="list">
    <SimpleForm>

      <TextInput source="title" validate={required()} />

      <TextInput
        source="description"
        multiline
        validate={required()}
      />

      <TextInput source="example" />

    </SimpleForm>
  </Edit>
);

/* ---------------- CREATE ---------------- */
export const LessonCreate = () => (
  <Create redirect="list">
    <SimpleForm>

      <TextInput source="title" validate={required()} />

      <TextInput
        source="description"
        multiline
        validate={required()}
      />

      <TextInput source="example" />

    </SimpleForm>
  </Create>
);