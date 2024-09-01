<?php

namespace App\Models\API\V1;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyQuestionAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['survey_question_id', 'survey_answer_id', 'answer'];

    public function question()
    {
        return $this->belongsTo(SurveyQuestion::class);
    }

    public function answer()
    {
        return $this->belongsTo(SurveyAnswer::class);
    }
}
