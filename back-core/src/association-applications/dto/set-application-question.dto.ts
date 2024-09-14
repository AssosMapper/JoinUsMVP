import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SetApplicationQuestionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    question: string;
}