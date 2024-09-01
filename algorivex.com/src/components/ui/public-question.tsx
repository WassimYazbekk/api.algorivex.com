import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";
import { Textarea } from "./textarea";

export default function PublicQuestion({ question, index, answerChanged }) {
    let selectedOptions = [];

    function onCheckboxChange(option, $event) {
        if ($event.target.checked) {
            selectedOptions.push(option.text);
        } else {
            selectedOptions = selectedOptions.filter((op) => op != option.text);
        }
        answerChanged(selectedOptions);
    }

    return (
        <>
            <fieldset className="mb-4">
                <div>
                    <Label className="text-lg">
                        {index + 1}. {question.question}
                    </Label>
                    <p>{question.description}</p>
                </div>

                <div className="mt-3">
                    {question.type === "select" && (
                        <div>
                            <Select
                                name="questionType"
                                onValueChange={(v) => answerChanged(v)}
                            >
                                <SelectTrigger className="w-64">
                                    <SelectValue placeholder="Answer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {question.data.options.map((option) => (
                                        <SelectItem
                                            value={option.text}
                                            key={option.uuid}
                                        >
                                            {option.text}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {question.type === "radio" && (
                        <div>
                            <RadioGroup>
                                {question.data.options.map((option) => (
                                    <div
                                        key={option.uuid}
                                        className="flex items-center space-x-2"
                                    >
                                        <RadioGroupItem
                                            id={option.uuid}
                                            onChange={(ev) =>
                                                answerChanged(ev.target.value)
                                            }
                                            value={option.text}
                                        />
                                        <Label htmlFor={option.uuid}>
                                            {option.text}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}
                    {question.type === "checkbox" && (
                        <div>
                            {question.data.options.map((option) => (
                                <div
                                    key={option.uuid}
                                    className="flex items-center space-x-2 my-2"
                                >
                                    <Checkbox
                                        id={option.uuid}
                                        onChange={(ev) =>
                                            onCheckboxChange(option, ev)
                                        }
                                    />
                                    <Label
                                        htmlFor={option.uuid}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {option.text}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    )}
                    {question.type === "text" && (
                        <div>
                            <Input
                                type="text"
                                onChange={(ev) =>
                                    answerChanged(ev.target.value)
                                }
                                className="mt-1 "
                            />
                        </div>
                    )}
                    {question.type === "textarea" && (
                        <div>
                            <Textarea
                                onChange={(ev) =>
                                    answerChanged(ev.target.value)
                                }
                                className="mt-1 "
                            ></Textarea>
                        </div>
                    )}
                </div>
            </fieldset>
            <hr className="mb-4" />
        </>
    );
}
