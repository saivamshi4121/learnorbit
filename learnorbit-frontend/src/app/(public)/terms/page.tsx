import StaticPage from "@/components/layout/StaticPage";

export const metadata = {
    title: "Terms of Service | LearnOrbit",
    description: "Guidelines for using the LearnOrbit platform.",
};

export default function TermsPage() {
    return (
        <StaticPage 
            title="Terms of Service"
            description="By using LearnOrbit, you agree to these terms. Please read them carefully."
        />
    );
}
