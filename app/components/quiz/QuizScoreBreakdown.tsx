"use client";

import { QuizResult } from "@/app/lib/quizData";

interface QuizScoreBreakdownProps {
  result: QuizResult;
  protocolName: string;
}

export default function QuizScoreBreakdown({
  result,
  protocolName,
}: QuizScoreBreakdownProps) {
  return (
    <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-current/10">
      {/* Header */}
      <div className="py-4 border-b border-current/10">
        <h4 className="font-bold text-sm mb-1">
          How you scored for {protocolName}
        </h4>
        <p className="font-mono text-xs opacity-60">
          {result.totalPoints}/{result.maxPossiblePoints} points ({result.percentage}% match)
        </p>
      </div>

      {/* Question Breakdown */}
      <div className="divide-y divide-current/10">
        {result.questionBreakdown.map((item, idx) => (
          <div key={item.questionId} className="py-3">
            <div className="flex items-start gap-3">
              {/* Question Number */}
              <div className="w-6 h-6 rounded-full bg-current/10 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-xs font-bold">{idx + 1}</span>
              </div>

              {/* Question Details */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm mb-1 line-clamp-2">
                  &ldquo;{item.questionText}&rdquo;
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-mono text-xs">
                    Your answer:{" "}
                    <span className="font-bold">{item.userAnswer}</span>
                  </span>
                  <span
                    className={`font-mono text-xs ${
                      item.pointsAwarded > 0 ? "text-green-600" : "opacity-50"
                    }`}
                  >
                    {item.pointsAwarded > 0 ? "+" : ""}
                    {item.pointsAwarded}/{item.maxPoints} pts
                  </span>
                  <span className="font-mono text-xs opacity-50">
                    (measures: {item.measures})
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="pt-4 mt-2 border-t-2 border-current/20 flex justify-between items-center">
        <span className="font-mono text-sm">Total Score</span>
        <span className="font-bold text-lg">
          {result.totalPoints}/{result.maxPossiblePoints} ({result.percentage}%)
        </span>
      </div>
    </div>
  );
}





