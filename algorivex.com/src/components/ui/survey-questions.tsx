import { useEffect } from "react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import QuestionEditor from "./question-editor";
import { PlusIcon } from "lucide-react";
import { Button } from "./button";

export default function SurveyQuestions({ questions, onQuestionsUpdate }) {
    const [myQuestions, setMyQuestions] = useState([...questions]);

    const addQuestion = (index?: number) => {
        index = index !== undefined ? index : myQuestions.length;
        myQuestions.splice(index, 0, {
            id: uuid(),
            type: "text",
            question: "",
            description: "",
            data: {},
        });
        setMyQuestions([...myQuestions]);
        onQuestionsUpdate(myQuestions);
    };

    const questionChange = (question) => {
        if (!question) return;
        const newQuestions = myQuestions.map((q) => {
            if (q.id == question.id) {
                return { ...question };
            }
            return q;
        });
        setMyQuestions(newQuestions);
        onQuestionsUpdate(newQuestions);
    };

    const deleteQuestion = (question) => {
        const newQuestions = myQuestions.filter((q) => q.id !== question.id);

        setMyQuestions(newQuestions);
        onQuestionsUpdate(newQuestions);
    };

    useEffect(() => {
        setMyQuestions(questions);
    }, [questions]);

    return (
        <>
            <div className="flex justify-between mb-2">
                <h3 className="text-2xl font-bold">Questions</h3>
                <Button
                    type="button"
                    variant={"ghost"}
                    className=""
                    onClick={() => addQuestion()}
                >
                    <PlusIcon className="w-4 mr-2" />
                    Add question
                </Button>
            </div>
            {myQuestions.length ? (
                myQuestions.map((q, ind) => (
                    <QuestionEditor
                        key={q.id}
                        index={ind}
                        question={q}
                        questionChange={questionChange}
                        addQuestion={addQuestion}
                        deleteQuestion={deleteQuestion}
                    />
                ))
            ) : (
                <div className="text-gray-400 text-center py-4">
                    You don't have any questions created
                </div>
            )}
        </>
    );
}
