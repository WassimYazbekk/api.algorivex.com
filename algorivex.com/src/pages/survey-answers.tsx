import http from "@/axios-client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function SurveyAnswers() {
    const id = useParams().id;

    async function fetchAnswers() {
        const response = await http.get(`survey/${id}/answers`);
        const data = await response.data;

        return data;
    }

    const surveyQuery = useQuery({
        queryKey: ["survey", id, "answers"],
        queryFn: fetchAnswers,
        placeholderData: keepPreviousData,
    });

    return (
        <div>
            {surveyQuery.isLoading || surveyQuery.isError ? (
                <h1>loading...</h1>
            ) : (
                <div className="p-2">
                    {surveyQuery.data.data.questions?.map((question) => {
                        return (
                            <Card
                                className="mb-2"
                                key={`question:${question.id}`}
                            >
                                <CardHeader>
                                    <CardTitle>
                                        Question: {question.question}
                                    </CardTitle>
                                    <CardDescription>
                                        Description: {question.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <h3>Answers:</h3>
                                    {question.type === "text" ||
                                    question.type === "textarea" ? (
                                        <div>
                                            {question.answers.map(
                                                (answer, ind) => {
                                                    return (
                                                        <h1>
                                                            {`${ind + 1}-
                                                            ${answer.answer}`}
                                                        </h1>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ) : question.type === "checkbox" ? (
                                        <div>
                                            {question.data.options?.map(
                                                (option, ind) => {
                                                    const count =
                                                        question.answers.reduce(
                                                            (acc, answer) => {
                                                                const selectedOptions =
                                                                    JSON.parse(
                                                                        answer.answer,
                                                                    );
                                                                if (
                                                                    selectedOptions.includes(
                                                                        option.text,
                                                                    )
                                                                ) {
                                                                    return (
                                                                        acc + 1
                                                                    );
                                                                }
                                                                return acc;
                                                            },
                                                            0,
                                                        );

                                                    return (
                                                        <h1 key={option.uuid}>
                                                            {`${ind + 1} - ${option.text} `}
                                                            <span className="text-blue-500">
                                                                {`(${count} selected)`}
                                                            </span>
                                                        </h1>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {question.data.options?.map(
                                                (option, ind) => {
                                                    const count =
                                                        question.answers.filter(
                                                            (answer) =>
                                                                answer.answer ===
                                                                option.text,
                                                        ).length;

                                                    return (
                                                        <h1 key={option.uuid}>
                                                            {`${ind + 1} - ${option.text} `}
                                                            <span className="text-blue-500">
                                                                {`(${count} selected)`}
                                                            </span>
                                                        </h1>
                                                    );
                                                },
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
