import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCourseContent } from "../data/courseContent";

const CourseDetail = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  /*
   * Course can be passed through React Router state:
   * navigate(`/courses/${course.id}`, { state: { course } })
   *
   * We also support a courseId coming directly from the URL.
   */
  const course = location.state?.course || {
    id: courseId,
    slug: courseId,
    title: courseId,
  };

  const content = useMemo(() => {
    return getCourseContent(course);
  }, [course]);

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem(
        `evolva_completed_${course?.id || courseId}`
      );

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /*
   * Save progress whenever completedLessons changes.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        `evolva_completed_${course?.id || courseId}`,
        JSON.stringify(completedLessons)
      );
    } catch (error) {
      console.error("Unable to save course progress:", error);
    }
  }, [completedLessons, course?.id, courseId]);

  /*
   * Reset lesson selection when a different course is opened.
   */
  useEffect(() => {
    setCurrentModuleIndex(0);
    setCurrentLessonIndex(0);
  }, [courseId]);

  /*
   * If the course content does not exist.
   */
  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">📚</div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Course Coming Soon
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't find course content for this course yet.
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const modules = Array.isArray(content.modules) ? content.modules : [];

  const currentModule = modules[currentModuleIndex];

  const lessons = currentModule?.lessons || [];

  const currentLesson = lessons[currentLessonIndex];

  /*
   * Flatten all lessons so Previous/Next can move across modules.
   */
  const allLessons = useMemo(() => {
    const result = [];

    modules.forEach((module, moduleIndex) => {
      (module.lessons || []).forEach((lesson, lessonIndex) => {
        result.push({
          lesson,
          moduleIndex,
          lessonIndex,
        });
      });
    });

    return result;
  }, [modules]);

  const currentGlobalIndex = allLessons.findIndex(
    (item) =>
      item.moduleIndex === currentModuleIndex &&
      item.lessonIndex === currentLessonIndex
  );

  const totalLessons = allLessons.length;

  const completedCount = completedLessons.length;

  const progress =
    totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

  /*
   * Create a stable lesson ID.
   */
  const getLessonId = (moduleIndex, lessonIndex, lesson) => {
    return (
      lesson?.id ||
      lesson?.slug ||
      `${course?.id || courseId}-module-${moduleIndex}-lesson-${lessonIndex}`
    );
  };

  const currentLessonId = currentLesson
    ? getLessonId(
        currentModuleIndex,
        currentLessonIndex,
        currentLesson
      )
    : null;

  const isCurrentLessonCompleted = currentLessonId
    ? completedLessons.includes(currentLessonId)
    : false;

  /*
   * Mark the current lesson as completed.
   */
  const markLessonComplete = () => {
    if (!currentLessonId) return;

    setCompletedLessons((previous) => {
      if (previous.includes(currentLessonId)) {
        return previous;
      }

      return [...previous, currentLessonId];
    });
  };

  /*
   * Open a lesson from the sidebar.
   */
  const openLesson = (moduleIndex, lessonIndex) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Go to previous lesson.
   */
  const goPrevious = () => {
    if (currentGlobalIndex <= 0) return;

    const previous = allLessons[currentGlobalIndex - 1];

    setCurrentModuleIndex(previous.moduleIndex);
    setCurrentLessonIndex(previous.lessonIndex);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Go to next lesson.
   */
  const goNext = () => {
    if (currentGlobalIndex < 0) return;

    if (currentGlobalIndex >= allLessons.length - 1) {
      markLessonComplete();
      return;
    }

    markLessonComplete();

    const next = allLessons[currentGlobalIndex + 1];

    setCurrentModuleIndex(next.moduleIndex);
    setCurrentLessonIndex(next.lessonIndex);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Get previous / next state.
   */
  const hasPrevious = currentGlobalIndex > 0;
  const hasNext =
    currentGlobalIndex >= 0 &&
    currentGlobalIndex < allLessons.length - 1;

  /*
   * Safe quiz extraction.
   *
   * Your courseContent uses:
   * lesson.quiz
   */
  const quizQuestions = Array.isArray(currentLesson?.quiz)
    ? currentLesson.quiz
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* ============================================================
          TOP HEADER
      ============================================================ */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <button
                onClick={() => navigate("/courses")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-1"
              >
                ← Back to Courses
              </button>

              <h1 className="text-xl md:text-2xl font-bold">
                {content.title || course.title || "Course"}
              </h1>

              {content.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {content.description}
                </p>
              )}
            </div>

            {/* Progress */}
            <div className="min-w-[220px]">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Your Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {completedCount} / {totalLessons} lessons completed
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          MAIN LAYOUT
      ============================================================ */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* ==========================================================
            SIDEBAR
        ========================================================== */}
        <aside className="lg:w-80 lg:min-h-[calc(100vh-100px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h2 className="font-bold text-lg mb-4">Course Content</h2>

            <div className="space-y-3">
              {modules.map((module, moduleIndex) => {
                const moduleLessons = module.lessons || [];

                const moduleCompleted = moduleLessons.filter(
                  (lesson, lessonIndex) => {
                    const lessonId = getLessonId(
                      moduleIndex,
                      lessonIndex,
                      lesson
                    );

                    return completedLessons.includes(lessonId);
                  }
                ).length;

                return (
                  <div
                    key={module.id || moduleIndex}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                  >
                    {/* Module heading */}
                    <button
                      onClick={() =>
                        setCurrentModuleIndex(moduleIndex)
                      }
                      className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Module {moduleIndex + 1}
                          </p>

                          <h3 className="font-semibold">
                            {module.title || `Module ${moduleIndex + 1}`}
                          </h3>
                        </div>

                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {moduleCompleted}/{moduleLessons.length}
                        </span>
                      </div>
                    </button>

                    {/* Lessons */}
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {moduleLessons.map((lesson, lessonIndex) => {
                        const lessonId = getLessonId(
                          moduleIndex,
                          lessonIndex,
                          lesson
                        );

                        const completed =
                          completedLessons.includes(lessonId);

                        const active =
                          moduleIndex === currentModuleIndex &&
                          lessonIndex === currentLessonIndex;

                        return (
                          <button
                            key={lessonId}
                            onClick={() =>
                              openLesson(moduleIndex, lessonIndex)
                            }
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition ${
                              active
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                completed
                                  ? "bg-green-500 text-white"
                                  : active
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {completed ? "✓" : lessonIndex + 1}
                            </span>

                            <span className="text-sm">
                              {lesson.title ||
                                `Lesson ${lessonIndex + 1}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ==========================================================
            LESSON CONTENT
        ========================================================== */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
            {!currentLesson ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                <h2 className="text-xl font-bold mb-2">
                  No lesson available
                </h2>

                <p className="text-gray-600 dark:text-gray-400">
                  This module doesn't contain any lessons yet.
                </p>
              </div>
            ) : (
              <>
                {/* Lesson title */}
                <div className="mb-8">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                    Module {currentModuleIndex + 1} · Lesson{" "}
                    {currentLessonIndex + 1}
                  </p>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {currentLesson.title ||
                      `Lesson ${currentLessonIndex + 1}`}
                  </h2>

                  {currentLesson.description && (
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {currentLesson.description}
                    </p>
                  )}
                </div>

                {/* ==================================================
                    LESSON CONTENT
                ================================================== */}
                <LessonContent lesson={currentLesson} />

                {/* ==================================================
                    KEY POINTS
                ================================================== */}
                {Array.isArray(currentLesson.keyPoints) &&
                  currentLesson.keyPoints.length > 0 && (
                    <section className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-4">
                        💡 Key Points
                      </h3>

                      <ul className="space-y-3">
                        {currentLesson.keyPoints.map(
                          (point, index) => (
                            <li
                              key={index}
                              className="flex gap-3"
                            >
                              <span className="text-blue-600 font-bold">
                                ✓
                              </span>

                              <span>{point}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </section>
                  )}

                {/* ==================================================
                    PRACTICE
                ================================================== */}
                {Array.isArray(currentLesson.practice) &&
                  currentLesson.practice.length > 0 && (
                    <section className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                      <h3 className="text-xl font-bold mb-5">
                        📝 Practice Problems
                      </h3>

                      <div className="space-y-5">
                        {currentLesson.practice.map(
                          (problem, index) => (
                            <PracticeProblem
                              key={index}
                              problem={problem}
                              index={index}
                            />
                          )
                        )}
                      </div>
                    </section>
                  )}

                {/* ==================================================
                    LESSON QUIZ
                ================================================== */}
                {quizQuestions.length > 0 && (
                  <LessonQuiz
                    questions={quizQuestions}
                  />
                )}

                {/* ==================================================
                    COMPLETE LESSON
                ================================================== */}
                <section className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        {isCurrentLessonCompleted
                          ? "Lesson completed 🎉"
                          : "Finished this lesson?"}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Mark this lesson as complete to update
                        your course progress.
                      </p>
                    </div>

                    <button
                      onClick={markLessonComplete}
                      disabled={isCurrentLessonCompleted}
                      className={`px-6 py-3 rounded-lg font-medium transition ${
                        isCurrentLessonCompleted
                          ? "bg-green-100 text-green-700 cursor-default"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {isCurrentLessonCompleted
                        ? "✓ Completed"
                        : "Mark as Complete"}
                    </button>
                  </div>
                </section>

                {/* ==================================================
                    PREVIOUS / NEXT
                ================================================== */}
                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    onClick={goPrevious}
                    disabled={!hasPrevious}
                    className={`px-5 py-3 rounded-lg font-medium transition ${
                      hasPrevious
                        ? "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        : "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    ← Previous
                  </button>

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentGlobalIndex + 1} / {totalLessons}
                  </span>

                  <button
                    onClick={goNext}
                    disabled={!hasNext}
                    className={`px-5 py-3 rounded-lg font-medium transition ${
                      hasNext
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {hasNext ? "Next →" : "Course Complete ✓"}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

/* ================================================================
   LESSON CONTENT COMPONENT
================================================================ */

const LessonContent = ({ lesson }) => {
  /*
   * Supports different content structures so your existing
   * courseContent.js does not have to be rewritten.
   */

  if (Array.isArray(lesson.sections)) {
    return (
      <div className="space-y-6">
        {lesson.sections.map((section, index) => (
          <ContentSection
            key={index}
            section={section}
          />
        ))}
      </div>
    );
  }

  if (lesson.content) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <FormattedContent content={lesson.content} />
      </div>
    );
  }

  if (lesson.explanation) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <FormattedContent content={lesson.explanation} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <p className="text-gray-600 dark:text-gray-300">
        Lesson content is available in the course data.
      </p>
    </div>
  );
};

/* ================================================================
   CONTENT SECTION
================================================================ */

const ContentSection = ({ section }) => {
  if (typeof section === "string") {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <FormattedContent content={section} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      {section.title && (
        <h3 className="text-2xl font-bold mb-4">
          {section.title}
        </h3>
      )}

      {section.content && (
        <FormattedContent content={section.content} />
      )}

      {section.code && (
        <CodeBlock code={section.code} />
      )}

      {section.output && (
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">
            Output
          </p>

          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
            {section.output}
          </pre>
        </div>
      )}
    </div>
  );
};

/* ================================================================
   FORMATTED CONTENT
================================================================ */

const FormattedContent = ({ content }) => {
  if (typeof content !== "string") {
    return null;
  }

  return (
    <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-7">
      {content}
    </div>
  );
};

/* ================================================================
   CODE BLOCK
================================================================ */

const CodeBlock = ({ code }) => {
  return (
    <pre className="mt-4 bg-gray-950 text-gray-100 rounded-xl p-5 overflow-x-auto text-sm leading-6">
      <code>{code}</code>
    </pre>
  );
};

/* ================================================================
   PRACTICE PROBLEM
================================================================ */

const PracticeProblem = ({ problem, index }) => {
  if (typeof problem === "string") {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="font-semibold mb-2">
          {index + 1}. {problem}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <h4 className="font-semibold mb-3">
        {index + 1}.{" "}
        {problem.question ||
          problem.title ||
          "Practice Problem"}
      </h4>

      {problem.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {problem.description}
        </p>
      )}

      {problem.code && <CodeBlock code={problem.code} />}

      {problem.answer && (
        <details className="mt-4">
          <summary className="cursor-pointer font-medium text-blue-600">
            Show Answer
          </summary>

          <div className="mt-3">
            {typeof problem.answer === "string" ? (
              <FormattedContent content={problem.answer} />
            ) : (
              <CodeBlock code={String(problem.answer)} />
            )}
          </div>
        </details>
      )}
    </div>
  );
};

/* ================================================================
   LESSON QUIZ
================================================================ */

const LessonQuiz = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((total, question, index) => {
    const selected = selectedAnswers[index];

    if (
      selected !== undefined &&
      selected === question.answer
    ) {
      return total + 1;
    }

    return total;
  }, 0);

  return (
    <section className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-6">
        🧠 Quick Quiz
      </h3>

      <div className="space-y-8">
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <h4 className="font-semibold mb-4">
              {questionIndex + 1}.{" "}
              {question.question || question.text}
            </h4>

            <div className="space-y-2">
              {(question.options || []).map(
                (option, optionIndex) => {
                  const selected =
                    selectedAnswers[questionIndex] ===
                    optionIndex;

                  const correct =
                    submitted &&
                    question.answer === optionIndex;

                  return (
                    <label
                      key={optionIndex}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        correct
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : selected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={selected}
                        onChange={() =>
                          !submitted &&
                          setSelectedAnswers((previous) => ({
                            ...previous,
                            [questionIndex]: optionIndex,
                          }))
                        }
                        disabled={submitted}
                      />

                      <span>{option}</span>
                    </label>
                  );
                }
              )}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-6 p-5 rounded-xl bg-gray-50 dark:bg-gray-900">
          <h4 className="text-lg font-bold">
            Score: {score} / {questions.length}
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {score === questions.length
              ? "Perfect score! 🎉"
              : "Review the lesson and try again."}
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setSelectedAnswers({});
            }}
            className="mt-4 px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      )}
    </section>
  );
};

export default CourseDetail;