import http from "@/axios-client";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/ui/dashboard-card";
import router from "@/router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { EyeIcon, PencilIcon } from "lucide-react";
import { TailSpin } from "react-loader-spinner";

export default function Dashboard() {
    async function fetchData() {
        const response = await http.get(`dashboard`);
        const data = await response.data;
        return data;
    }

    const dashboardQuery = useQuery({
        queryKey: ["dashboard"],
        queryFn: fetchData,
        placeholderData: keepPreviousData,
    });

    return (
        <div className="p-2">
            {(dashboardQuery.isError || dashboardQuery.isLoading) && (
                <div className="flex min-h-screen w-full justify-center items-center">
                    <TailSpin
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="tail-spin-loading"
                        color="#FFF"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
            )}
            {!(dashboardQuery.isLoading || dashboardQuery.isError) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
                    <DashboardCard
                        title="Total Surveys"
                        className="order-1 lg:order-2"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                            {dashboardQuery.data.totalSurveys}
                        </div>
                    </DashboardCard>
                    <DashboardCard
                        title="Total Answers"
                        className="order-2 lg:order-4"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                            {dashboardQuery.data.totalAnswers}
                        </div>
                    </DashboardCard>
                    <DashboardCard
                        title="Latest Survey"
                        className="order-3 lg:order-1 row-span-2"
                        style={{ animationDelay: "0.2s" }}
                    >
                        {dashboardQuery.data.latestSurvey && (
                            <div>
                                <h3 className="font-bold text-xl mb-3">
                                    {dashboardQuery.data.latestSurvey.title}
                                </h3>
                                <div className="flex justify-between text-sm mb-1">
                                    <div>Create Date:</div>
                                    <div>
                                        {
                                            dashboardQuery.data.latestSurvey
                                                .created_at
                                        }
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <div>Expire Date:</div>
                                    <div>
                                        {
                                            dashboardQuery.data.latestSurvey
                                                .expire_date
                                        }
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <div>Status:</div>
                                    <div>
                                        {dashboardQuery.data.latestSurvey.status
                                            ? "Public"
                                            : "Private"}
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <div>Questions:</div>
                                    <div>
                                        {
                                            dashboardQuery.data.latestSurvey
                                                .questions
                                        }
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm mb-3">
                                    <div>Answers:</div>
                                    <div>
                                        {
                                            dashboardQuery.data.latestSurvey
                                                .answers
                                        }
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <Button
                                        onClick={() =>
                                            router.navigate(
                                                `/surveys/${dashboardQuery.data.latestSurvey.id}`,
                                            )
                                        }
                                    >
                                        <PencilIcon className="w-5 h-5 mr-2" />
                                        Edit Survey
                                    </Button>

                                    <Button
                                        onClick={() =>
                                            router.navigate(
                                                `/surveys/${dashboardQuery.data.latestSurvey.id}/answers`,
                                            )
                                        }
                                    >
                                        <EyeIcon className="w-5 h-5 mr-2" />
                                        View Answers
                                    </Button>
                                </div>
                            </div>
                        )}
                        {!dashboardQuery.data.latestSurvey && (
                            <div className="text-gray-600 text-center py-16">
                                Your don't have surveys yet
                            </div>
                        )}
                    </DashboardCard>
                    <DashboardCard
                        title="Latest Answers"
                        className="order-4 lg:order-3 row-span-2"
                        style={{ animationDelay: "0.3s" }}
                    >
                        {dashboardQuery.data.latestAnswers.length && (
                            <div className="text-left">
                                {dashboardQuery.data.latestAnswers.map(
                                    (answer) => (
                                        <a
                                            href="#"
                                            key={answer.id}
                                            className="block p-2 hover:bg-gray-100/90"
                                        >
                                            <div className="font-semibold">
                                                {answer.survey.title}
                                            </div>
                                            <small>
                                                Answer Made at:
                                                <i className="font-semibold">
                                                    {answer.end_date}
                                                </i>
                                            </small>
                                        </a>
                                    ),
                                )}
                            </div>
                        )}
                        {!dashboardQuery.data.latestAnswers.length && (
                            <div className="text-gray-600 text-center py-16">
                                Your don't have answers yet
                            </div>
                        )}
                    </DashboardCard>
                </div>
            )}
        </div>
    );
}
