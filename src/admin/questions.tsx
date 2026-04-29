import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Create,
  ArrayInput,
  SimpleFormIterator,
  required,
} from "react-admin";

/* ---------------- LIST ---------------- */
export const QuestionList = () => (
  <List>
    <Datagrid rowClick="edit">

      <TextField source="question" />
      <TextField source="type" />
      <TextField source="answer" />
      <TextField source="kana_kanji" />

      <EditButton />

      <DeleteButton
        mutationMode="pessimistic"
        confirmTitle="Delete question"
        confirmContent="Are you sure you want to delete this question?"
      />

    </Datagrid>
  </List>
);

/* ---------------- FORM ---------------- */
const QuestionForm = () => (
  <SimpleForm>

    <SelectInput
      source="type"
      validate={required()}
      choices={[
        { id: "input", name: "Input" },
        { id: "choice", name: "Choice" },
      ]}
    />

    <TextInput source="question" fullWidth validate={required()} />
    <TextInput source="answer" fullWidth validate={required()} />
    <TextInput source="kana_kanji" fullWidth />

    {/* OPTIONS (only used when type === choice) */}
    <ArrayInput source="options">
      <SimpleFormIterator>

        {/* IMPORTANT: must have source */}
        <TextInput source="" label="Option" />

      </SimpleFormIterator>
    </ArrayInput>

  </SimpleForm>
);

/* ---------------- EDIT ---------------- */
export const QuestionEdit = () => (
  <Edit redirect="list">
    <QuestionForm />
  </Edit>
);

/* ---------------- CREATE ---------------- */
export const QuestionCreate = () => (
  <Create redirect="list">
    <QuestionForm />
  </Create>
);