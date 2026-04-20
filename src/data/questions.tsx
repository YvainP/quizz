export type InputQuestion = {
  type: "input";
  question: string;
  answer: string;
};

export type ChoiceQuestion = {
  type: "choice";
  question: string;
  options: string[];
  answer: string;
};

export type Question = InputQuestion | ChoiceQuestion;

export const questions: Question[] = [
  {
    type: "choice",
    question: "What is React?",
    options: ["Library", "Framework", "Language", "Database"],
    answer: "Library",
  },
  {
    type: "input",
    question: "Which hook manages state?",
    answer: "usestate",
  },
  {
    type: "choice",
    question: "Which company created React?",
    options: ["Google", "Meta", "Microsoft", "Apple"],
    answer: "Meta",
  },
];