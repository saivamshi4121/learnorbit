import { Target, Zap, CheckCircle2, Trophy } from "lucide-react";

interface LearningOutcome {
    icon: "target" | "zap" | "check" | "trophy";
    title: string;
    description: string;
}

interface CourseAboutProps {
    description: string;
    learning_outcomes: LearningOutcome[];
}

const icons = {
    target: Target,
    zap: Zap,
    check: CheckCircle2,
    trophy: Trophy,
};

export function CourseAbout({ description, learning_outcomes }: CourseAboutProps) {
    return (
        <div className="space-y-12">
            {/* About Section */}
            <section>
                <h2 className="text-2xl font-semibold text-textPrimary mb-4 tracking-tight">
                    About This Course
                </h2>
                <p className="text-base text-mutedText leading-relaxed">
                    {description}
                </p>
            </section>

            {/* Learning Outcomes */}
            <section>
                <h2 className="text-2xl font-semibold text-textPrimary mb-6 tracking-tight">
                    What You'll Learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    {learning_outcomes.map((outcome, index) => {
                        const Icon = icons[outcome.icon];
                        return (
                            <div
                                key={index}
                                className="bg-surface border border-borderLight rounded-xl p-5 hover:shadow-sm transition-shadow duration-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-textPrimary mb-1">
                                            {outcome.title}
                                        </h4>
                                        <p className="text-sm text-mutedText leading-relaxed">
                                            {outcome.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
