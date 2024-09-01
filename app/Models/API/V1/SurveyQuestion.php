<?php

namespace App\Models\API\V1;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyQuestion extends Model
{
    use HasFactory;

    protected $fillable = ['question','type','description','data','survey_id'];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function questionAnswers()
    {
        return $this->hasMany(SurveyQuestionAnswer::class);
    }

    public function answers()
    {
        return $this->hasManyThrough(SurveyQuestionAnswer::class, SurveyAnswer::class, 'survey_id', 'survey_question_id', 'id', 'id');
    }
}
