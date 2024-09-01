import http from "@/axios-client";
import { Button } from "@/components/ui/button";
import router from "@/router";
import { Edit, Link, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type TSurvey = {
    id: number;
    title: string;
    slug: string;
    description: string;
    status: boolean;
};

const Surveys = () => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchSurveys = async (page: number = 1, query: string = "") => {
        try {
            const res = await http.get("survey", {
                params: {
                    page: page,
                    query: query,
                },
            });
            const data = res.data;
            return data;
        } catch (error) {
            throw new Error("Failed to fetch surveys");
        }
    };

    const surveysQuery = useQuery({
        queryKey: ["surveys", page, searchQuery],
        queryFn: () => fetchSurveys(page, searchQuery),
        placeholderData: keepPreviousData,
    });

    return (
        <div>
            <div className="flex w-full justify-between p-4">
                <div className="flex justify-between w-1/2 gap-4">
                    <h1 className="text-3xl text-nowrap">Your Surveys</h1>
                    <div className="flex w-full gap-2">
                        <Input
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                            }}
                            className="px-4 py-2 w-full"
                            placeholder="search"
                            type="search"
                        />
                    </div>
                    <Select>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Survey status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    onClick={() => router.navigate("/surveys/create")}
                    variant={"ghost"}
                    className="flex gap-2"
                >
                    <Plus />
                    Create new
                </Button>
            </div>
            <div className="flex flex-col max-h-full w-full p-2 gap-2">
                {surveysQuery.isLoading || surveysQuery.isError ? (
                    <span className="text-2xl">Loading...</span>
                ) : (
                    surveysQuery.data.data.map((survey: TSurvey) => {
                        return (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{survey.title}</CardTitle>
                                    <CardDescription>
                                        @{survey.title}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>{survey.description}</CardContent>
                                <CardFooter className="flex justify-between">
                                    {survey.status ? "public" : "private"}
                                    <div className="flex gap-2">
                                        <Button
                                            variant={"ghost"}
                                            onClick={() =>
                                                router.navigate(
                                                    `/survey/public/${survey.slug}`,
                                                )
                                            }
                                        >
                                            <Link className="mr-2" />
                                            View
                                        </Button>

                                        <Button
                                            variant={"ghost"}
                                            onClick={() =>
                                                router.navigate(
                                                    `/surveys/${survey.id}`,
                                                )
                                            }
                                        >
                                            <Edit className="mr-2" />
                                            Edit
                                        </Button>

                                        <Button
                                            variant={"ghost"}
                                            onClick={() =>
                                                router.navigate(
                                                    `/surveys/${survey.id}`,
                                                )
                                            }
                                        >
                                            <Trash className="mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Surveys;
