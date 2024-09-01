import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "@/axios-client";
import PublicQuestion from "@/components/ui/public-question";
import { Button } from "@/components/ui/button";

export default function PublicSurvey() {
    const answers = {};
    const [surveyFinished, setSurveyFinished] = useState(false);
    const [survey, setSurvey] = useState({
        questions: [],
    });

    const [loading, setLoading] = useState(false);
    const { slug } = useParams();

    useEffect(() => {
        setLoading(true);
        http.get(`survey/public/${slug}`)
            .then(({ data }) => {
                setLoading(false);
                setSurvey(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    function answerChanged(question, value) {
        answers[question.id] = value;
    }

    function onSubmit(e) {
        e.preventDefault();

        http.post(`/survey/${survey.id}/answer`, {
            answers,
        }).then((response) => {
            setSurveyFinished(true);
        });
    }

    return (
        <div>
            {loading && <div className="flex justify-center">Loading..</div>}
            {!loading && (
                <form
                    onSubmit={(e) => onSubmit(e)}
                    className="container mx-auto p-4"
                >
                    <div className="grid grid-cols-6">
                        <div className="col-span-5">
                            <h1 className="text-3xl mb-3">{survey.title}</h1>
                            <p className=" text-sm mb-3">
                                Expire Date: {survey.expire_date}
                            </p>
                            <p className="  mb-3">{survey.description}</p>
                        </div>
                    </div>

                    {surveyFinished && (
                        <div className="py-8 px-6 bg-emerald-500 text-white w-[600px] mx-auto">
                            Thank you for participating in the survey
                        </div>
                    )}
                    {!surveyFinished && (
                        <>
                            <div>
                                {survey.questions.map((question, index) => (
                                    <PublicQuestion
                                        key={question.id}
                                        question={question}
                                        index={index}
                                        answerChanged={(val) =>
                                            answerChanged(question, val)
                                        }
                                    />
                                ))}
                            </div>
                            <Button type="submit">Submit</Button>
                        </>
                    )}
                </form>
            )}
        </div>
    );
}
