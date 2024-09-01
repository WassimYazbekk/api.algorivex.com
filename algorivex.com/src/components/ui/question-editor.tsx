import { v4 as uuid } from "uuid";
import { useEffect } from "react";
import { useState } from "react";
import { Plus, PlusIcon, TrashIcon } from "lucide-react";
import { questionTypes } from "@/constats/question-types";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { Select } from "@radix-ui/react-select";
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";
import { Textarea } from "./textarea";

export default function QuestionEditor({
    index = 0,
    question,
    addQuestion,
    deleteQuestion,
    questionChange,
}) {
    const [model, setModel] = useState({ ...question });

    useEffect(() => {
        questionChange(model);
    }, [model]);

    function shouldHaveOptions(type = null) {
        type = type || model.type;
        return ["select", "radio", "checkbox"].includes(type);
    }

    function onTypeChange(v) {
        const newModel = {
            ...model,
            type: v,
        };
        if (!shouldHaveOptions(model.type) && shouldHaveOptions(v)) {
            if (!model.data.options) {
                newModel.data = {
                    options: [{ uuid: uuid(), text: "" }],
                };
            }
        }
        setModel(newModel);
    }

    function addOption() {
        model.data.options.push({
            uuid: uuid(),
            text: "",
        });
        setModel({ ...model });
    }

    function deleteOption(op) {
        model.data.options = model.data.options.filter(
            (option) => option.uuid != op.uuid,
        );
        setModel({ ...model });
    }

    return (
        <>
            <div className="my-2 py-2">
                <div className="flex justify-between mb-3">
                    <h4>
                        {index + 1}. {model.question}
                    </h4>
                    <div className="flex items-center">
                        <Button
                            type="button"
                            variant={"ghost"}
                            className="mr-2"
                            onClick={() => addQuestion(index + 1)}
                        >
                            <PlusIcon className="w-4" />
                            Add
                        </Button>
                        <Button
                            type="button"
                            variant={"destructive"}
                            className="font-semibold"
                            onClick={() => deleteQuestion(question)}
                        >
                            <TrashIcon className="w-4" />
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="flex gap-3 justify-between mb-3">
                    {/* Question Text */}
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Input
                            type="text"
                            name="question"
                            id="question"
                            placeholder="question"
                            value={model.question}
                            onChange={(ev) =>
                                setModel({
                                    ...model,
                                    question: ev.target.value,
                                })
                            }
                        />
                    </div>
                    {/* Question Text */}

                    {/* Question Type */}
                    <div>
                        <div className="space-y-2">
                            <Label htmlFor="questionType">Question Type</Label>
                            <Select
                                name="questionType"
                                value={model.type}
                                onValueChange={onTypeChange}
                            >
                                <SelectTrigger className="w-64">
                                    <SelectValue placeholder="Question Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {questionTypes.map((type) => (
                                        <SelectItem
                                            value={type}
                                            className={"capitalize"}
                                            key={type}
                                        >
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Question Type */}
                </div>

                {/*Description*/}
                <div className="mb-3 space-y-2">
                    <Label htmlFor="questionDescription">Description</Label>
                    <Textarea
                        name="questionDescription"
                        id="questionDescription"
                        value={model.description || ""}
                        onChange={(ev) =>
                            setModel({ ...model, description: ev.target.value })
                        }
                    ></Textarea>
                </div>
                {/*Description*/}

                <div>
                    {shouldHaveOptions() && (
                        <div>
                            <h4 className="text-sm font-semibold mb-1 flex justify-between items-center ">
                                Options
                                <Button
                                    onClick={addOption}
                                    variant="ghost"
                                    type="button"
                                    className="mb-2"
                                >
                                    <PlusIcon className="w-4" /> Add Option
                                </Button>
                            </h4>

                            {model.data.options.length === 0 && (
                                <div className="text-xs text-gray-600 text-center py-3">
                                    You don't have any options defined
                                </div>
                            )}
                            {model.data.options.length > 0 && (
                                <div className="px-2">
                                    {model.data.options.map((op, ind) => (
                                        <div
                                            key={op.uuid}
                                            className="flex items-center mb-1"
                                        >
                                            <span className="w-6 text-sm">
                                                {ind + 1}.
                                            </span>
                                            <Input
                                                type="text"
                                                value={op.text}
                                                onInput={(ev) => {
                                                    op.text = ev.target.value;
                                                    setModel({ ...model });
                                                }}
                                                className="w-full mr-2"
                                            />
                                            <Button
                                                variant={"destructive"}
                                                onClick={(ev) =>
                                                    deleteOption(op)
                                                }
                                                type="button"
                                            >
                                                <TrashIcon className="w-4 h-4 " />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {model.type === "select" && <div></div>}
            </div>
            <hr />
        </>
    );
}
