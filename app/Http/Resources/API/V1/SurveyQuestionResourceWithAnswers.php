<?php

namespace App\Http\Resources\API\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SurveyQuestionResourceWithAnswers extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'question' => $this->question,
            'description' => $this->description,
            'data' => json_decode($this->data),
            'answers' => SurveyQuestionAnswersResource::collection($this->questionAnswers),
        ];
    }
}
