import http from "@/axios-client";
import { Button } from "@/components/ui/button";
import router from "@/router";
import { Edit, EyeIcon, Link, Plus, Trash } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import {
    Card,
    CardContent,
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { TailSpin } from "react-loader-spinner";

export type TSurvey = {
    id: number;
    title: string;
    slug: string;
    description: string;
    status: boolean;
};

const Surveys = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [status, setStatus] = useState("");
    const [copied, setCopied] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const handleCopy = (slug) => {
        navigator.clipboard.writeText(
            `${import.meta.env.VITE_APP_URL}/survey/public/${slug}`,
        );
        setCopied(slug);

        // Hide the popover after 2 seconds
        setTimeout(() => {
            setCopied("");
        }, 2000);
    };

    async function handleDelete(id) {
        const response = await http.delete(`survey/${id}`);
        if (response.status === 204) {
            toast({ title: "Survey Deleted!", variant: "destructive" });
            queryClient.invalidateQueries({ queryKey: ["surveys"] });
        }
    }

    const fetchSurveys = async ({ pageParam }: { pageParam: number }) => {
        try {
            const res = await http.get("survey", {
                params: {
                    query: searchQuery,
                    page: pageParam,
                    status: status === "null" ? null : status,
                },
            });
            const data = res.data;
            return data;
        } catch (error) {
            throw new Error("Failed to fetch surveys");
        }
    };

    const surveysQuery = useInfiniteQuery({
        queryKey: ["surveys", searchQuery, status],
        queryFn: fetchSurveys,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.current_page + 1 <= lastPage.last_page
                ? lastPage.current_page + 1
                : null;
        },
    });
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            surveysQuery.fetchNextPage();
        }
    }, [surveysQuery.fetchNextPage, inView]);

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
                    <Select onValueChange={(v) => setStatus(v)}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Survey status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                                <SelectItem value="null">Both</SelectItem>
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
                ) : (
                    surveysQuery.data?.pages.map((page) => {
                        return page.data.map((survey: TSurvey) => {
                            return (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between">
                                                {survey.title}
                                                <TooltipProvider>
                                                    <Tooltip
                                                        open={
                                                            copied ===
                                                            survey.slug
                                                        }
                                                    >
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant={
                                                                    "ghost"
                                                                }
                                                                className="relative"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        survey.slug,
                                                                    )
                                                                }
                                                            >
                                                                <Link className="mr-2" />
                                                                Public Link
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <h1>Copied</h1>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {survey.description}
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            {survey.status
                                                ? "public"
                                                : "private"}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant={"ghost"}
                                                    onClick={() =>
                                                        router.navigate(
                                                            `/surveys/${survey.id}/answers`,
                                                        )
                                                    }
                                                >
                                                    <EyeIcon className="mr-2" />
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

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant={"ghost"}
                                                        >
                                                            <Trash className="mr-2" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you
                                                                absolutely sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action
                                                                cannot be
                                                                undone. This
                                                                will permanently
                                                                delete your
                                                                survey and all
                                                                its corresponing
                                                                data from our
                                                                servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        survey.id,
                                                                    )
                                                                }
                                                            >
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </>
                            );
                        });
                    })
                )}
                <div ref={ref}>
                    {surveysQuery.isFetchingNextPage && (
                        <div className="flex  w-full justify-center items-center">
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
                </div>
            </div>
        </div>
    );
};

export default Surveys;
