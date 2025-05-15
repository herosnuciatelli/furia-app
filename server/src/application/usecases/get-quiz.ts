import type { Question } from "../../domain/entities/question";
import type { Quiz } from "../../domain/entities/quiz";
import type { ResponseUseCase } from "../../types/response-usecase";
import type { QuestionRepository } from "../repositories/QuestionRespository";
import type { QuizRepository } from "../repositories/QuizRepository";

type GetQuizRequest = {
    quizId: string
}

export class GetQuiz  {
    constructor(
        private quizRepository: QuizRepository,
        private questionRepository: QuestionRepository
    ){}

    async execute({ quizId }: GetQuizRequest): Promise<ResponseUseCase<{ quiz: Quiz, questions: Question[] }>> {
        if (quizId.length === 0) {
            return {
                data: [],
                message: "Quiz id was not provided",
                success: false
            }
        }

        const quiz = await this.quizRepository.findById(quizId)

        if (!quiz) {
            return {
                data: [],
                message: "Quiz does not exits",
                success: false
            }
        }

        const questions = await this.questionRepository.findMany(quiz.props.questionsIdentifiers)

        if (!questions || questions.length !== 5) {
            return {
                data: [],
                message: "Quiz does not have enough questions",
                success: false
            }
        }

        return {
            data: [{quiz, questions}],
            message: "Quiz was returned",
            success: true
        }
    }
}