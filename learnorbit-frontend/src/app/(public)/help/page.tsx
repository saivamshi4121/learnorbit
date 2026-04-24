import StaticPage from "@/components/layout/StaticPage";

export const metadata = {
    title: "Help Center | LearnOrbit",
    description: "Support and FAQs for the LearnOrbit platform.",
};

export default function HelpPage() {
    return (
        <StaticPage 
            title="Help Center"
            description="Need help? Find answers to common questions or reach out to our support team."
        />
    );
}
