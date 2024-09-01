import { useState } from "react";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import http from "@/axios-client";
import router from "@/router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import SurveyQuestions from "@/components/ui/survey-questions";
import { Switch } from "@/components/ui/switch";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    expire_date: z.date().nullable(),
    status: z.boolean(),
});

export default function UpdateSurvey() {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            expire_date: null,
            status: false,
        },
    });

    const fetchSurvey = async (id: number) => {
        try {
            const res = await http.get("survey/" + id);
            const data = res.data;

            form.reset({
                title: data.data.title,
                description: data.data.description,
                expire_date: new Date(data.data.expire_date),
                status: data.data.status,
            });

            setQuestions(data.data.questions);

            return data;
        } catch (error) {
            throw new Error("Failed to fetch surveys");
        }
    };

    const surveyQuery = useQuery({
        queryKey: ["survey", id],
        queryFn: () => fetchSurvey(Number(id)),
        placeholderData: keepPreviousData,
    });

    function onQuestionsUpdate(questions) {
        setQuestions(questions);
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            ...values,
            expire_date: values.expire_date
                ? format(values.expire_date, "yyyy-MM-dd hh:mm:ss")
                : null,
            questions: questions,
        };

        const response = await http.put("survey/" + id, data);
        if (response.status === 200) {
            router.navigate("/surveys");
        }
    }

    return (
        <div className="flex w-full h-full items-center justify-center p-2">
            {surveyQuery.isLoading || surveyQuery.isError ? (
                <h1>Loading...</h1>
            ) : (
                <Card className="max-w-lg w-full self-center">
                    <CardHeader className="items-center">
                        <CardTitle className="text-4xl">
                            Update Survey
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Survey Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Title"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="description"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="expire_date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Expire Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value &&
                                                                    "text-muted-foreground",
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    "PPP",
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Survey's
                                                                    expire date.
                                                                </span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        //@ts-ignore-next-line
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        disabled={(date) =>
                                                            date < new Date()
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Active
                                                </FormLabel>
                                                <FormDescription>
                                                    Wether to make the survey
                                                    publicly available
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <SurveyQuestions
                                        onQuestionsUpdate={onQuestionsUpdate}
                                        questions={questions}
                                    />
                                </div>
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
