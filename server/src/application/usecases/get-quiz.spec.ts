import { describe, it, expect } from "vitest";
import { GetQuiz } from "./get-quiz";
import { InMemoryQuizRepository } from "../../tests/repositories/in-memory-quiz-respository";
import { InMemoryQuestionRepository } from "../../tests/repositories/in-memory-question-repository";
import { Quiz } from "../../domain/entities/quiz";
import { generateQuestions } from "../../tests/utils/generate-questions";

describe("Get quiz use case", () => {
	it("should be able to get a quiz", async () => {
		const quizRepository = new InMemoryQuizRepository();
		const questionRepository = new InMemoryQuestionRepository();

		const questions = generateQuestions();
		const quiz = Quiz.create({
			created_at: new Date(),
			fanId: "fake_fanId",
			questionsIdentifiers: questions.map((question) => question.id),
			score: 0,
			title: "fake_title",
		});

		await quizRepository.create(quiz);
		await questionRepository.createMany(questions);

		const getQuiz = new GetQuiz(quizRepository, questionRepository);

		const response = await getQuiz.execute({ quizId: quiz.id });

		expect(response.success).toBeTruthy();
		expect(response.message).toEqual("Quiz was returned");
		expect(response.data[0].quiz.id).toEqual(quiz.id);
	});

	it("should not allow get a quiz without an id provided", async () => {
		const quizRepository = new InMemoryQuizRepository();
		const questionRepository = new InMemoryQuestionRepository();

		const questions = generateQuestions();
		const quiz = Quiz.create({
			created_at: new Date(),
			fanId: "fake_fanId",
			questionsIdentifiers: questions.map((question) => question.id),
			score: 0,
			title: "fake_title",
		});

		await quizRepository.create(quiz);
		await questionRepository.createMany(questions);

		const getQuiz = new GetQuiz(quizRepository, questionRepository);

		const response = await getQuiz.execute({ quizId: "" });

		expect(response.success).toBeFalsy();
		expect(response.message).toEqual("Quiz id was not provided");
	});

	it("should not allow to get a quiz that does not exits", async () => {
		const quizRepository = new InMemoryQuizRepository();
		const questionRepository = new InMemoryQuestionRepository();

		const questions = generateQuestions();
		const quiz = Quiz.create({
			created_at: new Date(),
			fanId: "fake_fanId",
			questionsIdentifiers: questions.map((question) => question.id),
			score: 0,
			title: "fake_title",
		});

		await questionRepository.createMany(questions);

		const getQuiz = new GetQuiz(quizRepository, questionRepository);

		const response = await getQuiz.execute({ quizId: quiz.id });

		expect(response.success).toBeFalsy();
		expect(response.message).toEqual("Quiz does not exits");
	});

	it("should not allow to get a quiz that does not have enough questions", async () => {
		const quizRepository = new InMemoryQuizRepository();
		const questionRepository = new InMemoryQuestionRepository();

		const questions = generateQuestions();
		const quiz = Quiz.create({
			created_at: new Date(),
			fanId: "fake_fanId",
			questionsIdentifiers: questions.map((question) => question.id),
			score: 0,
			title: "fake_title",
		});

		await quizRepository.create(quiz);

        questions.pop() // to have just 4 questions
		await questionRepository.createMany(questions);

		const getQuiz = new GetQuiz(quizRepository, questionRepository);

		const response = await getQuiz.execute({ quizId: quiz.id });

		expect(response.success).toBeFalsy();
		expect(response.message).toEqual("Quiz does not have enough questions");
	});
});
