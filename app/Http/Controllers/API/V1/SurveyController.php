<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Enums\API\V1\QuestionTypeEnum;
use App\Http\Requests\API\V1\StoreSurveyAnswerRequest;
use App\Http\Requests\API\V1\StoreSurveyRequest;
use App\Http\Requests\API\V1\UpdateSurveyRequest;
use App\Http\Resources\API\V1\AnswersResource;
use App\Models\API\V1\Survey;
use App\Models\API\V1\SurveyAnswer;
use App\Models\API\V1\SurveyQuestion;
use App\Models\API\V1\SurveyQuestionAnswer;
use Illuminate\Http\Request;
use App\Http\Resources\API\V1\SurveyResource;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\ValidationException;
use http\Client\Response;

class SurveyController extends Controller
{
    /**
     * @return
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = $request->input('query', '');
        $status = $request->input('status');

        if($status !== null)
            $results = Survey::query()->where('user_id',$user->id)->where('status',$status==='public');
        else
            $results = Survey::query()->where('user_id',$user->id);

        // Apply full-text search if a query is provided
        if (!empty($query)) {
            $results->where('title', 'LIKE', '%' . $query . '%');
        }

        // Paginate the results
        return $results->orderByDesc('created_at')->paginate(10);
    }

    /**
     * @return SurveyResource
     */
    public function store(StoreSurveyRequest $request): SurveyResource
    {
        $data = $request->validated();

        $survey = Survey::create($data);

        foreach ($data['questions'] as $question) {
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }

        return new SurveyResource($survey);
    }

    /**
     * @return SurveyResource
     */
    public function show(Survey $survey, Request $request): SurveyResource
    {
        $user = $request->user();

        if($survey->user_id !== $user->id){
            return abort(403, 'Unauthorized action.');
        }

        return new SurveyResource($survey);
    }

    /**
     * @return SurveyResource
     */
    public function update(Survey $survey, UpdateSurveyRequest $request): SurveyResource
    {
        $data = $request->validated();

        $survey->update($data);

        $existingIds = $survey->questions()->pluck('id')->toArray();

        $newIds = Arr::pluck($data['questions'],'id');

        $toDelete = array_diff($existingIds, $newIds);

        $toAdd = array_diff($newIds, $existingIds);

        SurveyQuestion::destroy($toDelete);

        foreach ($data['questions'] as $question) {
            if(in_array($question['id'], $toAdd)){
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }

        $questionsMap = collect($data['questions'])->keyBy('id');

        foreach ($survey->questions as $question) {
            if(isset($questionsMap[$question->id])){
                 $this->updateQuestion($question, $questionsMap[$question->id]);
            }
        }

        return new SurveyResource($survey);
    }

    /**
     * @return Response
     */
    public function destroy(Survey $survey,Request $request): Response
    {
        $user = $request->user();

        if($survey->user_id !== $user->id){
            return abort(403, 'Unauthorized action.');
        }

        $survey->delete();

        return response('',204);
    }

    public function getBySlug(Survey $survey)
    {
        if (!$survey->status) {
            return response("", 404);
        }

        $currentDate = new \DateTime();
        $expireDate = new \DateTime($survey->expire_date);
        if ($currentDate > $expireDate) {
            return response("", 404);
        }

        return new SurveyResource($survey);
    }

    /**
     * @param $data
     */
    private function createQuestion($data){

        if(is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }


        $validator = Validator::make($data, [
            'question'=>'required|string|max:2048',
            'type'=> ['required', new Enum(QuestionTypeEnum::class)],
            'description'=>'string|nullable',
            'data'=>'present',
            'survey_id'=>'exists:App\Models\API\V1\Survey,id'
        ]);

        return SurveyQuestion::create($validator->validated());
}

    /**
     * @param SurveyQuestion $question
     * @param $data
     * @return bool
     * @throws ValidationException
    */
    private function updateQuestion(SurveyQuestion $question, $data):bool{

        if(is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make($data, [
            'id'=>'exists:App\Models\API\V1\SurveyQuestion,id',
            'question'=>'required|string|max:2048',
            'type'=> ['required', new Enum(QuestionTypeEnum::class)],
            'description'=>'string|nullable',
            'data'=>'present',
        ]);

        return $question->update($validator->validated());
    }

    public function storeAnswer(StoreSurveyAnswerRequest $request, Survey $survey)
    {
        $validated = $request->validated();

        $surveyAnswer = SurveyAnswer::create([
            'survey_id' => $survey->id,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s'),
        ]);

        foreach ($validated['answers'] as $questionId => $answer) {
            $question = SurveyQuestion::where(['id' => $questionId, 'survey_id' => $survey->id])->get();
            if (!$question) {
                return response("Invalid question ID: \"$questionId\"", 400);
            }

            $data = [
                'survey_question_id' => $questionId,
                'survey_answer_id' => $surveyAnswer->id,
                'answer' => is_array($answer) ? json_encode($answer) : $answer
            ];

            $questionAnswer = SurveyQuestionAnswer::create($data);
        }

        return response("", 201);
    }

    public function answers(Survey $survey, Request $request){

        $user = $request->user();

        if($survey->user_id !== $user->id){
            return abort(403, 'Unauthorized action.');
        }


        return new AnswersResource($survey);




    }


}
